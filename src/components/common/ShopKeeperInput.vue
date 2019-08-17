<template>
    <div>
        <!-- <span>门店选择</span> -->
        <input type="text" v-model="shopName" placeholder="请选择" @focus="showShopDialog" class="inp input" readonly> 
        <div class="mytable" v-if="isShow">
            <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="请输入店长名字" class="input">
            <i class="el-icon-close" @click='closeDialog'></i>
            <el-table :data="shopNameOptions" style="width: 100%" @row-click='getRowDetail' border v-loading="loading">
                <el-table-column show-overflow-tooltip prop="name" label="姓名" width="180"></el-table-column>
                <el-table-column show-overflow-tooltip prop="creditCode" label="身份证号码" width="180"></el-table-column>
                <el-table-column show-overflow-tooltip prop="telephone" label="手机" width="180"></el-table-column>
                <el-table-column show-overflow-tooltip prop="memberId" label="微信会员ID" width="180"></el-table-column>
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

  export default {
      data() {
        return {
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
            loading:true
        }
      },
    methods: {
        showShopDialog(){
            this.isShow = true
        },
        getRowDetail(row){
            // console.log(row)
            this.shopName = row.name
            this.shopId = row.id
            this.isShow = false
            this.$emit('OnGetShopIdFromChild',this.shopId)
            // console.log(this.shopId)
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
            this.$axios.get('/api/shopkeeper',{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                // console.log(res.data.data.data)
                this.loading = false
            })
        },
        searchShopName(){
            this.$axios.get(`/api/shopkeeper?name=${this.inputShopName}`,{params:this.params}).then((res)=>{
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
        // console.log(this.isShow)
    }
  }
</script>


<style scoped>
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
.el-icon-close{
    float: right;
    cursor: pointer;
}
</style>