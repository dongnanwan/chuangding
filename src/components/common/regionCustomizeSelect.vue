<template>
    <div>
        <div style="position:relative">
            <el-input v-model="shopName" placeholder="请选择大区" readonly @focus="showShopDialog">
                <i slot="prefix" class="el-input__icon el-icon-error" @click="deleteData()"></i>
            </el-input>
            <div class="mytable" v-if="isShow">
                <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="请输入地区名" class="input inputInside">
                <i class="el-icon-close" @click='closeDialog'></i>
                <el-table :data="shopNameOptions" style="width: 100%" @row-click='getRowDetail' border v-loading="loading">
                    <el-table-column show-overflow-tooltip prop="id" label="ID" width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="code" label="区域代码" width="180"></el-table-column>
                    <el-table-column prop="provinceName" label="省份" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="name" label="区域名称" width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="manager" label="区域负责人" width="180"></el-table-column>
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
    </div>
</template>

<script>
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
        deleteData(){
            this.shopName = ''
            this.$emit('OnGetDataFromChild','')
        },
        showShopDialog(){
            this.isShow = true
        },
        getRowDetail(row){
            this.shopName = row.name
            this.shopId = row.id
            this.isShow = false
            this.$emit('OnGetDataFromChild',row.id)
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
            this.$axios.get('/api/address/region',{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                this.loading = false
            })
        },
        searchShopName(){
            this.$axios.get(`/api/address/region?name=${this.inputShopName}`,{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
            })
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


<style scoped>
.mytable{
    border: 1px solid #ccc;
    position: absolute;
    z-index: 999;
    background: white;
    padding: 5px;
    border-radius: 5px;
}

.input{
    border: 1px solid #ccc;
    width: 213px;
    height: 30px;
    border-radius:3px;
    
}
.inputInside{
    margin: 10px;
}
.el-icon-close{
    float: right;
    cursor: pointer;
}
</style>