<template>
    <Modal class="modalImport-container"
           v-model="modalValue"
           title="导入"
           :width="500"
           footer-hide
           @on-visible-change="onVisibleChange">
        <div style="height: 500px;">
            <Form ref="form"
                  :label-width="120">
                <Row>
                    <FormItem label="模板下载:" prop="name">
                        <Button type="primary"
                                to="/template/一卡通充值点数据导入模板.xlsx"
                                download="一卡通充值点数据导入模板.xlsx"
                                target="_blank"
                                icon="ios-cloud-download">一卡通充值点数据导入模板.xlsx</Button>
                    </FormItem>
                    <FormItem label="公共自行车站导入:" prop="roleNo">
                        <Upload :action="uploadFileAction" :on-success="onSuccess_file">
                            <Button type="primary" icon="ios-cloud-upload-outline">导入</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="批量导入图片:">
                        <Upload ref="uploadImg" :action="uploadImagesAction"
                                :with-credentials="true"
                                multiple
                                :on-success="onSuccess_img"
                                :on-remove="onRemove_img">
                            <Button type="primary" icon="ios-cloud-upload-outline">批量导入图片</Button>
                        </Upload>

                        <Button v-show="fileIds.length > 0"
                                :loading="saveBtnLoading"
                                type="primary"
                                @click="save">保存</Button>

                    </FormItem>

                </Row>
            </Form>
        </div>
    </Modal>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import Config from '../../../../config';
    export default {
        name: 'vmodalImport',
        mixins: [modalMixin],
        computed: {
            uploadFileAction() {
                return Config.ajaxUrl + '/card/exportBike'
            },
            uploadImagesAction() {
                return Config.ajaxUrl + '/file/upload/card'
            }
        },
        data () {
            return {
                saveBtnLoading: false,
                fileIds: []
            };
        },
        beforeDestroy() {
            this.fileIds = [];
            this.$refs.uploadImg.clearFiles();
        },
        methods: {
            onSuccess_file(response, file, fileList) {
                if (response.code === 'SUCCESS') {
                    this.$Message.success('上传成功！');
                }
                else {
                    this.$Message.error({
                        content: response.data.msg,
                        closable: true,
                        duration: 20
                    });
                }
            },

            onSuccess_img(response, file, fileList) {

                if (response.code === 'SUCCESS') {
                    this.fileIds.push(response.data.fileId);
                }
            },
            onRemove_img(file, fileList) {
                let idx = this.fileIds.indexOf(file.response.data.fileId);
                if (idx > -1) {
                    this.fileIds.splice(idx, 1);
                }
            },

            save() {
                this.saveBtnLoading = true;
                this.$http({
                    method: 'post',
                    url: '/card/importPic',
                    data: this.fileIds
                }).then(res => {
                    this.saveBtnLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('上传成功！');
                        this.fileIds = [];
                        this.$refs.uploadImg.clearFiles();
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
    .modalImport-container {
    }
</style>