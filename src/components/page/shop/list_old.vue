<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <router-link to="/shop_add">
            <el-button plain type="primary">添加</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      :data="items"
      style="width: 100%">
      <!-- <el-table-column show-overflow-tooltip fixed prop="id" label="ID" min-width="60"></el-table-column> -->
      <el-table-column show-overflow-tooltip prop="name" label="门店名称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="partner.name" label="合伙人" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="manager.name" label="店长" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="provinceName" label="省" min-width="90"></el-table-column>
      <el-table-column show-overflow-tooltip prop="cityName" label="市" min-width="90"></el-table-column>
      <el-table-column show-overflow-tooltip prop="areaName" label="区" min-width="90"></el-table-column>
      <el-table-column show-overflow-tooltip prop="address" label="地址" min-width="200"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phone" label="联系电话" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="statusText" label="门店状态" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip fixed="right" label="操作" min-width="280">
        <template slot-scope="scope">
          <el-button class="button" plain type="primary" size="mini" @click="showKeeperList(scope.row)" v-if=" scope.row.managerId === 0 && (scope.row.status === 'Created' || scope.row.status === 'Verify_Success' || scope.row.status === 'Verify_Failure' || scope.row.status === 'Close') ">绑定店长</el-button>

          <router-link v-if=" scope.row.status === 'Created' || scope.row.status === 'Verify_Success' || scope.row.status === 'Verify_Failure' || scope.row.status === 'Close' " :to="'/shop_edit?id=' + scope.row.id">
            <el-button class="button" plain type="primary" size="mini">编辑门店</el-button>
          </router-link>

          <el-button plain type="primary" class="button" size="mini" @click="dialogVerifyConfirmShown = true; currentId = scope.row.id " v-if=" scope.row.status === 'Created' ">提交审核</el-button>

          <el-button class="button" @click="shopEnable(scope.row.id)" v-if=" scope.row.status === 'Verify_Success' || scope.row.status === 'Close' " plain type="primary" size="mini">门店上线</el-button>
          <el-button class="button" @click="shopDisable(scope.row.id)" v-if=" scope.row.status === 'Open' " plain type="primary" size="mini">门店下线</el-button>
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

    <el-dialog  :visible.sync="dialogBindShown" fullscreen>
      <el-card>
        <div slot="header" class="clearfix" style="height:25px"> 
          <h2>绑定店长</h2>
        </div>
        <el-form>
          <ShopKeeperInput-app @OnGetShopIdFromChild='GetShopKeeperIdFromChild'></ShopKeeperInput-app>
        </el-form>
      </el-card>
      <div>
        <el-button @click="dialogBindShown = false">取 消</el-button>
        <el-button type="primary" @click="bindShopkeeper(currentId)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提交审核" :visible.sync="dialogVerifyConfirmShown">
      <el-form>
        <el-form-item label="审核时，店铺信息将不可修改，你是否已经确认信息无误并提交审核？"></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVerifyConfirmShown = false">取 消</el-button>
        <el-button type="primary" @click="verifyConfirm(currentId)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import ShopKeeperInput from '../../common/ShopKeeperInput.vue'
  export default {
    data () {
      return {
        dialogVerifyConfirmShown: false,
        dialogBindShown: false,
        shopkeeperId: '',
        currentId: 0
      }
    },
    components:{
      'ShopKeeperInput-app':ShopKeeperInput
    },
    computed: {
      total () {
        return this.$store.getters.shop.total
      },
      params () {
        return this.$store.getters.shop.params
      },
      items () {
        var items = this.$store.getters.shop.list
        items.forEach(v => {
          if (v.status === 'Created') {
            v.statusText = '未审核'
          } else if (v.status === 'Wait_Verify') {
            v.statusText = '审核中'
          } else if (v.status === 'Verify_Success') {
            v.statusText = '审核通过'
          } else if (v.status === 'Verify_Failure') {
            v.statusText = '审核失败'
            if (v.reason !== undefined) {
              v.statusText += '：' + v.reason
            }
          } else if (v.status === 'Open') {
            v.statusText = '上线'
          } else if (v.status === 'Close') {
            v.statusText = '下线'
          }
        })
        return items
      }
    },
    mounted () {
      this.$store.dispatch('SHOP_LIST')
    },
    methods: {
      GetShopKeeperIdFromChild(data){
        this.shopkeeperId = data
        // console.log(data)
      },
      showKeeperList(row){
        this.dialogBindShown = true; 
        this.currentId = row.id

      },
      handleSizeChange (val) {
        this.$store.dispatch('SHOP_SIZE_CHG', val).then(res => {
          this.$store.dispatch('SHOP_LIST')
        })
      },
      handleCurrentChange (val) {
        this.$store.dispatch('SHOP_PAGE_CHG', val).then(res => {
          this.$store.dispatch('SHOP_LIST')
        })
      },
      bindShopkeeper (shopId) {
        console.log(shopId)
        this.$store.dispatch('SHOP_SHOPKEEPER_CHANGE', {shopId: shopId, managerId: this.shopkeeperId}).then((res) => {
          if (res.code === 200) {
            this.dialogBindShown = false
            this.$store.dispatch('SHOP_LIST')
            this.$message.success('绑定成功！')
          } else {
            this.$message.success(res.message)
          }
        })
      },
      verifyConfirm (id) {
        this.$store.dispatch('SHOP_START_VERIFY', {id: id}).then((res) => {
          if (res.code === 200) {
            this.dialogVerifyConfirmShown = false
            this.$store.dispatch('SHOP_LIST')
            this.$message.success('提交成功！')
          } else {
            this.$message.success(res.message)
          }
        })
      },
      shopEnable (id) {
        this.$store.dispatch('SHOP_ENABLE', {id: id}).then((res) => {
          if (res.code === 200) {
            this.$store.dispatch('SHOP_LIST')
            this.$message.success('门店已上线')
          } else {
            this.$message.success(res.message)
          }
        })
      },
      shopDisable (id) {
        this.$store.dispatch('SHOP_DISABLE', {id: id}).then((res) => {
          if (res.code === 200) {
            this.$store.dispatch('SHOP_LIST')
            this.$message.success('门店已下线')
          } else {
            this.$message.success(res.message)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .button{
    margin-left: 5px;
  }
</style>
