<template>
  <el-form label-width="100px">
    <el-form-item label="上级类目" v-if="category.id == 0 || category.pid > 0">
      <el-select v-model="category.pid" placeholder="请选择">
        <el-option label="请选择" :value="0"></el-option>
        <el-option
          v-for="category in firstCategories"
          :key="category.id"
          :label="category.name"
          :value="category.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model="category.name"></el-input>
    </el-form-item>
    <el-form-item label="图片">
      <el-upload
        class="avatar-uploader"
        action="/api/upload"
        :show-file-list="false"
        accept="JPG, JPEG, PNG"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :headers="myHeaders"
        >
        <img v-if="imageUrl" :src="'https://img.chuangdingshop.com/' + imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onClose">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      imageUrl: '',
      myHeaders: {Authorization:''}
    }
  },
  computed: {
    category () {
      return this.$store.getters.category.temp
    },
    firstCategories () {
      return this.$store.getters.category.firstCategories
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      if (res.code === 200) {
        this.imageUrl = res.data
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG|PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onSubmit () {
      if (this.category.name === '') {
        this.$message({
          showClose: true,
          message: '名称不能为空',
          type: 'warning'
        })
        return
      }
      if (this.imageUrl) {
        this.category.icoUrl = this.imageUrl
      }
      this.$store.dispatch('CATEGORY_POST').then((res) => {
        this.$message.success('提交成功！')
        // this.removeView()
      })
    },
    onClose () {
      // this.removeView()
    }
  },
  created () {
    if (this.$store.getters.category.firstCategories.length === 0) {
      this.$store.dispatch('CATEGORY_FIRST_LIST').then(res => {
      })
    }
    if (this.$route.query.id) {
      if (parseInt(this.$route.query.id) !== this.category.id) {
        this.$store.dispatch('CATEGORY_EDIT', {id: this.$route.params.id})
      }
    } else {
      this.$store.dispatch('CATEGORY_TEMP_CLEAR')
    }

    this.myHeaders.Authorization = 'Authorization'+' '+window.sessionStorage['token']
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: auto;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: auto;
  height: 178px;
  display: block;
}
.editor-content{
  margin-top: 20px;
}
</style>
