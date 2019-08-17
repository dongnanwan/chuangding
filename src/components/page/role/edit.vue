<template>
  <div>
    <div class="custom-tree-container" style="max-width: 300px">

      <el-button @click="save()">
        保存配置
      </el-button>

      <div class="block" style="margin-top: 10px">
        <div class="custom-tree-node" >
          <span>
            <!--<el-button-->
              <!--type="text"-->
              <!--size="mini">-->
              <!--添加-->
            <!--</el-button>-->
            <!--<el-button-->
            <!--type="text"-->
            <!--size="mini"-->
            <!--@click="() => remove(node, data)">-->
            <!--删除-->
            <!--</el-button>-->
          </span>
        </div>
        <el-tree
          :data="menus"
          show-checkbox
          ref="tree"
          node-key="id"
          :default-checked-keys="my_menus"
          default-expand-all
          :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <!--<el-button-->
              <!--type="text"-->
              <!--size="mini">-->
              <!--删除-->
            <!--</el-button>-->
            <!--<el-button-->
              <!--type="text"-->
              <!--size="mini">-->
              <!--添加-->
            <!--</el-button>-->
          </span>
        </span>
        </el-tree>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    mounted () {
      this.$store.dispatch('MENU_ALL')
      if (this.$route.query.id) {
        if (parseInt(this.$route.query.id) !== this.role.id) {
          // console.log(this.$route.query.id)
          this.$store.dispatch('ROLE_PERMISSION_LIST', {id: this.$route.query.id}).then(res => {
            console.log(this.my_menus)
          })
        }
      }
    },
    computed: {
      role () {
        return this.$store.getters.role.temp
      },
      menus () {
        var perms = this.$store.getters.menu.data
        perms.forEach(v => {
          if (v.id !== -100) {
            v.disabled = false
          }
          if (v.children.length > 0) {
            v.children.forEach(v2 => {
              if (v2.id !== -100) {
                v2.disabled = false
              }
            })
          }
        })
        return perms
      },
      my_menus () {
        var str = this.$store.getters.role.perm_list + ''
        var arr = str.split(',')
        return arr
      }
    },
    methods: {
      save () {
        var data = {
          id: this.$route.query.id,
          permissionId: this.$refs.tree.getCheckedKeys().join(',')
        }
        this.$store.dispatch('ROLE_PERMISSION_UPDATE', data).then(res => {
          this.$message.success('保存成功！')
          this.removeView()
        })
      }
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
