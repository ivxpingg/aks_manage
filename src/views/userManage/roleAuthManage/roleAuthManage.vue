<template>
    <div class="roleAuthManage-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem>
                    <Button type="primary" icon="md-add" @click="$refs.modal_addRole.modalValue = true">新增</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="检索：" :label-width="65">
                    <Input v-model.trim="searchParams.searchKey" placeholder="关键字" />
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
        </div>

        <!--添加角色-->
        <vCruRole ref="modal_addRole"
                  type="add"
                  @modal-callback="getData"></vCruRole>

        <!--编辑角色-->
        <vCruRole ref="modal_editRole"
                  type="edit"
                  :roleId="modal_editRole_props.roleId"
                  @modal-callback="getData"></vCruRole>
        <!--配置角色权限-->
        <vModalMenuTree ref="modal_menuTree"
                        :roleId="modal_menuTree_props.roleId"></vModalMenuTree>
        <!--配置用户-->
        <vRoleUser ref="modal_roleUser"
                   :roleId="modal_roleUser_props.roleId"></vRoleUser>
    </div>
</template>

<script>
    import comMixin from '../../../lib/mixin/comMixin';
    import vCruRole from './cru/cruRole';
    import vModalMenuTree from './setMenuTree/modalMenuTree';
    import vRoleUser from './setUser/roleUser';
    export default {
        name: 'vRroleAuthManage',
        mixins: [comMixin],
        components: {vCruRole, vModalMenuTree, vRoleUser },

        data () {
            return {
                searchParams: {
                    searchKey: ''
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '角色名称', width: 160, align: 'center', key: 'name' },
                    { title: '编号', width: 180, align: 'center', key: 'roleNo' },
                    { title: '顺序', width: 120, align: 'center', key: 'sort' },
                    { title: '备注', minWidth: 120, align: 'center', key: 'remark' },
                    {
                        title: '操作',
                        width: 360,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'ios-eye-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_editRole_props.roleId = params.row.roleId;
                                            this.$refs.modal_editRole.modalValue = true;
                                        }
                                    }
                                }, '编辑'),

                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-lock-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_menuTree_props.roleId = params.row.roleId;
                                            this.$refs.modal_menuTree.modalValue = true;
                                        }
                                    }
                                }, '权限管理'),

                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-contacts'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_roleUser_props.roleId = params.row.roleId;
                                            this.$refs.modal_roleUser.modalValue = true;
                                        }
                                    }
                                }, '配置用户'),

                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'md-trash'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除',
                                                content: `确定要删除《${params.row.name}》角色?`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/role/delete',
                                                        params: {
                                                            roleId: params.row.roleId
                                                        }
                                                    }).then((res) => {
                                                        if(res.code === 'SUCCESS') {
                                                            this.$Message.success(`《${params.row.name}》角色删除成功！`);
                                                            this.getData();
                                                        }
                                                        else {
                                                            this.$Message.error('删除失败！');
                                                        }
                                                    }).catch((e) => {
                                                        this.$Message.error('删除失败！');
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }, '删除')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],
                dict_userType: [],

                modal_editRole_props: {
                    roleId: ''
                },

                // 角色菜单权限
                modal_menuTree_props: {
                    roleId: ''
                },
                // 用户配置
                modal_roleUser_props: {
                    roleId: ''
                }
            };
        },
        mounted() {
            this.getDicts(['userType']);
            this.getData();
        },
        watch: {
            'searchParams.searchKey'() {
                this.getData();
            }
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.condition.beginTime = value[0];
                this.searchParams.condition.endTime = value[1];
            },
            getData() {
                this.modal_editRole_props.roleId = '';
                this.modal_menuTree_props.roleId = '';
                this.modal_roleUser_props.roleId = '';

                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/role/list',
                    params: this.searchParams
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data;
                        // this.tableData = res.data.records;
                        // this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .roleAuthManage-container {
    }
</style>