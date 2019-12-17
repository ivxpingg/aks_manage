<template>
    <Modal class="cruLine-container"
           v-model="modalValue"
           :title="title"
           :width="1200"
           :styles="{top: '20px'}"
           @on-visible-change="onVisibleChange">
        <div class="modal-body">
            <div class="left-panel">
                <Form ref="form"
                      class="form"
                      :model="formData"
                      :rules="rules"
                      :label-width="80">
                    <Row>
                        <FormItem label="线路名称:" prop="lineName">
                            <Input v-model.trim="formData.lineName" placeholder="请输入线路名称" />
                        </FormItem>
                        <FormItem label="发车时间:" prop="departTime">
                            <TimePicker v-model="formData.departTime" format="HH:mm" type="time" placeholder="请选择发车时间"></TimePicker>
                        </FormItem>
                        <FormItem label="站点列表:" prop="customBusStations">
                            <div class="station-list">
                                <div class="drag-item"
                                    v-for="element in formData.customBusStations"
                                    :key="element.stationId" @click="panTo(element)">
                                    <Icon type="md-pin" />
                                    {{ element.stationName }}
                                </div>
                            </div>
                        </FormItem>
                    </Row>
                </Form>
            </div>
            <div class="right-panel">
                <div class="select-station">
                    <vSelectStationByMap ref="selectStationByMap"
                                         v-model="formData.customBusStations"
                                         v-if="modalValue">
                    </vSelectStationByMap>
                </div>
            </div>

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
    import vSelectStationByMap from './module/selectStationByMap';
    export default {
        name: 'vcruLine',
        mixins: [modalMixin],
        components: {vSelectStationByMap},
        props: {
            customBusId: {
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
                    customBusId: '',
                    lineName: '',
                    departTime: '',
                    beginStation: '',
                    endStation: '',
                    customBusStations: []
                },
                rules: {
                    lineName: [{ required: true, message: '线路名称不能为空!', trigger: 'blur' }],
                    departTime: [{ required: true, message: '请选择发车时间!', trigger: 'blur' }],
                    customBusStations: [{ required: true, type: 'array', message: '请选择站点!', trigger: 'blur' }]
                }

            };
        },
        mounted() {
            // this.getStations();
        },
        watch: {
            customBusId(val) {
                if (val) {
                    this.formData.customBusId = val;
                    this.getData();
                }
                else {
                    this.formData.customBusId = '';
                    this.formData.customBusStations = [];
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
                    url: '/customBus/detail',
                    params: {
                        customBusId: this.customBusId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);
                        this.getStationList();
                    }
                })
            },
            getStationList() {
                this.$http({
                    method: 'get',
                    url: '/customBus/stationList',
                    params: {
                        customBusId: this.customBusId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.formData.customBusStations = res.data || [];
                    }
                })
            },
            save() {
                this.saveBtnLoading = true;
                this.$refs.form.validate((valid) => {
                    if (valid) {

                        if (this.formData.customBusStations.length > 0) {
                            this.formData.beginStation = this.formData.customBusStations[0].stationName;
                            this.formData.endStation = this.formData.customBusStations[this.formData.customBusStations.length - 1].stationName;
                        }

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
                    url: '/customBus/add',
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
                    url: '/customBus/update',
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
            },
            panTo(element) {
                let point = new BMap.Point(element.lng, element.lat);
                this.$refs.selectStationByMap.panTo(point);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cruLine-container {
        .modal-body {
            display: flex;
            .left-panel {
                padding-right: 10px;
                width: 280px;

                .drag-item {
                    margin: 5px 0;
                    padding: 0 15px;
                    line-height: 30px;
                    border: 1px solid #dcdee2;
                    border-radius: 5px;
                    background-color: #f8f8f9;
                }
            }
            .right-panel {
                flex: 1;
            }
        }
    }
</style>