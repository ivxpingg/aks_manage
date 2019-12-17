<template>
    <Modal class="cruOrg-container"
           v-model="modalValue"
           :title="title"
           :width="400"
           @on-visible-change="onVisibleChange">
        <div class="modal-body">
            <Form ref="form"
                  class="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <Row>
                    <FormItem label="机构名称:" prop="orgName">
                        <Input v-model.trim="formData.orgName" placeholder="请输入线路名称" />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="联系人:" prop="contactsName">
                        <Input v-model.trim="formData.contactsName" placeholder="请输入线路名称" />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="联系电话:" prop="contactsPhone">
                        <Input v-model.trim="formData.contactsPhone" placeholder="请输入线路名称" />
                    </FormItem>
                </Row>
            </Form>
        </div>
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
        name: 'vcruOrg',
        mixins: [modalMixin],
        props: {
            rentCarOrgId: {
                type: String,
                default: ''
            },
            type: {
                validator(value) {
                    return ['add', 'edit'].indexOf(value) !== -1;
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
                    rentCarOrgId: '',  // 包车机构ID
                    orgName: '',       // 机构名称
                    contactsName: '',  // 联系人
                    contactsPhone: '' // 联系电话
                },
                rules: {
                    orgName: [{ required: true, message: '机构名称不能为空!', trigger: 'blur' }],
                    contactsName: [{ required: true, message: '联系人不能为空!', trigger: 'blur' }],
                    contactsPhone: [{ required: true, message: '联系电话不能为空!', trigger: 'blur' }]
                }

            };
        },
        watch: {
            rentCarOrgId(val) {
                if (val) {
                    this.formData.rentCarOrgId = val;
                    this.getData();
                }
                else {
                    this.initFormData();
                }
            }
        },
        methods: {
            initFormData() {
                Object.assign(this.formData, this.defaultFormData);
            },
            // 获取详情
            getData() {
                this.$http({
                    method: 'get',
                    url: '/rentCarOrg/detail',
                    params: {
                        rentCarOrgId: this.rentCarOrgId
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
                    url: '/rentCarOrg/add',
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
                    url: '/rentCarOrg/update',
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
    .cruOrg-container {
    }
</style>