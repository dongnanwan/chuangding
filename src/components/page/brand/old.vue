<template>
  <div>
    <el-button @click="brandSync">数据同步</el-button>
    <el-table
      border
      :data="items"
      style="width: 100%;margin-top: 10px"
     >
      <el-table-column fixed prop="id" label="ID" width="120"></el-table-column>
      <el-table-column prop="name" label="品牌"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    computed: {
      total () {
        return this.$store.getters.brand.total
      },
      items () {
        return this.$store.getters.brand.list
      }
    },
    mounted () {
      this.$store.dispatch('BRAND_LIST').then((res) => {
       
      })
    },
    methods: {
      brandSync () {
        this.$store.dispatch('BRAND_SYNC').then((res) => {
         
        })
      }
    }
  }
</script>

<style scoped>

</style>
