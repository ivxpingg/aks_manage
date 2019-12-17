<template>
    <Modal class="taxiOrderInfo-container"
           v-model="modalValue"
           title="订单信息"
           :width="1000"
           footer-hide
           @on-visible-change="onVisibleChange">
        <div class="modal-body">
            <div class="baidu-dom" id="baidu_taxiOrderInfo"></div>
            <Form ref="form"
                  class="form"
                  :model="formData"
                  :label-width="40">
                <Row>
                    <FormItem label="起点:">
                        {{formData.beginAddress}}
                    </FormItem>
                    <FormItem label="终点:">
                        {{formData.endAddress}}
                    </FormItem>
                </Row>
            </Form>

        </div>
    </Modal>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import initBMap from '../../../../lib/baidu/initBMap';
    export default {
        name: 'vtaxiOrderInfo',
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
                map: null,
                defaultFormData: {},
                formData: {
                    beginAddress: '',
                    beginLat: null,
                    beginLng: null,
                    distance: 0,
                    endAddress: '',
                    endLat: null,
                    endLng: null,
                    insTime: '',
                    orderId: '',
                    orderNo: '',
                    orderStatus: '',
                    orderStatusLabel: '',
                    receiveOrderTime: '',
                    totalPrice: 0,
                    userId: '',
                    passengerName: '',
                    passengerPhone: ''
                },

                startMarker: null,
                endMarker: null
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
            },
            modalValue: {
                immediate: true,
                handler (val) {
                    if (val && !this.map) {
                        initBMap('baidu_taxiOrderInfo').then((map) => {
                            this.map = map;
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
                    url: '/taxiOrder/taxiOrderDetail',
                    params: {
                        orderId: this.orderId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data.order, res.data.passenger);
                        this.setStartMarker(res.data.order.beginLng, res.data.order.beginLat);
                        this.setEndMarker(res.data.order.endLng, res.data.order.endLat);
                    }
                })
            },
            // 设置上车起点位置
            setStartMarker(lng, lat) {
                let point;
                if (!this.map) {
                    setTimeout(() => {
                        this.setStartMarker(lng, lat);
                    }, 1000);
                }
                else {
                    point = new BMap.Point(lng, lat);
                    setTimeout(() => {
                        this.map.panTo(point);
                    }, 500)
                }
                if (!this.startMarker) {
                    let myIcon = new BMap.Icon("/images/map/start-point.png", new BMap.Size(28,34));
                    myIcon.setImageSize(new BMap.Size(28,34));
                    this.startMarker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                    this.map.addOverlay(this.startMarker);
                }
                else {
                    this.startMarker.setPosition(point);
                }
            },
            // 设置终点位置
            setEndMarker(lng, lat) {
                let point;
                if (!this.map) {
                    setTimeout(() => {
                        this.setEndMarker(lng, lat);
                    }, 1000);
                }
                else {
                    point = new BMap.Point(lng, lat);
                }

                if (!this.endMarker) {
                    let myIcon = new BMap.Icon("/images/map/end-point.png", new BMap.Size(28,34));
                    myIcon.setImageSize(new BMap.Size(28,34));
                    this.endMarker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                    this.map.addOverlay(this.endMarker);
                }
                else {
                    this.endMarker.setPosition(point);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .taxiOrderInfo-container {
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

                .ivu-form-item {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>