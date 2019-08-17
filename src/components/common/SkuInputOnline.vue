<template>
    <div>
      <el-button @click="showShopDialog" type="primary" plain>添加商品</el-button> 
      <div class="mytable" v-if="isShow">
        <input type="text" v-model="inputSkuName" v-on:keydown="searchSkuName" placeholder="请输入sku名称" class="input">
        <el-table :data="shopNameOptions" style="width: 100%" @row-click='getRowDetail' border v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column show-overflow-tooltip prop="year" label="年份" width="180"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="season" label="季节" width="180"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="brandName" label="品牌" width="180"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="sku名称" width="180"> </el-table-column>
            <el-table-column prop="stock" label="库存" width="180"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价" width="180"> </el-table-column>
        </el-table>

        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" :page-size="pageSizes[0]" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-button type="primary" plain @click="insertSku">插入</el-button>
        <el-button type="danger" plain @click="closeDialog">关闭</el-button>
      </div>
    </div>
</template>


<script>
  export default {
      data() {
        return {
            shopId:'',
            shopName:'',
            inputSkuName: '',
            isShow:false,
            shopNameOptions:[],
            pageSizes:[10, 20],
            total:0,
            params:{
                size:10,
                page:1,
                status:10
            },
            loading:true,
            multipleSelection: []
        }
      },
    methods: {
        showShopDialog(){
            this.isShow = true
        },
        getRowDetail(row){
            // this.$emit('OnGetShopIdFromChild',this.shopId)
        },
        handleSizeChange(val) {
            this.params.size = val 
            this.params.page = 1
            this.getInfo()
        },
        handleCurrentChange(val) {
            this.params.page = val
            this.getInfo()
        },
        getInfo(){
            this.$axios.get('/api/item/skus',{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
                // console.log(res.data.data.data)
                this.loading = false
            })
        },
        searchSkuName(){
            this.params.name = this.inputSkuName
            this.$axios.get(`/api/item/skus`,{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                // console.log(res.data.data.data)
            })
        },
        handleSelectionChange(val) {
            // console.log(val)
            this.multipleSelection = val;
        },
        insertSku(){
            this.$emit('onInsertSkuData',this.multipleSelection)
            // console.log(this.multipleSelection)
        },
        closeDialog(){
            this.isShow = false
        }
    },
    mounted(){
        this.getInfo()
        // console.log(this.isShow)
    }
  }
</script>


<style>
.mytable{
    border: 1px solid #ccc;
    position: absolute;
    z-index: 999;
    background: white;
    padding: 5px;
    /* top: 3px; */
}
.inp{
    position: relative
}
.input{
    border: 1px solid #ccc;
    width: 213px;
    height: 30px;
    border-radius:3px;
}
</style>