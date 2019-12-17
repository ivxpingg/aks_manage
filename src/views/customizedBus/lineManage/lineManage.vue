<template>
    <div class="lineManage-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-add" @click="$refs.model_cruLine_add.modalValue = true;">添加线路</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="线路名称" />
                </FormItem>
                <FormItem label="状态：" :label-width="65">
                    <Select v-model="searchParams.condition.lineStatus" placeholder="全部" clearable style="width: 120px;">
                        <Option v-for="(item, idx) in dict_lineStatus"
                                :key="idx"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-search" @click="getData">查询</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  @on-change="onPageChange"></Page>
        </div>

        <!--添加线路-->
        <vCruLine ref="model_cruLine_add"
                  type="add"
                  @modal-callback="getData"></vCruLine>

        <!--编辑线路-->
        <vCruLine ref="model_cruLine_edit"
                  type="edit"
                  :customBusId="model_cruLine_edit_props.customBusId"
                  @modal-callback="getData"></vCruLine>

        <!--查看-->
        <vMapView ref="model_mapView"
                  :customBusId="model_mapView_props.customBusId"></vMapView>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vCruLine from './cruLine/cruLine';
    import vMapView from './mapView/mapView';
    export default {
        name: 'vlineManage',
        mixins: [comMixin, tableMixin],
        components: {vCruLine, vMapView},
        data () {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',
                        beginTime: '',
                        endTime: '',
                        lineStatus: ''
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '线路名字', align: 'center', key: 'lineName' },
                    { title: '起点', align: 'center', key: 'beginStation' },
                    { title: '终点', align: 'center', key: 'endStation' },
                    { title: '途径站点数量', align: 'center', key: 'stationNum' },
                    { title: '状态', align: 'center', key: 'lineStatusLabel' },
                    { title: '投票数量', align: 'center', key: 'voteNum' },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                            let btn_text = params.row.userStatus === 'normal' ? '停用' : '启用';
                            let list = [];

                            // 编辑
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-create'
                                },
                                on: {
                                    click: () => {
                                        this.model_cruLine_edit_props.customBusId = params.row.customBusId;
                                        this.$refs.model_cruLine_edit.modalValue = true;
                                    }
                                }
                            }, '编辑'));
                            // 发布
                            if (params.row.lineStatus === 'wait_publish') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要发布《${params.row.lineName}》线路？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/customBus/publishLine',
                                                        params: {
                                                            customBusId: params.row.customBusId
                                                        }
                                                    }).then((res) => {
                                                        if (res.code === 'SUCCESS') {
                                                            this.$Message.success('发布成功！');
                                                            this.getData();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, '发布'));
                            }
                            // 开通
                            if (params.row.lineStatus === 'publish' || params.row.lineStatus === 'close') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要开通《${params.row.lineName}》线路？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/customBus/openLine',
                                                        params: {
                                                            customBusId: params.row.customBusId
                                                        }
                                                    }).then((res) => {
                                                        if (res.code === 'SUCCESS') {
                                                            this.$Message.success('开通成功！');
                                                            this.getData();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, '开通'));
                            }
                            // 关闭
                            if (params.row.lineStatus === 'open') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'md-close'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要关闭《${params.row.lineName}》线路？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/customBus/closeLine',
                                                        params: {
                                                            customBusId: params.row.customBusId
                                                        }
                                                    }).then((res) => {
                                                        if (res.code === 'SUCCESS') {
                                                            this.$Message.success('关闭成功！');
                                                            this.getData();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, '关闭'));
                            }
                            // 删除
                            if (params.row.lineStatus === 'wait_publish' || params.row.lineStatus === 'close') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要删除《${params.row.lineName}》线路？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/customBus/delete',
                                                        params: {
                                                            customBusId: params.row.customBusId
                                                        }
                                                    }).then((res) => {
                                                        if (res.code === 'SUCCESS') {
                                                            this.$Message.success('删除成功！');
                                                            this.getData();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, '删除'));
                            }

                            // 查看
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-create'
                                },
                                on: {
                                    click: () => {
                                        this.model_mapView_props.customBusId = params.row.customBusId;
                                        this.$refs.model_mapView.modalValue = true;
                                    }
                                }
                            }, '查看'));

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                dict_lineStatus: [],

                model_cruLine_edit_props: {
                    customBusId: ''
                },
                model_mapView_props: {
                    customBusId: ''
                }
            };
        },
        mounted() {
            this.getData();
            this.getDicts(['lineStatus']);
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.condition.beginTime = value[0];
                this.searchParams.condition.endTime = value[1];
            },
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/customBus/list',
                    data: this.searchParams
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .lineManage-container {
    }
</style>