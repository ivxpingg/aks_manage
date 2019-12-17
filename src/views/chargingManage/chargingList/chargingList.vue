<template>
    <div class="chargingList-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-search" @click="$refs.modal_cruChargingStation_add.modalValue = true">添加充电桩</Button>
                </FormItem>
                <FormItem :label-width="10">
                    <Button type="primary"
                            icon="ios-cloud-upload"
                            @click="$refs.modal_modalImport.modalValue = true">导入</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="时间：" :label-width="65">
                    <DatePicker type="daterange"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="停车场名称" />
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

        <!--导入-->
        <vModalImport ref="modal_modalImport" @modal-callback="getData"></vModalImport>

        <!--添加-->
        <vCruChargingStation ref="modal_cruChargingStation_add"
                         type="add"
                         @modal-callback="getData"></vCruChargingStation>

        <!--编辑-->
        <vCruChargingStation ref="modal_cruChargingStation_edit"
                         type="edit"
                         :charge-pile-id="modal_cruChargingStation_edit_props.chargePileId"
                         @modal-callback="getData"></vCruChargingStation>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vCruChargingStation from './cruChargingStation/cruChargingStation';
    import vModalImport from './modalImport/modalImport';
    export default {
        name: 'vChargingList',
        mixins: [comMixin, tableMixin],
        components: {vCruChargingStation, vModalImport},
        data () {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',
                        beginTime: '',
                        endTime: ''
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '充电桩名称', align: 'center', key: 'chargePileName' },
                    { title: '单价', align: 'center', key: 'singlePrice' },
                    { title: '位置', align: 'center', key: 'address' },
                    { title: '创建时间', align: 'center', key: 'insTime',
                        render: (h, params) => {
                            return h('span', this.timeFormat(params.row.insTime))
                        }
                    },
                    {
                        title: '操作',
                        width: 240,
                        align: 'center',
                        render: (h, params) => {
                            let list = [];
                            list.push([
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-eye'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_cruChargingStation_edit_props.chargePileId = params.row.chargePileId;
                                            this.$refs.modal_cruChargingStation_edit.modalValue = true;
                                        }
                                    }
                                }, '编辑')
                            ]);

                            list.push([
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-lock'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要删除《${params.row.chargePileName}》充电桩？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/chargePile/delete',
                                                        params: {
                                                            chargePileId: params.row.chargePileId
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
                                }, '删除')
                            ]);

                            let btn_text = params.row.publishStatus === 'publish' ? '停用' : '启用';
                            let btn_type = params.row.publishStatus === 'publish' ? 'error' : 'primary';
                            list.push(h('Button', {
                                props: {
                                    type: btn_type,
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: `确定要${btn_text}《${params.row.chargePileName}》？`,
                                            onOk: () => {
                                                this.$http({
                                                    method: 'get',
                                                    url: '/chargePile/publish',
                                                    params: {
                                                        chargePileId: params.row.chargePileId
                                                    }
                                                }).then((res) => {
                                                    if (res.code === 'SUCCESS') {
                                                        this.$Message.success(`${btn_text}成功！`);
                                                        this.getData();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            }, btn_text))

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                modal_cruChargingStation_edit_props: {
                    chargePileId: ''
                }
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.condition.beginTime = value[0];
                this.searchParams.condition.endTime = value[1];
            },
            getData() {
                this.modal_cruChargingStation_edit_props.chargePileId = '';
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/chargePile/list',
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
    .chargingList-container {
    }
</style>