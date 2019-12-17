<template>
    <div class="index-container">
        <div class="login-box">
            <h2 class="h1" style="text-align: center; padding-bottom: 10px; font-size: 26px;">
                <!--<img src="/images/logo_icon.png" alt="">-->
                阿克苏交通出行管理后台
            </h2>
            <div class="box-border">
                <div class="switch-bg">
                    <div class="switch-tab login_name" :class="{ 'switch-tab-active': activeTab === 'name'}" @click="changeTab('name')">登 录</div>
                    <!--<div class="switch-tab login_qrcode" :class="{ 'switch-tab-active': activeTab === 'qrcode'}" @click="changeTab('qrcode')">扫码登陆</div>-->
                </div>
                <div v-show="activeTab === 'name'" class="tab-panel tab-name">
                    <Form ref="loginForm"
                          class="form"
                          :model="form"
                          :rules="rules"
                          @keydown.enter.native="handleSubmit">
                        <FormItem prop="userName">
                            <Input v-model="form.loginName" size="large" placeholder="用户名/手机密码/账号" />
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" size="large" placeholder="密码" />
                        </FormItem>
                    </Form>
                    <div class="forget-password">
                        <Button type="text">忘记密码</Button>
                    </div>
                    <div class="submit-panel">
                        <Button @click="handleSubmit" type="primary" size="large">登录</Button>
                        <Spin v-show="loading" fix style="background-color: rgba(255,255,255,.6);">
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        </Spin>
                    </div>
                </div>
                <div v-show="activeTab === 'qrcode'" class="tab-panel tab-qrcode">
                    <img class="img-qrcode" src="./images/login-qrcode.png" alt="">
                    <div class="text-qrcode">请用微信扫描二维码登录 </br> "紫馨教育平台" </div>
                </div>
            </div>
        </div>
        <footer class="footer">
            <span>版权所有：</span>
            <span style="padding-right: 5px">阿克苏姑墨交通投资有限责任公司</span>
            <!--<span>Copyright©</span>-->
            <!--<span>2019</span>-->
            <div>
                <span style="padding-right: 5px">技术支持：</span>
                <span>厦门卫星定位应用股份有限公司</span>
            </div>
        </footer>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import MD5 from 'md5';
    import Config from '../../config';
    export default {
        name: 'index',
        data () {
            return {
                loading: false,
                activeTab: 'name',
                form: {
                    loginName: '',
                    password: ''
                },
                rules: {
                    loginName: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
                    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
                }
            };
        },
        mounted() {

        },
        methods: {
            ...mapActions([
                'handleLogin',
                'getMenuList'
            ]),
            changeTab(name) {
                this.activeTab = name;
            },
            handleSubmit () {
                this.loading = true;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        let pwd = MD5(this.form.password + Config.passwordKey);
                        this.handleLogin({
                            loginName: this.form.loginName,
                            password: pwd }).then(res => {
                                this.getMenuList(true).then((list) => {
                                    this.loading = false;
                                    if (this.$route.query.redirect) {
                                        this.$router.push(this.$route.query.redirect);
                                    } else {
                                        this.$router.push({name: 'home'});
                                    }
                                }).catch((err) => {
                                    this.loading = false;
                                })
                        }).catch(() => {
                            this.loading = false;
                        });
                    }
                    else {
                        this.loading = false;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .index-container {
        position: relative;
        height: 100%;
        background: url("./images/login-bg.png") no-repeat center center;
        background-size: 100% auto;

        .login-box {
            position: absolute;
            top: 50%;
            right: 10%;
            margin-top: -250px;
            z-index: 10;
            .h1 {}
            .box-border {
                width:500px;
                height:493px;
                background:rgba(255,255,255,1);
                box-shadow:0px 0px 5px rgba(0,0,0,0.16);
                opacity:1;
                border-radius:5px;

                .switch-bg {
                    display: flex;
                    height:60px;
                    background: rgba(50,164,255,1);
                    opacity:1;
                    border-radius:5px 5px 0px 0px;
                    .switch-tab {
                        flex: 1;
                        text-align: center;
                        font-size:20px;
                        font-weight:bold;
                        line-height:60px;
                        color: #FFF;
                        letter-spacing:3px;
                        border-radius:5px 5px 0px 0px;
                        opacity:1;
                        cursor: pointer;
                        transition: all 0.1s linear;
                        &.switch-tab-active {
                            color:rgba(0,0,0,1);
                            background-color: #FFF;
                        }
                    }
                }

                .tab-panel {
                    padding: 0 53px;
                    .form {
                        padding: 60px 0 0px;
                        .ivu-form-item {
                            margin-bottom: 30px;
                        }
                    }
                    .forget-password {
                        text-align: right;
                        .ivu-btn {
                            font-size: 14px;
                            outline: none;
                            &:active, &:hover, &:focus {
                                outline: none;
                                border-image: none;
                                box-shadow: none;
                            }
                        }
                    }
                    .submit-panel {
                        position: relative;
                        margin-top: 50px;
                        text-align: center;
                        .ivu-btn {
                            height: 60px;
                            width: 250px;
                            font-size: 18px;
                            letter-spacing: 20px;
                            text-indent: 20px;
                            border-image: none;
                            outline: none;
                            outline-width:0;
                            &:hover, &:active, &:focus {
                                box-shadow: none;
                                border-image: none;
                                outline: none;
                            }
                        }
                    }

                    &.tab-qrcode {
                        text-align: center;
                        .img-qrcode {
                            margin-top: 63px;
                            width: 220px;
                            height: 220px;
                        }
                        .text-qrcode {
                            margin-top: 5px;
                            font-size:15px;
                            font-weight:400;
                            line-height:20px;
                            color:rgba(112,112,112,1);
                            letter-spacing: 1px;
                            opacity:1;
                        }
                    }
                }

            }
        }

        .footer {
            position: fixed;
            bottom: 30px;
            left: 0;
            right: 0;
            text-align: center;
            font-size:12px;
            font-weight:400;
            line-height:21px;
            color:rgba(255,255,255,1);
            opacity:1;
        }
    }
</style>
<style lang="scss">
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .login-box {
        .form{
            .ivu-input {
                border-width: 0 0 1px 0;
                border-radius: 0;
                border-image: none;
                outline: none;
                outline-width:0;
                &:hover, &:active, &:focus {
                    box-shadow: none;
                    border-image: none;
                    outline: none;
                }

                &.ivu-input-large {
                    height: 56px;
                    font-size: 18px;
                }
            }
        }
    }
</style>