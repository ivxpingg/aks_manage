<template>
    <Modal class="cruCardStation-container"
           v-model="modalValue"
           :title="title"
           :width="1000"
           @on-visible-change="onVisibleChange">
        <div class="modal-body">
            <div class="baidu-dom" v-if="type === 'add'" id="baidu_cardStation_add"></div>
            <div class="baidu-dom" v-if="type === 'edit'"  id="baidu_cardStation_edit"></div>
            <Form ref="form"
                  class="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="100">
                <Row>
                    <FormItem label="充值点名称:" prop="cardName">
                        <Input v-model.trim="formData.cardName" placeholder="请输入名称" />
                    </FormItem>
                    <FormItem label="服务电话:">
                        <Input v-model.trim="formData.servicePhone" placeholder="请输入服务电话" />
                    </FormItem>
                    <FormItem label="地址:" prop="address">
                        <Input v-model.trim="formData.address" placeholder="请输入地址" />
                    </FormItem>
                    <FormItem label="经度(lng):" prop="lng">
                        <Input v-model="formData.lng" type="number" placeholder="经度" />
                    </FormItem>
                    <FormItem label="纬度(lat):" prop="lat">
                        <Input  v-model="formData.lat" type="number" placeholder="纬度" />
                    </FormItem>
                </Row>
            </Form>

            <img class="img-point" src="/images/map/position.png" alt="">
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
    import initBMap from '../../../../lib/baidu/initBMap';
    export default {
        name: 'vcruCardStation',
        mixins: [modalMixin],
        props: {
            cardId: {
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
                    cardId: '',
                    cardName: '',  // 充值点名称
                    servicePhone: '', // 服务电话
                    address: '',  //	位置
                    lng: null, //	经度
                    lat: null,  //	纬度
                    fileIds: [],  // 图片
                },
                rules: {
                    cardName: [{ required: true, message: '停车场名称不能为空!', trigger: 'blur' }],
                    address: [{ required: true, message: '位置不能为空!', trigger: 'blur' }],
                    lng: [{ required: true, type: 'number', message: '经度不能为空!', trigger: 'blur' }],
                    lat: [{ required: true, type: 'number', message: '纬度不能为空!', trigger: 'blur' }],
                },

                map: null
            };
        },
        mounted() {
        },
        watch: {
            cardId(val) {
                if (val) {
                    this.formData.cardId = val;
                    this.getData();
                }
                else {
                    this.formData.cardId = '';
                }
            },
            modalValue: {
                immediate: true,
                handler (val) {
                    let that = this;
                    if (val && !this.map) {
                        let id = this.type === 'add' ? 'baidu_cardStation_add' : 'baidu_cardStation_edit';
                        initBMap(id).then((map) => {
                            this.map = map;
                            this.map.addEventListener('dragend', function(e) {
                                that.getStart();
                            });


                        })
                    }
                }
            }
        },
        methods: {
            initFormData() {
                Object.assign(this.formData, this.defaultFormData);
            },
            // 解析上车位置
            getStart(p) {
                let that = this;
                let point =  p || this.map.getCenter();
                let geocoder = new BMap.Geocoder();
                geocoder.getLocation(point, function (result) {
                    that.map.panTo(result.point);
                    that.formData.address = result.address;
                    that.formData.lng = parseFloat(result.point.lng.toFixed(6));
                    that.formData.lat = parseFloat(result.point.lat.toFixed(6));
                    // that.setDrivingLine();
                });
            },
            // 获取详情
            getData() {
                this.$http({
                    method: 'get',
                    url: '/card/detail',
                    params: {
                        cardId: this.cardId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);
                        if (this.map) {
                            this.map.setCenter(new BMap.Point(res.data.lng, res.data.lat));
                        }
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
                    url: '/card/add',
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
                    url: '/card/update',
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
    .cruCardStation-container {
        .modal-body {
            position: relative;
            height: 500px;
            .baidu-dom {
                margin-left: 260px;
                height: 100%;
            }
            .form {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                width: 240px;
                background-color: #FFF;
            }
            .img-point {
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -32px;
                margin-left: -10px + 130px;
                width: 20px;
                height: 32px;
            }
        }
    }
</style>