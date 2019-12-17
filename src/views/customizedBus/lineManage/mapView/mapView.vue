<template>
    <Modal class="mapView-container"
           v-model="modalValue"
           title="查看"
           :width="1200"
           footer-hide
           :styles="{top: '20px'}"
           @on-visible-change="onVisibleChange">
        <div class="baidu" id="map_view">

        </div>
    </Modal>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import initBMap from '../../../../lib/baidu/initBMap';
    export default {
        name: 'vmapView',
        mixins: [modalMixin],
        props: {
            customBusId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                map: null,
                formData: {
                    customBusStations: []
                }
            };
        },
        mounted() {
            initBMap('map_view').then((map) => {
                this.map = map;
            });
        },
        watch: {
            customBusId(val) {
                if (val) {
                    this.getData();
                }
            },
            modalValue: {
                immediate: true,
                handler (val) {
                    if (val && !this.map) {

                    }
                }
            }
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/customBus/stationList',
                    params: {
                        customBusId: this.customBusId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.formData.customBusStations = res.data || [];
                        this.setAllStationPosition();
                        this.drawLine();
                    }
                })
            },
            setAllStationPosition() {
                let that = this;
                this.formData.customBusStations.forEach((item) => {
                    let point = new BMap.Point(item.lng, item.lat);
                    let marker = new BMap.Marker(point, {
                        title: item.stationName
                    });

                    let label = new BMap.Label(item.stationName, {
                        offset: new BMap.Size(-item.stationName.length * 5 - 5,  -20)
                    });
                    label.setStyle({
                        padding: '0 5px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: 'transparent',
                        color: '#666',
                        border: 'none',
                        textShadow: '0 0 3px #999',
                        borderRadius: '3px'
                    });
                    marker.setLabel(label);
                    marker.info = item;
                    marker.setLabel(

                    );
                    this.map.addOverlay(marker);
                })
            },
            // 绘制站点线路
            drawLine() {
                let points = this.formData.customBusStations.map(item => new BMap.Point(item.lng, item.lat));

                if (points.length > 0) {
                    if (this.polyline) {
                        this.map.removeOverlay(this.polyline);
                    }
                    this.polyline = new BMap.Polyline(points, {
                        strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
                    this.map.addOverlay(this.polyline);
                }
                else {
                    if (this.polyline) {
                        this.polyline = null;
                        this.map.removeOverlay(this.polyline);
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mapView-container {
        .baidu {
            height: 650px;
        }
    }
</style>