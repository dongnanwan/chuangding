<template>
    <div>
        <el-card style="margin-top:10px">
            <div slot="header"  style="height:25px">
              <h2>vip折扣设置</h2>
            </div>
            <div style="min-width:500px">
              <div style="height:50px;float:left">
                <div style="float:left;width:100px"><span style="line-height:30px">输入折扣</span>  </div>
                <div style="float:left;"> <el-input v-model="vipDiscountShow" disabled=""></el-input></div>
              </div>
              <div style="height:50px;float:left">
                <el-input v-model="vipDiscount"></el-input>
              </div>
              <div style="height:50px;float:left">
                <el-button @click="setVipDiscount" type="primary" plain="">设置</el-button>
              </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import bannerSelect from '../../common/bannerSelect.vue'
import couponSelect from '../../common/couponSelect.vue'
import qs from 'qs'
export default {
    data(){
        return {
          msgCreate:'msg',
          msgType:'success',
          vipDiscount:'',
          vipDiscountShow:''
        }
    },
    
    methods:{
        msgCreateOpen() {
          this.$message({
            message:this.msgCreate,
            type:this.msgType,
            showClose: true
          });
        },
        getInfoVipDiscount(){
          this.$axios.get('/api/setting/'+'vip_discount').then((res)=>{

            this.vipDiscountShow = res.data.data
          })
        },
       
        setVipDiscount(){
          this.$axios.post('/api/setting/'+'vip_discount',qs.stringify({value:this.vipDiscount})).then((res)=>{
            if(res.data.code == 200){
              this.msgCreate = '操作成功'
              this.msgType = 'success'
              this.msgCreateOpen()
              this.getInfoVipDiscount()
            }else{
              this.msgCreate = res.data.message
              this.msgType = 'error'
              this.msgCreateOpen()
            }
          })
        },
     
    },
    mounted(){
      this.getInfoVipDiscount()
    }
}
</script>
