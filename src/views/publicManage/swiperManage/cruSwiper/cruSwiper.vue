<template>
    <Modal class="cruSwiper-container"
           v-model="modalValue"
           :title="title"
           :width="450"
           @on-visible-change="onVisibleChange">
        <Form ref="form"
              :model="formData"
              :rules="rules" :label-width="90">
            <Row>
                <FormItem label="轮播图名称:" prop="bannerName">
                    <Input v-model.trim="formData.bannerName" placeholder="请输入轮播图名称" />
                </FormItem>
                <FormItem label="展示位置:" prop="showPosition">
                    <Select v-model="formData.showPosition" style="width: 120px;">
                        <Option v-for="(item, idx) in dict_showPosition"
                                :key="idx"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem label="轮播图:" prop="fileId">
                    <vImgUpload fileType="banner"
                                :defaultList="formData.defaultList"
                                :onRemove="removeFile"
                                :onSuccess="uploadSuccess"></vImgUpload>
                </FormItem>
            </Row>
        </Form>
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
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    import vImgUpload from '../../../../components/upload/imgUpload/imgUpload';
    export default {
        name: 'vcruSwiper',
        mixins: [modalMixin, comMixin, uploadMixin],
        components: {vImgUpload},
        props: {
            bannerId: {
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
                saveBtnLoading: false,
                defaultFormData: {},
                formData: {
                    bannerId: '',    // 轮播图id
                    bannerName: '',  // 轮播图名称
                    showPosition: '', // 展示位置
                    fileId: '',
                    defaultList: []
                },
                rules: {
                    bannerName: [{ required: true, message: '轮播图名称不能为空!', trigger: 'blur' }],
                    showPosition: [{ required: true, message: '请选择展示位置!', trigger: 'blur' }],
                    fileId: [{ required: true, message: '请上传轮播图!', trigger: 'blur' }]
                },
                dict_showPosition: []
            };
        },
        watch: {
            bannerId: {
                immediate: true,
                handler(val) {
                    this.formData.bannerId = val;
                    if (val) { this.getData(); }
                }
            }
        },
        //
        mounted() {
            this.getDicts(['showPosition']);
        },
        methods: {
            initFormData() {
                Object.assign(this.formData, this.defaultFormData);
            },
            removeFile(file, fileList) {
                this.formData.fileId = '';
            },
            uploadSuccess(res, file, fileList) {
                this.formData.fileId = res.data.fileId;
            },

            // 获取用户详情
            getData() {
                this.$http({
                    method: 'get',
                    url: '/banner/detail',
                    params: {
                        bannerId: this.bannerId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);
                        if (res.data.bannerId) {
                            this.getFile();
                        }
                    }
                })
            },
            getFile() {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: this.bannerId,
                        fileType: 'banner'
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS' && res.data.length > 0) {
                        this.formData.defaultList = [{
                            status: 'finished',
                            response: {
                                data: {
                                    name: res.data[0].fileName,
                                    url: res.data[0].url,
                                }
                            }
                        }]
                    }
                })
            },
            save() {
                this.saveBtnLoading = true;
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
                    url: '/banner/add',
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
                    url: '/banner/update',
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

<style lang="scss" scoped>
    .cruSwiper-container {
    }
</style>