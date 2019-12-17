<template>
    <div class="driver-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="时间：" :label-width="65">
                    <DatePicker type="daterange"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="审核状态：" :label-width="85">
                    <Select v-model="searchParams.condition.auditStatus" placeholder="全部" clearable style="width: 120px;">
                        <Option v-for="(item, idx) in dict_auditStatus"
                                :key="idx"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="名字/手机号码" />
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

        <vUserInfoTab ref="modal_userInfoTab"
                      :user-id="modal_userInfoTab_props.userId"
                      :type="modal_userInfoTab_props.type"
                      @modal-callback="getData"></vUserInfoTab>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vUserInfoTab from './module/userInfoTab/userInfoTab';
    export default {
        name: 'vDriver',
        mixins: [comMixin, tableMixin],
        components: {vUserInfoTab},
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
                        auditStatus: ''
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '名字', width: 140, align: 'center', key: 'name' },
                    { title: '手机号码', minWidth: 120, align: 'center', key: 'phone' },
                    { title: '注册时间', width: 120, align: 'center', key: 'insTime',
                        render: (h, params) => {
                            return h('span', this.timeFormat(params.row.insTime));
                        }
                    },
                    { title: '状态', width: 120, align: 'center', key: 'auditStatusLabel' },
                    { title: '任职公司', minWidth: 120, align: 'center', key: 'companyName' },
                    {
                        title: '操作',
                        width: 240,
                        align: 'center',
                        render: (h, params) => {
                            let btn_text = params.row.userStatus === 'normal' ? '停用' : '启用';
                            let list = [];

                            // 审核材料如果是待审核， 显示审核按钮
                            if (params.row.auditStatus === 'wait_audit') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-checkmark'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_userInfoTab_props.userId = params.row.userId;
                                            this.modal_userInfoTab_props.type = 'audit';
                                            this.$refs.modal_userInfoTab.modalValue = true;
                                        }
                                    }
                                }, '审核材料'))
                            }

                            // 审核材料如果是已审核， 显示查看详情
                            if (params.row.auditStatus !== 'wait_audit') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'ios-eye-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_userInfoTab_props.userId = params.row.userId;
                                            this.modal_userInfoTab_props.type = '';
                                            this.$refs.modal_userInfoTab.modalValue = true;
                                        }
                                    }
                                }, '查看详情'))
                            }

                            // 如果审核通过，显示停用或者启用
                            if (params.row.auditStatus === 'pass') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-eye-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要${btn_text}《${params.row.name}》用户？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/user/updateUserStatus',
                                                        params: {
                                                            userId: params.row.userId
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
                                }, btn_text))
                            }

                            // 如果审核不通过，显示按钮
                            if (params.row.auditStatus === 'not_pass') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-eye-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要删除《${params.row.name}》用户？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/taxiDriver/delete',
                                                        params: {
                                                            userId: params.row.userId
                                                        }
                                                    }).then((res) => {
                                                        if (res.code === 'SUCCESS') {
                                                            this.$Message.success(`删除成功！`);
                                                            this.getData();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, '删除'))
                            }

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                dict_auditStatus: [],

                modal_userInfoTab_props: {
                    userId: '',
                    type: ''
                }
            };
        },
        mounted() {
            this.getData();
            this.getDicts(['auditStatus']);
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
                    url: '/taxiDriver/taxiDriverList',
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
    .driver-container {
    }
</style>