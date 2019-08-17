<template>
  <div>
    <div class="row">
      <label class="lb">类目</label>
      <el-cascader @change="sschange"
        :value="[item.firstId, item.secondId]"
        placeholder="搜索"
        :options="categories"
        filterable>
      </el-cascader>
      <label class="lb">系列</label>
      <el-select v-model="item.seriesId" placeholder="请选择">
        <el-option label="请选择" :value="0"></el-option>
        <el-option
          v-for="series in seriesList"
          :key="series.id"
          :label="series.name"
          :value="series.id">
        </el-option>
      </el-select>
    </div>
    <div class="row">
      <label class="lb">标题</label>
      <el-input style="width: 485px;" v-model="item.title" maxlength="16"></el-input>
    </div>
    <div class="row">
      <label class="lb">副标题</label>
      <el-input style="width: 485px;" v-model="item.subTitle" maxlength="32"></el-input>
    </div>
    <div class="row">
      <label class="lb">品牌</label>
      <label class="lb">{{item.brandName}}</label>
    </div>
    <div class="row">
      <label class="lb">年份</label>
      <label class="lb">{{item.year}}</label>
    </div>
    <div class="row">
      <label class="lb">季节</label>
      <label class="lb">{{item.season}}</label>
    </div>
    <div class="row">
      <label class="lb">图片</label>
      <div class="images">
        <el-upload
          ref="uploadImages"
          action="/api/upload"
          :limit="5"
          :file-list="fileList"
          list-type="picture-card"
          :on-success="handleSuccess"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
    </div>
    <div class="row">
      <label class="lb">编码</label>
      <label class="lb">{{item.code}}</label>
    </div>
    <div class="row">
      <label class="lb">吊牌价</label>
      <el-input-number style="width: 485px;" v-model="item.marketPrice" :precision="2" :step="1" :max="100000"></el-input-number>
    </div>

    <div class="row" style="margin-top: 10px">
      <label class="lb">规格</label>
      <el-table
        border
        :data="skuList"
        style="width:700px;margin-left:92px;margin-top:-30px;display: inline-block">
        <el-table-column
          prop="color"
          label="颜色"
          width="120">
        </el-table-column>
        <el-table-column
          prop="size"
          label="尺码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="volume"
          label="体积"
          width="120">
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="stock"
          label="库存"
          width="120">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
      </el-table>
    </div>
    <div class="row">
      <label class="lb">属性</label>
      <div style="width: 500px; display: inline-block;margin-top: 7px">
        <span class="property" v-for="prop in baseProperties" :key="prop.id">
          <label class="p_lb">{{prop.name}}:</label>
          <el-select class="p_input" v-model="prop.selectId" placeholder="请选择">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="val in prop.values"
              :key="val.id"
              :label="val.value"
              :value="val.id">
            </el-option>
          </el-select>
        </span>
      </div>
    </div>
    <div class="row">
      <label class="lb">详情</label>
      <div  style="width: 375px; display: inline-block;overflow: hidden;margin-top: 15px">
        <div class="content-list">
          <template v-for="(content, index) in item.contentList">
            <div :key="index" class="content-wrap">
              <i v-if="content.type === 'A'" class="el-icon-edit" @click="itemContentTextEdit(index)"></i>
              <i class="el-icon-delete" @click="itemContentDelete(index)"></i>
              <img v-if="content.type === 'M'" class="m" :src="'/file' + content.content"></img>
              <div v-else class="a">{{content.content}}</div>
            </div>
          </template>
        </div>
        <el-button-group>
          <el-button type="primary" size="mini" @click="textInputVisible=true;" icon="el-icon-edit"></el-button>
          <el-upload
            class="btn-content-img"
            action="/api/upload"
            accept="JPG, JPEG, PNG"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess">
            <el-button type="primary" slot="trigger" size="mini" icon="el-icon-picture"></el-button>
          </el-upload>
        </el-button-group>
      </div>
    </div>
    <div class="row">
      <label class="lb"></label>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onClose">取消</el-button>
    </div>
    <el-dialog title="文本" :visible.sync="textInputVisible">
      <el-form>
        <el-form-item>
          <el-input type="textarea" v-model="content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="textInputVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTextInputConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="textEditVisible">
      <el-form>
        <el-form-item>
          <el-input type="textarea" v-model="editContent.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="textEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTextEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      textInputVisible: false,
      textEditVisible: false,
      editContent: {content: ''},
      colorVisible: false,
      colorValue: '',
      sizeVisible: false,
      sizeValue: '',
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      content: '',
      specSkus: {},
      baseProperties: [],
      skuV: 0,
      skuW: 0,
      skuStock: 0,
      skuPrice: 0
    }
  },
  watch: {
    skuV (newV, oldV) {
      if (this.skuList !== undefined) {
        this.skuList.forEach(sku => {
          sku.volume = newV
        })
      }
    },
    skuW (newV, oldV) {
      if (this.skuList !== undefined) {
        this.skuList.forEach(sku => {
          sku.weight = newV
        })
      }
    },
    skuStock (newV, oldV) {
      if (this.skuList !== undefined) {
        this.skuList.forEach(sku => {
          sku.stock = newV
        })
      }
    },
    skuPrice (newV, oldV) {
      if (this.skuList !== undefined) {
        this.skuList.forEach(sku => {
          sku.price = newV
        })
      }
    }
  },
  computed: {
    item () {
      return this.$store.getters.item.temp
    },
    categories () {
      let list = []
      if (this.$store.getters.category.firstCategories !== undefined) {
        this.$store.getters.category.firstCategories.forEach(cate => {
          let option = {
            value: cate.id,
            label: cate.name,
            children: []
          }
          list.push(option)
          if (cate.categories) {
            cate.categories.forEach(e => {
              option.children.push({
                value: e.id,
                label: e.name
              })
            })
          }
        })
      }
      return list
    },
    seriesList () {
      return this.$store.getters.series.all
    },
    skuList () {
      return this.item.skuList
    }
  },
  methods: {
    itemContentDelete (index) {
      this.item.contentList.splice(index, 1)
    },
    itemContentTextEdit (index) {
      this.editContent = this.item.contentList[index]
      this.textEditVisible = true
    },
    handleColorClose (color) {
      this.item.colors.splice(this.item.colors.indexOf(color), 1)
    },
    showColorInput () {
      this.colorVisible = true
      this.$nextTick(_ => {
        this.$refs.saveColorInput.$refs.input.focus()
      })
    },
    handleColorInputConfirm () {
      let inputValue = this.colorValue
      if (inputValue) {
        this.item.colors.push(inputValue)
      }
      this.colorVisible = false
      this.colorValue = ''
    },
    handleSizeClose (size) {
      this.item.sizes.splice(this.item.sizes.indexOf(size), 1)
    },
    showSizeInput () {
      this.sizeVisible = true
      this.$nextTick(_ => {
        this.$refs.saveSizeInput.$refs.input.focus()
      })
    },
    handleSizeInputConfirm () {
      let inputValue = this.sizeValue
      if (inputValue) {
        this.item.sizes.push(inputValue)
      }
      this.sizeVisible = false
      this.sizeValue = ''
    },
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess (response, file, fileList) {
      let uploadOK = true
      let images = []
      fileList.forEach(f => {
        if (!f.response) {
          uploadOK = false
        } else {
          images.push(f.response.data)
        }
      })
      if (uploadOK) {
        this.item.images = images
        this.setPropertyIds()
        this.saveItem()
      }
    },
    handleAvatarSuccess (res, file) {
      if (res.code === 200) {
        this.item.contentList.push({
          type: 'M',
          content: res.data
        })
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG|PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleTextInputConfirm () {
      let textValue = this.content
      if (textValue) {
        this.item.contentList.push({
          type: 'A',
          content: textValue
        })
      }
      this.textInputVisible = false
      this.content = ''
    },
    handleTextEditConfirm () {
      this.textEditVisible = false
      this.editContent = {content: ''}
    },
    sschange (ids) {
      this.item.firstId = ids[0]
      this.item.secondId = ids[1]
    },
    onSubmit () {
      let uploadOK = true
      let images = []
      this.$refs.uploadImages.uploadFiles.forEach(f => {
        if (!f.response) {
          uploadOK = false
        } else {
          images.push(f.response.data)
        }
      })
      if (uploadOK) {
        this.item.images = images
        this.setPropertyIds()
        this.saveItem()
      } else {
        if (this.checks()) {
          this.$refs.uploadImages.submit()
        } else {
          return false
        }
      }
    },
    setPropertyIds () {
      let ids = []
      this.baseProperties.forEach(prop => {
        if (prop.selectId > 0) {
          ids.push(prop.id + ':' + prop.selectId)
        }
      })
      this.item.property = {
        propertyIds: ids,
        propertyValues: []
      }
    },
    saveItem () {
      this.$store.dispatch('ITEM_POST').then(res => {
        this.$message('保存成功')
        this.removeView('/item')
      })
    },
    checks () {
      if (this.item.secondId === '' || this.item.secondId === 0) {
        this.$message({
          showClose: true,
          message: '请选择类目',
          type: 'warning'
        })
        return false
      }
      if (this.item.seriesId === 0) {
        this.$message({
          showClose: true,
          message: '请选择系列',
          type: 'warning'
        })
        return false
      }
      if (this.item.title.length <= 0 || this.item.title.length > 16) {
        this.$message({
          showClose: true,
          message: '请输入16字以内的标题',
          type: 'warning'
        })
        return false
      }
      if (this.item.subTitle.length <= 0 || this.item.subTitle.length > 16) {
        this.$message({
          showClose: true,
          message: '请输入32字以内的标题',
          type: 'warning'
        })
        return false
      }
      if (this.item.colors.length === 0) {
        this.$message({
          showClose: true,
          message: '请输入颜色',
          type: 'warning'
        })
        return false
      }
      if (this.item.sizes.length === 0) {
        this.$message({
          showClose: true,
          message: '请输入尺码',
          type: 'warning'
        })
        return false
      }
      return true
    },
    onClose () {
      this.removeView()
    }
  },
  created () {
    if (this.$store.getters.category.firstCategories.length === 0) {
      this.$store.dispatch('CATEGORY_FIRST_LIST')
    }
    if (this.$store.getters.series.all.length === 0) {
      this.$store.dispatch('SERIES_ALL')
    }
    this.$store.dispatch('listBaseProperties').then(res => {
      res.data.forEach(prop => {
        this.baseProperties.push({
          id: prop.id,
          name: prop.name,
          values: prop.values,
          selectId: 0
        })
      })
      if (this.$route.query.id) {
        if (parseInt(this.$route.query.id) !== this.item.id) {
          this.$store.dispatch('ITEM_EDIT', {id: this.$route.query.id}).then(item => {
            if (item.status === 'ON_SALE') {
              this.$message({
                showClose: true,
                message: '商品下架再编辑',
                type: 'warning'
              })
              this.onClose()
            }
            if (item.images !== undefined) {
              item.images.forEach(img => {
                this.fileList.push({
                  name: img,
                  url: '/file' + img,
                  response: {code: 200, data: img, ok: true}
                })
              })
            }
            if (item.property) {
              if (item.property.propertyIds) {
                item.property.propertyIds.forEach(e => {
                  var ss = e.split(':')
                  this.baseProperties.forEach(p => {
                    if (p.id === parseInt(ss[0])) {
                      p.selectId = parseInt(ss[1])
                    }
                  })
                })
              }
            }
          })
        }
      } else {
        this.$store.dispatch('ITEM_TEMP_CLEAR')
      }
    })
  }
}
</script>



<style lang="scss">
.images {
  display: inline-block;
  width: 525px;
  height: 100px;
  overflow: hidden;
}
.property .p_lb {
  text-align: right;
  font-size: 14px;
  color: #606266;
  line-height: 24px;
  padding: 0 5px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
}
.sku-list .sku-t {
  text-align: right;
  font-size: 14px;
  color: #606266;
  line-height: 24px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
}
.sku-list .sku-t2 {
  text-align: right;
  font-size: 14px;
  color: #606266;
  padding: 0 0 0 12px;
  line-height: 24px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
}
.sku-list .sku-n {
  width: 68px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 5px;
}
.content-wrap {
  position: relative;
}
.content-wrap .el-icon-edit, .content-wrap .el-icon-delete {
  position: absolute;
  width: 16px;
  height: 16px;
  font-size: 16px;
  top: 2;
  right: 0;
  color: red;
  cursor: pointer;
}
.content-wrap .el-icon-edit {
  right: 20px;
}
.content-list {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  font-size: 0;
  min-height: 100px;
  line-height: 1;
  outline: 0;
  padding: 0;
  width: 100%;
}
.content-list .m {
  width: 100%;
  border: 0;
  line-height: 1;
}
.content-list .a {
  width: 100%;
  border: 0;
  font-size: 16px;
  min-height: 16px;
  line-height: 1.2;
}



.images .el-upload--picture-card, .images .el-upload-list--picture-card .el-upload-list__item-thumbnail,
.images .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.images .el-upload-list--picture-card .el-upload-list__item-status-label i {
  position: absolute;
  right: -5px;
  top: -3px;
  width: 40px;
  height: 24px;
}
.images .el-upload-list--picture-card .el-upload-list__item {
  margin: 0 5px 0 0;
}

.property .p_input .el-input__inner{
  width: 100px;
  height: 24px;
  margin-right: 5px;
}
.property .p_input .el-input__icon{
  line-height: 24px;
}

.btn-content-img {
  width: 44px;
  height: 28px;
  border: none;
  display: inline-block;
}
.btn-content-img .el-upload--text {
  width: 44px;
  height: 28px;
  border: none;
  border-radius: 0;
}
.btn-content-img .el-button--mini {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag, .input-new-tag {
  margin-left: 0;
}
</style>
