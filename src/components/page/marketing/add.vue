<template>
  <div>
    <div class="row">
      <label class="lb" style="width: 120px;">名称</label>
      <div class="row-cell" style="width: auto; line-height: 40px; vertical-align: middle;">
        <el-input v-model="marketing.title"></el-input>
      </div>
    </div>
    <div class="row">
      <label class="lb" style="width: 120px;">类型</label>
      <div class="row-cell" style="width: auto; line-height: 40px; vertical-align: middle;">
        <el-radio-group v-model="marketing.type">
          <el-radio :label="'TUAN'">团购</el-radio>
          <el-radio :label="'SECKILl'">秒杀</el-radio>
          <el-radio :label="'PERCENT'">打折</el-radio>
        </el-radio-group>
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
    <div class="row" v-if="marketing.type === 'PERCENT'">
      <label class="lb" style="width: 120px;">折扣</label>
      <div class="row-cell" style="width: auto; line-height: 40px; vertical-align: middle;">
        <el-input-number v-model="marketing.percent" @change="percentChange" :min="0" size="mini" :precision="1" :step="0.1" :max="10"></el-input-number>
      </div>
    </div>
    <div class="row" v-if="marketing.type === 'TUAN'">
      <label class="lb" style="width: 120px;">成团人数</label>
      <div class="row-cell" style="width: auto; line-height: 40px; vertical-align: middle;">
        <el-input-number v-model="marketing.openNum" :min="1" size="mini" :step="1" :max="10000"></el-input-number>
      </div>
    </div>
    <div class="row">
      <label class="lb">规格</label>
      <div class="sku-list" style="width: 700px; display: inline-block;">
        <div style="margin-bottom: 5px;" v-for="(sku, index) in marketing.skuList" :key="index">
          <span class="sku-t">{{sku.sku.color}}-{{sku.sku.size}}</span>
          <span class="sku-t2">原价(元){{sku.sku.price.toFixed(2)}}</span>
          <span class="sku-t2">活动价(元)</span>
          <input class="sku-n" v-model="sku.price" type="number" />
        </div>
      </div>
    </div>
    <div class="row">
      <label class="lb" style="width: 120px;"></label>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onClose">取消</el-button>
    </div>
  </div>
</template>

<script>
import dateFormat from '@/assets/date.js'
export default {
  data () {
    return {
      dateValues: []
    }
  },
  computed: {
    marketing () {
      return this.$store.getters.marketing.temp
    }
  },
  methods: {
    percentChange () {
      this.marketing.skuList.forEach(sku => {
        sku.price = (sku.sku.price * this.marketing.percent / 10).toFixed(2)
      })
    },
    onSubmit () {
      if (this.dateValues.length !== 2) {
        this.$message({
          showClose: true,
          message: '请选择时间',
          type: 'warning'
        })
        return
      }
      if (this.marketing.title === '') {
        this.$message({
          showClose: true,
          message: '标题不能为空',
          type: 'warning'
        })
        return
      }
      this.marketing.startTime = this.dateValues[0]
      this.marketing.endTime = this.dateValues[1]
      this.$store.dispatch('marketing_POST').then((res) => {
        this.$message.success('提交成功！')
        this.removeView('/marketing')
      })
    },
    onClose () {
      this.removeView('/marketing')
    }
  },
  created () {
    if (this.$route.query.item_id) {
      this.$store.dispatch('ITEM_GET', this.$route.query.item_id).then(item => {
        this.$store.dispatch('marketing_SET_ITEM', item)
      })
    }
    if (this.$route.query.id && parseInt(this.$route.query.id) !== this.marketing.id) {
      this.$store.dispatch('marketing_EDIT', {id: this.$route.query.id}).then((res) => {
        this.dateValues = [dateFormat(res.startTime, 'yyyy-MM-dd hh:mm:ss'), dateFormat(res.endTime, 'yyyy-MM-dd hh:mm:ss')]
      })
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
