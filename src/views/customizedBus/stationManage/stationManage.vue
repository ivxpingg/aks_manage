<template>
    <div class="stationManage-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-add" @click="$refs.modal_cruStation_add.modalValue = true">添加站点</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="站点名称" />
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

        <!--添加站点-->
        <vCruStation ref="modal_cruStation_add"
                     type="add"
                     @modal-callback="getData"></vCruStation>

        <vCruStation ref="modal_cruStation_edit"
                     :station-id="modal_cruStation_edit_props.stationId"
                     type="edit"
                     @modal-callback="getData"></vCruStation>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vCruStation from './cruStation/cruStation';
    export default {
        name: 'vstationManage',  // 站点管理
        mixins: [comMixin, tableMixin],
        components: {vCruStation},
        data () {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: ''
                    }
                },
                tableLoading: false,
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '站点名字',  align: 'center', key: 'stationName' },
                    { title: '经度', align: 'center', key: 'lng' },
                    { title: '纬度', align: 'center', key: 'lat' },
                    { title: '状态', align: 'center', key: 'stationStatusLabel' },
                    {
                        title: '操作',
                        width: 300,
                        align: 'center',
                        render: (h, params) => {
                            let btn_text = params.row.userStatus === 'normal' ? '停用' : '启用';
                            let list = [];

                            // 权限设置
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-create'
                                },
                                on: {
                                    click: () => {
                                       this.modal_cruStation_edit_props.stationId = params.row.stationId;
                                       this.$refs.modal_cruStation_edit.modalValue = true;
                                    }
                                }
                            }, '修改'));
                            // 重置密码
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
                                            content: `确定要删除《${params.row.stationName}》站点？`,
                                            onOk: () => {
                                                this.$http({
                                                    method: 'get',
                                                    url: '/station/delete',
                                                    params: {
                                                        stationId: params.row.stationId
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

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                modal_cruStation_edit_props: {
                    stationId: ''
                }
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/station/list',
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
    .stationManage-container {
    }
</style>