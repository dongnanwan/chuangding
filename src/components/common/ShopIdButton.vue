<template>
    <div>
        <!-- <span>门店选择</span> -->
      <!-- <input type="text" v-model="shopName" placeholder="请选择门店" @focus="showShopDialog" class="inp input" readonly>  -->
      <el-button @click="showShopDialog" type="primary">选择门店</el-button>
      <div class="mytable" v-if="isShow">
        <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="请输入门店名称" class="input">
        <i class="el-icon-close" @click='closeDialog'></i>
        <el-table
            :data="shopNameOptions"
            style="width: 100%"
            @row-click='getRowDetail'
          
            v-loading="loading"
            >
            <el-table-column show-overflow-tooltip prop="name" label="店铺名" width="260"></el-table-column>
            <el-table-column show-overflow-tooltip prop="provinceName" label="省份" width="180"></el-table-column>
            <el-table-column show-overflow-tooltip prop="cityName" label="城市" width="180"></el-table-column>
            <el-table-column show-overflow-tooltip prop="areaName" label="区域" width="180"></el-table-column>
            <el-table-column show-overflow-tooltip prop="address" label="地址" width="180"></el-table-column>
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
    </div>
</template>


<script>
import { get } from 'http';
import { setTimeout } from 'timers';
  export default {
    data() {
        return {
            // searchData:[{a:'',b:'',c:'',d:''}],
            shopId:'',
            shopName:'',
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
            childData:{
                shopId:'',
                shopName:''
            }
        }
    },
    props:['shopNameProp'],
    computed:{
        shopNames(){
            return this.shopNameProp
        }
    },
    methods: {
        propsToData(){
            setTimeout(()=>{
                this.shopName = this.shopNames
            },200)
        },
        showShopDialog(){
            this.isShow = true
        },
        getRowDetail(row){
            // console.log(row)
            this.shopName = row.name
            this.shopId = row.id
            this.childData.shopName = row.name
            this.childData.shopId = row.id
            this.isShow = false
            this.$emit('OnGetShopIdFromChild',this.childData)
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
            this.$axios.get('/api/shop',{params:this.params}).then((res)=>{
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
                // console.log(res.data.data.data)
            })
        },
        closeDialog(){
            this.isShow = false
        }
    },
    mounted(){
        this.getInfo()
        this.propsToData()
        // this.$set(this,'shopName',this.shopNameProp)
    //     this.$nextTick(()=>{
    //         this.shopName = this.shopNameProp
    //     })
    //    this.shopName = this.shopNameProp
        // console.log(this.isShow)
    }
  }
</script>


<style scoped>
.mytable{
    border: 1px solid #ccc;
    border-radius: 6px;
    position: absolute;
    z-index: 999;
    background: white;
    padding: 10px;
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
.el-icon-close{
    float: right;
    cursor: pointer;
}
</style>