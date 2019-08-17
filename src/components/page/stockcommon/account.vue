<template>
  <div>
      <el-table :data="items" style="width: 100%" max-height="650" border highlight-current-row>
          <el-table-column prop="changeReason" label="类型" width="180" fixed></el-table-column>
          <el-table-column prop="skuName" label="SKU"></el-table-column>
          <el-table-column prop="storageAfter" label="数量" width="180"></el-table-column>
          <el-table-column prop="changeReason" label="来源业务" width="180"></el-table-column>
          <el-table-column prop="created" label="来源单据"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="pageSizes"
          :page-size="pageSizes[0]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
  </div>
</template>

<script>
  export default {
    data(){
        return {
            shopId:[],
            pageSizes:[2, 5, 10, 20]
        }
    },
    computed:{
      items(){
        return this.$store.getters.stock.accountlist
      },
      total(){
        return this.$store.getters.stock.accounttotal
      },
      shopNameOptions(){
        return this.$store.getters.shop.list
      }
    },
    methods:{
      handleSizeChange(val) {
        this.$store.dispatch('ACCOUNT_ARGS_CHANGE',{size:val})
        this.$store.dispatch('ACCOUNT_LIST')
      },
      handleCurrentChange(val) {
        this.$store.dispatch('ACCOUNT_ARGS_CHANGE',{page:val})
        this.$store.dispatch('ACCOUNT_LIST')
      }
    },
    mounted(){
        this.$store.dispatch('ACCOUNT_LIST')
    }
  }
</script>

<style scoped>
 
</style>
