<template>
  <el-form label-width="100px">
    <el-form-item label="姓名">
      <el-input v-model="shopkeeper.name"></el-input>
    </el-form-item>
    <el-form-item label="身份证号码">
      <el-input v-model="shopkeeper.creditCode"></el-input>
    </el-form-item>
    <el-form-item label="手机">
      <el-input v-model="shopkeeper.telephone"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    computed: {
      shopkeeper () {
        return this.$store.getters.shopkeeper.temp
      }
    },
    methods: {
      onSubmit () {
        // 验证
        if (this.shopkeeper.name === '') {
          this.$message({ showClose: true, message: '姓名不能为空', type: 'warning' })
          return
        }
        if (this.shopkeeper.telephone === '') {
          this.$message({ showClose: true, message: '手机不能为空', type: 'warning' })
          return
        }
        if (this.$route.query.id) {
          this.$store.dispatch('SHOPKEEPER_PUT', {id: this.$route.query.id}).then((res) => {
            if (res.code === 200) {
              this.$message.success('修改成功！')
              this.removeView('/shopkeeper/list')
            } else {
              this.$message.success(res.message)
            }
          })
        } else {
          this.$store.dispatch('SHOPKEEPER_POST').then((res) => {
            if (res.code === 200) {
              this.$message.success('提交成功！')
              this.removeView('/shopkeeper/list')
            } else {
              this.$message.success(res.message)
            }
          })
        }
      }
    },
    created () {
      if (this.$route.query.id) {
        if (parseInt(this.$route.query.id) !== this.shopkeeper.id) {
          this.$store.dispatch('SHOPKEEPER_EDIT', {id: this.$route.query.id})
        }
      }
    }
  }
</script>

<style scoped>

</style>
