<template>
    <div>
        <div style="padding-bottom:8px">
            <el-button type="primary" @click="createNew()" plain icon="el-icon-plus">创建</el-button>
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        </div>

        <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->

        <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row  v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column show-overflow-tooltip min-width="200" prop="title" label="标题"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="400" prop="content" label="内容"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="100" prop="platformType" label="平台类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.platformType == 'MANAGER_APP'">店长APP</span> 
                    <span v-else-if="scope.row.platformType == 'MINI_PROGRAM'">小程序</span>
                    <span v-else>{{scope.row.platformType}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="100" prop="contentType" label="内容类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.contentType == 'LONG_WX_UTIL'">长微信工具</span> 
                    <span v-else-if="scope.row.contentType == 'QA_FEEDBACK'">问答反馈</span>
                    <span v-else-if="scope.row.contentType == 'VERSION_UPDATE'">版本更新</span>
                    <span v-else>{{scope.row.contentType}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="80" prop="handProject" label="操作">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" plain="" @click="showEdit(scope.$index, scope.row)">修改</el-button> -->
                    <el-button type="primary" plain="" @click="showDeleteOne(scope.$index, scope.row)">删除</el-button>
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

        <el-dialog :visible.sync="createTableVisible" fullscreen="">

            <div class="container">
                <el-input placeholder="标题" v-model="addForm.title" style="width:215px;margin-bottom:10px"></el-input>
                <br>
                <el-select v-model="addForm.platformType" placeholder="平台类型" style="margin-bottom:10px">
                    <el-option value='MANAGER_APP' label='店长APP'></el-option>
                    <el-option value='MINI_PROGRAM' label='小程序'></el-option>
                </el-select>
                <br>
                <el-select v-model="addForm.contentType" placeholder="内容类型" style="margin-bottom:10px">
                    <!-- <el-option value='LONG_WX_UTIL' label='长微信工具'></el-option> -->
                    <el-option value='QA_FEEDBACK' label='问答反馈'></el-option>
                    <el-option value='VERSION_UPDATE' label='版本更新'></el-option>
                </el-select>
                <br>
                <!-- <div class="plugins-tips">
                    Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。
                    访问地址：<a href="https://github.com/surmon-china/vue-quill-editor" target="_blank">vue-quill-editor</a>
                </div> -->
                <quill-editor ref="myTextEditor" v-model="addForm.content" :options="editorOption"></quill-editor>
                <el-button class="editor-btn" type="primary" @click="submitCreate">提交</el-button>
            </div>

        </el-dialog>
        
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
export default {
    name: 'editor',
    data: function(){
        return {
            addForm:{},
            content: '',
            editorOption: {
                placeholder: 'Hello World'
            },
            createTableVisible:false,
            items:[],
            total:0,
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1
            },
            createTableVisible: false,
            indexLoading:true,
            msgCreate:'msg',
            msgType:'success'
        }
    },
    components: {
        quillEditor
    },
    methods: {
        showEdit(index,row){
            console.log()
        },
        showDeleteOne(index,row){
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.submitDelete(index,row)
            }).catch(() => {
                       
            }); 
        },
        submitDelete(index,row){
            this.$axios.delete(`/api/memo/delete/${row.id}`).then((res)=>{
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
        onEditorChange({ editor, html, text }) {
            this.content = html;
        },
        submitCreate(){
            this.$axios.post(`/api/memo/save`,this.addForm).then((res)=>{
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
            this.$axios.get('/api/memo/list',{params:this.params}).then(res=>{
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
            this.$axios.post(`/api/addWorkHandOver`,this.form).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    setTimeout(function(){
                    this.createTableVisible = false
                    },2000)
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
    }
}
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>