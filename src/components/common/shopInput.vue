<template>
    <div>
        <div style="position:relative">
            
            <el-input v-model="shopName" :placeholder="textName" @focus="showShopDialog" readonly="">
                <i slot="prefix" class="el-input__icon el-icon-error" @click="deleteData()"></i>
            </el-input>

            <div class="mytable" v-if="isShow">
                <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="请输入门店名称" class="input inptwo">
                <i class="el-icon-close" @click='closeDialog'></i>
                <el-table
                    :data="shopNameOptions"
                    style="width: 100%"
                    @row-click='getRowDetail'
                    v-loading="loading"
                >
                    <el-table-column show-overflow-tooltip prop="name" label="店铺名" width="260"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="partner.name" label="合伙人" min-width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="regionName" label="大区" width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="provinceName" label="省份" width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cityName" label="城市" width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="areaName" label="区域" width="180"></el-table-column>
                    <!-- <el-table-column show-overflow-tooltip prop="address" label="地址" width="180"></el-table-column> -->
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
            loading:true,
            textName:'请输入门店'
        }
    },
    // props:['fatherData','componentName'],
    props:{
        fatherData:{
            default:{
                provinceId:0,
                regionId:0,
                cityId:0
            }
        },
        componentName:{
            default:'请输入门店'
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
            // this.$axios.get('/api/shop',{params:this.params}).then((res)=>{
            //     this.shopNameOptions = res.data.data.data
            //     this.total = res.data.data.total
            //     this.loading = false
            // })
            this.$axios.get(`/api/shop?name=${this.inputShopName}&regionId=${this.fatherData.regionId}&provinceId=${this.fatherData.provinceId}&cityId=${this.fatherData.cityId}`,{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                this.loading = false
            })
        },
        searchShopName(){
            // this.$axios.get(`/api/shop?name=${this.inputShopName}`,{params:this.params}).then((res)=>{
            //     this.shopNameOptions = res.data.data.data
            //     this.total = res.data.data.total
            // })
            this.$axios.get(`/api/shop?name=${this.inputShopName}&regionId=${this.fatherData.regionId}&provinceId=${this.fatherData.provinceId}&cityId=${this.fatherData.cityId}`,{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
            })
        },
        closeDialog(){
            this.isShow = false
            
        }
    },
    mounted(){
        this.textName = this.componentName ? this.componentName : this.textName 
        this.getInfo()
    },
    watch:{
        fatherData:{//深度监听，可监听到对象、数组的变化
            
            handler(val, oldVal){
                this.params.page = 1
                this.getInfo()
            },
            deep:true
        }
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
.inp{
}
.input{
    border: 1px solid #ccc;
    width: 260px;
    height: 30px;
   
}
.inptwo{
   
    border-radius:3px;
    margin: 5px;
}
.el-icon-close{
    float: right;
    cursor: pointer;
}
</style>