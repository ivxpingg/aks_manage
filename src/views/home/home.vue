<template>
    <div class="home-container">
        <div class="title-img"></div>
        <div ref="panel" class="subSystem-panel">
            <ul ref="subBox" class="subSystem-ul">

                <li name="运行监视"><span class="subSystem subSystem2" :class="systemList['2'].auth ? '':'noauth'" @click="goto(systemList['2'])" ></span></li>
                <li name="综合分析"><span class="subSystem subSystem3" :class="systemList['3'].auth ? '':'noauth'" @click="goto(systemList['3'])" ></span></li>
                <li name="舆情分析"><span class="subSystem subSystem4" :class="systemList['4'].auth ? '':'noauth'" @click="goto(systemList['4'])" ></span></li>
                <li name="应急管理"><span class="subSystem subSystem5" :class="systemList['5'].auth ? '':'noauth'" @click="goto(systemList['5'])" ></span></li>
                <li name="运营考评"><span class="subSystem subSystem1" :class="systemList['1'].auth ? '':'noauth'" @click="goto(systemList['1'])" ></span></li>

                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>
                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>
                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>
                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>
                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>
                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>
                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>
                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>
                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>
                <li name="用户权限"><span class="subSystem subSystem11" ></span></li>

                <li name="用户权限"><span class="subSystem subSystem9" :class="systemList['9'].auth ? '':'noauth'" @click="goto(systemList['9'])" ></span></li>
                <li name="交通衔接"><span class="subSystem subSystem7" :class="systemList['7'].auth ? '':'noauth'" @click="goto(systemList['7'])" ></span></li>
                <li name="综合展示"><span class="subSystem subSystem8" :class="systemList['8'].auth ? '':'noauth'" @click="goto(systemList['8'])" ></span></li>
                <li name="从业人员"><span class="subSystem subSystem6" :class="systemList['6'].auth ? '':'noauth'" @click="goto(systemList['6'])" ></span></li>

            </ul>
        </div>
        <Icon class="arrow arrow-left" type="ios-arrow-back" @click="upSystem"></Icon>
        <Icon class="arrow arrow-right" type="ios-arrow-forward" @click="nextSystem"></Icon>

        <div class="btn-switcher" @click="logout">切换用户</div>
        <div class="btn-pwd" @click="showPwdPanel">修改密码</div>
        <vFooter class="footer"></vFooter>

        <Modal title="密码修改"
               v-model="showPwdEdit"
               :transfer="false"
               width="380">
            <div>
                <Form ref="formInline" :model="pwdForm" :rules="pwdFormRule" inline autocomplete="off">
                    <FormItem prop="oldPwd" label="旧密码:" :label-width="100" >
                        <Input v-model="pwdForm.oldPwd" type="password" autocomplete="off" disableautocomplete  style="width: 220px"></Input>
                    </FormItem>
                    <FormItem prop="newPwd"  label="新密码:" :label-width="100" >
                        <Input v-model="pwdForm.newPwd" type="password"  autocomplete="off" disableautocomplete  style="width: 220px"></Input>
                    </FormItem>
                    <FormItem  prop="newPwdFirst" label="重新输入密码:" :label-width="100" >
                        <Input v-model="pwdForm.newPwdFirst" type="password" autocomplete="off" disableautocomplete  style="width: 220px"></Input>
                    </FormItem>
                    <FormItem  label="">
                        <Button type="primary" style="width: 220px; margin-left: 100px;" @click="onEditPwd">确定</Button>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import vFooter from '../subSystem/components/footer/footer';
    import VueRouter from 'vue-router';
    export default {
        name: 'home',
        components: {vFooter},
        data () {
            return {
                showPwdEdit: false,
                mList: [],
                timer: 100,
                direction: 'left',
                figure: null,     // 3D元素的对应的元素
                theta: 0,         // 旋转一个子系统需要的角度
                gap: 35,          // 每个子系统元素的padding值
                currImage: 0,     // 当前对应的子系统

                systemList: {
                    '1': {
                        name: '运营考评子系统',
                        url: '',
                        auth: false
                    },
                    '2': {
                        name: '运行监视子系统',
                        url: 'runMonitor',
                        auth: true
                    },
                    '3': {
                        name: '综合分析子系统',
                        url: 'comShow',
                        auth: true
                    },
                    '4': {
                        name: '舆情分析子系统',
                        url: 'yqManage',
                        auth: true
                    },
                    '5': {
                        name: '应急管理子系统',
                        url: 'yjManage',
                        auth: true
                    },
                    '6': {
                        name: '从业人员管理子系统',
                        url: 'employee',
                        auth: true
                    },
                    '7': {
                        name: '交通衔接子系统',
                        url: 'yqManage',
                        auth: true
                    },
                    '8': {
                        name: '综合展示子系统',
                        url: 'comShow',
                        auth: true
                    },
                    '9': {
                        name: '用户权限',
                        url: 'stations',
                        auth: true
                    }
                },

                pwdForm: {
                    oldPwd: '',
                    newPwd: '',
                    newPwdFirst: ''
                },
                pwdFormRule: {
                    oldPwd: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' },

                    ],
                    newPwd: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
                    ],
                    newPwdFirst: [
                        { required: true, message: '请输入重新输入新密码', trigger: 'blur' },
                        {
                            validator: (rule, value, callback, source, options) => {

                                let errors = [];
                                if(this.pwdForm.newPwd === this.pwdForm.newPwdFirst) {

                                }
                                else {
                                    errors.push(new Error('2次新密码必须一样！'));
                                }
                                callback(errors);
                            }
                        }
                    ]
                }
            };
        },
        mounted() {
            // this.getData();
            this.threeD();
            this.init();
        },
        methods: {
            init(){
                let that = this;
                window.onresize = function () {

                    let images = that.figure.children,
                        n = images.length;

                    let s = parseFloat(getComputedStyle(images[0]).width);
                    that.theta = 2 * Math.PI / n;
                    let apothem = s / (2 * Math.tan(Math.PI / n));

                    that.figure.style.transformOrigin = '50% 50% ' + -apothem + 'px';

                    for (let i = 1; i < n; i++) {
                        that.figure.children[i].style.transformOrigin = '50% 50% ' + -apothem + 'px';
                        that.figure.children[i].style.transform = 'rotateY(' + i * that.theta + 'rad)';
                    }
                }

                document.onkeyup = function (e) {
                    if (window.event)//如果window.event对象存在，就以此事件对象为准
                        e = window.event;
                    let code = e.charCode || e.keyCode;

                    if (code === 37) {
                        that.upSystem();
                    }
                    if (code === 39) {
                        that.nextSystem();
                    }
                }
            },
            getData () {
                let that = this;
                Util.ajax.get('/xm/sys/auth/menuList')
                    .then(function (response) {
                        that.$Spin.hide();
                        that.mList = response.result || null;
                    })
                    .catch(function (error) {
                        that.$Spin.hide();
                        console.log(error);
                    });
            },
            threeD() {
                let figure = this.$refs.subBox,
                    images = figure.children,
                    n = images.length;
                this.setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));

            },
            setupCarousel(n, s) {
                this.figure = this.$refs.subBox;
                this.theta = 2 * Math.PI / n;

                let apothem = s / (2 * Math.tan(Math.PI / n));

                this.figure.style.transformOrigin = '50% 50% ' + -apothem + 'px';

                for (let i = 0; i < n; i++) {
                    this.figure.children[i].style.padding = this.gap + 'px';

                    this.figure.children[i].onmouseover = function () {
                        this.style.top = '-50px';
                    }


                    this.figure.children[i].onmouseleave = function () {
                        this.style.top = '0';
                    }
                }

                for (let i = 1; i < n; i++) {
                    this.figure.children[i].style.transformOrigin = '50% 50% ' + -apothem + 'px';
                    this.figure.children[i].style.transform = 'rotateY(' + i * this.theta + 'rad)';

                }

                this.figure.style.transform = 'rotateY(' + this.currImage * -this.theta + 'rad)';

                this.setCarouselEvent();

            },
            setCarouselEvent() {
                /*注册事件*/
                if(document.addEventListener){
                    document.addEventListener('DOMMouseScroll', this.scrollFunc, false);
                }
                //W3C
                window.onmousewheel = this.scrollFunc;//IE/Opera/Chrome
            },
            scrollFunc(e) {
                let that = this;

                e= e || window.event;
                if(e.wheelDelta){//IE/Opera/Chrome
                    //自定义事件：编写具体的实现逻辑

                    if (e.wheelDelta > 0) {
                        that.upSystem();
                    }
                    else {
                        that.nextSystem();
                    }
                }
                else if(e.detail){//Firefox
                    //自定义事件：编写具体的实现逻辑

                    if (e.detail > 0) {
                        that.upSystem();
                    }
                    else {
                        that.nextSystem();
                    }
                }
            },
            refreshCarousel() {
                this.figure.style.transform = 'rotateY(' + this.currImage * -this.theta + 'rad)';
            },

            upSystem() {
                if (this.currImage <= -4) { return;}
                this.currImage -= 1;
                this.refreshCarousel();
            },
            nextSystem() {
                if (this.currImage >= 4) { return;}
                this.currImage += 1;
                this.refreshCarousel();
            },

            logout () {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要退出当前用户？</p>',
                    onOk: () => {},
                    onCancel: () => {}
                });


            },

            goto(info) {

                let third = false;  // 是否是第三方地址
                let url = info.url;

                if (!info.auth) {
                    this.$Message.error('您没有《'+ info.name +'》权限,如有需要,请与管理员联系！');
                    return;
                }

                if (url.indexOf('http://') >= 0) {
                    third = true;
                    window.open(url);
                }
                else {
                    this.$router.push({
                        name: info.url
                    })
                }

            },

            showPwdPanel() {
                this.showPwdEdit = true;
            },

            onEditPwd() {
                let that = this;
                this.$refs['formInline'].validate((valid) => {
                    if (valid) {
                        Util.ajax({
                            method: "get",
                            url: '/xm/sys/resetPassword',
                            params: {
                                oldPassword: that.pwdForm.oldPwd,
                                newPassword: that.pwdForm.newPwd
                            }
                        }).then(function (response){

                            if (response.status ==  '1') {
                                that.$Message.success('密码修改成功！');
                                Util.ajax.get('/xm/sys/logout')
                                    .then(function (response){
                                        let router = new VueRouter();
                                        Util.cookie.unset('xmgd');
                                        Util.cookie.unset('xmgdname');
                                        that.$store.commit('setToken', null);
                                        setTimeout(function () {
                                            router.push({ path: '/' });
                                        }, 2000);
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }
                            else {
                                that.$Message.error(response.errMsg);
                            }
                        })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                },);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .home-container {
        position: relative;
        height: 100%;
        min-height: 770px;
        background: url('./images/bg.png') no-repeat;
        background-position: center top;
        background-size: 100% auto;

        .title-img {
            position: relative;
            top: 70px;
            margin: 0 auto;
            width: 1027px;
            height: 111px;
            background: url('./images/title.png') no-repeat center;
        }

        .arrow{
            position: absolute;
            top: 400px;
            padding: 15px 0;
            width: 62px;
            height: 62px;
            font-size: 32px;
            text-align: center;
            color: #FFFFFF;
            background-color: rgba(21,37,78,0.2);
            border-radius: 50%;
            z-index: 2;
            cursor: pointer;

            &:hover {
                background-color: rgba(21,37,78,0.5);
            }


            &.arrow-left {
                left: 28px;
            }
            &.arrow-right {
                right: 28px;
            }
        }

        .btn-switcher {
            position: absolute;
            right: 185px;
            bottom: 58px;
            height: 30px;
            padding-left: 39px;
            font-size: 20px;
            color: #FFFFFF;
            background: url('./images/switcher.png') no-repeat left center;
            background-size: 30px 30px;
            cursor: pointer;
            z-index: 2;
        }
        .btn-pwd {
            position: absolute;
            right: 45px;
            bottom: 58px;
            height: 30px;
            padding-left: 39px;
            font-size: 20px;
            color: #FFFFFF;
            background: url('./images/lock2.png') no-repeat left center;
            background-size: 30px 30px;
            cursor: pointer;
            z-index: 2;
        }

        .subSystem-panel {
            position: absolute;
            padding-top: 50px;
            top: 250px;
            left: 0;
            margin-left: 0;
            width: 100%;
            perspective: 700px;
            -webkit-perspective-origin-y: top;
            text-align: center;
            overflow: hidden;


            .subSystem-ul {
                position: relative;
                margin: 0px auto;
                box-sizing: border-box;
                width: 20%;
                transform-style: preserve-3d;
                transition: transform 0.5s;

                > li {
                    position: relative;
                    width: 100%;
                    height: 580px;
                    min-height: 429px;
                    transition: top 0.3s;

                    &:not(:first-of-type) {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }

                    .subSystem {
                        position: relative;
                        display: inline-block;
                        margin: 0;
                        width: 100%;
                        height: 100%;
                        background-size: 100%;
                        background-repeat: no-repeat;
                        cursor: pointer;

                        &.noauth:after {
                            position: absolute;
                            display: block;
                            content: " ";
                            width: 100%;
                            height: 100%;
                            top: 0;
                            left: 0;
                            background: url(./images/locked1.png) no-repeat center top;
                            background-size: 100% auto;
                        }

                        &.subSystem1 {
                            background-image: url(./images/1.png);
                        }
                        &.subSystem2 {
                            background-image: url(./images/2.png);
                        }
                        &.subSystem3 {
                            background-image: url(./images/3.png);
                        }
                        &.subSystem4 {
                            background-image: url(./images/4.png);
                        }
                        &.subSystem5 {
                            background-image: url(./images/5.png);
                        }
                        &.subSystem6 {
                            background-image: url(./images/6.png);
                        }
                        &.subSystem7 {
                            background-image: url(./images/7.png);
                        }
                        &.subSystem8 {
                            background-image: url(./images/8.png);
                        }
                        &.subSystem9 {
                            background-image: url(./images/9.png);
                        }
                        &.subSystem10 {
                            background-image: url(./images/10.png);
                        }
                        &.subSystem11 {
                            background-image: url(./images/11.png);
                        }


                        /*background-color: rgba(145,147,364,0.5);*/
                    }
                }
            }

        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 2;
        }
    }
</style>