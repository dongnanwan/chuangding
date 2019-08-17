<template>
    <div>
        <div style="margin-bottom:10px">
            <div>
                <el-button type="primary" @click="createNew()" plain icon="el-icon-plus">创建</el-button>
                <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
            </div>
        </div>

        <el-table :data="items" style="width: 100%" height="600" border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column show-overflow-tooltip min-width="100" prop="theme" label="陈列主题"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="120" prop="content" label="内容"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="120" prop="uploader" label="上传人"></el-table-column>
            
            <!-- <el-table-column show-overflow-tooltip min-width="80" prop="shopId" label="门店">
                <template slot-scope="scope">
                    <span v-for='item in scope.row.shopList' :key="item.id">{{item.name}},</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="130"  label="附件">
                <template slot-scope="scope">
                    {{scope.row.fileKey}}
                </template>
            </el-table-column> -->
            <el-table-column show-overflow-tooltip width="295"  label="操作" >
                <template slot-scope="scope">
                    <el-button type="primary" plain="" @click="showAddSample(scope.$index,scope.row)">添加附件</el-button>
                    <el-button type="primary" plain="" @click="executeAndRank(scope.$index,scope.row)">查看执行并评分</el-button>
                    <el-button type="danger" plain="" @click="showDelete(scope.$index,scope.row)">删除</el-button>
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
        <!-- 创建弹出框 -->

        <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>
            <el-card>
                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>创建</h2>
                </div>
                <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
                    <el-form-item label="陈列主题"> 
                        <el-input v-model="form.theme" placeholder=""></el-input>
                        </el-form-item>
                    <br>
                    <div style="height:50px">
                        <p style="float:left;line-height:30px;padding-left:12px">适用门店</p>
                        <div style="float:left;padding-left:12px">
                            <ShopIdInput-app @OnGetShopIdsFromChild='GetShopIdFromChild'></ShopIdInput-app>
                        </div>
                    </div>
                    <br>
                    <el-form-item label="成列类型"> 
                        <el-input v-model="form.exhibitionType" placeholder=""></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="成列内容"> 
                        <el-input v-model="form.content" placeholder=""></el-input>
                    </el-form-item>
                   
                    <br>
                
                </el-form>
            </el-card>
            <el-button type="primary" @click="submitCreateNew">创建</el-button>
            <el-button @click="closeCreateTable()">取消</el-button>
        </el-dialog>

        <!--查看执行并评分 -->
       
        <el-dialog  :visible.sync="rankTableVisible" class="detailTable" fullscreen>
            <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>查看执行并评分</h2>
                </div>
                <div style="margin-bottom:8px">
                    <div style="display:inline-block;position:absolute">
                        <shopInput-app :fatherData='fatherList'  @OnGetDataFromChild='getRankShopIdFromChild'></shopInput-app>
                    </div>

                    <el-button type="primary" plain="" @click="rankSearch()" style="margin-left:220px" icon="el-icon-search">搜索</el-button>
                </div>
                
                <el-table 
                    border
                    :data="rankData"
                    v-loading="rankTableLoading"
                    element-loading-text="数据加载中......"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                    <el-table-column show-overflow-tooltip prop="shopName" label="门店"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="score" label="分数"></el-table-column>

                    <el-table-column show-overflow-tooltip width="170"  label="操作" >
                        <template slot-scope="scope">
                            <el-button type="primary" plain="" @click="showGiveScore(scope.$index,scope.row)">评分</el-button>
                            <el-button type="primary" plain="" @click="showDetail(scope.$index,scope.row)">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-dialog>

        <!--查看详情 -->
       
        <el-dialog  :visible.sync="detailTableVisible" class="detailTable" fullscreen>
            <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>查看详情</h2>
                </div>

                <el-table 
                    border
                    :data="detailData"
                    element-loading-text="数据加载中......"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                    <el-table-column show-overflow-tooltip prop="sampleImg" label="陈列图片">
                        <template slot-scope="scope">
                            <img v-if="scope.row.sampleImg" @click="imgClick(scope.row)" :src="'https://img.chuangdingshop.com/' + scope.row.sampleImg" :alt="scope.row.title" width="30" height="30" class="am-img-thumbnail">
                            <p v-else>暂无图片</p>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="feedbackImg" label="执行图片">
                        <template slot-scope="scope">
                            <img v-if="scope.row.feedbackImg" @click="feedbackImgClick(scope.row)" :src="'https://img.chuangdingshop.com/' + scope.row.feedbackImg" :alt="scope.row.title" width="30" height="30" class="am-img-thumbnail">
                            <p v-else>暂无图片</p>
                        </template>
                    </el-table-column>
                    
                    <el-table-column show-overflow-tooltip prop="comments" label="反馈"></el-table-column>

                    <el-table-column show-overflow-tooltip width="170"  label="操作" >
                        <template slot-scope="scope">
                            <el-button type="primary" plain="" @click="showComments(scope.$index,scope.row)">添加反馈</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-dialog>

        <!--添加附件 -->
       
        <el-dialog  :visible.sync="sampleTableVisible" class="detailTable" fullscreen>
            <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>已添加附件</h2>
                </div>

                <el-table 
                    border
                    :data="imgData"
                    element-loading-text="数据加载中......"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                    <el-table-column show-overflow-tooltip prop="sampleImg" label="陈列图片">
                        <template slot-scope="scope">
                            <img v-if="scope.row.sampleImg" :src="'https://img.chuangdingshop.com/' + scope.row.sampleImg" :alt="scope.row.title" width="100" height="100" class="am-img-thumbnail">
                            <p v-else>暂无图片</p>
                        </template>
                    </el-table-column>

                    <el-table-column show-overflow-tooltip prop="sampleName" label="图片名"></el-table-column>
                    <el-table-column show-overflow-tooltip width="80"  label="操作" >
                        <template slot-scope="scope">
                            <el-button type="danger" plain="" @click="showDeleteImg(scope.$index,scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                
            </el-card>
            <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>添加附件</h2>
                </div>
                <br>
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

                <el-input v-model="sampleName" placeholder="图片名(最多四个字)" style="width:200px" @keyup.native="checkLength()"></el-input>
            </el-card>
            <el-button type="primary" @click="addSample()">添加</el-button>
            <el-button @click="sampleTableVisible = false">取消</el-button>
        </el-dialog>
        
        <!-- img -->
        <el-dialog  :visible.sync="bigImgVisible" class="detailTable" width="70%">
             <img alt="no-img" :src="'https://img.chuangdingshop.com/' + bigImgUrl"  width="100%" height="100%" class="am-img-thumbnail">
        </el-dialog>
    </div>
