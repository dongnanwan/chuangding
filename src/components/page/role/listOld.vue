<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button @click="dialogAddShown = true; " >添加</el-button>
        </el-form-item>
      </el-form>

      <el-table
        border
        :data="items"
        style="width: 100%"
        height="600"
        >
        <el-table-column fixed prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="name" label="角色" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <router-link :to="'/role_edit?id=' + scope.row.id">
              <el-button
                type="text"
                size="small">
                配置角色权限
              </el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <el-dialog title="添加角色" :visible.sync="dialogAddShown">
      <el-form>
        <el-form-item label="角色名称">
          <el-input v-model="roleName" autoComplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddShown = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    mounted () {
      this.$store.dispatch('ROLE_LIST')
    },
    data () {
      return {
        roleName: '',
        dialogAddShown: false
      }
    },
    computed: {
      items () {
        return this.$store.getters.role.list
      }
    },
    methods: {
      addRole () {
        this.$store.dispatch('ROLE_ADD', {name: this.roleName}).then(res => {
          this.dialogAddShown = false
          this.$store.dispatch('ROLE_LIST')
        })
      }
    }
  }
</script>

<style scoped>

</style>
