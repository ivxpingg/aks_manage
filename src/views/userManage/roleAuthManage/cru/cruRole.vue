<template>
    <Modal class="cruRole-container"
           v-model="modalValue"
           :title="title"
           :width="350"
           @on-visible-change="onVisibleChange">
        <Form ref="form"
              :model="formData"
              :rules="rules" :label-width="80">
            <Row>
                <FormItem label="角色名称:" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入角色名称" />
                </FormItem>
                <FormItem label="角色编号:" prop="roleNo">
                    <Input v-model.trim="formData.roleNo" placeholder="请输入编号" />
                </FormItem>
                <FormItem label="排序:">
                    <InputNumber  v-model.trim="formData.sort" placeholder="排序" />
                </FormItem>
                <FormItem label="备注:">
                    <Input v-model.trim="formData.remark" type="textarea" placeholder="请输入" />
                </FormItem>
            </Row>
        </Form>
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
        name: 'vCruRole',  // 创建、 查询、修改
        mixins: [modalMixin],
        props: {
            roleId: {
                type: String,
                default: ''
            },
            type: {
                validator(value) {
                    return ['add', 'edit', 'view'].indexOf(value) !== -1;
                },
                default() {
                    return 'add';
                }
            }
        },
        computed: {
            title () {
                switch (this.type) {
                    case 'add': return '添加';
                    case 'edit': return '编辑';
                    case 'view': return '查看';
                    default: return '';
                }
            }
        },
        created() {
            Object.assign(this.defaultFormData, this.formData);
        },
        data () {
            return {
                saveBtnLoading: false,
                defaultFormData: {},
                formData: {
                    roleId: '',
                    name: '',         // 角色名称
                    roleNo: '',       // 角色编号
                    sort: 0,        //
                    remark: '',        // 备注
                    parentId: '0',   // 不要删掉、后台接口需要。
                    nodeType: 'role' // 不要删掉、后台接口需要。
                },
                rules: {
                    name: [{ required: true, message: '角色名称不能为空!', trigger: 'blur' }],
                    roleNo: [{ required: true, message: '角色编号不能为空!', trigger: 'blur' }]
                },
            };
        },
        watch: {
            roleId: {
                immediate: true,
                handler(val) {
                    this.formData.roleId = val;
                    if (val) { this.getData(); }
                }
            }
        },
        methods: {
            initFormData() {
                Object.assign(this.formData, this.defaultFormData);
            },
            // 获取用户详情
            getData() {
                this.$http({
                    method: 'get',
                    url: '/role/query',
                    params: {
                        roleId: this.roleId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);
                    }
                })
            },
            save() {
                this.saveBtnLoading = true;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.type === 'add') {
                            this.addSubmit();
                        }
                        else {
                            this.editSubmit();
                        }
                    }
                    else{
                        this.saveBtnLoading = false;
                    }
                })
            },
            addSubmit() {
                this.$http({
                    method: 'post',
                    url: '/role/add',
                    data: this.formData
                }).then(res => {
                    this.saveBtnLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('添加角色成功！');
                        this.initFormData();
                        this.modalValue = false;
                        this.$emit('modal-callback');
                    }
                }).catch(() => {
                    this.saveBtnLoading = false;
                })
            },
            editSubmit() {
                this.$http({
                    method: 'post',
                    url: '/role/update',
                    data: this.formData
                }).then(res => {
                    this.saveBtnLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('修改角色人员成功！');
                        this.initFormData();
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

<style lang="scss" scoped>
    .cruRole-container {
    }
</style>