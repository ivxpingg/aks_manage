<template>
    <Modal class="cruNotice-container"
           v-model="modalValue"
           :title="title"
           :width="1000"
           :styles="{top: '20px'}"
           @on-visible-change="onVisibleChange">
        <div style="height: 600px; overflow-y: auto;">
            <Form ref="form"
                  :model="formData"
                  :rules="rules" :label-width="90">
                <Row>
                    <Col span="12">
                        <Col span="24">
                            <FormItem label="标题:" prop="title">
                                <Input v-model.trim="formData.title" placeholder="标题" />
                            </FormItem>
                        </Col>
                        <Col span="24"><FormItem label="展示位置:" prop="showPosition">
                            <Select v-model="formData.showPosition">
                                <Option v-for="(item, idx) in dict_showPosition"
                                        :key="idx"
                                        :value="item.value"
                                        :label="item.label"></Option>
                            </Select>
                        </FormItem>

                        </Col>
                        <Col span="24">
                            <FormItem label="公告类型:" prop="newsType">
                                <Select v-model="formData.newsType">
                                    <Option v-for="(item, idx) in dict_newsType"
                                            :key="idx"
                                            :value="item.value"
                                            :label="item.label"></Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="链接地址:">
                                <Input v-model.trim="formData.url" placeholder='请输入链接地址' />
                            </FormItem>
                        </Col>
                    </Col>
                    <Col span="12">
                        <Col span="24">
                            <FormItem label="图文内容:">
                                <div style="text-align: center;">
                                    <script :id="'editor_' + type" type="text/plain" style="width:375px;height:400px;"></script>
                                </div>
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
             </Form>
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
    import comMixin from '../../../../lib/mixin/comMixin';
    import Config from '../../../../config';
    export default {
        name: 'vcruNotice',
        mixins: [modalMixin, comMixin],
        props: {
            newsId: {
                type: String,
                default: ''
            },
            type: {
                validator(value) {
                    return ['add', 'edit', 'view'].indexOf(value) !== -1;
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
                    case 'view': return '查看';
                    default: return '';
                }
            }
        },
        created() {
            Object.assign(this.defaultFormData, this.formData);
        },
        data () {
            return {
                ue: null,
                saveBtnLoading: false,
                defaultFormData: {},
                formData: {
                    newsId: '', //	通知公告id
                    title: '',    //	标题
                    newsType: '', //	通知公告类型
                    showPosition: '', //	发布位置
                    newsContent: '', //	内容
                    url: ''  // 链接地址，自定义字段。
                },
                rules: {
                    title: [{ required: true, message: '标题不能为空!', trigger: 'blur' }],
                    showPosition: [{ required: true, message: '请选择展示位置!', trigger: 'blur' }],
                    newsType: [{ required: true, message: '请选择公告类型!', trigger: 'blur' }],
                    newsContent: [{ required: true, message: '内容不能为空!', trigger: 'blur' }]
                },
                dict_showPosition: [],
                dict_newsType: []  // 公告类型字典
            };
        },
        watch: {
            newsId: {
                immediate: true,
                handler(val) {
                    this.formData.newsId = val;
                    if (val) { this.getData(); }
                }
            },
            modalValue(val) {
                if (val) {
                    setTimeout(() => {
                        this.ue = UE.getEditor('editor_' + this.type);
                    }, 0);
                }
            }
        },
        //
        mounted() {
            this.getDicts(['showPosition', 'newsType']);
            UEDITOR_CONFIG.serverUrl = Config.filePath + '/ueditor/exec';
        },
        methods: {
            initFormData() {
                Object.assign(this.formData, this.defaultFormData);
            },

            // 获取详情
            getData() {
                this.$http({
                    method: 'get',
                    url: '/news/detail',
                    params: {
                        newsId: this.newsId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);

                        if (res.data.newsType === 'third_url') {
                            this.formData.url = res.data.newsContent;
                        }
                        else {
                            setTimeout(() => {
                                this.ue.setContent(res.data.newsContent);
                            }, 1000)
                        }
                    }
                })
            },
            save() {
                this.saveBtnLoading = true;
                if (this.formData.newsType === 'third_url') {
                    this.formData.newsContent = this.formData.url;
                }
                else {
                    this.formData.newsContent = this.ue.getContent();
                }
                this.$refs.form.validate((valid) => {
                    if (valid) {
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
                    url: '/news/add',
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
                    url: '/news/update',
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
            }
        }
    }
</script>

<style lang="scss" >
    .cruNotice-container {
        .edui-default {
            line-height: 1.5;
        }
    }
</style>