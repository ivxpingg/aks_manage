<template>
    <Modal class="orderDetail-container"
           v-model="modalValue"
           title="详情"
           :width="1200"
           :styles="{top: '20px'}"
           @on-visible-change="onVisibleChange">
        <div class="modal-body">
            <div class="left-panel">
                <div class="order-info-panel">
                    <Divider style="margin: 5px 0">用户信息</Divider>
                    <div class="item"> <span>起点：</span> <span>{{formData.beginAddress}}</span> </div>
                    <div class="item"> <span>终点：</span> <span>{{formData.endAddress}}</span> </div>
                    <div class="item"> <span>开始时间：</span> <span>{{formData.beginTime}}</span> </div>
                    <div class="item"> <span>结束时间：</span> <span>{{formData.endTime}}</span> </div>
                    <div class="item"> <span>用车人数：</span> <span>{{formData.seatNum}}</span> </div>
                    <div class="item"> <span>联系人：</span> <span>{{formData.contactsName}}</span> </div>
                    <div class="item"> <span>联系人电话：</span> <span>{{formData.contactsPhone}}</span> </div>
                    <div class="item"> <span>需求描述：</span> <span>{{formData.description}}</span> </div>
                    <Divider style="margin: 5px 0">司机信息</Divider>
                    <div class="item"> <span>司机名称：</span> <span>{{formData.driverName}}</span> </div>
                    <div class="item"> <span>司机电话：</span> <span>{{formData.driverPhone}}</span> </div>
                    <div class="item"> <span>车辆类型：</span> <span>{{formData.carType}}</span> </div>
                    <div class="item"> <span>车牌号码：</span> <span>{{formData.licensePlate}}</span> </div>
                    <div class="item"> <span>行程费用：</span> <span>{{formData.tripCost}}</span> </div>
                    <Divider style="margin: 5px 0">发票信息</Divider>
                    <div class="item"> <span>发票名称：</span> <span>{{formData.invoiceName}}</span> </div>
                    <div class="item"> <span>税号：</span> <span>{{formData.invoiceNo}}</span> </div>
                    <Divider style="margin: 5px 0">支付信息</Divider>
                    <div class="item"> <span>支付类型：</span> <span>{{formData.payTypeLabel}}</span> </div>
                    <div class="item"> <span>支付金额：</span> <span>{{formData.totalPrice}}</span> </div>

                </div>
            </div>
            <div class="right-panel">
                <div class="baidu" id="baidu_orderDetail_dom"></div>
            </div>
        </div>
    </Modal>
</template>

<script>
    import comMixin from '../../../../lib/mixin/comMixin';
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import initBMap from '../../../../lib/baidu/initBMap';
    export default {
        name: 'vorderDetail',
        mixins: [comMixin, modalMixin],
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
                defaultFormData: {},
                formData: {
                    rentCarOrderId: '', //	包车订单id
                    beginAddress: '', //	起点名称
                    beginLng: '',
                    beginLat: '',
                    endAddress: '', //	终点名称
                    endLng: '',
                    endLat: '',
                    beginTime: '', //	用车开始时间
                    endTime: '', //	用车结束时间
                    seatNum: '', //	用车人数
                    contactsPhone: '', //	联系人电话
                    contactsName: '', //	联系人
                    description: '', //	描述
                    driverName: '', //	司机名称
                    driverPhone: '', //	司机联系电话
                    carType: '', //	车辆类型
                    licensePlate: '', //	车牌号码
                    tripCost: '',   // 行程费用
                    invoiceName: '', //	发票名称
                    invoiceNo: '', //	税号
                    payType: '',  // 支付类型
                    totalPrice: '',  // 支付金额
                    insTime: '' //	创建时间
                },

                drivingRoute: {
                    obj: null
                }
            };
        },
        watch: {
            orderId(val) {
                if (val) {
                    this.getData();
                }
                else {
                    this.initFormData();
                }
            },
            modalValue: {
                immediate: true,
                handler (val) {
                    if (val && !this.map) {
                        initBMap('baidu_orderDetail_dom').then((map) => {
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
            // 获取详情
            getData() {
                this.$http({
                    method: 'get',
                    url: '/order/rentCarOrderDetail',
                    params: {
                        orderId: this.orderId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data, {
                            beginTime: this.timeFormat(res.data.beginTime, 'YYYY-MM-DD HH:mm'),
                            endTime: this.timeFormat(res.data.endTime, 'YYYY-MM-DD HH:mm')
                        });
                        this.showDrivingLine();
                    }
                })
            },
            // 设置驾车线路
            showDrivingLine() {

                if (!this.drivingRoute.obj && this.formData.beginLng) {
                    this.drivingRoute.obj = new BMap.DrivingRoute(this.map, {
                        renderOptions: {
                            map: this.map,
                            autoViewport: true
                        },
                        // onSearchComplete: function(results) {
                        //     if (that.drivingRoute.obj.getStatus() !== BMAP_STATUS_SUCCESS) {
                        //         return;
                        //     }
                        //     let plan = results.getPlan(0);
                        //     that.drivingRoute.duration = plan.getDuration(true);
                        //     that.drivingRoute.distance = plan.getDistance(true);
                        // }
                    });

                    let startPoint = new BMap.Point(this.formData.beginLng, this.formData.beginLat);
                    let endPoint = new BMap.Point(this.formData.endLng, this.formData.endLat);
                    this.drivingRoute.obj.search(startPoint, endPoint);
                }
                else {
                    this.drivingRoute.obj.clearResults();
                    this.drivingRoute.obj = null;
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .orderDetail-container {
        .modal-body {
            display: flex;
            .left-panel {
                width: 280px;
                .order-info-panel {
                    height: 600px;
                    padding-right: 5px;
                    overflow-y: auto;
                    .item {
                        padding-bottom: 6px;
                        font-size: 12px;
                        line-height: 20px;
                        >span:first-child {
                            font-weight: 700;
                        }
                    }
                }
            }
            .right-panel {
                flex: 1;
                .baidu {
                    height: 600px;
                }
            }
        }
    }
</style>