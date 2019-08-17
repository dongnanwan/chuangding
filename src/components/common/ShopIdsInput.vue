<template>
    <div>
        <!-- <span>门店选择</span> -->
      <!-- <input type="text" v-model="shopName" placeholder="请选择门店" @focus="showShopDialog" class="inp input" readonly> -->
      <el-input v-model="shopNameString" placeholder="请选择门店" @focus="showShopDialog" class="inp input" readonly="">
          <el-button @click="clearData" type="danger" slot="append" >清空</el-button>
      </el-input>

      <div class="mytable" v-if="isShow">
        <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="请输入门店名称" class="input">
        <i class="el-icon-close" @click='closeDialog'></i>
        <el-table :data="shopNameOptions"  style="width: 100%" @row-click='getRowDetail' border v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column show-overflow-tooltip type="selection" width="50"></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="店铺名" width="250"></el-table-column>
            <el-table-column show-overflow-tooltip prop="provinceName" label="省份" width="200"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="cityName" label="城市" width="200"></el-table-column>
            <el-table-column show-overflow-tooltip prop="areaName" label="区域"  width="200"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="address" label="地址" width="200"></el-table-column>
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

        <el-button @click="insertItem()" type="primary">添加</el-button>
      </div>
    </div>
</template>


<script>
import { get } from 'http';
  export default {
    data() {
        return {
            // searchData:[{a:'',b:'',c:'',d:''}],
            shopIds:[],
            shopName:[],
            inputShopName: '',
            isShow:false,
            shopNameOptions:[],
            pageSizes:[10, 20],
            total:0,
            params:{
                size:10,
                page:1
            },
            loading:true,
            multipleSelection: [],
            shopNameString:''
        }
    },
    methods: {
        clearData(){
            this.shopName = []
            this.shopNameString = ''
            this.shopIds = []
            this.$emit('OnGetShopIdsFromChild',null)
        },
        showShopDialog(){
            this.isShow = true
        },
        getRowDetail(row){
            
            // this.shopName = row.name
            // this.shopId = row.id
            // this.isShow = false
            // this.$emit('OnGetShopIdFromChild',this.shopId)
            // console.log(this.shopName)
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
            this.$axios.get(`/api/shop?name=${this.inputShopName}`,{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                // console.log(res.data.data.data)
                this.loading = false
            })
        },
        searchShopName(){
            this.$axios.get(`/api/shop?name=${this.inputShopName}`,{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
            })
        },
        closeDialog(){
            this.isShow = false
        },
        insertItem(){
            this.multipleSelection.forEach((val,ind)=>{
                this.shopName.push(val.name)
                this.shopIds.push(val.id)
            })

            this.shopIds = [...new Set(this.shopIds)]
            this.shopName = [...new Set(this.shopName)]
            this.shopNameString = this.shopName.toString()    
            
            // console.log(this.shopIds)
            this.isShow = false
            this.$emit('OnGetShopIdsFromChild',this.shopIds)
          
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    },
    mounted(){
        this.getInfo()
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
    height:30px;
    width: 350px;

}
.el-icon-close{
    float: right;
    cursor: pointer;
}
</style>