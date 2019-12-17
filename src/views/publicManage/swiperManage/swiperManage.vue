<template>
    <div class="swiperManage-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-add" @click="$refs.modal_cruSwiper_add.modalValue = true">添加轮播图</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="轮播图名称" />
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

        <!--轮播图新增-->
        <vCruSwiper ref="modal_cruSwiper_add"
                    type="add" @modal-callback="getData"></vCruSwiper>
        <!--轮播图修改-->
        <vCruSwiper ref="modal_cruSwiper_edit"
                    type="edit"
                    :banner-id="modal_cruSwiper_edit_props.bannerId"
                    @modal-callback="getData"></vCruSwiper>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vCruSwiper from './cruSwiper/cruSwiper';
    export default {
        name: 'vswiperManage',
        mixins: [comMixin, tableMixin],
        components: {vCruSwiper},
        data () {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: ''
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '轮播图名称', align: 'center', key: 'bannerName' },
                    { title: '发布位置', align: 'center', key: 'showPositionLabel' },
                    { title: '发布状态', align: 'center', key: 'bannerStatusLabel' },
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
                            let btn_text = params.row.bannerStatus === 'publish' ? '停用' : '发布';
                            let type = params.row.bannerStatus === 'publish' ? 'error' : 'success';
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
                                            this.modal_cruSwiper_edit_props.bannerId = params.row.bannerId;
                                            this.$refs.modal_cruSwiper_edit.modalValue = true;
                                        }
                                    }
                                }, '编辑')
                            );

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
                                                content: `确定要${btn_text}《${params.row.bannerName}》？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/banner/publish',
                                                        params: {
                                                            bannerId: params.row.bannerId
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

                            list.push(
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要删除《${params.row.bannerName}》？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/banner/delete',
                                                        params: {
                                                            bannerId: params.row.bannerId
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
                                }, '删除')
                            );

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                modal_cruSwiper_edit_props: {
                    bannerId: ''
                }
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.modal_cruSwiper_edit_props.bannerId = '';
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/banner/list',
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
    .swiperManage-container {
    }
</style>