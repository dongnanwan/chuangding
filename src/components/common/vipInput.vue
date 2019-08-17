<template>
    <div>
        <div style="position:relative">
            <el-input v-model="shopName" placeholder="请选择会员ID" @focus="showShopDialog" readonly="">
                <i slot="prefix" class="el-input__icon el-icon-error" @click="deleteData()"></i>
            </el-input>
            <div class="mytable" v-if="isShow">
                <input type="text" v-model="inputShopName" v-on:keyup="searchShopName" placeholder="会员名称(至少两个字)" class="input inptwo">
                <i class="el-icon-close" @click='closeDialog'></i>
                <el-table
                    :data="shopNameOptions"
                    style="width: 100%"
                    @row-click='getRowDetail'
                    v-loading="loading"
                    >
                    <el-table-column show-overflow-tooltip prop="id" label="ID" width="80"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="memberCode" label="会员号" width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="nick" label="昵称" width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="vip" label="会员等级" width="180">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vip == 'GOLD'">金卡会员</span>
                            <span v-else-if="scope.row.vip == 'SILVER'">银卡会员</span>
                            <span v-else>非会员</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="mid" label="上级会员ID" width="180"></el-table-column>
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
            console.log(123)
            this.shopName = row.id
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
            this.$axios.get('/api/member/findMembers',{params:this.params}).then((res)=>{
                this.shopNameOptions = res.data.data.data
                this.total = res.data.data.total
                this.loading = false
            })
        },
        searchShopName(){
            console.log(123)
            this.$axios.get(`/api/member/findMembers?nick=${this.inputShopName}`,{params:this.params}).then((res)=>{
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
.inp{
    /* position: relative */
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