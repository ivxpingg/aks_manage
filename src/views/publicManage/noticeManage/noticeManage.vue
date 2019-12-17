<template>
    <div class="noticeManage-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-add" @click="$refs.modal_cruNotice_add.modalValue = true">添加公告</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="时间：" :label-width="65">
                    <DatePicker type="daterange"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="发布位置：" :label-width="85">
                    <Select v-model="searchParams.condition.showPosition" placeholder="全部" clearable style="width: 120px;">
                        <Option v-for="(item, idx) in dict_showPosition"
                                :key="idx"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="公告名称" />
                </FormItem>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-search" @click="getData">查询</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  @on-change="onPageChange"></Page>
        </div>

        <!--添加-->
        <vCruNotice ref="modal_cruNotice_add"
                    type="add"
                    @modal-callback="getData"></vCruNotice>
        <!--编辑-->
        <vCruNotice ref="modal_cruNotice_edit"
                    type="edit"
                    :news-id="modal_cruNotice_edit_props.newsId"
                    @modal-callback="getData"></vCruNotice>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vCruNotice from './cruNotice/cruNotice';
    export default {
        name: 'vnoticeManage',
        mixins: [comMixin, tableMixin],
        components: {vCruNotice},
        data () {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',
                        beginTime: '',
                        endTime: '',
                        showPosition: ''
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '公告名称', align: 'center', key: 'title' },
                    { title: '发布位置', align: 'center', key: 'showPositionLabel' },
                    { title: '发布状态', align: 'center', key: 'newsStatusLabel' },
                    { title: '发布时间', align: 'center', key: 'publishTime',
                        render: (h, params) => {
                            return h('span', this.timeFormat(params.row.publishTime, 'YYYY-MM-DD HH:mm:ss'))
                        }
                    },
                    {
                        title: '操作',
                        width: 240,
                        align: 'center',
                        render: (h, params) => {
                            let list = [];

                            list.push(
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_cruNotice_edit_props.newsId = params.row.newsId;
                                            this.$refs.modal_cruNotice_edit.modalValue = true;
                                        }
                                    }
                                }, '编辑')
                            );

                            let btn_text = params.row.newsStatus === 'publish' ? '下架' : '发布';
                            let type = params.row.newsStatus === 'publish' ? 'error' : 'success';
                            list.push(
                                h('Button', {
                                    props: {
                                        type: type,
                                        size: 'small',
                                        icon: 'ios-stop'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要${btn_text}《${params.row.title}》？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/news/publish',
                                                        params: {
                                                            newsId: params.row.newsId
                                                        }
                                                    }).then((res) => {
                                                        if (res.code === 'SUCCESS') {
                                                            this.$Message.success(`${btn_text}成功！`);
                                                            this.getData();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, btn_text)
                            );
                            // 删除
                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-trash'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: `确定要删除《${params.row.title}》通知？`,
                                            onOk: () => {
                                                this.$http({
                                                    method: 'get',
                                                    url: '/news/delete',
                                                    params: {
                                                        newsId: params.row.newsId
                                                    }
                                                }).then((res) => {
                                                    if (res.code === 'SUCCESS') {
                                                        this.$Message.success('删除成功！');
                                                        this.getData();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            }, '删除'));

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                dict_showPosition: [],
                modal_cruNotice_edit_props: {
                    newsId: ''
                }
            };
        },
        mounted() {

            this.getData();
            this.getDicts(['showPosition']);
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.condition.beginTime = value[0];
                this.searchParams.condition.endTime = value[1];
            },
            getData() {
                this.modal_cruNotice_edit_props.newsId = '';
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/news/list',
                    data: this.searchParams
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .noticeManage-container {
    }
</style>