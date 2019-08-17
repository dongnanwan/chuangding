<template>
    <div>
        <!-- <span>门店选择</span> -->
      <input type="text" v-model="shopName" placeholder="请选择优惠券" @focus="showShopDialog" class="inp input" readonly>

      <div class="mytable" v-if="isShow">
        <!-- <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="请输入优惠券类型" class="input" disabled> -->
        <i class="el-icon-close" @click='closeDialog'></i>
        <el-table :data="shopNameOptions" style="width:1000px;margin-top:15px" @row-click='getRowDetail'  v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="60"></el-table-column>
            <el-table-column show-overflow-tooltip prop="type" label="类型" min-width="80">
                <template slot-scope="scope">
                {{scope.row.type === 'PERCENT' ? '打折' : '满减'}}
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="amount" label="面额|折扣" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip prop="conditions" label="条件" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip label="时间" min-width="300">
                <template slot-scope="scope">
                    <span v-if="scope.row.startTime == null || scope.row.endTime == null"></span>
                    <span v-else>{{new Date(parseInt(scope.row.startTime)).toLocaleString()}} ~ {{new Date(parseInt(scope.row.endTime)).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="planNum" label="发行量" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip prop="num" label="领取量" min-width="100"></el-table-column>
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

        <div style="float:right;margin-top:10px">
            <el-button @click="insertItem()" type="primary">添加</el-button>
            <el-button @click="isShow=false">关闭</el-button>
        </div>
        
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
            multipleSelection: []
        }
      },
    methods: {
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
            this.$axios.get('/api/coupon',{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                console.log(res.data.data.data)
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
            // console.log(123)
            this.multipleSelection.forEach((val,ind)=>{
                this.shopName.push(val.id)
                this.shopIds.push(val.id)
            })
            this.shopIds = [...new Set(this.shopIds)]
            this.shopName = [...new Set(this.shopName)]    
            this.$emit('OnGetDataFromChild',this.shopIds)
          
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