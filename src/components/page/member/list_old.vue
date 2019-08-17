<template>
  <div>

    <el-table
      border
      :data="items"
      style="width: 100%"
     >
      <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="60"></el-table-column>
      <el-table-column show-overflow-tooltip prop="memberCode" label="会员号" min-width="150"></el-table-column>
      <el-table-column show-overflow-tooltip prop="nick" label="昵称" min-width="210"></el-table-column>
      <el-table-column show-overflow-tooltip prop="levelString" label="会员等级" min-width="100"></el-table-column>
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
  </div>
</template>

<script>
export default {
  computed: {
    total () {
      return this.$store.getters.member.total
    },
    params () {
      return this.$store.getters.member.params
    },
    items () {
      this.$store.getters.member.list.forEach(value => {
        if (value.vip === 'NON') {
          value.levelString = '非会员'
        } else if (value.vip === 'SILVER') {
          value.levelString = '银牌会员'
        } else if (value.vip === 'GOLD') {
          value.levelString = '金牌会员'
        }
      })
      return this.$store.getters.member.list
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$store.dispatch('MEMBER_SIZE_CHG', val).then(res => {
        this.$store.dispatch('MEMBER_LIST')
      })
    },
    handleCurrentChange (val) {
      this.$store.dispatch('MEMBER_PAGE_CHG', val).then(res => {
        this.$store.dispatch('MEMBER_LIST')
      })
    }
  },
  mounted () {
    this.$store.dispatch('MEMBER_LIST').then((res) => {
      console.log(res)
    })
  }
}
</script>

<style type="text/css" lang="scss" scoped>
  .title {
    height: 16px;
    line-height: 16px;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
