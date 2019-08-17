<template>
    <div>
        <el-input v-model="shopName" placeholder="请选择合伙人" readonly @focus="showShopDialog">
            <i slot="prefix" class="el-input__icon el-icon-error" @click="deleteData()"></i>
        </el-input>
        
        <div class="mytable" v-if="isShow">
            <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="请输入合伙人名字" class="input inputInside">
            <i class="el-icon-close" @click='closeDialog'></i>
            <el-table :data="shopNameOptions" style="width: 100%" @row-click='getRowDetail' border v-loading="loading">
                <el-table-column show-overflow-tooltip prop="id" label="ID" width="180"></el-table-column>
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

export default {
    data() {
        return {
            shopId:'',
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
            shopName:''
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
            this.$axios.get('/api/partner',{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                this.loading = false
            })
        },
        searchShopName(){
            this.$axios.get(`/api/partner?name=${this.inputShopName}`,{params:this.params}).then((res)=>{
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
    /* top: 3px; */
    border-radius: 5px;
}

.input{
    border: 1px solid #ccc;
    width: 215px;
    height: 30px;
    border-radius:3px;
}
.el-icon-close{
    float: right;
    cursor: pointer;
}
.inputInside{
    margin: 10px
}
</style>