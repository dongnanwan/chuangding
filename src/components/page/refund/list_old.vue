<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="params.status" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option
              v-for="(value, key) in statusNames"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      :data="items"
      style="width: 100%"
      >
      <el-table-column fixed prop="id" label="ID" width="120"></el-table-column>
      <el-table-column prop="tradeId" label="订单编号" width="120"></el-table-column>
      <el-table-column prop="reason" label="退款原因" width="120"></el-table-column>
      <el-table-column prop="reason" label="退款类型" width="120">
        <template slot-scope="scope">
          {{typeNames[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column prop="expressName" label="快递公司" width="120"></el-table-column>
      <el-table-column prop="expressNo" label="快递编号" width="120"></el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          {{statusNames[scope.row.status]}}
          <div v-show=" scope.row.status === 'REFUSE'">
            原因：{{scope.row.denyReason}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="memberName" label="会员" width="120"></el-table-column>
      <el-table-column label="商品" width="220">
        <template slot-scope="scope">
          <div class="item-list" v-for="order in scope.row.items" :key="order.id" style="margin-top:8px;margin-bottom:8px">
            <img :src="'https://img.chuangdingshop.com/' + order.mainImg"  style="margin-right:10px;margin-top:10px" >
            <div class="info">
              <span class="title">{{order.title}}</span>
              <span class="spec">尺码：{{order.spec}}</span><br/>
              <span class="spec">数量：{{order.num}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" width="90">
        <template slot-scope="scope">{{scope.row.amount.toFixed(2)}}</template>
      </el-table-column>
      <el-table-column label="申请退款时间" width="100">
        <template slot-scope="scope">
          {{dateformat(scope.row.applyTime)}}
        </template>
      </el-table-column>
      <el-table-column label="批准时间" width="100">
        <template slot-scope="scope">
          {{dateformat(scope.row.agreeTime)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">

          <!--<router-link v-if="scope.row.status === 'IN_STOCK'" :to="'/item/' + scope.row.id">-->
            <!--<el-button-->
              <!--style="display:block"-->
              <!--type="text"-->
              <!--size="small">-->
              <!--编辑-->
            <!--</el-button>-->
          <!--</router-link>-->

          <el-button
            style="display:block;margin-left:0px;"
            v-if="scope.row.status === 'APPLY'"
            @click="showDeny(scope.row)"
            type="text"
            size="small">
            拒绝申请
          </el-button>

          <el-button
            style="display:block;margin-left:0px;"
            v-if="scope.row.status === 'APPLY'"
            @click="agreeRefund(scope.row)"
            type="text"
            size="small">
            同意申请
          </el-button>

          <el-button
            style="display:block;margin-left:0px;"
            v-if="scope.row.status === 'WAIT_MONEY'"
            @click="agree(scope.row)"
            type="text"
            size="small">
            同意退款
          </el-button>

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

    <el-dialog title="拒绝申请" v-if="refund !== null" :visible.sync="denyShow">
      <el-form>
        <el-form-item label="退款号" :label-width="formLabelWidth">
          {{refund.id}}
        </el-form-item>
        <el-form-item label="拒绝原因" :label-width="formLabelWidth">
          <el-input auto-complete="off" v-model="denyReason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDeny" >取 消</el-button>
        <el-button @click="denyRefund" type="primary" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dateFormat from '@/assets/date.js'
export default {
  data () {
    return {
      refund: null,
      denyShow: false,
      formLabelWidth: '120px',
      denyReason: '',
      statusNames: {
        'APPLY': '申请退款',
        'REFUSE': '拒绝申请',
        'WAIT_CONSIGN': '待退货',
        'WAIT_RECEIVE': '待收货',
        'WAIT_MONEY': '待退款',
        'FINISHED': '完成',
        'CLOSE': '关闭'
      },
      typeNames: {
        'GoodsToHQ': '退货到总部',
        'GoodsToShop': '退货到门店',
        'Money': '仅退款'
      }
    }
  },
  methods: {
    dateformat (val) {
      return dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
    },
    handleCommand (command) {
      let params = command.split('_')
      let row = this.items[params[1]]
      if (params[0] === 'deny') {
        this.showDeny(row)
      } else if (params[0] === 'refund') {
        this.agreeRefund(row)
      } else if (params[0] === 'agree') {
        this.agree(row)
      } else if (params[0] === 'confirm') {
        this.confirm(row)
      }
    },
    showDeny (row) {
      this.refund = row
      this.denyShow = true
    },
    hideDeny () {
      this.refund = null
      this.denyShow = false
      this.denyReason = ''
    },
    denyRefund () {
      if (this.refund === null || this.denyReason === '') {
        this.$message.error('请填写退款原因')
        return false
      }
      this.$store.dispatch('Refund_deny', {
        id: this.refund.id,
        reason: this.denyReason
      }).then(res => {
        if (res.ok) {
          this.refund.status = 'REFUSE'
          this.$message.success('操作完成')
        }
        this.hideDeny()
      })
    },
    agreeRefund (row) {
      this.$store.dispatch('Refund_agreeRefund', row.id).then(res => {
        if (res.ok) {
          row.status = 'WAIT_CONSIGN'
          this.$message.success('操作完成')
        }
      })
    },
    agree (row) {
      this.$store.dispatch('Refund_agree', row.id).then(res => {
        if (res.ok) {
          row.status = 'FINISHED'
          this.$message.success('操作完成')
        }
      })
    },
    confirm (row) {
      this.$store.dispatch('Refund_confirm', row.id).then(res => {
        if (res.ok) {
          row.status = 'FINISHED'
          this.$message.success('操作完成')
        }
      })
    },
    onSubmit () {
      this.$store.dispatch('Refund_PAGE_CHG', 1)
      this.openLoading('加载中...')
      this.$store.dispatch('Refund_LIST').then((res) => {
        this.closeLoading()
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('Refund_SIZE_CHG', val)
      this.$store.dispatch('Refund_LIST')
    },
    handleCurrentChange (val) {
      this.$store.dispatch('Refund_PAGE_CHG', val)
      this.$store.dispatch('Refund_LIST')
    }
  },
  computed: {
    total () {
      return this.$store.getters.refund.total
    },
    params () {
      return this.$store.getters.refund.params
    },
    items () {
      return this.$store.getters.refund.list
    }
  },
  created () {
  },
  mounted () {
    this.onSubmit()
  }
}
</script>

<style type="text/css" lang="scss" scoped>
  .item-list {
    display: flex;
    img {
      width: 50px;
      height: 50px;
    }
    .info {
      width: 150px;
    }
    .title {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .spec {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
