<template>
    <div class="employeeSelect-container">
        <div class="modal-body">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="检索:" :label-width="65">
                        <Input v-model="searchParams.condition.searchKey" placeholder="请输入" />
                    </FormItem>

                    <FormItem :label-width="20">
                        <Button type="primary"
                                @click="getData">检索</Button>
                    </FormItem>
                </Form>
            </vIvxFilterBox>

            <div class="ivx-table-box">
                <Table ref="table"
                       border
                       :height="400"
                       :columns="tableColumns"
                       :data="filterSelected ? tableDataFilterSelected:tableData"
                       :highlight-row="!multiple"
                       @on-current-change="onCurrentChange"
                       @on-select="onSelect"
                       @on-select-cancel="onSelectCancel"
                       @on-select-all="onSelectAll"
                       @on-selection-change="onSelectionChange"></Table>
                <Page v-if="!filterSelected"
                      prev-text="上一页"
                      next-text="下一页"
                      show-total
                      :current="searchParams.current"
                      :page-size="searchParams.size"
                      :total="searchParams.total"
                      @on-change="onPageChange"></Page>
            </div>
        </div>

        <div class="ivu-modal-footer six-modal-footer-padding-bottom-0">
            <Button type="primary"
                    size="large"
                    :loading="loading"
                    @click="addPerson">添加</Button>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    import comMixin from '../../../lib/mixin/comMixin';
    export default {
        name: 'employeeSelect',
        mixins: [comMixin],
        components: {vIvxFilterBox},
        props: {
            multiple: {
                type: Boolean,
                default: false
            },
            // 已选
            selectedValue: {
                type: Array,
                default() {
                    return [];
                }
            },
            // 过滤已选的值
            filterSelected: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: this.filterSelected ? 10000:7,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',
                        beginTime: '',
                        endTime: '',
                        userType: '',
                        menuType: 'admin'
                    }
                },
                tableColumns: [
                    { title: '选择', width: 60, align: 'center', type: this.multiple ? 'selection' : 'index'},
                    { title: '名字', width: 140, align: 'center', key: 'name' },
                    { title: '类型', width: 120, align: 'center', key: 'userTypeLabel' },
                    { title: '状态', width: 120, align: 'center', key: 'userStatusLabel' },
                    { title: '手机号码', minWidth: 120, align: 'center', key: 'phone' },
                ],
                tableData: [],
                tableDataFilterSelected: [],
                selectValue: [],
                selectItems: [],
                loading: false,

                // 字典
                dict_unitType: []
            };
        },
        watch: {
            selectedValue: {
                immediate: true,
                handler(val) {
                    if (!this.filterSelected){
                        this.selectValue = val.map(v => v);
                    }
                    else {
                        this.selectValue = [];
                    }

                    this.selectItems = [];
                    this.getData();
                }
            },

            'searchParams.current': {
                handler() {
                    this.getData();
                }
            },
            'searchParams.condition': {
                deep: true,
                handler() {
                    this.getData();
                }
            },
            tableData(val) {
                if (this.filterSelected) {
                    this.tableDataFilterSelected = val.filter(v => this.selectedValue.indexOf(v.userId) === -1);
                }
                else {
                    setTimeout(() => {
                        val.forEach((v, idx) => {
                            if (this.selectValue.indexOf(v.userId) > -1) {
                                this.$refs.table.objData[idx]._isChecked = true;
                                this.selectItems.push(v);
                            }
                        });
                    }, 200);
                }
            },
        },
        computed: {

        },
        mounted() {
            this.getData();
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {

                this.searchParams.current = current;
            },
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'post',
                    url: '/user/list',
                    data: this.searchParams
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.total;
                    }
                })
            },

            /**
             * 表格选择
             */
            onCurrentChange(currentRow, oldCurrentRow) {
                this.selectItems = currentRow;
                this.selectValue = currentRow.userId;
            },
            onSelect(selection, row) {
                this.selectItems.push(row);
                this.selectValue.push(row.userId);
            },
            onSelectCancel(selection, row) {
                let idx = this.selectValue.indexOf(row.userId);
                if (idx !== -1) {
                    this.selectValue.splice(idx, 1);
                    this.selectItems.splice(idx, 1);
                }
            },
            onSelectAll(selection) {
                selection.forEach((val) => {
                    let idx = this.selectValue.indexOf(val.userId);
                    if (idx === -1) {
                        this.selectValue.push(val.userId);
                        this.selectItems.push(val);
                    }
                });
            },
            onSelectionChange(selection) {
                let data = this.filterSelected ? this.tableDataFilterSelected : this.tableData;

                if (selection.length === 0) {
                    data.forEach((val) => {
                        let idx = this.selectValue.indexOf(val.userId);
                        if (idx !== -1) {
                            this.selectValue.splice(idx, 1);
                            this.selectItems.splice(idx, 1);
                        }
                    });
                }
            },

            addPerson() {
                // this.loading = true;

                this.$emit('handleSelect', this.selectValue, this.selectItems);
            }
        }
    }
</script>

<style lang="scss" >
    .employeeSelect-container {

        .modal-body {
            /*height: 660px;*/
            /*overflow-y: auto;*/
            /*overflow-x: hidden;*/
        }
    }
</style>