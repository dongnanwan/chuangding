<template>
  <div>
    <div class="row">
      <label class="lb" style="width: 120px;">类型</label>
      <div class="row-cell" style="width: auto; line-height: 40px; vertical-align: middle;">
        <el-radio-group v-model="coupon.type">
          <el-radio :label="'PERCENT'">打折</el-radio>
          <el-radio :label="'DIRECT'">满减</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="row" v-if="coupon.type === 'PERCENT'">
      <label class="lb" style="width: 120px;">折扣</label>
      <div class="row-cell" style="width: auto; line-height: 40px; vertical-align: middle;">
        <el-input-number v-model="coupon.amount" size="mini" :precision="1" :step="0.1" :max="10"></el-input-number>
      </div>
    </div>
    <div class="row" v-if="coupon.type === 'DIRECT'">
      <label class="lb" style="width: 120px;">面额</label>
      <div class="row-cell" style="width: auto; line-height: 40px; vertical-align: middle;">
        <el-radio-group v-model="coupon.amount">
          <el-radio :label="3">3元</el-radio>
          <el-radio :label="5">5元</el-radio>
          <el-radio :label="10">10元</el-radio>
          <el-radio :label="20">20元</el-radio>
        </el-radio-group>
        其它<el-input-number v-model="coupon.amount" :min="1" size="mini" :max="1000"></el-input-number>
      </div>
    </div>
    <div class="row">
      <label class="lb" style="width: 120px;">使用条件</label>
      <div class="row-cell" style="width: auto; line-height: 40px; vertical-align: middle;">
        <el-radio-group v-model="coupon.conditions">
          <el-radio :label="0">0元</el-radio>
          <el-radio :label="10">10元</el-radio>
          <el-radio :label="20">20元</el-radio>
        </el-radio-group>
        其它<el-input-number v-model="coupon.conditions" :min="0" size="mini" :max="100000"></el-input-number>
      </div>
    </div>
    <div class="row">
      <label class="lb" style="width: 120px;">时间</label>
      <el-date-picker
        v-model="dateValues"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="row">
      <label class="lb" style="width: 120px;">发行量</label>
      <div class="row-cell" style="width: auto; line-height: 40px; vertical-align: middle;">
        <el-input-number v-model="coupon.planNum" :min="0" size="mini" :max="100000"></el-input-number>
      </div>
    </div>
    <div class="row">
      <el-button @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dateValues: []
    }
  },
  computed: {
    coupon () {
      return this.$store.getters.coupon.temp
    }
  },
  methods: {
    onSubmit () {
      console.log(this.dateValues)
      if (this.coupon.type === '') {
        this.$message({
          showClose: true,
          message: '请选择类型',
          type: 'warning'
        })
        return
      }
      if (this.coupon.amount === 0) {
        this.$message({
          showClose: true,
          message: '请填写面额或者折扣',
          type: 'warning'
        })
        return
      }
      if (this.dateValues.length !== 2) {
        this.$message({
          showClose: true,
          message: '请选择时间',
          type: 'warning'
        })
        return
      }
      this.coupon.startTime = this.dateValues[0]
      this.coupon.endTime = this.dateValues[1]
      this.$store.dispatch('Coupon_POST').then((res) => {
        this.$message.success('提交成功！')
        this.removeView()
      })
    },
    onClose () {
      this.removeView()
    }
  },
  created () {
    if (this.$route.params.id) {
      this.$store.dispatch('SERIES_EDIT', {id: this.$route.params.id}).then((res) => {
      })
    } else {
      this.$store.dispatch('SERIES_TEMP_CLEAR')
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
