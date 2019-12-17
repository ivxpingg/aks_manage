<template>
    <div class="fileInfo-container">
        <div class="item">
            <div class="left-panel">
                <span class="left-title">人车合一照片:</span>
            </div>
            <div class="right-panel">
                <img class="img"
                     v-for="item in fileList_personCar"
                     :key="item.fileId"
                     :src="getUrl(item.url)" alt="">
            </div>
        </div>

        <div class="item">
            <div class="left-panel">
                <span class="left-title">政审表:</span>
            </div>
            <div class="right-panel">
                <img class="img"
                     v-for="item in fileList_political"
                     :key="item.fileId"
                     :src="getUrl(item.url)" alt="">
            </div>
        </div>

        <div class="item">
            <div class="left-panel">
                <span class="left-title">三年无重大失误证明:</span>
            </div>
            <div class="right-panel">
                <img class="img"
                     v-for="item in fileList_noAccident"
                     :key="item.fileId"
                     :src="getUrl(item.url)" alt="">
            </div>
        </div>

        <div class="item">
            <div class="left-panel">
                <span class="left-title">从业资格证:</span>
            </div>
            <div class="right-panel">
                <img class="img"
                     v-for="item in fileList_qualificate"
                     :key="item.fileId"
                     :src="getUrl(item.url)" alt="">
            </div>
        </div>

        <div class="item">
            <div class="left-panel">
                <span class="left-title">体检表:</span>
            </div>
            <div class="right-panel">
                <img class="img"
                     v-for="item in fileList_health"
                     :key="item.fileId"
                     :src="getUrl(item.url)" alt="">
            </div>
        </div>

        <div class="item">
            <div class="left-panel">
                <span class="left-title">驾驶证:</span>
            </div>
            <div class="right-panel">
                <img class="img"
                     v-for="item in fileList_driverLicense"
                     :key="item.fileId"
                     :src="getUrl(item.url)" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import Config from '../../../../../config';
    export default {
        name: 'vfileInfo',
        props: {
            userId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                fileList_personCar: [], //  人车合一照片
                fileList_political: [], // 政审表
                fileList_noAccident: [], // 三年无重大失误证明
                fileList_qualificate: [], // 从业资格证
                fileList_health: [], // 体检表
                fileList_driverLicense: [], // 驾驶证
            };
        },
        watch: {
            userId(val) {
                if (val) {
                    this.initData();
                    this.getData();
                }
            }
        },
        methods: {
            initData() {
                this.fileList_personCar = [];
                this.fileList_political = [];
                this.fileList_noAccident = [];
                this.fileList_qualificate = [];
                this.fileList_health = [];
                this.fileList_driverLicense = [];
            },
            getUrl(url) {
                return Config.filePath + url;
            },
            // 获取用户详情
            getData() {
                //
                this.getFile('person_car', (res) => {
                    this.fileList_personCar = res.data;
                });
                this.getFile('political', (res) => {
                    this.fileList_political = res.data;
                });

                this.getFile('no_accident', (res) => {
                    this.fileList_noAccident = res.data;
                });

                this.getFile('qualificate', (res) => {
                    this.fileList_qualificate = res.data;
                });

                this.getFile('health', (res) => {
                    this.fileList_health = res.data;
                });

                this.getFile('driver_license', (res) => {
                    this.fileList_driverLicense = res.data;
                });

            },
            getFile(fileType, callback) {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: this.userId,
                        fileType: fileType
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        callback(res);
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fileInfo-container {
        padding: 10px 0;
        .item {
            display: flex;

            .left-panel {
                width: 80px;
                .left-title {
                    display: block;
                    padding-top: 20px;
                    height: 70px;
                }
            }
            .right-panel {
                flex: 1;

                .img {
                    display: inline-block;
                    float: left;
                    margin: 10px;
                    width: 80px;
                    height: 80px;
                }
            }
        }
    }
</style>