<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">创鼎新零售IDI管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                msgCreate:'msg',
                msgType:'success'
            }
        },
        methods: {
            // submitForm(formName) {
            //     this.$refs[formName].validate((valid) => {
            //         if (valid) {
            //             localStorage.setItem('ms_username',this.ruleForm.username);
            //             this.$router.push('/');
            //         } else {
            //             console.log('error submit!!');
            //             return false;
            //         }
            //     });
            // },
            msgCreateOpen() {
                this.$message({
                    message:this.msgCreate,
                    type:this.msgType,
                    showClose: true
                });
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.$axios.post('/api/auth',qs.stringify(this.ruleForm)).then(res => {
                            console.log(res)
                            // console.log(res.data.data.user.id)
                            if (res.data.code === 200) {
                                sessionStorage.setItem('user_permissions', JSON.stringify(res.data.data.permissions))
                                sessionStorage.setItem('user_id', res.data.data.user.id)
                                // sessionStorage.setItem('user_no', res.data.data.user.id)
                                sessionStorage.setItem('who_name', this.ruleForm.username)
                                sessionStorage.setItem('token', res.data.data.token)
                                sessionStorage.setItem('login_time', new Date().getTime())
                                // localStorage.setItem('ms_username',this.ruleForm.username);
                                this.$router.push('/dashboard')
                                this.hasError = false
                            } else {
                                // this.hasError = true
                                // this.errorMessage = res.message
                                this.msgCreate = '帐号或者密码错误'
                                this.msgType = 'error'
                                this.msgCreateOpen()
                            }
                        })
                    } else {
                        this.msgCreate = '请输入帐号或者密码'
                        this.msgType = 'error'
                        this.msgCreateOpen()
                        return false
                    }
                })
            },
            msgCreateOpen(){
                this.$message({
                    message:this.msgCreate,
                    type:this.msgType,
                    showClose: true
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>