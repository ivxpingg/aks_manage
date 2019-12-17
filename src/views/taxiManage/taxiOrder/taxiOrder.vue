<template>
    <div class="taxiOrder-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="时间：" :label-width="65">
                    <DatePicker type="daterange"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="司机名称/乘客手机号" />
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

        <vTaxiOrderInfo ref="modal_taxiOrderInfo"
                        :order-id="modal_taxiOrderInfo_props.orderId"></vTaxiOrderInfo>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vTaxiOrderInfo from './taxiOrderInfo/taxiOrderInfo';
    export default {
        name: 'vtaxiOrder',
        mixins: [comMixin, tableMixin],
        components: {vTaxiOrderInfo},
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
                    { title: '时间', align: 'center', key: 'insTime',
                        render: (h, params) => {
                            return h('span', this.timeFormat(params.row.insTime))
                        }
                    },
                    { title: '司机名称', align: 'center', key: 'driverName' },
                    { title: '司机手机号', align: 'center', key: 'driverPhone' },
                    { title: '归属单位', align: 'center', key: 'companyName' },
                    { title: '金额', align: 'center', key: 'totalPrice' },
                    { title: '起点', align: 'center', key: 'beginAddress' },
                    { title: '终点', align: 'center', key: 'endAddress' },
                    { title: '订单状态', align: 'center', key: 'orderStatusLabel' },
                    { title: '乘客手机号', align: 'center', key: 'passengerPhone' },
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            let list = [];
                            list.push([
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'ios-eye'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_taxiOrderInfo_props.orderId = params.row.orderId;
                                            this.$refs.modal_taxiOrderInfo.modalValue = true;
                                        }
                                    }
                                }, '查看')
                            ]);

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                modal_taxiOrderInfo_props: {
                    orderId: ''
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
                this.modal_taxiOrderInfo_props.orderId = '';
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/taxiOrder/taxiOrderList',
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
    .taxiOrder-container {
    }
</style>