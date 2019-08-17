<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <router-link to="/marketing_edit">
            <el-button>添加</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      :data="items"
      style="width: 100%"
      >
      <el-table-column fixed prop="id" label="ID" width="120"></el-table-column>
      <el-table-column label="主图" sortable width="80">
        <template slot-scope="scope">
          <img :src="'/file' + scope.row.item.mainImage" :alt="scope.row.title" width="60" height="60" class="am-img-thumbnail">
        </template>
      </el-table-column>
      <el-table-column prop="" label="类型" width="120">
        <template slot-scope="scope">
          {{typeNames[scope.row.type]}}
          <template v-if="scope.row.type === 'TUAN'">开团人数{{scope.row.openNum}}</template>
          <template v-if="scope.row.type === 'PERCENT'">打{{scope.row.percent}}折</template>
        </template>
      </el-table-column>
      <el-table-column prop="" label="时间" width="220">
        <template slot-scope="scope">
          {{dateformat(scope.row.startTime)}}<br/>
          {{dateformat(scope.row.endTime)}}
        </template>
      </el-table-column>
      <el-table-column label="标题" width="120">
        <div class="title" :alt="scope.row.title" slot-scope="scope">{{scope.row.title}}</div>
      </el-table-column>
      <el-table-column label="规格" width="250">
        <template slot-scope="scope">
          <div class="item-list" v-for="sku in scope.row.skuList">
            <div class="info">
              <span class="title">{{sku.sku.color}}-{{sku.sku.size}} 活动价:</span>
              <span class="spec">{{sku.price.toFixed(2)}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <router-link :to="'/marketing_edit?id=' + scope.row.id">
            <el-button
              type="text"
              size="small">
              编辑
            </el-button>
          </router-link>
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
import dateFormat from '@/assets/date.js'
export default {
  data () {
    return {
      typeNames: {
        'TUAN': '团购',
        'PERCENT': '打折',
        'SECKILL': '秒杀'
      }
    }
  },
  methods: {
    dateformat (val) {
      return dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
    },
    handleCommand (command) {
      let params = command.split('_')
      let row = this.items[params[1]]
      if (params[0] === 'delete') {
        this.deleteRow(params[1], row)
      } else if (params[0] === 'online') {
        this.online(row)
      } else if (params[0] === 'offline') {
        this.offline(row)
      }
    },
    online (row) {
      this.$store.dispatch('marketing_ONLINE', row.id).then(res => {
        if (res.code === 200) {
          row.status = 'ON_SALE'
        }
      })
    },
    offline (row) {
      this.$store.dispatch('marketing_OFFLINE', row.id).then(res => {
        if (res.code === 200) {
          row.status = 'IN_STOCK'
        }
      })
    },
    deleteRow (index, row) {
      this.$confirm('确认要删除类目', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('marketing_DELETE', row.id).then(res => {
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
      this.$store.dispatch('marketing_PAGE_CHG', 1)
      this.openLoading('加载中...')
      this.$store.dispatch('marketing_List').then((res) => {
        this.closeLoading()
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('marketing_SIZE_CHG', val)
      this.$store.dispatch('marketing_List')
    },
    handleCurrentChange (val) {
      this.$store.dispatch('marketing_PAGE_CHG', val)
      this.$store.dispatch('marketing_List')
    }
  },
  computed: {
    total () {
      return this.$store.getters.marketing.total
    },
    params () {
      return this.$store.getters.marketing.params
    },
    items () {
      return this.$store.getters.marketing.list
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
  .item-list {
    display: flex;
    .info {
      width: 250px;
    }
    .title {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .spec {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
