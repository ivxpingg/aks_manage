<template>
    <div class="orgManage-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem :label-width="10">
                    <Button type="primary" icon="md-add" @click="$refs.modal_cruOrg_add.modalValue = true">添加机构</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="关键字：" :label-width="75">
                    <Input v-model="searchParams.condition.searchKey" placeholder="机构名字" />
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

        <!--添加机构-->
        <vCruOrg ref="modal_cruOrg_add"
                 type="add"
                 @modal-callback="getData"></vCruOrg>
        <!--修改机构-->
        <vCruOrg ref="modal_cruOrg_edit"
                 type="edit"
                 :rentCarOrgId="modal_cruOrg_edit_props.rentCarOrgId"
                 @modal-callback="getData"></vCruOrg>
    </div>
</template>

<script>
    import tableMixin from '../../../lib/mixin/tableMixin';
    import comMixin from '../../../lib/mixin/comMixin';
    import vCruOrg from './cruOrg/cruOrg';
    export default {
        name: 'vorgManage',
        mixins: [tableMixin, comMixin],
        components: {vCruOrg},
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
                    { title: '机构名称', align: 'center', key: 'orgName' },
                    { title: '联系人', align: 'center', key: 'contactsName' },
                    { title: '联系电话', align: 'center', key: 'contactsPhone' },
                    {
                        title: '操作',
                        width: 240,
                        align: 'center',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_cruOrg_edit_props.rentCarOrgId = params.row.rentCarOrgId;
                                            this.$refs.modal_cruOrg_edit.modalValue = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要删除《${params.row.orgName}》机构？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/rentCarOrg/delete',
                                                        params: {
                                                            rentCarOrgId: params.row.rentCarOrgId
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

                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                modal_cruOrg_edit_props: {
                    rentCarOrgId: ''
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
                    url: '/rentCarOrg/list',
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
    .orgManage-container {
    }
</style>