<template>
  <el-form label-width="100px">
    <el-form-item label="用户名">
      <el-input v-if="member.id > 0" readonly v-model="member.name"></el-input>
      <el-input v-else v-model="member.name"></el-input>
    </el-form-item>
    <el-form-item label="硬盘ID">
      <el-input v-model="member.uniId"></el-input>
    </el-form-item>
    <el-form-item label="代理商ID">
      <el-input v-model="member.factorId"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-tooltip v-if="member.id > 0" class="item" effect="dark" content="需要修改密码时填写" placement="top">
        <el-input type="password" v-model="member.password"></el-input>
      </el-tooltip>
      <el-input v-else type="password" v-model="member.password"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="member.remark"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onClose">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  computed: {
    member () {
      return this.$store.getters.member.temp
    }
  },
  methods: {
    handleSuccess (url) {
      this.article.mainImg = url
    },
    onSubmit () {
      if (this.member.name === '') {
        this.$message({
          showClose: true,
          message: '用户名不能为空',
          type: 'warning'
        })
        return
      }
      if (this.member.uniId === '') {
        this.$message({
          showClose: true,
          message: '硬盘ID不能为空',
          type: 'warning'
        })
        return
      }
      if (this.member.id === 0 && this.member.password === '') {
        this.$message({
          showClose: true,
          message: '密码不能为空',
          type: 'warning'
        })
        return
      }
      this.member.factorId = parseInt(this.member.factorId)
      this.$store.dispatch('MEMBER_POST').then((res) => {
        this.$message.success('提交成功！')
        this.removeView()
      })
    },
    onClose () {
      this.removeView()
    }
  },
  created () {
    if (this.$route.params.id) {
      this.$store.dispatch('MEMBER_EDIT', this.$route.params.id).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
