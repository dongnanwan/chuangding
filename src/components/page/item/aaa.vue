<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="params.firstId" @change="firstChange" placeholder="请选择">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="category in firstCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-show="showSecond" v-model="params.secondId" placeholder="请选择">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="category in secondCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-button @click="itemSync">数据同步</el-button>
      </el-form>
    </div>
    <el-table
      border
      :data="items"
      style="width: 100%"
     >
      <el-table-column fixed prop="id" label="ID" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="主图" sortable width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <img v-if="scope.row.images" :src="'https://img.chuangdingshop.com/' + scope.row.images[0]" :alt="scope.row.title" width="60" height="60" class="am-img-thumbnail">
          <p v-else>暂无图片</p>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="状态" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{statusNames[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="类目" width="120" show-overflow-tooltip>
        <div class="title" slot-scope="scope">{{scope.row.firstName}}/{{scope.row.secondName}}</div>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="标题" width="120" show-overflow-tooltip>
        <div class="title" :alt="scope.row.title" slot-scope="scope">{{scope.row.title}}</div>
      </el-table-column>
      <el-table-column label="副标题" width="120" show-overflow-tooltip>
        <div class="title" :alt="scope.row.subTitle" slot-scope="scope">{{scope.row.subTitle}}</div>
      </el-table-column>
      <el-table-column prop="code" label="编码" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="year" label="年份" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="season" label="季节" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="颜色" width="120" show-overflow-tooltip>
        <div class="title" slot-scope="scope">{{joinToString(scope.row.colors) }}</div>
      </el-table-column>
      <el-table-column label="尺码" width="120" show-overflow-tooltip>
        <div class="title" slot-scope="scope">{{joinToString(scope.row.sizes)}}</div>
      </el-table-column>
      <el-table-column label="吊牌价" width="120" show-overflow-tooltip>
        <div class="title" slot-scope="scope">{{scope.row.marketPrice}}</div>
      </el-table-column>
      <el-table-column label="价格" width="120" show-overflow-tooltip>
        <div class="title" slot-scope="scope">{{scope.row.lowPrice}}~{{scope.row.highPrice}}</div>
      </el-table-column>
      <el-table-column prop="totalStock" label="库存" width="60" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="销量" width="60" show-overflow-tooltip>
        <div class="title" slot-scope="scope">{{scope.row.saleNum}}</div>
      </el-table-column>
      <el-table-column label="评价" width="60" show-overflow-tooltip>
        <div class="title" slot-scope="scope">{{scope.row.commentNum}}</div>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link v-show="'marketing' === sel" :to="'/marketing/edit?item_id=' + scope.row.id">
            <el-button
              type="text"
              size="small">
              选择
            </el-button>
          </router-link>
          <!-- <router-link v-show="scope.row.status === 'IN_STOCK'" :to="'/item_edit?id=' + scope.row.id">
            <el-button
              type="danger"
              size="small">
              编辑
            </el-button>
          </router-link> -->
          <el-button plain="" type="primary" @click="showEditDialogue(scope.$index, scope.row)">编辑</el-button>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="`online_${scope.$index}`" >上架</el-dropdown-item>
              <el-dropdown-item :command="`offline_${scope.$index}`" >下架</el-dropdown-item>
              <el-dropdown-item :command="`relevance_${scope.$index}`" >搭配</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="params.page"
      :page-sizes="[5, 10, 20, 50, 100]"
      :page-size="params.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="设置搭配商品ID" :visible.sync="dialogFormVisible">
      <div class="row">
        <label class="lb" style="width: 120px;">搭配商品ID</label>
        <el-input v-model="relevanceIds" style="width: 250px;" autocomplete="off"></el-input>
      </div>
      <div class="row">
        <label class="lb" style="width: 120px;"></label>
        <div class="tip">搭配商品的ID，以','分隔</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRelevance">取 消</el-button>
        <el-button type="primary" @click="saveRelevance">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改弹出框 -->
     <el-dialog  :visible.sync="updateTableVisible" class="detailTable"  fullscreen   v-loading="updateDialogueLoading" @close='updateTableClose()'>
        
        <el-form label-position="right" label-width="80px" :inline="true">

            <el-card shadow="hover" style="">
                <div slot="header" class="clearfix" style="height:40px"> 
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
                <div slot="header" class="clearfix" style="height:40px"> 
                   <h2>商品信息</h2>
                </div>
                 
               <el-form-item >
                  <el-form-item  label="标题"><el-input  v-model="updateForm.title"></el-input></el-form-item>
                  <el-form-item  label="副标题"><el-input  v-model="updateForm.subTitle"></el-input></el-form-item>
                  <el-form-item  label="市场价"><el-input  v-model="updateForm.marketPrice"></el-input></el-form-item>
                 
              </el-form-item> 


            </el-card>

            <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:40px"> 
                   <h2>商品属性</h2>
                </div>
                
                
                <el-form-item  label="属性详情">
                  <el-input :value="propertyString" disabled=""></el-input>
                  <el-button @click="changeProperty()">修改属性</el-button>
                </el-form-item>



                <ul v-show='showPropertyChangeForm'>
                  <li v-for="(property,index) in itemsProperties" :key="property.id">
                     <el-form-item :label="property.name">
                        <el-select v-model="testarr[index]"  placeholder="请选择" @change='selectChange(testarr[index].nameValue)'>
                          <el-option
                            v-for="item in property.values"
                            :label="item.value"
                            :value="{keyId:property.id,keyValue:property.name,nameId:item.id,nameValue:item.value}"
                            :key="item.id"
                            >
                          </el-option>
                        </el-select> 
                     </el-form-item> 
                  </li>
                </ul>
            </el-card>

           

            <el-card shadow="hover" style="margin-top:10px">
                  <div slot="header" class="clearfix" style="height:40px">
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
                            <img v-else-if="scope.row.type == 'M'" :src="'https://img.chuangdingshop.com/' + scope.row.content" :alt="scope.row.title" width="60" height="60" class="am-img-thumbnail">
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
                <div slot="header" class="clearfix" style="height:40px"> 
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
                      
                      <el-table-column prop="price" label="销售价" >
                           <template slot-scope="scope">
                              <el-input v-model="scope.row.price" placeholder="销售价"></el-input>
                          </template>  
                      </el-table-column>
                     
                  </el-table>
                </div>
            </el-card>

            <!-- <el-form-item  label="码段组"><el-input v-model="updateForm.brandName"></el-input></el-form-item> -->
        </el-form>

        <el-button @click="submitUpdate()" type="primary">保存修改</el-button>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showPropertyChangeForm:false,
      propertyString:'',
      propertySelectedArr:[],
      testarr:[],
      rowstyle:{height:'80px'},
      contentWordsInput:'',
      contentList: [],
      fileListContent:[],
      fileList: [],
      myHeaders: {Authorization:''},
      dialogImageUrl: '',
      dialogVisible: false,
      updateDialogueLoading:true,
      dialogFormVisible: false,
      selectedItem: null,
      relevanceIds: '',
      secondCategories: [],
      sel: '',
      statusNames: {
        'IN_STOCK': '下架',
        'ON_SALE': '在售'
      },
      updateTableVisible:false,
      updateForm:{},
      skuTableData:[],
      imgUrlList:[],
      itemsProperties:[]
    }
  },
  methods: {
    changeProperty(){
      this.showPropertyChangeForm = this.showPropertyChangeForm
    },
    selectChange(a,b){
      this.$forceUpdate()
      // this.updateForm.property = {}
      this.updateForm.property.propertyIds = []
      this.updateForm.property.propertyValues = []
      // console.log(a)
      let idString = ''
      let nameString = ''

      // console.log(this.testarr)
      
      this.testarr.forEach((val,ind)=>{
         this.updateForm.property.propertyIds.push(val.keyId+':'+val.nameId)
         this.updateForm.property.propertyValues.push(val.keyValue+':'+val.nameValue)
        // idString = idString+val.keyId+':'+val.nameId+';'
        // nameString =  nameString+val.keyValue+':'+val.nameValue+';'
      })
      // this.updateForm.propertyIds = idString.replace(/(;$)/g, "")
      // this.updateForm.propertyValues = nameString.replace(/(;$)/g, "")
      // console.log(idString, nameString)
      // console.log(this.propertySelectedArr)
      console.log(this.updateForm)
    },
      addContentWords(){
          this.contentList.push({content:this.contentWordsInput,type:'A'})
          // console.log(this.updateForm.contentList)
          if(this.updateForm.contentList == undefined){
            this.updateForm.contentList = []
          }
          this.updateForm.contentList = this.contentList
           console.log(this.updateForm.contentList)
      },
      deleteContentWords(index,row){
          this.contentList.splice(index,1)
          this.updateForm.contentList = this.contentList
          console.log(this.updateForm.contentList)
      },
      imgUploadSuccess(file){
          this.imgUrlList.push(file.data)
          this.updateForm.images =  this.imgUrlList
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
      submitUpdate(){
          // console.log(this.updateForm.skuList)
          let rst = this.updateForm.skuList.map((val,ind)=>{
              return {price:parseInt(val.price),skuId:val.id}
          })
          this.updateForm.skuBodies = rst
          this.$axios.post(`/api/item`,this.updateForm).then(res=>{
              console.log(res)
          })
      },
      showEditDialogue(index,row){
          this.updateTableVisible = true
          this.$axios.get(`/api/item/${row.id}`).then(res=>{
              this.updateForm = res.data.data
              this.skuTableData = res.data.data.skuList
              if(res.data.data.contentList != undefined){this.contentList = res.data.data.contentList}
              console.log(res.data.data)
              this.imgUrlList = res.data.data.images
              if(res.data.data.images){
                res.data.data.images.forEach((val,ind)=>{
                  this.fileList.push({url:'https://img.chuangdingshop.com/'+val,name:val})
                })
              }
              this.propertyString = this.updateForm.property.propertyValues.join(',')
          })
      },
    updateTableClose(){
      //弹出框关闭后把图片列表清空
      this.fileList = []
    },
    joinToString (arr) {
      if (arr !== undefined) {
        return arr.join(',')
      } else {
        return ''
      }
    },
    firstChange (val) {
      this.firstCategories.forEach(c => {
        if (c.id === val) {
          this.secondCategories = c.categories
        }
      })
    },
    handleCommand (command) {
      let params = command.split('_')
      let row = this.items[params[1]]
      if (params[0] === 'delete') {
        this.deleteRow(params[1], row)
      } else if (params[0] === 'online') {
        this.online(row)
      } else if (params[0] === 'offline') {
        this.offline(row)
      } else if (params[0] === 'relevance') {
        this.relevance(row)
      }
    },
    cancelRelevance () {
      this.selectedItem = false
      this.relevanceIds = ''
      this.dialogFormVisible = false
    },
    saveRelevance () {
      this.$store.dispatch('ITEM_Relevance_SAVE', {
        id: this.selectedItem.id,
        relevanceIds: this.relevanceIds
      }).then(() => {
        this.cancelRelevance()
      })
    },
    relevance (row) {
      this.selectedItem = row
      this.openLoading()
      this.$store.dispatch('ITEM_GET', row.id).then(item => {
        if (item.property && item.property.relevanceIds) {
          this.relevanceIds = item.property.relevanceIds.join(',')
        }
        this.dialogFormVisible = true
        this.closeLoading()
      })
    },
    online (row) {
      this.$store.dispatch('ITEM_ONLINE', row.id).then(res => {
        if (res.code === 200) {
          row.status = 'ON_SALE'
        }
      })
    },
    offline (row) {
      this.$store.dispatch('ITEM_OFFLINE', row.id).then(res => {
        if (res.code === 200) {
          row.status = 'IN_STOCK'
        }
      })
    },
    deleteRow (index, row) {
      this.$confirm('确认要删除类目', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ITEM_DELETE', row.id).then(res => {
          if (res.code === 200) {
            this.items.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onSubmit () {
      if (this.params.cid === 0) {
        this.$message({
          showClose: true,
          message: '请选择类别',
          type: 'warning'
        })
        return
      }
      this.openLoading('加载中...')
      // this.$store.dispatch('ITEM_PAGE_CHG', 1).then((res) => {
      //
      // })
      this.$store.dispatch('ITEM_LIST').then((res) => {
        this.closeLoading()
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('ITEM_SIZE_CHG', val)
      this.$store.dispatch('ITEM_LIST')
    },
    handleCurrentChange (val) {
      this.$store.dispatch('ITEM_PAGE_CHG', val)
      this.$store.dispatch('ITEM_LIST')
    },
    itemSync () {
      this.$store.dispatch('ALL_SYNC').then((res) => {
        location.reload()
      })
    }
    
  },
  computed: {
    showSecond () {
      return this.secondCategories.length > 0
    },
    total () {
      return this.$store.getters.item.total
    },
    params () {
      return this.$store.getters.item.params
    },
    items () {
      return this.$store.getters.item.list
    },
    firstCategories () {
      return this.$store.getters.category.firstCategories
    }
  },
  created () {
    if (this.$route.query.sel) {
      this.sel = this.$route.query.sel
    }
    if (this.$store.getters.category.firstCategories.length === 0) {
      this.$store.dispatch('CATEGORY_FIRST_LIST')
    }
  },
  mounted () {
    this.$axios.get(`/api/item-property/base-properties`).then(res=>{
        this.itemsProperties = res.data.data
        // this.itemsProperties.forEach((val,ind)=>{
        //   this.testarr.push({keyId:'',keyValue:'',nameId:'',nameValue:''})
        // })
        console.log(res.data.data)
    })

    this.onSubmit()
    this.myHeaders.Authorization = 'Authorization'+' '+window.sessionStorage['token']
  }
}
</script>

<style scoped>
  .title {
    height: 16px;
    line-height: 16px;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  h2{
      padding: 10px;
  }
  .todo-item {
      font-size: 14px;
  }

  .todo-item-del {
      text-decoration: line-through;
      color: #999;
  }

 
</style>
