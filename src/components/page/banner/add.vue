<template>
  <el-form label-width="100px">

    

    <div>
      <img src="" alt="">
    </div>
    <el-form-item label="标题">
      <el-input v-model="banner.title"></el-input>
    </el-form-item>
    <el-form-item label="链接">
      <el-input v-model="banner.url"></el-input>
    </el-form-item>
    
    <el-form-item label="图片">
      <el-upload
        class="upload-demo"
        ref="uploadBanner"
        action="/api/upload"
        :limit="1"
        :file-list="fileList"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload"
        :on-success="handleSuccess"
        :headers="myHeaders"
        
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
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
      fileList: [],
      myHeaders: {Authorization:''}
    }
  },
  computed: {
    banner () {
      return this.$store.getters.banner.temp
    }
  },
  methods: {
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleSuccess (response, file, fileList) {
      this.banner.img = response.data
      this.saveBanner()
    },
    onSubmit () {
      if (this.banner.title === '') {
        this.$message({
          showClose: true,
          message: '标题不能为空',
          type: 'warning'
        })
        return
      }
      if (this.banner.url === '') {
        this.$message({
          showClose: true,
          message: '链接不能为空',
          type: 'warning'
        })
        return
      }
      let uploadOK = true
      this.$refs.uploadBanner.uploadFiles.forEach(f => {
        if (!f.response) {
          uploadOK = false
        } else {
          this.banner.img = f.response.data
        }
      })
      if (uploadOK) {
        this.saveBanner()
      } else {
        this.$refs.uploadBanner.submit()
      }
    },
    saveBanner () {
      this.$store.dispatch('BANNER_POST').then((res) => {
        this.$message.success('提交成功！')
        // this.removeView()
      })
    },
    onClose () {
      // this.removeView()
    }
  },
  created () {
    if (this.$route.query.id) {
      if (parseInt(this.$route.query.id) !== this.banner.id) {
        this.$store.dispatch('BANNER_EDIT', {id: this.$route.query.id}).then((res) => {
          this.fileList.push({
            name: res.img,
            url: '/file' + res.img
          })
        })
      }
    } else {
      this.$store.dispatch('BANNER_CLEAR')
    }

    this.myHeaders.Authorization = 'Authorization'+' '+window.sessionStorage['token']

  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
