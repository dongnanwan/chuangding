<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="params.firstId" @change="firstChange" placeholder="请选择">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="category in firstCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-show="showSecond" v-model="params.secondId" placeholder="请选择">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="category in secondCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-button @click="itemSync">数据同步</el-button>
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
          <img v-if="scope.row.mainImage" :src="'http://user.chuangdingshop.com/file/' + scope.row.mainImage" :alt="scope.row.title" width="60" height="60" class="am-img-thumbnail">
          <p v-else>暂无图片</p>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="状态" width="120">
        <template slot-scope="scope">
          {{statusNames[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="类目" width="120">
        <div class="title" slot-scope="scope">{{scope.row.firstName}}/{{scope.row.secondName}}</div>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="120">
      </el-table-column>
      <el-table-column label="标题" width="120">
        <div class="title" :alt="scope.row.title" slot-scope="scope">{{scope.row.title}}</div>
      </el-table-column>
      <el-table-column label="副标题" width="120">
        <div class="title" :alt="scope.row.subTitle" slot-scope="scope">{{scope.row.subTitle}}</div>
      </el-table-column>
      <el-table-column prop="code" label="编码" width="80">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="80">
      </el-table-column>
      <el-table-column prop="year" label="年份" width="80">
      </el-table-column>
      <el-table-column prop="season" label="季节" width="80">
      </el-table-column>
      <el-table-column label="颜色" width="120">
        <div class="title" slot-scope="scope">{{joinToString(scope.row.colors) }}</div>
      </el-table-column>
      <el-table-column label="尺码" width="120">
        <div class="title" slot-scope="scope">{{joinToString(scope.row.sizes)}}</div>
      </el-table-column>
      <el-table-column label="吊牌价" width="120">
        <div class="title" slot-scope="scope">{{scope.row.marketPrice.toFixed(2)}}</div>
      </el-table-column>
      <el-table-column label="价格" width="120">
        <div class="title" slot-scope="scope">{{scope.row.lowPrice.toFixed(2)}}~{{scope.row.highPrice.toFixed(2)}}</div>
      </el-table-column>
      <el-table-column prop="totalStock" label="库存" width="60">
      </el-table-column>
      <el-table-column label="销量" width="60">
        <div class="title" slot-scope="scope">{{scope.row.saleNum}}</div>
      </el-table-column>
      <el-table-column label="评价" width="60">
        <div class="title" slot-scope="scope">{{scope.row.commentNum}}</div>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <router-link v-show="'marketing' === sel" :to="'/marketing/edit?item_id=' + scope.row.id">
            <el-button
              type="text"
              size="small">
              选择
            </el-button>
          </router-link>
          <router-link v-show="scope.row.status === 'IN_STOCK'" :to="'/item_edit?id=' + scope.row.id">
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
              <el-dropdown-item :command="`online_${scope.$index}`" >上架</el-dropdown-item>
              <el-dropdown-item :command="`offline_${scope.$index}`" >下架</el-dropdown-item>
              <el-dropdown-item :command="`relevance_${scope.$index}`" >搭配</el-dropdown-item>
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
    <el-dialog title="设置搭配商品ID" :visible.sync="dialogFormVisible">
      <div class="row">
        <label class="lb" style="width: 120px;">搭配商品ID</label>
        <el-input v-model="relevanceIds" style="width: 250px;" autocomplete="off"></el-input>
      </div>
      <div class="row">
        <label class="lb" style="width: 120px;"></label>
        <div class="tip">搭配商品的ID，以','分隔</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRelevance">取 消</el-button>
        <el-button type="primary" @click="saveRelevance">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogFormVisible: false,
      selectedItem: null,
      relevanceIds: '',
      secondCategories: [],
      sel: '',
      statusNames: {
        'IN_STOCK': '下架',
        'ON_SALE': '在售'
      }
    }
  },
  methods: {
    joinToString (arr) {
      if (arr !== undefined) {
        return arr.join(',')
      } else {
        return ''
      }
    },
    firstChange (val) {
      this.firstCategories.forEach(c => {
        if (c.id === val) {
          this.secondCategories = c.categories
        }
      })
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
      } else if (params[0] === 'relevance') {
        this.relevance(row)
      }
    },
    cancelRelevance () {
      this.selectedItem = false
      this.relevanceIds = ''
      this.dialogFormVisible = false
    },
    saveRelevance () {
      this.$store.dispatch('ITEM_Relevance_SAVE', {
        id: this.selectedItem.id,
        relevanceIds: this.relevanceIds
      }).then(() => {
        this.cancelRelevance()
      })
    },
    relevance (row) {
      this.selectedItem = row
      this.openLoading()
      this.$store.dispatch('ITEM_GET', row.id).then(item => {
        if (item.property && item.property.relevanceIds) {
          this.relevanceIds = item.property.relevanceIds.join(',')
        }
        this.dialogFormVisible = true
        this.closeLoading()
      })
    },
    online (row) {
      this.$store.dispatch('ITEM_ONLINE', row.id).then(res => {
        if (res.code === 200) {
          row.status = 'ON_SALE'
        }
      })
    },
    offline (row) {
      this.$store.dispatch('ITEM_OFFLINE', row.id).then(res => {
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
        this.$store.dispatch('ITEM_DELETE', row.id).then(res => {
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
      this.openLoading('加载中...')
      // this.$store.dispatch('ITEM_PAGE_CHG', 1).then((res) => {
      //
      // })
      this.$store.dispatch('ITEM_LIST').then((res) => {
        this.closeLoading()
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('ITEM_SIZE_CHG', val)
      this.$store.dispatch('ITEM_LIST')
    },
    handleCurrentChange (val) {
      this.$store.dispatch('ITEM_PAGE_CHG', val)
      this.$store.dispatch('ITEM_LIST')
    },
    itemSync () {
      this.$store.dispatch('ALL_SYNC').then((res) => {
        location.reload()
      })
    }
  },
  computed: {
    showSecond () {
      return this.secondCategories.length > 0
    },
    total () {
      return this.$store.getters.item.total
    },
    params () {
      return this.$store.getters.item.params
    },
    items () {
      return this.$store.getters.item.list
    },
    firstCategories () {
      return this.$store.getters.category.firstCategories
    }
  },
  created () {
    if (this.$route.query.sel) {
      this.sel = this.$route.query.sel
    }
    if (this.$store.getters.category.firstCategories.length === 0) {
      this.$store.dispatch('CATEGORY_FIRST_LIST')
    }
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
