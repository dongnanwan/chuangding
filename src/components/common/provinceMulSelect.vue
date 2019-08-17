<template>
    <div>
        <div>
            <el-button @click="showShopDialog" type="primary" plain>添加省份</el-button> 
            <div class="mytable" v-if="isShow">
                <i class="el-icon-close" @click='isShow = false' style="float:right;cursor:pointer;"></i>
                <el-table :data="shopNameOptions" style="width: 100%;" @row-click='getRowDetail' v-loading="loading" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="id" label="ID" width="180"> </el-table-column>
                    <el-table-column show-overflow-tooltip prop="code" label="编码" width="180"> </el-table-column>
                    <el-table-column show-overflow-tooltip prop="name" label="省份名称" width="180"> </el-table-column>
                </el-table>

                <div style="padding:10px;float:right">
                    <el-button type="primary"  @click="insertSku">添加</el-button>
                    <el-button   @click="closeDialog">关闭</el-button>
                </div>
            </div>
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
                size:40,
                page:1,
                status:'ON_SALE'
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
            this.$axios.get('/api/address/province',{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                this.loading = false
            })
        },
        searchSkuName(){
            this.params.code = this.inputSkuName
            this.$axios.get(`/api/item`,{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        insertSku(){
            this.$emit('OnGetDataFromChild',this.multipleSelection)
        },
        closeDialog(){
            this.isShow = false
        }
    },
    mounted(){
        this.getInfo()
    }
  }
</script>


<style scope>
.mytable{
    border: 1px solid #ccc;
    position: absolute;
    /* float: left; */
    z-index: 999;
    background: white;
    padding: 5px;
    /* top: 3px; */
    border-radius: 5px;
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