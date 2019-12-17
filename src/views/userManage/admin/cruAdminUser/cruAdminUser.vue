<template>
    <Modal class="cruAdminUser-container"
           v-model="modalValue"
           :title="title"
           :width="450"
           @on-visible-change="onVisibleChange">
        <Form ref="form"
              :model="formData"
              :rules="rules" :label-width="90">
            <FormItem label="名称:" prop="name">
                <Input v-model.trim="formData.name" placeholder="请输入名称" />
            </FormItem>

            <!--<FormItem label="登陆名:" prop="loginName">-->
                <!--<Input v-model.trim="formData.loginName" placeholder="请输入登陆名" />-->
            <!--</FormItem>-->

            <FormItem label="联系电话:" prop="phone">
                <Input v-model.trim="formData.phone" placeholder="请输入联系电话" />
            </FormItem>
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
    import comMixin from '../../../../lib/mixin/comMixin';
    export default {
        name: 'vcruAdminUser',
        mixins: [modalMixin, comMixin],
        props: {
            userId: {
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
                    userId: '',
                    name: '',
                    loginName: '',
                    phone: ''
                },
                rules: {
                    name: [{ required: true, message: '名称不能为空!', trigger: 'blur' }],
                  //   loginName: [{ required: true, message: '登陆名不能为空!', trigger: 'blur' }],
                    phone: [{ required: true, message: '联系电话不能为空!', trigger: 'blur' }],
                }
            };
        },
        watch: {
            userId: {
                immediate: true,
                handler(val) {
                    this.formData.userId = val;
                    if (val) { this.getData(); }
                }
            }
        },
        //
        mounted() {
        },
        methods: {
            initFormData() {
                Object.assign(this.formData, this.defaultFormData);
            },

            // 获取用户详情
            getData() {
                this.$http({
                    method: 'get',
                    url: '/user/userDetail',
                    params: {
                        userId: this.userId
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
                    url: '/user/addUser',
                    data: this.formData
                }).then(res => {
                    this.saveBtnLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('添加成功！');
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
                    url: '/user/updateUser',
                    data: this.formData
                }).then(res => {
                    this.saveBtnLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('修改成功！');
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
    .cruAdminUser-container {
    }
</style>