<template>
  <div>
    <div class="box query-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <router-link to="/partner_add">
            <el-button>添加</el-button>
          </router-link>
        </el-form-item>
      </el-form>

      <el-table
        border
        :data="items"
        style="width: 100%"
       >
        <el-table-column fixed prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="name" label="合伙人" width="120"></el-table-column>
        <el-table-column prop="creditCode" label="身份证号码" width="220"></el-table-column>
        <el-table-column prop="telephone" label="手机" width="120"></el-table-column>
        <el-table-column prop="memberId" label="微信会员ID" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <router-link :to="'/partner_edit?id=' + scope.row.id">
              <el-button type="text" size="small">编辑</el-button>
            </router-link>
            <el-button @click="dialogBindShown = true; currentRowId=scope.row.id " type="text" size="small">绑定微信</el-button>
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

      <el-dialog title="绑定微信会员号" :visible.sync="dialogBindShown">
        <el-form>
          <el-form-item label="微信会员号">
            <el-input v-model="wechatMemberId" autoComplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBindShown = false">取 消</el-button>
          <el-button type="primary" @click="bindWechatMember(currentRowId)">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        currentRowId: 0,
        wechatMemberId: '',
        dialogBindShown: false
      }
    },
    methods: {
      bindWechatMember (id) {
        this.$store.dispatch('PARTNER_BIND', {id: id, memberCode: this.wechatMemberId}).then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.dialogBindShown = false
            this.$message.success('绑定成功')
          } else {
            this.dialogBindShown = false
            this.$message.success(res.message)
          }
        })
      },
      handleSizeChange (val) {
        this.$store.dispatch('PARTNER_SIZE_CHG', val).then(res => {
          this.$store.dispatch('PARTNER_LIST')
        })
      },
      handleCurrentChange (val) {
        this.$store.dispatch('PARTNER_PAGE_CHG', val).then(res => {
          this.$store.dispatch('PARTNER_LIST')
        })
      }
    },
    computed: {
      items () {
        return this.$store.getters.partner.list
      },
      total () {
        return this.$store.getters.partner.total
      },
      params () {
        return this.$store.getters.partner.params
      }
    },
    mounted () {
      this.$store.dispatch('PARTNER_LIST')
    }
  }
</script>

<style scoped>

</style>
