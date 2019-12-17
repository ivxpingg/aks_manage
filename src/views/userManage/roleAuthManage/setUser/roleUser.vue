<template>
    <Modal class="roleUser-container"
           v-model="modalValue"
           title="用户配置"
           :width="540"
           @on-visible-change="onVisibleChange">
        <Transfer
                :data="sourceData"
                :target-keys="targetKeys"
                :list-style="listStyle"
                filterable
                :titles="['未选用户', '已选用户']"
                :render-format="render"
                @on-change="handleChange"></Transfer>
        <div slot="footer">
            <Button type="primary"
                    size="large"
                    :loading="saveBtnLoading"
                    @click="save">保存</Button>
        </div>
    </Modal>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'vRoleUser',   // 配置角色权限
        mixins: [modalMixin],
        props: {
            roleId: {
                type: String,
                default: ''
            }
        },
        computed: {
            sourceData() {
                return this.userList.map((item) => {
                    item.label = item.name;
                    item.key = item.userId;
                    return item;
                });
            }
        },
        data () {
            return {
                saveBtnLoading: false,
                userList: [],
                targetKeys: [],
                listStyle: {
                    width: '220px',
                    height: '500px'
                },
                // 当前角色已有的用户
                currentRoleUserList: []
            };
        },
        watch: {
            roleId(val) {
                this.targetKeys = [];
                if (val) {
                    this.userList = [];
                    this.getUserList();
                    this.getData();
                }
            }
        },
        mounted() {

        },
        methods: {
            render (item) {
                return `${item.name}(${item.loginName})`;
            },
            // 获取已有用户
            getData() {
                this.$http({
                    method: 'get',
                    url: '/userRole/getUserListByRoleId',
                    params: {
                        roleId: this.roleId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.currentRoleUserList = res.data || [];
                        this.targetKeys = this.currentRoleUserList.map((item) => {
                            return item.userId;
                        });

                        res.data.forEach((val) => {
                            this.userList.push(val);
                        })
                    }
                })
            },
            getUserList() {
                this.$http({
                    method: 'get',
                    url: '/user/noRoleUserList'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        res.data.forEach((val) => {
                            this.userList.push(val);
                        })
                    }
                })
            },
            handleChange(newTargetKeys) {
                this.targetKeys = newTargetKeys;
            },
            save() {
                this.saveBtnLoading = true;
                let userRoles = this.targetKeys.map((val) => {
                    return {
                        roleId: this.roleId,
                        userId: val
                    }
                })
                this.$http({
                    method: 'post',
                    url: '/userRole/updateUserRole' + '/' + this.roleId,
                    data: userRoles
                }).then(res => {
                    this.saveBtnLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('保存成功');
                        this.modalValue = false;
                        this.$emit('modal-callback');
                    }
                }).catch(() => {
                    this.saveBtnLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss">
    .roleUser-container {
        .my-list-style {
            height: 400px;
        }
    }
</style>