</template>

<script>
    import ShopIdInput from '../../common/ShopIdsInput.vue'
    import shopInput from '../../common/shopInput.vue'
    export default {
        data(){
            return {
                fatherList:{
                    provinceId:0,
                    regionId:0,
                    cityId:0
                },
                rankShopId:0,
                rankParams:{

                },
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
                    fileKey:[]
                },
                shopNameOptions:[],
                multipleSelection: [],
                msgCreate:'msg',
                msgType:'success',
                myHeaders: {Authorization:''},
                upload:'',
                rankTableVisible:false,
                rankData:[],
                rankTableLoading:true,
                detailRow:'',
                detailTableVisible:false,
                detailData:[],
                comments:'',
                sampleTableVisible:false,
                sampleImg:'',
                sampleName:'',
                exhibitionId:"",
                imgData:[],
                row:'',
                index:'',
                bigImgVisible:false,
                bigImgUrl:'',
                rankRow:'',
                rankIndex:''
            }
        },
        components:{
            'ShopIdInput-app':ShopIdInput,
            'shopInput-app':shopInput
        },
        computed:{
        },
        methods:{
            rankSearch(){
               this.executeAndRank(this.rankIndex,this.rankRow) 
            },
            getRankShopIdFromChild(data){
                this.rankShopId = data
            },
            feedbackImgClick(row){
                this.bigImgUrl = row.feedbackImg
                this.bigImgVisible = true
            },
            imgClick(row){
                this.bigImgUrl = row.sampleImg
                this.bigImgVisible = true
            },
            checkLength(){
                if(this.sampleName.length > 4){
                    this.sampleName = this.sampleName.substring(0,4)
                    this.msgCreate = '字数不能超过4位'
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            },
            showDeleteImg(index,row){

                this.$axios.delete(`/api/exhibition/delete-sample/${row.id}`).then(res=>{
                    if(res.data.code == 200){
                        this.msgCreate = '操作成功'
                        this.msgType = 'success'
                        this.msgCreateOpen()
                        this.$axios.get('/api/exhibition/list',{params:this.params}).then(res=>{
                            if(res.data.code == 200){
                                this.items = res.data.data.data
                                this.total = res.data.data.total
                                this.indexLoading = false
                                this.imgData = this.items[this.index].sampleList
                            }else{
                                this.msgCreate = res.data.message
                                this.msgType = 'error'
                                this.msgCreateOpen()
                                this.indexLoading = false
                            }
                        })
                    }else{
                        this.msgCreate = res.data.message
                        this.msgType = 'error'
                        this.msgCreateOpen()
                    }
                })
            },
            addSample(){
                let that = this
                this.$axios.post(`/api/exhibition/save-sample/${this.exhibitionId}`,[{sampleImg:this.sampleImg,sampleName:this.sampleName}]).then(res=>{
                    if(res.data.code == 200){
                        this.msgCreate = '操作成功'
                        this.msgType = 'success'
                        this.msgCreateOpen()
                        this.sampleImg = ''
                        this.sampleName = ''
                        console.log('aaa')
                        this.$axios.get('/api/exhibition/list',{params:this.params}).then(res=>{
                            if(res.data.code == 200){
                                this.items = res.data.data.data
                                this.total = res.data.data.total
                                this.indexLoading = false
                                this.imgData = this.items[this.index].sampleList
                            }else{
                                this.msgCreate = res.data.message
                                this.msgType = 'error'
                                this.msgCreateOpen()
                                this.indexLoading = false
                            }
                        })
                        
                    }else{
                        this.msgCreate = res.data.message
                        this.msgType = 'error'
                        this.msgCreateOpen()
                    }
                })
            },
            showAddSample(index,row){
                this.row = row
                this.index = index
                this.sampleTableVisible = true
                this.exhibitionId = row.id
                this.imgData = row.sampleList
            },
            showComments(index,row){
                this.$prompt('请输入反馈', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    this.comments = value
                    this.giveComments(index,row)
                }).catch(() => {
                       
                });
            },
            giveComments(index,row){
                this.$axios.put(`/api/exhibition-feedback/evaluate/${row.id}?comments=${this.comments}`).then(res=>{
                    if(res.data.code == 200){
                        this.msgCreate = '操作成功'
                        this.msgType = 'success'
                        this.msgCreateOpen()
                        this.executeAndRank(index,this.detailRow)
                        this.detailTableVisible = false
                    }else{
                        this.msgCreate = res.data.message
                        this.msgType = 'error'
                        this.msgCreateOpen()
                    }
                })
            },
            showDetail(index,row){
                this.detailTableVisible = true
                this.detailData = this.rankData[index].feedbackDetailList
            },
            showGiveScore(index,row) {
                this.$prompt('请输入分数', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    this.score = value
                    this.giveScore(index,row)
                }).catch(() => {
                       
                });
            },
            giveScore(index,row){
                this.$axios.put(`/api/exhibition-feedback/mark/${row.id}/${this.score}`).then(res=>{
                    if(res.data.code == 200){
                        this.msgCreate = '操作成功'
                        this.msgType = 'success'
                        this.msgCreateOpen()
                        this.executeAndRank(index,this.detailRow)
                    }else{
                        this.msgCreate = res.data.message
                        this.msgType = 'error'
                        this.msgCreateOpen()
                    }
                })
            },
            executeAndRank(index,row){
                this.detailRow = row
                this.rankTableVisible = true
                this.rankRow = row
                this.rankIndex = index
                this.$axios.get(`/api/exhibition-feedback/list?exhibitionId=${row.id}&size=500&shopId=${this.rankShopId}`).then(res=>{
                    if(res.data.code == 200){
                        console.log(res.data.data.data)
                        this.rankData = res.data.data.data
                        this.rankTableLoading = false
                    }else{
                        this.msgCreate = res.data.message
                        this.msgType = 'error'
                        this.msgCreateOpen()
                        this.rankTableLoading = false
                    }
                })
            },
            refreshData(){
                this.getInfo()
            },
            showDelete(index,row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteData(index,row)
                }).catch(() => {
                        
                });
            },
            deleteData(index,row){
                this.$axios.delete(`/api/exhibition/delete/${row.id}`).then(res=>{
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
                    // this.form.fileKey += res.data + ','
                    this.sampleImg = res.data
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
            //----
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
                this.indexLoading = true
                this.$axios.get('/api/exhibition/list',{params:this.params}).then(res=>{
                    if(res.data.code == 200){
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
            createNew(){
                this.createTableVisible = true
            },
            submitCreateNew() {
                this.$axios.post(`/api/exhibition/save`,this.form).then((res)=>{
                    if(res.data.code == 200){
                        this.msgCreate = '操作成功'
                        this.msgType = 'success'
                        this.msgCreateOpen()
                        this.getInfo()
                        this.createTableVisible = false
                        this.form = {}
                        this.form.fileKey = []
                        this.upload = ''
                    }else{
                        this.msgCreate = res.data.message
                        this.msgType = 'error'
                        this.msgCreateOpen()
                    }
                })
            },
            addDetailInfo(){
                this.form.counts.push({})
            },
            closeCreateTable(){
                this.createTableVisible = false
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            GetShopIdFromChild(data){
                this.form.shopId = data.join(',')
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

