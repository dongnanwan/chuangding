<template>
  <div>
    <el-table
      border
      :data="items"
      style="width: 100%">
      <el-table-column fixed prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="门店名称" width="120"></el-table-column>
      <el-table-column prop="partner.name" label="合伙人" width="120"></el-table-column>
      <el-table-column prop="manager.name" label="店长" width="120"></el-table-column>
      <el-table-column prop="provinceName" label="省" width="90"></el-table-column>
      <el-table-column prop="cityName" label="市" width="90"></el-table-column>
      <el-table-column prop="areaName" label="区" width="90"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="90">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="verifySuccess(scope.row.id)">审核通过</el-button><br>
          <el-button type="text" size="small" @click="dialogVerifyFailureShown = true; currentId = scope.row.id">审核不通过</el-button>
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

    <el-dialog title="审核不通过" :visible.sync="dialogVerifyFailureShown">
      <el-form>
        <el-form-item label="审核不通过理由">
          <el-input v-model="failureReason" autoComplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVerifyFailureShown = false">取 消</el-button>
        <el-button type="primary" @click="verifyFailure(currentId)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        failureReason: '',
        dialogVerifyFailureShown: false,
        currentId: 0,
        verify_total: 0
      }
    },
    computed: {
      items () {
        var items = this.$store.getters.shop.list
        var returnedItems = []
        items.forEach(v => {
          if (v.status === 'Wait_Verify') {
            returnedItems.push(v)
          }
        })
        this.verify_total = returnedItems.length
        return returnedItems
      },
      total () {
        return this.verify_total
      },
      params () {
        return this.$store.getters.shop.params
      }
    },
    methods: {
      verifySuccess (id) {
        this.$store.dispatch('SHOP_VERIFY_SUCCESS', {id: id}).then(res => {
          this.dialogVerifyFailureShown = false
          this.$store.dispatch('SHOP_LIST')
          this.$message.success('已标记为审核通过')
        })
      },
      verifyFailure (id) {
        this.$store.dispatch('SHOP_VERIFY_FAILURE', {id: id, reason: this.failureReason}).then(res => {
          this.dialogVerifyFailureShown = false
          this.$store.dispatch('SHOP_LIST')
          this.$message.success('已标记为审核不通过')
        })
      },
      handleSizeChange (val) {
        this.$store.dispatch('SHOP_SIZE_CHG', val).then(res => {
          this.$store.dispatch('SHOP_LIST')
        })
      },
      handleCurrentChange (val) {
        this.$store.dispatch('SHOP_PAGE_CHG', val).then(res => {
          this.$store.dispatch('SHOP_LIST')
        })
      }
    },
    mounted () {
      this.$store.dispatch('SHOP_LIST')
    }
  }
</script>

<style scoped>
</style>
