<template>
    <Modal class="modalMenuTree-container"
           v-model="modalValue"
           title="菜单权限"
           :width="400"
           @on-visible-change="onVisibleChange">
        <div style="height: 400px; overflow: auto;">
            <vMenuTree ref="menuTree"
                       class="menu-tree"
                       :checkedNodes="roleMenuAuth"
                       :roleId="roleId"
                       @onCheckChange="menuTree_onCheckChange"></vMenuTree>
        </div>
        <div slot="footer">
            <Button type="primary"
                    size="large"
                    @click="saveMenuTreeAuth">保存</Button>
        </div>
    </Modal>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import vMenuTree from '../../../Common/menuTree/menuTree';
    export default {
        name: 'vModalMenuTree',
        mixins: [modalMixin],
        components: {vMenuTree},
        props: {
            roleId: {
                type: String,
                default: ''
            }
        },
        computed: {
            roleMenus() {
                return this.menuTreeCheckNodes.map((val) => {
                    return {
                        roleId: this.roleId,
                        menuId: val.menuId
                    };
                });
            }
        },
        data () {
            return {
                menuTreeCheckNodes: [],
                roleMenuAuth: []
            };
        },
        watch: {
            roleId(val) {
                if (val) {
                    this.getRoleMenu();
                }
            }
        },
        methods: {
            // 获取角色菜单权限
            getRoleMenu () {
                this.$http({
                    method: 'get',
                    url: '/role/getRoleMenu',
                    params: {
                        roleId: this.roleId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.roleMenuAuth = res.data === '' ? [] : res.data;
                    }
                })
            },
            /**
             * 菜单树返回的选中的项， 获取选中的项没有采用默认方法，
             *
             * @param item
             */
            menuTree_onCheckChange (item) {
                this.menuTreeCheckNodes = this.$refs.menuTree.$refs.tree.flatState.filter(obj => obj.node.checked || obj.node.indeterminate).map(obj => obj.node);
            },
            // 保存角色的菜单权限
            saveMenuTreeAuth () {
                this.$http({
                    method: 'post',
                    url: '/role/addRoleMenu',
                    data: this.roleMenus
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.$Message.success({
                            content: '菜单权限保存成功！'
                        });
                        this.modalValue = false;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>