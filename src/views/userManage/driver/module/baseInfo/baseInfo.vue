<template>
    <div class="baseInfo-container">
        <Form ref="form"
              :model="formData"
              :label-width="80">
            <Row>
                <Col span="12">
                    <FormItem label="姓名:">
                        <Input v-model.trim="formData.name" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="出生日期:">
                        <Input v-model.trim="formData.birthday" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="民族:">
                        <Input v-model.trim="formData.nation" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="身份证:">
                        <Input v-model.trim="formData.idNumber" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="任职单位:">
                        <Input v-model.trim="formData.companyName" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="联系电话:">
                        <Input v-model.trim="formData.phone" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="地址:">
                        <Input v-model.trim="formData.address" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="车牌号码:">
                        <Input v-model.trim="formData.licensePlate" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="24"><Divider style="margin-top: 0;" /></Col>
                <Col span="12">
                    <FormItem label="父亲姓名:">
                        <Input v-model.trim="formData.fatherName" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="民族:">
                        <Input v-model.trim="formData.fatherNation" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="身份证:">
                        <Input v-model.trim="formData.fatherIdNumber" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="24"><Divider style="margin-top: 0;" /></Col>
                <Col span="12">
                    <FormItem label="母亲姓名:">
                        <Input v-model.trim="formData.motherName" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="民族:">
                        <Input v-model.trim="formData.motherNation" readonly placeholder="" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="身份证:">
                        <Input v-model.trim="formData.motherIdNumber" readonly placeholder="" />
                    </FormItem>
                </Col>

            </Row>
        </Form>
    </div>
</template>

<script>
    import comMixin from '../../../../../lib/mixin/comMixin';
    export default {
        name: 'vbaseInfo',
        mixins: [comMixin],
        props: {
            userId: {
                type: String,
                default: ''
            }
        },
        created() {
            Object.assign(this.defaultFormData, this.formData);
        },
        data () {
            return {
                defaultFormData: {},
                formData: {
                    name: '', //
                    birthday: '', //
                    nation: '', //
                    idNumber: '', //
                    companyName: '', //
                    phone: '', //
                    address: '', // 家庭住址
                    // 家庭成员信息
                    fatherName: '', //
                    fatherNation: '', //
                    fatherIdNumber: '', //
                    motherName: '', //
                    motherNation: '', //
                    motherIdNumber: '', //
                    // 车辆信息
                    licensePlate: '', //  车牌号码
                }
            };
        },
        watch: {
            userId(val) {
                if (val) {
                    this.initFormData();
                    this.getData();
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
                    url: '/taxiDriver/driverDetail',
                    params: {
                        userId: this.userId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data, {
                            birthday: this.timeFormat(res.data.birthday)
                        });
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .baseInfo-container {
    }
</style>