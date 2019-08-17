<template>
  <div>
    <el-button @click="sizeSync">数据同步</el-button>
    <el-table
      border
      :data="items"
      style="width: 100%;margin-top:10px"
     >
      <el-table-column fixed prop="id" label="ID" width="120"></el-table-column>
      <el-table-column prop="name" label="尺寸"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    computed: {
      total () {
        return this.$store.getters.sizes.total
      },
      items () {
        return this.$store.getters.sizes.list
      }
    },
    mounted () {
      this.$store.dispatch('SIZE_LIST').then((res) => {
        // console.log(res.data)
      })
    },
    methods: {
      sizeSync () {
        this.$store.dispatch('SIZE_SYNC').then((res) => {
          location.reload()
        })
      }
    }
  }
</script>

<style scoped>

</style>
