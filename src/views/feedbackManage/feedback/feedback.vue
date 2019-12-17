<template>
    <div class="feedback-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="时间：" :label-width="65">
                    <DatePicker type="daterange"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="关键字" />
                </FormItem>
                <FormItem label="反馈类型：" :label-width="85">
                    <Select v-model="searchParams.condition.feedbackType" placeholder="全部" clearable style="width: 120px;">
                        <Option v-for="(item, idx) in dict_feedbackType"
                                :key="idx"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
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
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    export default {
        name: 'vfeedback',
        mixins: [comMixin, tableMixin],
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
                        feedbackType: ''
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '时间', width: 160, align: 'center', key: 'insTime',
                        render: (h, params) => {
                            return h('span', this.timeFormat(params.row.insTime, 'YYYY-MM-DD HH:mm:ss'))
                        }
                    },
                    { title: '手机号码', width: 120, align: 'center', key: 'phone' },
                    { title: '用户名', width: 120, align: 'center', key: 'name' },
                    { title: '反馈类型', width: 120, align: 'center', key: 'feedbackTypeLabel' },
                    { title: '反馈内容', align: 'center', key: 'feedbackContent' },
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            let list = [];
                            // 重置密码
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
                                            content: `确定要删除该反馈？`,
                                            onOk: () => {
                                                this.$http({
                                                    method: 'get',
                                                    url: '/feedback/delete',
                                                    params: {
                                                        feedbackId: params.row.feedbackId
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

                dict_feedbackType: []
            };
        },
        mounted() {
            this.getData();
            this.getDicts(['feedbackType']);
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.condition.beginTime = value[0];
                this.searchParams.condition.endTime = value[1];
            },
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/feedback/list',
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
    .feedback-container {
    }
</style>