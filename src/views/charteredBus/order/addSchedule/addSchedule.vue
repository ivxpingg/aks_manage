<template>
    <Modal class="addSchedule-container"
           v-model="modalValue"
           title="添加安排"
           :width="800"
           @on-visible-change="onVisibleChange">
        <Form ref="form"
              class="form"
              :model="formData"
              :rules="rules"
              :label-width="80">
            <Row>
                <Col span="12">
                    <FormItem label="包车机构:" prop="rentCarOrgId">
                        <Select v-model="formData.rentCarOrgId" style="width: 300px;">
                            <Option v-for="item in orgList"
                                    :key="item.rentCarOrgId"
                                    :value="item.rentCarOrgId"
                                    :label="item.orgName"></Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="司机名称:" prop="driverName">
                        <Input v-model="formData.driverName" placeholder="请输入线路名称" />
                    </FormItem>
                </Col>

                <Col span="12">
                    <FormItem label="联系电话:" prop="driverPhone">
                        <Input v-model="formData.driverPhone" placeholder="请输入联系电话" />
                    </FormItem>
                </Col>

                <Col span="12">
                    <FormItem label="接送时间:" prop="pickUpTime">
                        <DatePicker type="datetime"
                                    format="yyyy-MM-dd HH:mm"
                                    @on-change="onChage_datetime"
                                    placeholder="选择时间"
                                    style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>

                <Col span="12">
                    <FormItem label="车牌号:" prop="licensePlate">
                        <Input v-model="formData.licensePlate" placeholder="请输入线路名称" />
                    </FormItem>
                </Col>

                <Col span="12">
                    <FormItem label="行程费用:" prop="tripCost">
                        <Input v-model="formData.tripCost" type="number" placeholder="请输入线路名称" />
                    </FormItem>
                </Col>

                <Col span="12">
                    <FormItem label="车辆类型:" prop="carType">
                        <Input v-model="formData.carType" placeholder="请输入车辆类型" />
                    </FormItem>
                </Col>

                <Col span="24">
                    <FormItem label="服务内容:" prop="serviceContent">
                        <Input v-model="formData.serviceContent" type="textarea" placeholder="请输入服务内容" />
                    </FormItem>
                </Col>
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
    import comMixin from '../../../../lib/mixin/comMixin';
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'vaddSchedule',
        mixins: [comMixin, modalMixin],
        props: {
            orderId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                saveBtnLoading: false,
                defaultFormData: {},
                formData: {
                    rentCarOrderId: '',
                    rentCarOrgId: '',  // 机构
                    driverName: '',
                    driverPhone: '',
                    carType: '',   // 车辆类型
                    licensePlate: '', // 车牌号码
                    serviceContent: '',
                    pickUpTime: '',
                    tripCost: 0 // 行程费用
                },
                rules: {
                    rentCarOrgId: [{ required: true, message: '请选择包车机构!', trigger: 'blur' }],
                    driverName: [{ required: true, message: '请输入司机名称!', trigger: 'blur' }],
                    driverPhone: [{ required: true, message: '请输入联系电话!', trigger: 'blur' }],
                    licensePlate: [{ required: true, message: '请输入车牌号!', trigger: 'blur' }],
                    pickUpTime: [{ required: true, message: '请选择接送时间!', trigger: 'blur' }],
                    carType: [{ required: true, message: '请输入车辆类型!', trigger: 'blur' }],
                    serviceContent: [{ required: true, message: '请输入服务内容!', trigger: 'blur' }]
                },
                orgList: []
            };
        },
        mounted() {
            this.getOrgList();
        },
        watch: {
            orderId(val) {
                this.formData.rentCarOrderId = val;
            }
        },
        methods: {
            onChage_datetime(value) {
                this.formData.pickUpTime = this.timeFormat(value, 'YYYY-MM-DD HH:mm');
            },
            getOrgList() {
                this.$http({
                    method: 'post',
                    url: '/rentCarOrg/list',
                    data: {
                        current: 1,      // 当前第几页
                        size: 1000,      // 每页几行
                        total: 0,
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.orgList = res.data.records;
                    }
                })
            },
            save() {
                this.saveBtnLoading = true;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/order/addPlan',
                            data: this.formData
                        }).then(res => {
                            this.saveBtnLoading = false;
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('安排成功！');
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
    .addSchedule-container {
    }
</style>