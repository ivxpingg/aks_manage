<template>
    <div class="bikeList-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-search" @click="$refs.modal_cruBikeStation_add.modalValue = true">添加停车场</Button>
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
        <vCruBikeStation ref="modal_cruBikeStation_add"
                         type="add"
                         @modal-callback="getData"></vCruBikeStation>

        <!--编辑-->
        <vCruBikeStation ref="modal_cruBikeStation_edit"
                         type="edit"
                         :bike-id="modal_cruBikeStation_edit_props.bikeId"
                         @modal-callback="getData"></vCruBikeStation>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vCruBikeStation from './cruBikeStation/cruBikeStation';
    import vModalImport from './modalImport/modalImport';
    export default {
        name: 'vBikeList',
        mixins: [comMixin, tableMixin],
        components: {vCruBikeStation, vModalImport},
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
                    { title: '停车场名称', align: 'center', key: 'bikeName' },
                    { title: '位置', align: 'center', key: 'address' },
                    { title: '总数量', align: 'center', key: 'totalNum' },
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
                                            this.modal_cruBikeStation_edit_props.bikeId = params.row.bikeId;
                                            this.$refs.modal_cruBikeStation_edit.modalValue = true;
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
                                                content: `确定要删除《${params.row.bikeName}》停车场？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/bike/delete',
                                                        params: {
                                                            bikeId: params.row.bikeId
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
                                            content: `确定要${btn_text}《${params.row.bikeName}》？`,
                                            onOk: () => {
                                                this.$http({
                                                    method: 'get',
                                                    url: '/bike/publish',
                                                    params: {
                                                        bikeId: params.row.bikeId
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

                modal_cruBikeStation_edit_props: {
                    bikeId: ''
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
                this.modal_cruBikeStation_edit_props.bikeId = '';
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/bike/list',
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
    .bikeList-container {
    }
</style>