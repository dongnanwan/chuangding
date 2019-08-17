<template>
  <el-form label-width="100px">
    <el-form-item label="店铺名称">
      <el-input v-model="shop.name"></el-input>
    </el-form-item>
    <el-form-item label="区域">
      <el-select v-model="shop.regionId" placeholder="请选择">
        <el-option
          v-for="region in region.list"
          :key="region.id"
          :label="region.name"
          :value="region.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="省">
      <el-select v-model="shop.provinceId" placeholder="请选择" @change="onProvinceChange">
        <el-option
          v-for="province in province.list"
          :key="province.id"
          :label="province.name"
          :value="province.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="市">
      <el-select v-model="shop.cityId" placeholder="请选择"  @change="onCityChange">
        <el-option
          v-for="province in city.list"
          :key="province.id"
          :label="province.name"
          :value="province.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="区">
      <el-select v-model="shop.areaId" placeholder="请选择">
        <el-option
          v-for="area in area.list"
          :key="area.id"
          :label="area.name"
          :value="area.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="店铺地址">
      <el-input v-model="shop.address"></el-input>
    </el-form-item>
    <el-form-item label="营业时间">
      <el-input v-model="shop.openTime"></el-input>
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input v-model="shop.phone"></el-input>
    </el-form-item>
    <el-form-item label="合伙人">
      <el-select v-model="shop.partnerId" placeholder="请选择">
        <el-option
          v-for="partner in partner.list"
          :key="partner.id"
          :label="partner.name"
          :value="partner.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    computed: {
      shop () {
        return this.$store.getters.shop.temp
      },
      region () {
        return this.$store.getters.region
      },
      province () {
        return this.$store.getters.province
      },
      city () {
        return this.$store.getters.city
      },
      area () {
        return this.$store.getters.area
      },
      partner () {
        return this.$store.getters.partner
      }
    },
    methods: {
      onSubmit () {
        if (this.$route.query.id) {
          this.$store.dispatch('SHOP_PUT', {id: this.$route.query.id}).then((res) => {
            if (res.code === 200) {
              this.$message.success('修改成功！')
              // this.removeView('/shop/list')
              this.$router.push('shop_list')
            } else {
              this.$message.success(res.message)
            }
          })
        } else {
          this.$store.dispatch('SHOP_ADD').then((res) => {
            if (res.code === 200) {
              this.$message.success('提交成功！')
              // this.removeView('/shop/list')
              this.$router.push('shop_list')
            } else {
              this.$message.success(res.message)
            }
          })
        }
      },
      onProvinceChange () {
        this.$store.dispatch('CITY_LIST', this.shop.provinceId)
      },
      onCityChange () {
        this.$store.dispatch('AREA_LIST', this.shop.cityId)
      }
    },
    mounted () {
     
      this.$store.dispatch('REGION_LIST')
      this.$store.dispatch('PROVINCE_LIST')
      this.$store.dispatch('PARTNER_LIST')
    },
    created () {
      // 如果是编辑模式，读入数据项
      if (this.$route.query.id) {
        if (parseInt(this.$route.query.id) !== this.shop.id) {
          this.$store.dispatch('SHOP_EDIT', {id: this.$route.query.id}).then(res => {
            this.$store.dispatch('CITY_LIST', res.data.provinceId)
            this.$store.dispatch('AREA_LIST', res.data.cityId)
          })
        }
      }else{
        //  this.
      }
    }
  }
</script>

<style scoped>

</style>
