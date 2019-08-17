<template>
    <div>
        <el-button @click="showShopDialog" type="primary" plain>添加商品</el-button> 
        <div class="mytable" v-if="isShow">
            <!-- <input type="text" v-model="inputSkuName" v-on:keyup="searchSkuName" placeholder="请输入sku名称" class="input"> -->
            <el-table :data="shopNameOptions" style="width: 100%;" @row-click='getRowDetail' v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column show-overflow-tooltip prop="skuId" label="skuId" width="180"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="shopName" label="门店名称" min-width="120"></el-table-column>
                <el-table-column show-overflow-tooltip label="年份" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.year}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="season" label="季节" min-width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="secondCategory" label="类别" min-width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="code" label="款号" min-width="130"></el-table-column>
                <el-table-column show-overflow-tooltip prop="color" label="颜色" min-width="80"></el-table-column>
                <el-table-column show-overflow-tooltip  label="尺寸" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.size}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="inStorage" label="门店库存" min-width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="inTravel" label="在途库存" min-width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="sex" label="性别" min-width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="series" label="系列" min-width="80"></el-table-column>
            </el-table>

            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" :page-size="pageSizes[0]" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <div style="float:right">
                <el-button type="primary"  @click="insertSku">插入</el-button>
                <el-button plain @click="closeDialog">关闭</el-button>
            </div>
            
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            shopIdFromFather:'',
            shopId:'',
            shopName:'',
            inputSkuName: '',
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
    props:['fatherData'],
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
            this.$axios.get(`/api/stock/all?shopId=${this.shopIdFromFather}`,{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                this.loading = false
            })
        },
        searchSkuName(){
            this.params.name = this.inputSkuName
            this.$axios.get(`/api/stock/all`,{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        insertSku(){
            this.multipleSelection.forEach((val,ind)=>{
                val.id = val.skuId
            })
            this.$emit('onInsertSkuData',this.multipleSelection)
        },
        closeDialog(){
            this.isShow = false
        }
    },
    mounted(){
        this.getInfo()
    },
    watch:{
        fatherData:{
            handler(val, oldVal){
                this.shopIdFromFather = this.fatherData
                this.getInfo()
            },
            deep:true
        }
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