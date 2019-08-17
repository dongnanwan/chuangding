<template>
    <div>
        <div style="height:40px">
            <div style="float:left">
                <el-button type="primary" @click="createNew()" plain icon="el-icon-plus">创建</el-button>
                <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
            </div>
        </div>
        
        <el-table :data="items" style="width: 100%" border highlight-current-row v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column show-overflow-tooltip min-width="80" prop="id" label="id"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="100" prop="name" label="呈现系列名"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="100" prop="seriesIds" label="绑定产品系列"></el-table-column>

            <el-table-column show-overflow-tooltip min-width="180" prop="" label="首页显示产品">
                <template slot-scope="scope">
                    <span v-for="item in scope.row.items" :key="item.id">
                        {{item.code+' '}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip min-width="120" prop="content" label="呈现图片">
                <template slot-scope="scope">
                    <img v-if="scope.row.icoUrl" :src="'https://img.chuangdingshop.com/' + scope.row.icoUrl" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                    <p v-else>暂无图片</p>
                </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip min-width="80" prop="sort" label="系列排序"></el-table-column>
            
            <el-table-column show-overflow-tooltip width="235"  label="操作" >
                <template slot-scope="scope">
                    <el-button type="primary" plain="" @click="showEditTable(scope.$index,scope.row)">修改</el-button>
                    <el-button type="primary" plain="" @click="showSortDialog(scope.$index,scope.row)">商品排序</el-button>
                    <el-button type="danger" plain="" @click="deleteData(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 创建弹出框 -->

        <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>
            <el-card>
                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>创建</h2>
                </div>
                <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
                    <el-form-item label="呈现系列名"> 
                        <el-input v-model="form.name" placeholder=""></el-input>
                        </el-form-item>
                    <br>
                    <div style="height:50px">
                        <p style="float:left;line-height:30px;padding-left:12px">首页产品</p>
                        <div style="float:left;padding-left:12px">
                            <div style="float:left">
                                <itemSelect-app @onInsertSkuData='itemsInsertSkuData'></itemSelect-app>
                            </div>
                            <div style="float:left">
                                <el-input v-model="itemsIds" disabled></el-input>
                            </div>
                            <div style="float:left">
                                <el-button @click="itemIdsClear" type="danger">清空</el-button>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div style="height:50px">
                        <p style="float:left;line-height:30px;padding-left:12px">绑定系列</p>
                        <div style="float:left;padding-left:12px">
                            <div style="float:left">
                                <seriesSelect-app @onInsertSkuData='seriesFromChild'></seriesSelect-app>
                            </div>
                            <div style="float:left">
                                <el-input v-model="seriesIds" disabled></el-input>
                            </div>
                        </div>
                    </div>
                    <br>
                    <el-form-item label="排序"> 
                        <el-input v-model="form.sort" placeholder=""></el-input>
                        </el-form-item>
                    <br>
                    <el-form-item label="上传附件">
                        <el-upload
                            class="upload-file"
                            drag
                            action="/api/upload"
                            :headers="myHeaders"
                            :on-success="handleAvatarSuccess"
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-form-item>
                    <br>
                </el-form>
            </el-card>
            <el-button type="primary" @click="submitCreateNew">创建</el-button>
            <el-button @click="closeCreateTable()">取消</el-button>
        </el-dialog>

        <!-- 修改弹出框 -->
        <el-dialog  :visible.sync="editTableVisible" class="detailTable"  fullscreen>
            <el-card>
                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>修改</h2>
                </div>

                <el-form label-width="80px" :inline="true"  class="demo-form-inline">
                    <el-form-item label="呈现系列名"> 
                        <el-input v-model="editForm.name" placeholder=""></el-input>
                        </el-form-item>
                    <br>
                    <div style="height:50px">
                        <p style="float:left;line-height:30px;padding-left:12px">首页产品</p>
                        <div style="float:left;padding-left:12px">
                            <div style="float:left">
                                <itemSelect-app @onInsertSkuData='editItemsInsertSkuData'></itemSelect-app>
                            </div>
                            <!-- <div style="float:left">
                                <el-input v-model="editItemIds" disabled style="width:500px"></el-input>
                            </div>
                            <div style="float:left">
                                <el-button @click="editItemIdsClear" type="danger">清空</el-button>
                            </div> -->
                        </div>
                    </div>
                    <br>
                    <div style="height:50px">
                        <p style="float:left;line-height:30px;padding-left:12px">绑定系列</p>
                        <div style="float:left;padding-left:12px">
                            <div style="float:left">
                                <seriesSelect-app @onInsertSkuData='editSeriesFromChild'></seriesSelect-app>
                            </div>
                            <div style="float:left">
                                <el-input v-model="editForm.seriesIds" disabled></el-input>
                            </div>
                        </div>
                    </div>
                    <br>
                    <el-form-item label="排序"> 
                        <el-input v-model="editForm.sort" placeholder=""></el-input>
                        </el-form-item>
                    <br>
                    <el-form-item label="上传附件">
                        <el-upload
                        class="upload-file"
                        drag
                        action="/api/upload"
                        :headers="myHeaders"
                        :on-success="editHandleAvatarSuccess"
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-form-item>
                    <br>
                </el-form>
            </el-card>

            <el-card>

                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>排序</h2>
                </div>

                <el-table :data="sortTableData" style="width: 100%" border highlight-current-row>
                    <el-table-column show-overflow-tooltip min-width="80" prop="id" label="id"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" prop="code" label="款号"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" prop="itemId" label="itemId"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" prop="title" label="标题"></el-table-column>

                    <el-table-column show-overflow-tooltip min-width="120" prop="content" label="图片">
                        <template slot-scope="scope">
                            <img v-if="scope.row.mainImage" :src="'https://img.chuangdingshop.com/' + scope.row.mainImage" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                            <p v-else>暂无图片</p>
                        </template>
                    </el-table-column>

                    <el-table-column show-overflow-tooltip min-width="80" prop="sort" label="排序"></el-table-column>
                    
                    <el-table-column show-overflow-tooltip width="85"  label="操作" >
                        <template slot-scope="scope">
                            <!-- <el-button type="primary" plain="" @click="showSort(scope.$index,scope.row)">排序</el-button> -->
                            <el-button type="danger" plain="" @click="deleteSortOneItem(scope.$index,scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-card>
            
            <el-button @click="save()" type='primary' plain>保存</el-button>
        </el-dialog>

        <!-- 排序弹出框 -->

        <el-dialog  :visible.sync="sortTableVisible" class="detailTable"  fullscreen>
            <el-card>

                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>排序</h2>
                </div>

                <el-table :data="sortData" style="width: 100%" border highlight-current-row>
                    <el-table-column show-overflow-tooltip min-width="80" prop="id" label="id"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" prop="code" label="款号"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" prop="itemId" label="itemId"></el-table-column>
                    <el-table-column show-overflow-tooltip min-width="100" prop="title" label="标题"></el-table-column>

                    <el-table-column show-overflow-tooltip min-width="120" prop="content" label="图片">
                        <template slot-scope="scope">
                            <img v-if="scope.row.mainImage" :src="'https://img.chuangdingshop.com/' + scope.row.mainImage" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                            <p v-else>暂无图片</p>
                        </template>
                    </el-table-column>

                    <el-table-column show-overflow-tooltip min-width="80" prop="sort" label="排序"></el-table-column>
                    
                    <el-table-column show-overflow-tooltip width="145"  label="操作" >
                        <template slot-scope="scope">
                            <el-button type="primary" plain="" @click="showSort(scope.$index,scope.row)">排序</el-button>
                            <!-- <el-button type="danger" plain="" @click="deleteSortOneItem(scope.$index,scope.row)">删除</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>

            </el-card>
            <el-button @click="saveSortDelete()" type='primary' plain>保存</el-button>
        </el-dialog>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import ShopIdInput from '../../common/ShopIdsInput.vue'
import itemSelect from '../../common/itemSelectNotRelative.vue'
import seriesSelect from '../../common/seriesSelect.vue'
export default {
    data(){
        return {
            editForm:{},
            sortTableVisible:false,
            sortTableData:[],
            sortLoading:true,
            items:[],
            total:0,
            shopId:[],
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1
            },
            createTableVisible: false,
            indexLoading:true,
            form: {
            },
            shopNameOptions:[],
            multipleSelection: [],
            msgCreate:'msg',
            msgType:'success',
            myHeaders: {Authorization:''},
            upload:'',
            itemsIds:'',
            seriesIds:'',
            itemsTableData:[],
            sortInput:0,
            sortId:'',
            editIndex:'',
            editRow:{},
            editId:'',
            editItemsTableData:[],
            editTableVisible:false,
            editItemIds:'',
            sortForm:{},
            sortData:[]
        }
    },
    components:{
        'ShopIdInput-app':ShopIdInput,
        'itemSelect-app':itemSelect,
        'seriesSelect-app':seriesSelect
    },
    computed:{
        status(){
            return 123
        }
    },
    methods:{
        deleteSortOneItem(index,row){
            this.sortTableData.splice(index,1)
        },
        showSortDialog(index,row){
            console.log(row)
            this.sortForm = row
            this.sortTableVisible = true
            this.sortData = row.recommendItems
        },
        saveSortDelete(){
            let str = ''
            console.log(this.sortForm)
            this.sortTableData.forEach((val,ind)=>{
                str += val.itemId + ','
            })
            str = str.substring(0,str.length-1)
            // console.log(str)
            this.sortForm.itemIds = str
            this.$axios.post(`/api/index/series/add`,this.sortForm).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.sortTableVisible = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        editItemsInsertSkuData(data){
            this.editItemIds = ''
            function unique(array){     
                    var allArr = [];   
                    for(var i=0;i<array.length;i++){
                        var flag = true;
                    　    for(var j=0;j<allArr.length;j++){
                        if(array[i].itemId == allArr[j].itemId){
                    　　　　　   flag = false;
                    　　    };
                    };
                    if(flag){
                    　　allArr.push(array[i]);
                    };
            };
                return allArr;
            }　　
            let arr = this.sortTableData
            data.forEach((value,index)=>{
                arr.push({itemId:value.id,code:value.code})
            })
            arr = unique(arr)
            this.sortTableData = arr
            arr.forEach((val,ind)=>{
                this.editItemIds += val.id + ','
            })
            this.editItemIds = this.editItemIds.substring(0,this.editItemIds.length-1)
        },
        editSeriesFromChild(){

        },
        save(){
            this.editForm.id = this.editId
            this.editForm.itemIds = this.editItemIds
            let str = ''
            this.sortTableData.forEach((val,ind)=>{
                str += val.itemId + ','
            })
            str = str.substring(0,str.length-1)
            this.editForm.itemIds = str
            console.log(this.sortTableData)
            this.$axios.post(`/api/index/series/add`,this.editForm).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.editTableVisible = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        showSort(index,row) {
            this.sortId = row.id
            this.$prompt('请输入排序', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                this.sortInput = value
                this.itemSort()
            }).catch(() => {

            });
        },
        itemSort(){
            this.$axios.put(`/api/recommend/item/${this.sortId}/sort?sort=${this.sortInput}`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.sortTableVisible = false
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
        showEditTable(index,row){
            this.editTableVisible = true
            this.editIndex = index
            this.editRow = row
            this.editForm = row
            this.editId = row.id
            let ids = ''
            row.items.forEach((val,ind)=>{
                ids += val.id + ','
            })
            this.sortTableData = row.recommendItems
            this.editItemsTableData = row.items
            // this.editForm.itemIds = ids.substring(0,ids.length-1)
            this.editItemIds = ids.substring(0,ids.length-1)
            // console.log(row)
            // console.log(this.editForm)
            // this.$axios.get(`/api/index/series/${row.id}`).then(res=>{
            //     if(res.data.code == 200){
            //         this.sortTableData = res.data.data.recommendItems
            //         this.sortLoading = false
            //     }else{
            //         this.msgCreate = res.data.message
            //         this.msgType = 'error'
            //         this.msgCreateOpen()
            //     }
            // })
        },
        EditTable(index,row){
            
        },
        itemIdsClear(){
            this.itemsIds = ''
            this.itemsTableData = []
        },
        editItemIdsClear(){
            this.editItemIds = ''
            this.editItemsTableData = []
        },
        seriesFromChild(data){
            this.seriesIds = ''
            data.forEach((val,ind)=>{
                this.seriesIds += val.id + ','
            })
            this.seriesIds = this.seriesIds.substring(0,this.seriesIds.length-1)
        },
        itemsInsertSkuData(data){
            this.itemsIds = ''
            function unique(array){     
                    var allArr = [];   
                    for(var i=0;i<array.length;i++){
                        var flag = true;
                    　    for(var j=0;j<allArr.length;j++){
                        if(array[i].id == allArr[j].id){
                    　　　　　   flag = false;
                    　　    };
                    };
                    if(flag){
                    　　allArr.push(array[i]);
                    };
            };
                return allArr;
            }　　

            let arr = this.itemsTableData
            
            data.forEach((value,index)=>{
                arr.push(value)
            })

            arr = unique(arr)

            arr.forEach((val,ind)=>{
                this.itemsIds += val.id + ','
            })
            this.itemsIds = this.itemsIds.substring(0,this.itemsIds.length-1)
        },
        refreshData(){
            this.getInfo()
        },
        deleteData(index,row){
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.doDelete(index,row)
            }).catch(() => {
                       
            });
        },
        doDelete(index,row){
            this.$axios.put(`/api/index/series/${row.id}/remove`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        handleAvatarSuccess (res, file) {
            // console.log(res,file)
            if (res.code === 200) {
                this.form.icoUrl = res.data
                // this.form.fileKey += res.data + ','
            }
        },
        editHandleAvatarSuccess (res, file) {
            // console.log(res,file)
            if (res.code === 200) {
                this.editForm.icoUrl = res.data
                // this.form.fileKey += res.data + ','
            }
        },
        beforeAvatarUpload (file) {
        // console.log(file)
        },
        //消息++++
        msgCreateOpen() {
            this.$message({
                message:this.msgCreate,
                type:this.msgType,
                showClose: true
            });
        },
        getInfo(){
            this.indexLoading = true
            this.$axios.get('/api/index/series/all').then(res=>{
                if(res.data.code == 200){
                    console.log(res.data)
                    this.items = res.data.data
                    this.total = res.data.data.total
                    this.indexLoading = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                    this.indexLoading = false
                }
            })
        },
        createNew(){
            this.createTableVisible = true
        },
        submitCreateNew() {
            this.form.itemIds = this.itemsIds
            this.form.seriesIds = this.seriesIds
            console.log(this.form)
            this.$axios.post(`/api/index/series/add`,this.form).then((res)=>{
                console.log(res)
                if(res.data.code == 200){
                this.msgCreate = '操作成功'
                this.msgType = 'success'
                this.msgCreateOpen()
                this.getInfo()
                this.createTableVisible = false
                }else{
                this.msgCreate = res.data.message
                this.msgType = 'error'
                this.msgCreateOpen()
                }
            })
        },
        closeCreateTable(){
            this.createTableVisible = false
        }
    },
    mounted(){
        this.getInfo()
        this.myHeaders.Authorization = 'Authorization'+' '+window.sessionStorage['token']
    }
}
</script>

<style scoped>
 
</style>

