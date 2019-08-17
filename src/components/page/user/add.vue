<template>
  <el-form label-width="100px">
    <el-form-item label="姓名">
      <el-input v-model="name"></el-input>
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model="sysName"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="password"></el-input>
    </el-form-item>
    <el-form-item label="手机">
      <el-input v-model="phone"></el-input>
    </el-form-item>
    <el-form-item label="角色">
      <el-tree
        style="margin-top: 8px"
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id">
      </el-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addUser">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    mounted () {
      this.$store.dispatch('ROLE_LIST')
    },
    data () {
      return {
        name: '',
        sysName: '',
        password: '',
        roleId: '',
        phone:''
      }
    },
    computed: {
      treeData () {
        var data = this.$store.getters.role.list
        data.forEach(v => {
          if (v.name) {
            v.label = v.name
          }
        })
        return data
      }
    },
    methods: {
      addUser () {
        var data = {
          name: this.name,
          sysName: this.sysName,
          password: this.password,
          phone:this.phone,
          roleId: this.$refs.tree.getCheckedKeys().join(',')
        }
        this.$store.dispatch('USER_ADD', data).then(res => {
          this.$message.success('保存成功！')
          this.removeView()
        })
      }
    }
  }
</script>

<style scoped>

</style>
