<template>
    <Modal class="userInfoTab-container"
           v-model="modalValue"
           title="详情"
           :width="700"
           :footer-hide="type !== 'audit'"
           @on-visible-change="onVisibleChange">
        <Tabs v-model="active">
            <TabPane label="基本信息" name="base">
                <vBaseInfo :user-id="userId"></vBaseInfo>
            </TabPane>
            <TabPane label="证明材料" name="file">
                <vFileInfo :user-id="userId"></vFileInfo>
            </TabPane>
        </Tabs>

        <div slot="footer">
            <Button type="error"
                    size="large"
                    @click="noPass">审核不通过</Button>
            <Button type="primary"
                    size="large"
                    :loading="saveBtnLoading"
                    @click="pass">审核通过</Button>
        </div>
    </Modal>
</template>

<script>
    import modalMixin from '../../../../../lib/mixin/modalMixin';
    import vBaseInfo from '../baseInfo/baseInfo';
    import vFileInfo from '../fileInfo/fileInfo';
    export default {
        name: 'vuserInfoTab',
        mixins: [modalMixin],
        components: {vBaseInfo, vFileInfo},
        props: {
            userId: {
                type: String,
                default: ''
            },
            type: {

            }
        },
        data () {
            return {
                active: 'base',
                saveBtnLoading: false,
            };
        },
        methods: {
            noPass() {
                this.$Modal.confirm({
                    title: '审核',
                    content: '确定审核不通过?',
                    onOk: () => {
                        this.saveBtnLoading = true;
                        this.$http({
                            method: 'get',
                            url: '/taxiDriver/driverAuditNotPass',
                            params: {
                                userId: this.userId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.modalValue = false;
                                this.$emit('modal-callback');
                            }
                        })
                    }
                })
            },
            pass() {
                this.$Modal.confirm({
                    title: '审核',
                    content: '确定审核通过?',
                    onOk: () => {
                        this.saveBtnLoading = true;
                        this.$http({
                            method: 'get',
                            url: '/taxiDriver/driverAuditPass',
                            params: {
                                userId: this.userId
                            }
                        }).then((res) => {
                            this.saveBtnLoading = false;
                            if (res.code === 'SUCCESS') {
                                this.modalValue = false;
                                this.$emit('modal-callback');
                            }
                        }).catch(() => {
                            this.saveBtnLoading = false;
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .userInfoTab-container {
    }
</style>