<template>
    <div>
        <div>
            <div style="margin-bottom:10px">
                <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
            </div>
            <div>
                <div style="margin-bottom:10px;float:left;">
                    <itemSelect-app @onInsertSkuData='itemsInsertSkuData'></itemSelect-app>
                </div>
                <div style="float:left;">
                    <el-input  readonly="" style="width:200px" v-model="itemsIdRecommend">
                        <i slot="prefix" class="el-input__icon el-icon-error" @click="itemsIdRecommend = ''"></i>
                    </el-input>
                    <el-button type="primary" @click="setItemsRecommend">提交</el-button>
                </div>
            </div>
            
            
        </div>
        <el-table :data="itemsTableData" style="width: 100%"  border highlight-current-row
            v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-table-column show-overflow-tooltip prop="code" label="款号" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip label="图片" min-width="80">
                <template slot-scope="scope">
                    <img v-if="scope.row.mainImage" :src="'https://img.chuangdingshop.com/' + scope.row.mainImage" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="title" label="标题" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip prop="sort" label="排序" min-width="80"></el-table-column>
            <el-table-column fixed="right" label="操作" width="153" show-overflow-tooltip>
                <template slot-scope="scope"> 
                    <el-button plain="" type="primary" @click="deleteOne(scope.$index, scope.row)" style="margin:0 5px">删除</el-button>
                    <el-button plain="" type="primary" @click="showSortItems(scope.$index, scope.row)" style="margin:0 5px">排序</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import itemsSelect from '../../common/itemsSelectOnsale.vue'
import qs from 'qs'
export default {
    data(){
        return {
            itemsTableData:[],
            indexLoading:true,
            msgCreate:'msg',
            msgType:'success',
            sortInput:0,
            sortId:'',
            updateItemsIdRecommend:[],
            giftSkuTableData:[],
            itemsIdRecommend:''
        }
    },
    components:{
        'itemSelect-app':itemsSelect,
    },
    methods:{
        setItemsRecommend(){
            let value = this.updateItemsIdRecommend?this.updateItemsIdRecommend.join(','):''
            this.$axios.post(`/api/recommend/item/add?recommendType=recommend_items&items=${value}`).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.itemsIdRecommend = ''
                    this.updateItemsIdRecommend = []
                    this.getInfo()
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        itemsInsertSkuData(data){
            this.updateItemsIdRecommend = []
            function unique(array){     
                var allArr = [];   
                for(var i=0;i<array.length;i++){
                    var flag = true;
                　  for(var j=0;j<allArr.length;j++){
                        if(array[i].id == allArr[j].id){
                        　　flag = false;
                        }
                    }
                    if(flag){
                    　　allArr.push(array[i]);
                    }
                }
                return allArr;
            }　　

            let arr = this.giftSkuTableData
            
            data.forEach((value,index)=>{
                arr.push(value)
            })

            this.giftSkuTableData = unique(arr)

            this.giftSkuTableData.forEach((val,ind)=>{
                this.updateItemsIdRecommend.push(val.id)
            })

            this.itemsIdRecommend = this.updateItemsIdRecommend.join(',')
        },
        showSortItems(index,row){
            this.sortId = row.id
            this.$prompt('输入排序', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /[0-9]+/,
                inputErrorMessage: '请输入数字'
            }).then(({ value }) => {
                this.sortInput = value
            }).then(()=>{
                this.sortItems()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });
        },
        sortItems(){
            this.indexLoading = true
            this.$axios.put(`/api/recommend/item/${this.sortId}/sort?sort=${this.sortInput}`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.indexLoading = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                    this.indexLoading = false
                }
            })
        },
        deleteOne(index,row){
            this.indexLoading = true
            this.$axios.put(`/api/recommend/item/${row.id}/delete`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.indexLoading = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                    this.indexLoading = false
                }
            })
        },
        refreshData(){
            this.getInfo()
        },
        msgCreateOpen() {
            this.$message({
                message:this.msgCreate,
                type:this.msgType,
                showClose: true
            });
        },
        getInfo(){
            this.indexLoading = true
            this.$axios.get('/api/recommend/items?recommendType=recommend_items',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                    console.log(res.data.data)
                    this.itemsTableData = res.data.data
                    this.indexLoading = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                    this.indexLoading = false
                }
            })
        }
    },
    mounted(){
        this.getInfo()
    }
}
</script>

<style scoped>
 
</style>

