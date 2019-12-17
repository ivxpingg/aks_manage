<template>
    <div class="selectStationByMap-container">
        <div class="baidu" id="map_selectStationByMap">

        </div>
    </div>
</template>

<script>
    import initBMap from '../../../../../lib/baidu/initBMap';
    export default {
        name: 'vSelectStationByMap',
        props: {
            // 已选择的车站
            value: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        model: {
            prop: 'value',
            event: 'changeSelectedStation'
        },
        computed: {
            selectedStationIds() {
                return this.currentValue.map(item => item.stationId);
            }
        },
        data () {
            return {
                map: null,
                //
                currentValue: this.value,
                // 所有站点
                stationList: [],

                polyline: null
            };
        },
        mounted() {
            initBMap('map_selectStationByMap').then((map) => {
                this.map = map;
                this.getStations();
            });
        },
        watch: {
            value(val) {
                this.currentValue = val;
            },
            currentValue: {
                immediate: true,
                handler(val) {
                    setTimeout(() => {
                        this.drawLine();
                    }, 0)
                }
            }
        },
        methods: {
            // 获取站点
            getStations() {
                this.$http({
                    method: 'post',
                    url: '/station/list',
                    data: {
                        current: 1,      // 当前第几页
                        size: 10000,      // 每页几行
                        total: 0     // 总行数
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.stationList = res.data.records;
                        this.setAllStationPosition();
                    }
                })
            },
            // 在地图显示站点
            setAllStationPosition() {
                let that = this;
                this.stationList.forEach((item) => {
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
                    marker.addEventListener('click', function () {
                        that.onClick_marker(this.info);
                    });
                    this.map.addOverlay(marker);
                })
            },
            onClick_marker(station) {
                let idx = this.selectedStationIds.indexOf(station.stationId);
                if (idx > -1) {
                    this.currentValue.splice(idx, 1);
                }
                else {
                    this.currentValue.push(station);
                }
                this.$emit('changeSelectedStation', this.currentValue);
            },

            // 绘制站点线路
            drawLine() {
                let points = this.currentValue.map(item => new BMap.Point(item.lng, item.lat));

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

            },
            panTo(point) {
                this.map.panTo(point);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .selectStationByMap-container {
        .baidu{
            height: 600px;
        }
    }
</style>