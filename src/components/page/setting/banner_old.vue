<template>
  <div>
    <div class="row">
      <label class="lb" style="width: 120px;">首页banner设置</label>
      <el-input v-model="banner" style="width: 120px;" placeholder="首页banner"></el-input>
      <el-button @click="saveSetting">保存</el-button>
    </div>
    <div class="row">
      <label class="lb" style="width: 120px;"></label>
      <div class="tip">填写资料库>banner的ID，以','分隔</div>
    </div>
    <div class="row">
      <label class="lb" style="width: 120px;">首页优惠券设置</label>
      <el-input v-model="coupon" style="width: 120px;" placeholder="首页优惠券"></el-input>
      <el-button @click="saveCoupon">保存</el-button>
    </div>
    <div class="row">
      <label class="lb" style="width: 120px;"></label>
      <div class="tip">填写营销>coupon的ID，以','分隔</div>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        banner: '',
        coupon: ''
      }
    },
    methods: {
      saveSetting () {
        this.openLoading()
        this.$store.dispatch('setSetting', {name: 'index_banner', value: this.banner}).then(() => {
          this.closeLoading()
        })
      },
      saveCoupon () {
        this.openLoading()
        this.$store.dispatch('setSetting', {name: 'index_coupon', value: this.coupon}).then(() => {
          this.closeLoading()
        })
      }
    },
    created () {
      this.$store.dispatch('getSetting', 'index_banner').then(res => {
        this.banner = res.data
      })
      this.$store.dispatch('getSetting', 'index_coupon').then(res => {
        this.coupon = res.data
      })
    }
  }
</script>
<style>
  .el-form-item__content {
    line-height: 1;
  }
  .A textarea {
    font-size: 12px;
  }
  .B textarea {
    font-size: 24px;
    font-weight: bold;
  }
  .IMG img {
    width: 100%;
  }
  .content-img {
    display: inline-block;
  }
  .content-img .el-upload--text {
    height: auto;
    width: auto;
    border: none;
    overflow: inherit;

  }
  .content-img .el-upload--text .el-button {
    padding: 12px 20px;
  }
</style>
<style scoped="scoped">
  .tip {
    width: auto;
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    color: #606266;
    background-color: hsla(0,87%,69%,.1);
    color: #f56c6c;
  }
  .doc-content {
    position: relative;
  }
  .content-delete {
    color: red;
    font-size: 36px;

    position: absolute;
    float: right;
    right: 0;
    top: 0;
  }
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 178px;
    display: block;
  }
</style>
