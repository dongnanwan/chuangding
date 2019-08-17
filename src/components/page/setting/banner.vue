<template>
    <div>
       <!-- 设置banner -->
        <el-card>
          <div slot="header"  style="height:25px">
            <h2>设置首页banner</h2>
          </div>
          <div style="min-width:500px">
            <div style="height:50px;float:left">
              <div style="float:left;width:100px"><span style="line-height:30px">图片ID</span>  </div>
              <div style="float:left;"><el-input   disabled="" v-model="bannerId"></el-input></div>
            </div>
            <el-button @click="bannerVisible=true" type="primary" plain="">设置</el-button>
          </div>
        </el-card>

        <el-dialog :visible.sync="bannerVisible" fullscreen>
          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>设置首页banner</h2>
            </div>

            <div style="height:50px;float:left">
              <app-bannerSelect @OnGetDataFromChild='GetImageIdFromChild'></app-bannerSelect>
            </div>
            <div style="height:50px;float:left">
              <el-button @click="setBanner" type="primary" plain="">设置</el-button>
            </div>
          </el-card> 
        </el-dialog>
 <!-- 设置优惠券 -->
        <el-card style="margin-top:10px">
            <div slot="header"  style="height:25px">
              <h2>设置首页优惠券</h2>
            </div>
            <div style="min-width:500px">
              <div style="height:50px;float:left">
                <div style="float:left;width:100px"><span style="line-height:30px">优惠券ID</span>  </div>
                <div style="float:left;"><el-input   disabled="" v-model="couponId"></el-input></div>
              </div>
              <el-button @click="couponVisible=true" type="primary" plain="">设置</el-button>
            </div>
        </el-card>

        <el-dialog :visible.sync="couponVisible" fullscreen>
          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>设置首页banner</h2>
            </div>

           <div style="height:50px;float:left">
              <app-couponSelect @OnGetDataFromChild='GetCouponIdFromChild'></app-couponSelect>
            </div>
            <div style="height:50px;float:left">
              <el-button @click="setCoupon" type="primary" plain="">设置</el-button>
            </div>
          </el-card> 
        </el-dialog>
    </div>
</template>

<script>
import bannerSelect from '../../common/bannerSelect.vue'
import couponSelect from '../../common/couponSelect.vue'
import qs from 'qs'
export default {
    data(){
        return {
          couponVisible:false,
          bannerVisible:false,
          bannerId:'',
          couponId:'',
          updateBannerId:'',
          updateCouponId:'',
          msgCreate:'msg',
          msgType:'success'
        }
    },
    components:{
        'app-bannerSelect':bannerSelect,
        'app-couponSelect':couponSelect
    },
    methods:{
        msgCreateOpen() {
          this.$message({
            message:this.msgCreate,
            type:this.msgType,
            showClose: true
          });
        },
        GetImageIdFromChild(data){
          this.updateBannerId = data
        },
        GetCouponIdFromChild(data){
          this.updateCouponId = data
        },
        getInfo(){
          this.$axios.get('/api/setting/'+'index_banner').then((res)=>{
            this.bannerId = res.data.data
          })
        },
        getInfoCouponIndex(){
          this.$axios.get('/api/setting/'+'index_coupon').then((res)=>{
            this.couponId = res.data.data
          })
        },
        setBanner(){
          this.$axios.post('/api/setting/'+'index_banner',qs.stringify({value:this.updateBannerId.join(',')})).then((res)=>{
            if(res.data.code == 200){
              this.msgCreate = '操作成功'
              this.msgType = 'success'
              this.msgCreateOpen()
              this.getInfo()
              this.bannerVisible = false
            }else{
              this.msgCreate = res.data.message
              this.msgType = 'error'
              this.msgCreateOpen()
            }
          })
        },
        setCoupon(){
          this.$axios.post('/api/setting/'+'index_coupon',qs.stringify({value:this.updateCouponId.join(',')})).then((res)=>{
            if(res.data.code == 200){
              this.msgCreate = '操作成功'
              this.msgType = 'success'
              this.msgCreateOpen()
              this.getInfoCouponIndex()
              this.couponVisible = false
            }else{
              this.msgCreate = res.data.message
              this.msgType = 'error'
              this.msgCreateOpen()
            }
          })
        }
    },
    mounted(){
      this.getInfoCouponIndex()
      this.getInfo()
    }
}
</script>

