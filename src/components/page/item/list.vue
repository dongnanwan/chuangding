<template>
    <div>
        <div style="height:40px">
            <el-button type="primary" plain @click="dataFit()" icon="el-icon-upload">数据同步</el-button>
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        </div>
        <div style="margin-bottom:10px">
            <el-input placeholder="款号" class="searchItem" v-model="params.code" v-on:keyup.native="searchShopName"></el-input>
            <el-input placeholder="年份" class="searchItem" v-model="params.year" v-on:keyup.native="searchShopName"></el-input>
            <el-select v-model="params.season" class="searchItem" placeholder="季节" @change="searchShopName">
                <el-option
                    v-for="item in searchData.season"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>
            <el-input placeholder="标题" class="searchItem" v-model="params.title" v-on:keyup.native="searchShopName"></el-input>
            <el-select v-model="params.status" class="searchItem" placeholder="商品状态" @change="searchShopName">
                <el-option
                    v-for="item in searchData.status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>
            
            
        </div>

        <el-table
            border
            :data="items"
            style="width: 100%"
            :row-style="rowstyle"
             v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            height="600"
            >
            <el-table-column prop="id" label="ID" sortable  show-overflow-tooltip  min-width="60"></el-table-column>

            <el-table-column prop="code"  label="款号"  show-overflow-tooltip  min-width="110"></el-table-column>

            <el-table-column label="主图"   min-width="70" show-overflow-tooltip>
                <template slot-scope="scope">
                    <img v-if="scope.row.images" :src="'https://img.chuangdingshop.com/' + scope.row.images[0]" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                    <p v-else>暂无图片</p>
                </template>
            </el-table-column>

            <el-table-column  label="状态"  show-overflow-tooltip  min-width="70">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 'IN_STOCK'">下架</span> 
                    <span v-else-if="scope.row.status == 'ON_SALE'">在售</span>
                    <span v-else-if="scope.row.status == 'VERIFYING'">审核中</span>
                    <span v-else>{{scope.row.status}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="name" label="类目"  show-overflow-tooltip min-width="100">
                <div class="title" slot-scope="scope">{{scope.row.firstName}}/{{scope.row.secondName}}</div>
            </el-table-column>
            <el-table-column prop="seriesName" label="系列"  show-overflow-tooltip min-width="70"></el-table-column>
            <el-table-column label="标题"  show-overflow-tooltip min-width="240" prop="title"></el-table-column>
            <el-table-column label="库存"  show-overflow-tooltip min-width="100" prop="totalStock">
                <template slot-scope="scope">
                    <div v-if="scope.row.totalStock <= 10" style="background:red;color:white">{{scope.row.totalStock}}</div>
                    <div v-else>{{scope.row.totalStock}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌"  show-overflow-tooltip min-width="70"></el-table-column>
            <el-table-column prop="year" label="年份"  show-overflow-tooltip min-width="70"></el-table-column>
            <el-table-column prop="season" label="季节"  show-overflow-tooltip min-width="70"></el-table-column>
           
            <el-table-column label="市场价"  show-overflow-tooltip min-width="70">
                <div class="title" slot-scope="scope">{{scope.row.marketPrice}}</div>
            </el-table-column>

            <el-table-column label="一口价"  show-overflow-tooltip min-width="70">
                <div class="title" slot-scope="scope">{{scope.row.fixedPrice}}</div>
            </el-table-column>
           
            <el-table-column label="销量"  show-overflow-tooltip  min-width="70">
                <div class="title" slot-scope="scope">{{scope.row.saleNum}}</div>
            </el-table-column>

            <el-table-column label="评价"  show-overflow-tooltip  min-width="70">
                <div class="title" slot-scope="scope">{{scope.row.commentNum}}</div>
            </el-table-column>

            <el-table-column prop="batch"  label="批次"  show-overflow-tooltip  min-width="80"></el-table-column>

            <el-table-column show-overflow-tooltip  label="是否是赠品" min-width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.gift == false">否</span>
                    <span v-else-if="scope.row.gift == true">是</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="387" show-overflow-tooltip>
                <template slot-scope="scope"> 
                    <el-button plain="" type="primary" @click="showAddFakeNum(scope.$index, scope.row)" style="margin:0 5px">销售量</el-button>
                    <el-button plain="" type="primary" @click="batchEditShow(scope.$index, scope.row)" style="margin:0 5px">批次</el-button>
                    <el-button plain="" type="primary" @click="showEditDialogue(scope.$index, scope.row)" style="margin:0 5px">编辑</el-button>
                    <el-button :disabled="scope.row.status == 'ON_SALE' || scope.row.status == 'VERIFYING'" plain="" type="primary" @click="checkOnline(scope.$index, scope.row)" style="margin:0 5px">上架审核</el-button>
                    <!-- <el-button :disabled="true" v-if="scope.row.status == 'IN_STOCK'" plain="" type="success" @click="itemOnline(scope.$index, scope.row)" style="margin:0 5px">上架</el-button> -->
                    <el-button :disabled="scope.row.status == 'IN_STOCK' || scope.row.status == 'VERIFYING'" plain="" type="danger" @click="itemOffline(scope.$index, scope.row)" style="margin:0 5px">下架</el-button>
                </template>
            </el-table-column>
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

        <!-- 编辑出框 -->

        <!-- 修改弹出框 -->
     <el-dialog  :visible.sync="updateTableVisible" class="detailTable"  fullscreen   v-loading="updateDialogueLoading" @close='updateTableClose()'>
        
        <el-form label-position="right" label-width="80px" :inline="true">

            <el-card shadow="hover" style="">
                <div slot="header" class="clearfix" style="height:25px"> 
                   <h2>封面图片</h2>
                </div>
                 
               <el-form-item >
                  <el-upload
                    :file-list="fileList"
                    action="/api/upload"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="imgUploadSuccess"
                    :headers="myHeaders">
                    <i class="el-icon-plus"></i>
                  </el-upload>
              </el-form-item> 

                   
                <el-dialog :visible.sync="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>

            </el-card>

            
            <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:25px"> 
                   <h2>商品信息</h2>
                </div>
                 
               <el-form-item >
                    <el-form-item  label="标题"><el-input  v-model="updateForm.title"></el-input></el-form-item>
                    <el-form-item  label="副标题"><el-input  v-model="updateForm.subTitle"></el-input></el-form-item>
                    <el-form-item  label="市场价"><el-input  v-model="updateForm.marketPrice"></el-input></el-form-item>
                    <el-form-item  label="一口价"><el-input  v-model="updateForm.fixedPrice"></el-input></el-form-item>
                    <el-form-item  label="金卡折扣"><el-input  v-model="updateForm.goldDiscount"></el-input></el-form-item>
                    <el-form-item  label="银卡折扣"><el-input  v-model="updateForm.silverDiscount"></el-input></el-form-item>
                    <el-form-item  label="是否赠品">
                        <el-select v-model="updateForm.gift" placeholder="是否是赠品">
                            <el-option value="true" label="是"></el-option>
                            <el-option value="false" label="否"></el-option>
                        </el-select>
                    </el-form-item>
              </el-form-item> 


            </el-card>

            <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:25px"> 
                   <h2>商品属性</h2>
                </div>

                <el-form-item  label="属性详情">
                  <el-input :value="propertyString" disabled=""></el-input>
                  <el-button @click="changeProperty()">修改属性</el-button>
                </el-form-item>

                <ul v-show='showPropertyChangeForm'>
                  <span v-for="(property,index) in itemsProperties" :key="property.id">
                    <div style="margin-top:3px">
                        <span style="width:80px;display:inline-block;text-align: center;">{{property.name}}</span>
                        <select style="width:120px;height:30px;border-radius: 5px"  v-model="testarr[index]" ref="propertyChoice"  placeholder="请选择" @change='selectChange(testarr[index])'>
                        <option 
                            style="height:40px"
                            v-for="item in property.values" 
                            :key="item.id"
                            :value="{keyId:property.id,keyValue:property.name,nameId:item.id,nameValue:item.value}"
                            >{{item.value}}</option>
                        </select>
                    </div>
                        
                    <br>
                  </span>
                </ul>

            </el-card>

            <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:25px">
                    <h2>商品描述</h2>
                </div>

                <div style="float:left;margin:10px">
                    <el-input placeholder="文字描述" style="width:150px;" v-model="contentWordsInput"></el-input>
                    <el-button  type="primary" @click="addContentWords()">添加文字</el-button>
                </div>
                
                <div style="float:left;margin:10px">
                    <el-upload
                        ref="uploadContent"
                        :file-list="fileListContent"
                        action="/api/upload"
                        list-type="picture"
                        :on-success="imgUploadSuccessContent"
                        :headers="myHeaders">
                        <el-button size="small" type="primary">添加图片</el-button>
                    </el-upload>
                </div>

                <el-table :row-style="rowstyle" v-show="contentList.length > 0" :data="contentList" :show-header="false" border class='contentTable'  style="width: 100%;font-size:14px;"  >
                    <el-table-column>
                        <template slot-scope="scope">
                            <div v-if='scope.row.type == "A"' class="todo-item" :class="{'todo-item-del':false}">{{scope.row.content}}</div>
                            <img v-else-if="scope.row.type == 'M'" :src="'https://img.chuangdingshop.com/' + scope.row.content" :alt="scope.row.title" width="30" height="30" class="am-img-thumbnail">
                        </template>
                    </el-table-column>
                    <el-table-column width="80">
                        <template slot-scope="scope">
                            <!-- <i class="el-icon-edit"></i> -->
                            <!-- <i class="el-icon-delete" @click="deleteContentWords(scope.$index,scope.row)"></i> -->
                            <el-button type="danger"  @click="deleteContentWords(scope.$index,scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-card>

           <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:25px"> 
                   <h2>sku相关信息</h2>
                </div>
                 
                <div class="tableRowInfo">
                    <el-table border :data="skuTableData">
                        <el-table-column prop="year" label="年份" > </el-table-column>
                        <el-table-column prop="season" label="季节" > </el-table-column>
                        <el-table-column prop="brandName" label="品牌" > </el-table-column>
                        <el-table-column prop="name" label="sku名称" > </el-table-column>
                        <el-table-column prop="stock" label="库存" > </el-table-column>
                        <el-table-column prop="tagPrice" label="吊牌价" > </el-table-column>
                        <el-table-column prop="mainImage" label="图片" > 
                            <template slot-scope="scope">
                                <img v-if="scope.row.mainImage" :src="'https://img.chuangdingshop.com/' + scope.row.mainImage" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                                <p v-else>暂无图片</p>
                            </template>
                        </el-table-column>
                        
                        <el-table-column prop="price" label="销售价" >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.price" placeholder="销售价"></el-input>
                            </template>  
                        </el-table-column>

                        <el-table-column prop="price" label="操作" >
                            <template slot-scope="scope">
                                <el-upload
                                    ref="uploadContent"
                                    :file-list="skuFileListContent"
                                    action="/api/upload"
                                    list-type="picture"
                                    :on-success="skuImgUploadSuccessContent"
                                    :headers="myHeaders">
                                    <el-button size="small" type="primary" @click="addpic(scope.$index,scope.row)">添加图片</el-button>
                                 </el-upload>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>

            <!-- <el-form-item  label="码段组"><el-input v-model="updateForm.brandName"></el-input></el-form-item> -->
        </el-form>

        <el-button @click="submitUpdate()" type="primary">保存修改</el-button>
      </el-dialog>

        <el-dialog  :visible.sync="batchEditVisible"   fullscreen>
            <el-card>
                <div slot='header' class="clearfix" style="height:25px">
                    <h2>编辑批次</h2>
                </div>
                <div>
                    <el-input v-model="batchForm.batch" placeholder="请输入批次" style="width:200px"></el-input>
                </div>
            </el-card>
            <el-button @click="batchEditSubmit()" type='primary'>确认</el-button>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            searchData:{
                status:[
                    {value:'IN_STOCK',label:'下架'},
                    {value:'ON_SALE',label:'在售'},
                    {value:'',label:'全部'}
                ],
                season:[
                    {value:'春',label:'春'},
                    {value:'夏',label:'夏'},
                    {value:'秋',label:'秋'},
                    {value:'冬',label:'冬'},
                    {value:'',label:'全部'}
                ]
            },
            items:[],
            total:0,
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1,
                pid:13,
                name:'',
                secondId:''
            },
            indexLoading:true,
            msgCreate:'msg',
            msgType:'success',
            form:{},
            myHeaders: {Authorization:''},
            editName:'',
            rowstyle:{height:'40px'},
            updateDialogueLoading:true,
            updateTableVisible:false,
            updateForm:{property:{}},
            fileList: [],
            skuTableData:[],
            dialogVisible: false,
            dialogImageUrl: '',
            propertyString:'',
            showPropertyChangeForm:false,
            propertySelectedArr:[],
            itemsProperties:[],
            contentWordsInput:'',
            contentList: [],
            fileListContent:[],
            skuFileListContent:[],
            testarr:[],
            batchEditVisible:false,
            batchEditId:'',
            batchForm:{
                batch:''
            },
            thisIndex:0,
            fakeNum:0
        }
    },
    methods:{
        checkOnline(index,row){
            console.log(row)
            this.$axios.put(`/api/item/verify?id=${row.id}`).then(res=>{
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
        showAddFakeNum(index,row) {
            this.$prompt('请输入新增销售数', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                this.fakeNum = value
                this.addFakeNum(index,row)
            }).catch(() => {
                      
            });
        },
        addFakeNum(index,row){
            this.$axios.put(`/api/item/sales?id=${row.id}&num=${this.fakeNum}`).then(res=>{
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
        addpic(index,row){
            this.thisIndex = index
            console.log(row)
        },
        skuImgUploadSuccessContent(file){
            this.skuTableData[this.thisIndex].mainImage = ''
            this.skuTableData[this.thisIndex].mainImage = file.data
            // this.updateForm.images =  this.imgUrlList
            console.log(this.skuTableData[this.thisIndex])
        },
        addSkuImg(index,row){

        },
        batchEditSubmit(){
            this.$axios.put(`/api/item/${this.batchEditId}/batch?batch=${this.batchForm.batch}`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.batchEditVisible = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        batchEditShow(index,row){
            this.batchEditId = row.id
            this.batchForm.batch = row.batch
            this.batchEditVisible = true
        },
        searchShopName(){
            this.params.page = 1
            this.getInfo()
        },
        search(){

        },
        refreshData(){
            this.getInfo()
        },
        selectChange(a,b){
            this.updateForm.property = {}
            this.updateForm.property.propertyIds = []
            this.updateForm.property.propertyValues = []
            this.testarr.forEach((val,ind)=>{
                this.updateForm.property.propertyIds.push(val.keyId+':'+val.nameId)
                this.updateForm.property.propertyValues.push(val.keyValue+':'+val.nameValue)
            })
            var sel=this.$refs.propertyChoice[0];
        },
        changeProperty(){
            if(this.showPropertyChangeForm == false){
                this.$axios.get(`/api/item-property/base-properties`).then(res=>{
                    this.itemsProperties = res.data.data
                })
            }
            this.showPropertyChangeForm = !this.showPropertyChangeForm
        },
        itemOffline(index,row){
            this.$axios.post(`/api/item/offline?id=${row.id}`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.updateTableVisible = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        itemOnline(index,row){
            this.$axios.post(`/api/item/online?id=${row.id}`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.updateTableVisible = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        imgUploadSuccessContent(file){
            this.contentList.push({content:file.data,type:'M'})
            if(this.updateForm.contentList == undefined){
                this.updateForm.contentList = []
            }
            this.updateForm.contentList = this.contentList
            this.$refs.uploadContent.clearFiles();
            console.log(this.updateForm.contentList)
        },
        submitUpdate(){
            let rst = this.updateForm.skuList.map((val,ind)=>{
                return {price:parseFloat(val.price),skuId:val.id,mainImage:val.mainImage}
            })
            this.updateForm.skuBodies = rst
            this.$axios.post(`/api/item`,this.updateForm).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.updateTableVisible = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        deleteContentWords(index,row){
            this.contentList.splice(index,1)
            this.updateForm.contentList = this.contentList
            console.log(this.updateForm.contentList)
        },
        imgUploadSuccess(file){
            console.log(this.imgUrlList)
            this.imgUrlList.push(file.data)
            this.updateForm.images =  this.imgUrlList
        },
        handleRemove(file, fileList) {
            try{
                this.imgUrlList.splice(this.imgUrlList.indexOf(file.response.data),1)
            }catch(e){
                this.imgUrlList.splice(this.imgUrlList.indexOf(file.name),1)
            }
            this.updateForm.images =  this.imgUrlList
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
            console.log(file)
        },
        updateTableClose(){
            //弹出框关闭后把图片列表清空
            this.fileList = []
        },
        
        msgCreateOpen() {
        this.$message({
            message:this.msgCreate,
            type:this.msgType,
            showClose: true
        });
        },
        handleSizeChange(val) {
            this.params.size = val 
            this.getInfo()
        },
        handleCurrentChange(val) {
            this.params.page = val
            this.getInfo()
        },
        getInfo(){
            this.indexLoading = true
            this.$axios.get('/api/item',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                    console.log(res.data.data)
                    this.items = res.data.data.data
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
        dataFit(){
            this.indexLoading = true
            this.$axios.get(`/api/import/all`).then(res=>{
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
        showEditDialogue(index,row){
            this.skuFileListContent = []
            this.showPropertyChangeForm = false
            this.propertyString = ''
            this.updateTableVisible = true
            this.imgUrlList = []
            this.$axios.get(`/api/item/${row.id}`).then(res=>{
                // this.updateForm = res.data.data
                // this.updateForm.gift.toString()
                this.updateForm = Object.assign(res.data.data,{gift:row.gift.toString()})
                this.skuTableData = res.data.data.skuList
                if(res.data.data.contentList != undefined){this.contentList = res.data.data.contentList}
                // console.log(res.data.data)
                if(typeof(res.data.data.images) != 'undefined'){
                    this.imgUrlList = res.data.data.images
                }
                
                if(res.data.data.images){
                    res.data.data.images.forEach((val,ind)=>{
                        this.fileList.push({url:'https://img.chuangdingshop.com/'+val,name:val})
                    })
                }
     
                try{
                    this.propertyString = this.updateForm.property.propertyValues.join(',')
                    this.updateForm.property.propertyValues.forEach((val,ind)=>{
                    this.propertyValueArr.push(val)
                    })
                }catch(e){
                    console.log(e)
                }
            })
        }
    },
    mounted(){
        this.getInfo()
        this.myHeaders.Authorization = 'Authorization'+' '+window.sessionStorage['token']
    }
}
</script>

<style scoped>
.searchItem{
    width: 200px
}
</style>

