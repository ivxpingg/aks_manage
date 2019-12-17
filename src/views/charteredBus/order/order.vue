<template>
    <div class="order-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="时间：" :label-width="65">
                    <DatePicker type="daterange"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="状态：" :label-width="65">
                    <Select v-model="searchParams.condition.orderStatus" placeholder="全部" clearable style="width: 120px;">
                        <Option v-for="(item, idx) in dict_orderStatus"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="订单编号/用户/手机号" />
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

        <!--订单详情-->
        <vOrderDetail ref="modal_orderDetail"
                      :orderId="modal_orderDetail_props.orderId"></vOrderDetail>
        <!--拒绝订单-->
        <vRefuseOrder ref="modal_refuseOrder"
                      :orderId="modal_refuseOrder_props.orderId"
                      @modal-callback="getData"></vRefuseOrder>
        <!--添加安排-->
        <vAddSchedule ref="modal_addSchedule"
                      :orderId="modal_addSchedule_props.orderId"
                      @modal-callback="getData"></vAddSchedule>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vOrderDetail from './orderDetail/orderDetail';
    import vRefuseOrder from './refuseOrder/refuseOrder';
    import vAddSchedule from './addSchedule/addSchedule';
    export default {
        name: 'vorder',
        mixins: [comMixin, tableMixin],
        components: {
            vOrderDetail,
            vRefuseOrder,
            vAddSchedule
        },
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
                        orderStatus: ''
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '订单编号', align: 'center', key: 'orderNo' },
                    { title: '订单用户', align: 'center', key: 'name' },
                    { title: '用车时间', align: 'center', key: 'insTime',
                        render: (h, params) => {
                            return h('span', this.timeFormat(params.row.beginTime, 'YYYY-MM-DD HH:mm'))
                        }
                    },
                    { title: '手机号码', align: 'center', key: 'contactsPhone' },
                    { title: '用车人数', align: 'center', key: 'seatNum' },
                    { title: '状态',  align: 'center', key: 'orderStatusLabel' },
                    { title: '订单金额', align: 'center', key: 'totalPrice' },
                    {
                        title: '操作',
                        width: 320,
                        align: 'center',
                        render: (h, params) => {
                            let list = [];
                            // 查看详情
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-eye'
                                },
                                on: {
                                    click: () => {
                                        this.modal_orderDetail_props.orderId = params.row.orderId;
                                        this.$refs.modal_orderDetail.modalValue = true;
                                    }
                                }
                            }, '查看详情'));

                            // 添加安排
                            if (params.row.orderStatus === 'wait_receive') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-add'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_addSchedule_props.orderId = params.row.orderId;
                                            this.$refs.modal_addSchedule.modalValue = true;
                                        }
                                    }
                                }, '添加安排'));
                            }

                            if (params.row.orderStatus === 'wait_receive') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'md-close'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_refuseOrder_props.orderId = params.row.orderId;
                                            this.$refs.modal_refuseOrder.modalValue = true;
                                        }
                                    }
                                }, '拒绝'));
                            }
                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            }, list);
                        }
                    }
                ],
                tableData: [],
                dict_orderStatus: [
                    {
                        label: '待接单',
                        value: 'wait_receive'
                    },
                    {
                        label: '已接单',
                        value: 'receive_order'
                    },
                    {
                        label: '预约成功',
                        value: 'book_success'
                    },
                    {
                        label: '已完成',
                        value: 'complete'
                    },
                    {
                        label: '已取消',
                        value: 'cancel'
                    },
                    {
                        label: '已关闭',
                        value: 'close'
                    }
                ],

                modal_orderDetail_props: { orderId: '' },
                modal_refuseOrder_props: { orderId: '' },
                modal_addSchedule_props: { orderId: '' },
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
                this.modal_orderDetail_props.orderId= '';
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/order/rentCarOrderList',
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
    .order-container {
    }
</style>