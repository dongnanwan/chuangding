<template>
    <div style="position:relative">
        <el-input v-model="categoryName" placeholder="选择类目" @focus="showShopDialog" readonly="">
            <i slot="prefix" class="el-input__icon el-icon-error" @click="deleteData()"></i>
        </el-input>

        <div class="mytable" v-if="isShow">
            <i class="el-icon-close" @click='isShow = false'></i>
            <el-table :data="tableData" row-key="id"  style="width: 100%;" @row-click='getRowDetail' v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column show-overflow-tooltip prop="id" label="ID" width="180"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="类目名" width="180"> </el-table-column>
            </el-table>

            <div style="padding:10px;float:right">
                <el-button type="danger"  @click="closeDialog">关闭</el-button>
            </div>
        </div>
    </div>
</template>


<script>
  export default {
      data() {
        return {
            shopId:'',
            categoryName:'',
            inputSkuName: '',
            isShow:false,
            tableData:[],
            pageSizes:[10, 20],
            total:0,
            params:{
                size:10,
                page:1,
                status:'ON_SALE'
            },
            loading:true,
            multipleSelection: []
        }
      },
    methods: {
        deleteData(){
            this.categoryName = ''
            this.$emit('OnGetDataFromChild','')
        },
        showShopDialog(){
            this.isShow = true
        },
        getRowDetail(row){
            this.categoryName = row.name
            this.$emit('OnGetDataFromChild',row.id)
            this.isShow = false
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
            this.$axios.get('/api/category/all').then((res)=>{
                this.tableData = res.data.data
                this.total = res.data.total
                this.loading = false
            })
        },
        searchSkuName(){
            this.params.code = this.inputSkuName
            this.$axios.get(`/api/series`,{params:this.params}).then((res)=>{
                this.tableData = res.data.data.data
                this.total = res.data.data.total
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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