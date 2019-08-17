<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item>
          <!-- <el-button type="primary"  plain @click="onSubmit">查询</el-button> -->
          <router-link to="/banner_add">
            <el-button type="primary"  plain>添加</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :data="items" width="100%" height="600">
      <el-table-column fixed prop="id" label="ID" min-width="80"></el-table-column>

      <el-table-column label="图" sortable min-width="80" prop="img">
        <template slot-scope="scope">
          <img :src="'https://img.chuangdingshop.com/' + scope.row.img"  width="50" height="40" class="am-img-thumbnail">
          <!-- :alt="scope.row.title" -->
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="120">
        <div class="title" :alt="scope.row.title" slot-scope="scope">{{scope.row.title}}</div>
      </el-table-column>
      <el-table-column prop="url" label="链接" min-width="160"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <!-- <el-button @click="editBanenr(scope.row)" type="text" size="small">
            编辑
          </el-button> -->
          
          <!-- <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="`status_${scope.$index}`" >{{scope.row.status === 'hide' ? '显示' : '隐藏' }}</el-dropdown-item>
              <el-dropdown-item :command="`delete_${scope.$index}`" >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button @click="deleteBanner(scope.row)" type="primary" plain="" size="small">
            删除
          </el-button>
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
</template>

<script>
export default {
  data(){
    return {
    
    }
  },
  methods: {
    editBanenr(banner) {
      this.$store.dispatch('BANNER_EDIT', banner).then(() => {
        this.$router.push('/banner/edit?id=' + banner.id)
      })
    },
    deleteBanner(row){
      this.$axios.delete(`/api/banner/${row.id}`).then(res=>{
        console.log(res)
      })
    },
    handleCommand (command) {
      let params = command.split('_')
      let row = this.articles[params[1]]
      if (params[0] === 'delete') {
        this.deleteRow(params[1], row)
      } else if (params[0] === 'status') {
        this.setStatus(row)
      }
    },
    setStatus (row) {
      let status = row.status === 'hide' ? 'display' : 'hide'
      this.$store.dispatch('BANNER_SET_STATUS', {
        id: row.id,
        status: status
      }).then(res => {
        row.status = status
      })
    },
    deleteRow (index, row) {
      if (row.status !== 'hide') {
        this.$message({
          type: 'warning',
          message: '隐藏的文章才能删除'
        })
        return
      }
      this.$confirm('确认要删除文章', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('BANNER_DELETE', row.id).then(res => {
          if (res.code === 200) {
            this.member.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onSubmit () {
      if (this.params.cid === 0) {
        this.$message({
          showClose: true,
          message: '请选择类别',
          type: 'warning'
        })
        return
      }
      this.$store.dispatch('BANNER_PAGE_CHG', 1)
      this.$store.dispatch('BANNER_LIST').then((res) => {
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('BANNER_SIZE_CHG', val)
      this.$store.dispatch('BANNER_LIST')
    },
    handleCurrentChange (val) {
      this.$store.dispatch('BANNER_PAGE_CHG', val)
      this.$store.dispatch('BANNER_LIST')
    }
  },
  computed: {
    total () {
      return this.$store.getters.banner.total
    },
    params () {
      return this.$store.getters.banner.params
    },
    items () {
      return this.$store.getters.banner.list
    }
  },
  created () {

  },
  mounted () {
    this.onSubmit()
  }
}
</script>

<style type="text/css" lang="scss" scoped>
  .title {
    height: 16px;
    line-height: 16px;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
