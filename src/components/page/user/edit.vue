<template>
  <div>
    <el-button @click="save()">
      保存
    </el-button>
    <el-tree
      ref="tree"
      :data="treeData"
      show-checkbox
      node-key="id"
      :default-checked-keys="checkedRoles">
    </el-tree>
  </div>
</template>

<script>
  export default {
    mounted () {
      if (this.$route.query.name) {
        this.$store.dispatch('USER_ROLE', this.$route.query.name)
        this.$store.dispatch('ROLE_LIST')
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
      },
      checkedRoles () {
        var str = this.$store.getters.user.userRole + ''
        var arr = str.split(',')
        return arr
      }
    },
    methods: {
      save () {
        var data = {
          id: this.$route.query.id,
          roleId: this.$refs.tree.getCheckedKeys().join(',')
        }
        this.$store.dispatch('USER_ROLE_UPDATE', data).then(res => {
          this.$message.success('保存成功！')
          this.removeView()
        })
      }
    }
  }
</script>

<style scoped>

</style>
