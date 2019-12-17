<template>
    <div class="adminUser-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-search" @click="$refs.modal_cruAdminUser_add.modalValue = true">添加管理员</Button>
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

        <!--设置菜单权限-->
        <vSetAuth ref="model_setAuth" :roleId="model_setAuth_props.userId"></vSetAuth>

        <!--轮播图新增-->
        <vCruAdminUser ref="modal_cruAdminUser_add"
                    type="add" @modal-callback="getData"></vCruAdminUser>
        <!--轮播图修改-->
        <vCruAdminUser ref="modal_cruAdminUser_edit"
                    type="edit"
                    :user-id="modal_cruAdminUser_edit_props.userId"
                    @modal-callback="getData"></vCruAdminUser>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vSetAuth from './module/setAuth/setAuth';
    import vCruAdminUser from './cruAdminUser/cruAdminUser';
    export default {
        name: 'vAdminUser',
        mixins: [comMixin, tableMixin],
        components: {vSetAuth, vCruAdminUser},
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
                        userType: '',
                        menuType: 'admin'
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '名字', width: 140, align: 'center', key: 'name' },
                    { title: '类型', width: 120, align: 'center', key: 'userTypeLabel' },
                    { title: '注册时间', width: 120, align: 'center', key: 'insTime',
                        render: (h, params) => {
                            return h('span', this.timeFormat(params.row.insTime))
                        }
                    },
                    { title: '状态', width: 120, align: 'center', key: 'userStatusLabel' },
                    { title: '手机号码', minWidth: 120, align: 'center', key: 'phone' },
                    {
                        title: '操作',
                        width: 350,
                        align: 'center',
                        render: (h, params) => {
                            let btn_text = params.row.userStatus === 'normal' ? '停用' : '启用';
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
                                            this.modal_cruAdminUser_edit_props.userId = params.row.userId;
                                            this.$refs.modal_cruAdminUser_edit.modalValue = true;
                                        }
                                    }
                                }, '编辑')
                            );

                            // 权限设置
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'md-settings'
                                },
                                on: {
                                    click: () => {
                                        this.model_setAuth_props.userId = params.row.userId;
                                        this.$refs.model_setAuth.modalValue = true;
                                    }
                                }
                            }, '权限设置'));
                            // 重置密码
                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-lock'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: `确定要重置《${params.row.name}》用户密码？`,
                                            onOk: () => {
                                                this.$http({
                                                    method: 'get',
                                                    url: '/user/resetPassword',
                                                    params: {
                                                        userId: params.row.userId
                                                    }
                                                }).then((res) => {
                                                    if (res.code === 'SUCCESS') {
                                                        this.$Message.success('重置密码成功！');
                                                        this.getData();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            }, '重置密码'));
                            // 停用/启用
                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    // icon: 'ios-eye-outline'
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
                            }, btn_text));

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                model_setAuth_props: {
                    userId: ''
                },

                modal_cruAdminUser_edit_props: {
                    userId: ''
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
                this.model_setAuth_props.userId = '';
                this.modal_cruAdminUser_edit_props.userId = '';
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/user/list',
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
    .adminUser-container {
    }
</style>