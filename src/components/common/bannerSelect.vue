<template>
    <div>
        <!-- <span>门店选择</span> -->
      <input type="text" v-model="shopName" placeholder="请选择图片" @focus="showShopDialog" class="inp input" readonly>

      <div class="mytable" v-if="isShow">
        <!-- <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="请输图片标题" class="input" disabled> -->
        <i class="el-icon-close" @click='closeDialog'></i>
        <el-table :data="shopNameOptions" style="width:620px;margin-top:15px" @row-click='getRowDetail' v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column fixed prop="id" label="ID" min-width="140"></el-table-column>
            <el-table-column label="图" sortable min-width="80" prop="img">
                <template slot-scope="scope">
                <img :src="'https://img.chuangdingshop.com/' + scope.row.img"  width="50" height="40" class="am-img-thumbnail">
                <!-- :alt="scope.row.title" -->
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="120">
                <div class="title" :alt="scope.row.title" slot-scope="scope">{{scope.row.title}}</div>
            </el-table-column>
            <el-table-column prop="url" label="链接" min-width="200"></el-table-column>
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
            this.$axios.get('/api/banner',{params:this.params}).then((res)=>{
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