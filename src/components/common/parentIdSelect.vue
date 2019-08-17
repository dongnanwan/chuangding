<template>
    <div>
      <input type="text" v-model="shopName" placeholder="选择父级类目" @focus="showShopDialog" class="inp input" readonly> 
      <div class="mytable" v-if="isShow">
        <!-- <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="请输入门店名称" class="input"> -->
        <i class="el-icon-close" @click='closeDialog'></i>
        <el-table
            :data="tabelData"
            style="width:620px"
            @row-click='getRowDetail'
            v-loading="loading"
            row-key="id"
            >
            <el-table-column show-overflow-tooltip min-width="200" prop="id" label="id"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="200" prop="label" label="自定义类目"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="200" prop="categoryNames" label="ERP产品类目"></el-table-column>
        </el-table>

        <!-- <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="pageSizes"
                :page-size="pageSizes[0]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div> -->
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
            tabelData:[],
            pageSizes:[10, 20],
            total:0,
            params:{
                size:10,
                page:1
            },
            loading:false
        }
    },
    props:['shopNameProp','parentIdTableData'],
    computed:{
        shopNames(){
            return this.shopNameProp
        }
    },
    watch:{
        parentIdTableData:{
            immediate:true,
            handler(val){
                this.tabelData = val
            }
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

            this.shopName = row.label
            this.shopId = row.id
            this.isShow = false
            this.$emit('onGetDataFromChild',row)
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
                this.tabelData = res.data.data.data
                this.total = res.data.data.total
                // console.log(res.data.data.data)
                this.loading = false
            })
        },
        searchShopName(){
            this.$axios.get(`/api/shop?name=${this.inputShopName}`,{params:this.params}).then((res)=>{
                this.tabelData = res.data.data.data
                this.total = res.data.data.total
                // console.log(res.data.data.data)
            })
        },
        closeDialog(){
            this.isShow = false
        }
    },
    mounted(){
        // this.getInfo()
        this.propsToData()
        this.tabelData = this.parentIdTableData
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
    width: 260px;
    height: 30px;
    border-radius:3px;
}
.el-icon-close{
    float: right;
    cursor: pointer;
}
</style>