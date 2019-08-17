<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <router-link to="/user_add">
            <el-button>添加</el-button>
          </router-link>
        </el-form-item>
      </el-form>

      <el-table
        border
        :data="items"
        style="width: 100%"
        height="600"
      >
        <el-table-column fixed prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="name" label="用户名" width="120"></el-table-column>
        <el-table-column prop="sysName" label="系统名" width="120"></el-table-column>
        <el-table-column prop="roleNames" label="角色" width="220"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <router-link :to="'/user_edit?name=' + scope.row.name + '&id=' + scope.row.id">
              <el-button
                type="text"
                size="small">
                编辑
              </el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
  export default {
    computed: {
      items () {
        var userList = this.$store.getters.user.list
        userList.forEach(v => {
          if (v.roles) {
            v.roleNames = ''
            v.roles.forEach(role => {
              v.roleNames += role.name + ' '
            })
          }
        })
        return userList
      },
      total () {
        return this.$store.getters.user.total
      },
      params () {
        return this.$store.getters.user.params
      }
    },
    methods: {
      handleSizeChange (val) {
        this.$store.dispatch('USER_SIZE_CHG', val).then(res => {
          this.$store.dispatch('USER_LIST')
        })
      },
      handleCurrentChange (val) {
        this.$store.dispatch('USER_PAGE_CHG', val).then(res => {
          this.$store.dispatch('USER_LIST')
        })
      }
    },
    mounted () {
      this.$store.dispatch('USER_LIST')
    }
  }
</script>

<style scoped>

</style>
