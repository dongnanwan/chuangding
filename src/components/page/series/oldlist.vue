<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <router-link to="/series_edit">
            <el-button>添加</el-button>
          </router-link>
        </el-form-item>
        <el-button @click="seriesSync()">数据同步</el-button>
      </el-form>
    </div>
    <el-table
      border
      :data="items"
      style="width: 100%"
      >
      <el-table-column fixed prop="id" label="ID" min-width="120"></el-table-column>
      <el-table-column prop="name" label="类目名" min-width="120">
        <div class="title" :alt="scope.row.name" slot-scope="scope">{{scope.row.name}}</div>
      </el-table-column>

      <el-table-column label="图片" sortable min-width="80">
        <template slot-scope="scope">
          <!-- 如果有图片就显示 -->
          <img v-if="scope.row.icoUrl" :src="'https://img.chuangdingshop.com/' + scope.row.icoUrl" :alt="scope.row.title" width="60" height="60" class="am-img-thumbnail">
          <p v-else>暂无图片</p>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button @click="editBanenr(scope.row)"
            type="text"
            size="small">
            编辑
          </el-button>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="`delete_${scope.$index}`" >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
  methods: {
    editBanenr (series) {
      this.$store.dispatch('SERIES_EDIT', series).then(() => {
        this.$router.push('/series_edit?id=' + series.id)
      })
    },
    handleCommand (command) {
      let params = command.split('_')
      let row = this.items[params[1]]
      if (params[0] === 'delete') {
        this.deleteRow(params[1], row)
      }
    },
    deleteRow (index, row) {
      this.$confirm('确认要删除系列', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('SERIES_DELETE', row.id).then(res => {
          if (res.code === 200) {
            this.items.splice(index, 1)
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
      this.$store.dispatch('SERIES_PAGE_CHG', 1)
      this.$store.dispatch('SERIES_LIST').then((res) => {
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('SERIES_SIZE_CHG', val)
      this.$store.dispatch('SERIES_LIST')
    },
    handleCurrentChange (val) {
      this.$store.dispatch('SERIES_PAGE_CHG', val)
      this.$store.dispatch('SERIES_LIST')
    },
    seriesSync () {
      this.$store.dispatch('SERIES_SYNC').then((res) => {
        // location.reload()
         this.onSubmit()
      })
    }
  },
  computed: {
    total () {
      return this.$store.getters.series.total
    },
    params () {
      return this.$store.getters.series.params
    },
    items () {
      return this.$store.getters.series.list
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
