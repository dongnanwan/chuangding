<template>
  <el-form label-width="100px">
    <el-form-item label="名称">
      <el-input v-model="series.name"></el-input>
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
    series () {
      return this.$store.getters.series.temp
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
      if (this.series.name === '') {
        this.$message({
          showClose: true,
          message: '名称不能为空',
          type: 'warning'
        })
        return
      }
      if (this.imageUrl) {
        this.series.icoUrl = this.imageUrl
      }
      this.$store.dispatch('SERIES_POST').then((res) => {
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
      this.$store.dispatch('SERIES_EDIT', {id: this.$route.query.id})
    } else {
      this.$store.dispatch('SERIES_TEMP_CLEAR')
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
