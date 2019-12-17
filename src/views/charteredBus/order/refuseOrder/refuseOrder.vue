<template>
    <Modal class="refuseOrder-container"
           v-model="modalValue"
           title="拒绝订单"
           :width="450"
           @on-visible-change="onVisibleChange">
        <Form ref="form"
              class="form"
              :model="formData"
              :rules="rules"
              :label-width="80">
            <Row>
                <FormItem label="拒绝理由:" prop="refuseReason">
                    <Input v-model="formData.refuseReason" type="textarea" placeholder="请输入理由" />
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
        name: 'vRefuseOrder',
        mixins: [modalMixin],
        props: {
            orderId: {
                type: String,
                default: ''
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
                    orderId: '',
                    refuseReason: ''
                },
                rules: {
                    refuseReason: [{ required: true, message: '请输入拒绝理由!', trigger: 'blur' }]
                }
            };
        },
        watch: {
            orderId(val) {
                if (val) {
                    this.formData.orderId = val;
                    this.getData();
                }
                else {
                    this.formData.orderId = '';
                }
            }
        },
        methods: {
            initFormData() {
                Object.assign(this.formData, this.defaultFormData);
            },
            save() {
                this.saveBtnLoading = true;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/order/closeOrder',
                            data: this.formData
                        }).then(res => {
                            this.saveBtnLoading = false;
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('拒绝成功！');
                                this.initFormData();
                                this.modalValue = false;
                                this.$emit('modal-callback');
                            }
                        }).catch(() => {
                            this.saveBtnLoading = false;
                        })
                    }
                    else{
                        this.saveBtnLoading = false;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .refuseOrder-container {
    }
</style>