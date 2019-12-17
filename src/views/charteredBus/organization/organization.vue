<template>
    <div class="organization-container">
        <div class="filter-box">
            <div class="left-panel">
                <vIvxFilterBox :border="false">
                    <Form inline>
                        <FormItem label="时间类型：" :label-width="85">
                            <Button :type="searchParams.condition.timeType === 'day' ? 'info' : 'default'" @click="onChange_timeType('day')">按日</Button>
                        </FormItem>
                        <FormItem label="">
                            <Button :type="searchParams.condition.timeType === 'month' ? 'info' : 'default'" @click="onChange_timeType('month')">按月</Button>
                        </FormItem>
                        <FormItem label="">
                            <Button :type="searchParams.condition.timeType === 'year' ? 'info' : 'default'" @click="onChange_timeType('year')">按年</Button>
                        </FormItem>

                        <FormItem label="机构：" :label-width="60">
                            <Select v-model="searchParams.condition.rentCarOrgId" style="width: 200px;">
                                <Option v-for="item in orgList"
                                        :key="item.rentCarOrgId"
                                        :value="item.rentCarOrgId"
                                        :label="item.orgName"></Option>
                            </Select>
                        </FormItem>
                    </Form>
                </vIvxFilterBox>
                <vIvxFilterBox :border="false">
                    <Form inline>
                        <FormItem label="时间：" :label-width="65">
                            <DatePicker v-show="searchParams.condition.timeType === 'day'"
                                        :value="timeType.day.value"
                                        type="daterange"
                                        @on-change="onChage_daterange"
                                        placeholder="选择时间"
                                        style="width: 200px"></DatePicker>

                            <DatePicker v-show="searchParams.condition.timeType === 'month'"
                                        :value="timeType.month.value"
                                        type="month"
                                        @on-change="onChage_daterange"
                                        placeholder="选择时间"
                                        style="width: 200px"></DatePicker>

                            <DatePicker v-show="searchParams.condition.timeType === 'year'"
                                        :value="timeType.year.value"
                                        type="year"
                                        @on-change="onChage_daterange"
                                        placeholder="选择时间"
                                        style="width: 200px"></DatePicker>
                        </FormItem>
                        <FormItem label="关键字：" :label-width="75">
                            <Input v-model="searchParams.condition.searchKey" placeholder="订单编号/司机名称" />
                        </FormItem>
                        <FormItem :label-width="10">
                            <Button type="primary" icon="md-search" @click="getData">查询</Button>
                        </FormItem>
                    </Form>
                </vIvxFilterBox>
            </div>
            <div class="right-panel">
                <div class="count-box count-box-1">
                    <div class="value">{{totalPrice.notSettlePrice || 0}}</div>
                    <div class="title">未结算金额</div>
                </div>
                <div class="count-box count-box-2">
                    <div class="value">{{totalPrice.settlePrice || 0}}</div>
                    <div class="title">已结算金额</div>
                </div>
            </div>
        </div>
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
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    export default {
        name: 'vorganization',
        mixins: [comMixin, tableMixin],
        computed: {
            dataType() {
                switch (this.searchParams.condition.timeType) {
                    case 'day': return 'daterange';
                    case 'month': return 'month';
                    case 'year': return 'year';
                    default: return 'daterange';
                }
            }
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
                        settleStatus: '',
                        timeType: 'day',  // 按月传month，按年传year,按日传day
                        rentCarOrgId: ''
                    }
                },
                timeType: {
                    day: {
                        beginTime: this.$moment().subtract('day', 30).format('YYYY-MM-DD'),
                        endTime: this.$moment().format('YYYY-MM-DD'),
                        value: [this.$moment().subtract('day', 30)._d, this.$moment()._d]
                    },
                    month: {
                        beginTime: this.$moment().format('YYYY-MM'),
                        endTime: this.$moment().format('YYYY-MM'),
                        value: this.$moment()._d
                    },
                    year: {
                        beginTime: this.$moment().format('YYYY'),
                        endTime: this.$moment().format('YYYY'),
                        value: this.$moment()._d
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '订单编号', align: 'center', key: 'orderNo' },
                    { title: '订单金额', align: 'center', key: 'totalPrice' },
                    { title: '司机名称', align: 'center', key: 'driverName' },
                    { title: '司机电话', align: 'center', key: 'driverPhone' },
                    { title: '状态',  align: 'center', key: 'settleStatusLabel' },

                    {
                        title: '操作',
                        width: 240,
                        align: 'center',
                        render: (h, params) => {
                            let list = [];
                            // 结算
                            if (params.row.settleStatus === 'not_settle') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-check'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要结算《${params.row.orderNo}》订单？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'post',
                                                        url: '/order/settleOrder',
                                                        data: [params.row.orderId]
                                                    }).then((res) => {
                                                        if (res.code === 'SUCCESS') {
                                                            this.$Message.success('结算成功！');
                                                            this.getData();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, '结算'));
                            }
                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            }, list);
                        }
                    }
                ],

                // 机构金额
                totalPrice: {
                    notSettlePrice: '0',
                    settlePrice: '0'
                },
                tableData: [],
                orgList: [],
            };
        },
        mounted() {
            this.getOrgList();
        },
        methods: {
            onChange_timeType(type) {
                this.searchParams.condition.timeType = type;
                this.searchParams.condition.beginTime = this.timeType[type].beginTime;
                this.searchParams.condition.endTime = this.timeType[type].endTime;
            },
            onChage_daterange(value) {
                let type = this.searchParams.condition.timeType;
                switch (type) {
                    case 'day':
                        this.timeType[type].beginTime = value[0];
                        this.timeType[type].endTime = value[1];
                        this.searchParams.condition.beginTime = value[0];
                        this.searchParams.condition.endTime = value[1];
                        break;
                    case 'month':
                        this.timeType[type].beginTime = value;
                        this.timeType[type].endTime = value;
                        this.searchParams.condition.beginTime = value;
                        this.searchParams.condition.endTime = value;
                        break;
                    case 'year':
                        this.timeType[type].beginTime = value;
                        this.timeType[type].endTime = value;
                        this.searchParams.condition.beginTime = value;
                        this.searchParams.condition.endTime = value;
                        break;
                }
            },
            // 获取机构列表
            getOrgList() {
                this.$http({
                    method: 'post',
                    url: '/rentCarOrg/list',
                    data: {
                        current: 1,      // 当前第几页
                        size: 1000,      // 每页几行
                        total: 0,
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.orgList = res.data.records;
                        if (this.orgList.length > 0) {
                            this.searchParams.condition.rentCarOrgId = this.orgList[0].rentCarOrgId;
                            this.getData();
                        }
                    }
                })
            },
            // 获取机构金额
            getOrgPrice() {
                this.$http({
                    method: 'post',
                    url: '/order/totalPrice',
                    data: this.searchParams
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.totalPrice, res.data);
                    }
                })
            },
            getData() {
                this.getOrgPrice();
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/order/orgRentCarOrderList',
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
    .organization-container {
        .filter-box {
            display: flex;
            .left-panel {
                flex: 1;
            }
            .right-panel {
                width: 380px;
                overflow: hidden;

                .count-box {
                    margin-left: 10px;
                    float: left;
                    width: 178px;
                    height: 109px;
                    border-radius: 5px;
                    text-align: center;
                    color: #FFF;
                    .value {
                        padding-top: 25px;
                        font-size: 26px;
                    }
                    .title {
                        height: 64px;
                        font-size: 12px;
                    }
                    &.count-box-1 {
                        background-color: #9862F4;
                    }

                    &.count-box-2 {
                        background-color: #34CD62;
                    }
                }
            }
        }
    }
</style>