<template>
    <div>
      <!-- 设置banner -->
        <el-card>
            <div slot="header"  style="height:25px">
              <h2>设置banner</h2>
            </div>
            <div style="min-width:500px">
              <div style="height:50px;float:left">
                <div style="float:left;width:100px"><span style="line-height:30px">图片ID</span>  </div>
                <div style="float:left;"><el-input style="width:450px"  disabled="" v-model="bannerIdRecommend"></el-input></div>
                <el-button @click="bannerVisible=true" type="primary" plain="">设置</el-button>
              </div>
            </div>
        </el-card>

        <el-dialog :visible.sync="bannerVisible" fullscreen>
          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>设置推荐banner</h2>
            </div>

            <div style="height:50px;float:left">
              <app-bannerSelect @OnGetDataFromChild='GetImageIdFromChildRecommend'></app-bannerSelect>
            </div>

            <!-- <el-button @click="weekNewItemIdsClear" type="danger">清空</el-button> -->

          </el-card> 
          <el-button @click="setBannerRecommend" type="primary" plain="">保存设置</el-button>
        </el-dialog>

 <!-- 设置推荐商品 -->
        <!-- <el-card style="margin-top:10px;over-flow:scroll;">
            <div slot="header"  style="height:25px">
              <h2>设置每周上新商品</h2>
            </div>
            <div style="height:50px;float:left">
              <div style="float:left;width:100px"><span style="line-height:30px">商品ID</span>  </div>
              <div style="float:left;"><el-input  disabled="" v-model="itemsIdRecommend" style="width:450px"></el-input></div>
              <el-button @click="recommendVisible=true" type="primary" plain="">设置</el-button>

              
            </div>
        </el-card>

        <el-dialog :visible.sync="recommendVisible" fullscreen>
          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>设置每周上新商品</h2>
            </div>

            <div style="height:50px;float:left;">
               <SkuInput-app @onInsertSkuData='itemsInsertSkuData'></SkuInput-app>
            </div>

            <div style="height:50px;float:left">
              <div style="float:left;"><el-input  disabled="" style="width:450px" v-model="itemsIdRecommend"></el-input></div>
            </div>

            <div style="float:left">
              <el-button @click="weekNewItemIdsClear" type="danger">清空</el-button>
            </div>

          </el-card> 
          <el-button @click="setItemsRecommend" type="primary" plain="">保存设置</el-button>
        </el-dialog>
   -->

<!-- 设置设计师推荐商品 -->
        <!-- <el-card style="margin-top:10px;over-flow:scroll;">
            <div slot="header"  style="height:25px">
              <h2>设置设计师推荐商品</h2>
            </div>
            <div style="height:50px;float:left">
              <div style="float:left;width:100px"><span style="line-height:30px">商品ID</span>  </div>
              <div style="float:left;"><el-input  disabled="" v-model="designerItemsIdRecommend" style="width:450px"></el-input></div>
              <el-button @click="designerRecommendVisible=true" type="primary" plain="">设置</el-button>
            </div>
        </el-card>

        <el-dialog :visible.sync="designerRecommendVisible" fullscreen>
          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>设置设计师推荐商品</h2>
            </div>
            <div style="height:50px;float:left;">
               <SkuInput-app @onInsertSkuData='designerItemsInsertSkuData'></SkuInput-app>
            </div>
            <div style="height:50px;float:left">
              <div style="float:left;"><el-input  disabled="" v-model="designerItemsIdRecommend" style="width:450px"></el-input></div>
            </div>
            <div style="float:left">
              <el-button @click="designerItemIdsClear" type="danger">清空</el-button>
            </div>

            <br>
          </el-card> 
          <el-button @click="designerSetItemsRecommend" type="primary" plain="">保存设置</el-button>
        </el-dialog> -->

<!-- 设置热销商品 -->
        <!-- <el-card style="margin-top:10px;over-flow:scroll;">
            <div slot="header"  style="height:25px">
              <h2>设置热销商品</h2>
            </div>
            <div style="height:50px;float:left">
              <div style="float:left;width:100px"><span style="line-height:30px">商品ID</span>  </div>
              <div style="float:left;"><el-input  disabled="" v-model="hotItemsIdRecommend" style="width:450px"></el-input></div>
              <el-button @click="hotRecommendVisible=true" type="primary" plain="">设置</el-button>
            </div>
        </el-card>

        <el-dialog :visible.sync="hotRecommendVisible" fullscreen>
          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>热销商品</h2>
            </div>
            <div style="height:50px;float:left;">
               <SkuInput-app @onInsertSkuData='hotItemsInsertSkuData'></SkuInput-app>
            </div>
            <div style="height:50px;float:left">
              <div style="float:left;"><el-input  disabled="" v-model="hotItemsIdRecommend" style="width:450px"></el-input></div>
            </div>
            <div style="float:left">
              <el-button @click="hotItemIdsClear" type="danger">清空</el-button>
            </div>

            <br>
          </el-card> 
          <el-button @click="hotSetItemsRecommend" type="primary" plain="">保存设置</el-button>
        </el-dialog> -->

    </div>
</template>

<script>
import bannerSelect from '../../common/bannerSelect.vue'
import SkuInputVue from '../../common/itemSelect.vue'
import qs from 'qs'
export default {
     data(){
        return {
          designerRecommendVisible:false,
          designerItemsIdRecommend:'',
          designerUpdateItemsIdRecommend:'',
          designerGiftSkuTableData:[],
          hotRecommendVisible:false,
          hotItemsIdRecommend:'',
          hotUpdateItemsIdRecommend:'',
          hotGiftSkuTableData:[],
          itemsIdRecommend:'',
          bannerIdRecommend:'',
          updateItemsIdRecommend:[],
          updateBannerIdRecommend:'',
          msgCreate:'msg',
          msgType:'success',
          giftSkuTableData:[],
          bannerVisible:false,
          recommendVisible:false,
          itemWeeklyNewDataTabale:[]
        }
    },
    components:{
        'app-bannerSelect':bannerSelect,
        'SkuInput-app':SkuInputVue
    },
    methods:{
      weekNewItemIdsClear(){
        this.itemsIdRecommend = ''
      },
      designerItemIdsClear(){
        this.designerItemsIdRecommend = ''
      },
      hotItemIdsClear(){
        this.hotItemsIdRecommend = ''
      },
      designerItemsInsertSkuData(data){
        this.designerUpdateItemsIdRecommend = []
        function unique(array){     
            var allArr = [];   
            for(var i=0;i<array.length;i++){
                  var flag = true;
            　    for(var j=0;j<allArr.length;j++){
                  if(array[i].id == allArr[j].id){
            　　　　　   flag = false;
            　　    };
            };
            if(flag){
            　　allArr.push(array[i]);
            };
        };
          return allArr;
        }　　

        let arr = this.designerGiftSkuTableData
        
        data.forEach((value,index)=>{
          arr.push(value)
        })

        this.designerGiftSkuTableData = unique(arr)
        this.designerGiftSkuTableData.forEach((val,ind)=>{
          this.designerUpdateItemsIdRecommend.push(val.id)
        })
        this.designerItemsIdRecommend = this.designerUpdateItemsIdRecommend.join(',')
      },
      hotItemsInsertSkuData(data){
        this.hotUpdateItemsIdRecommend = []
        function unique(array){     
            var allArr = [];   
            for(var i=0;i<array.length;i++){
                  var flag = true;
            　    for(var j=0;j<allArr.length;j++){
                  if(array[i].id == allArr[j].id){
            　　　　　   flag = false;
            　　    };
            };
            if(flag){
            　　allArr.push(array[i]);
            };
        };
          return allArr;
        }　　

        let arr = this.hotGiftSkuTableData
        
        data.forEach((value,index)=>{
          arr.push(value)
        })

        this.hotGiftSkuTableData = unique(arr)
        this.hotGiftSkuTableData.forEach((val,ind)=>{
          this.hotUpdateItemsIdRecommend.push(val.id)
        })
        this.hotItemsIdRecommend = this.hotUpdateItemsIdRecommend.join(',')
      },
      itemsInsertSkuData(data){
        this.updateItemsIdRecommend = []
        function unique(array){     
            var allArr = [];   
            for(var i=0;i<array.length;i++){
                  var flag = true;
            　    for(var j=0;j<allArr.length;j++){
                  if(array[i].id == allArr[j].id){
            　　　　　   flag = false;
            　　    };
            };
            if(flag){
            　　allArr.push(array[i]);
            };
        };
          return allArr;
        }　　

        let arr = this.giftSkuTableData
        
        data.forEach((value,index)=>{
          arr.push(value)
        })

        this.giftSkuTableData = unique(arr)
        this.giftSkuTableData.forEach((val,ind)=>{
          this.updateItemsIdRecommend.push(val.id)
        })
        this.itemsIdRecommend = this.updateItemsIdRecommend.join(',')
      },
      msgCreateOpen() {
        this.$message({
          message:this.msgCreate,
          type:this.msgType,
          showClose: true
        });
      },
      getInfoRecommend(){
        this.$axios.get('/api/setting/'+'recommend_banner').then((res)=>{
          this.bannerIdRecommend = res.data.data
        })

        this.$axios.get('/api/setting/'+'recommend_items').then((res)=>{
          this.itemsIdRecommend = res.data.data
        })

        this.$axios.get('/api/recommend/items?recommendType="recommend_items"').then((res)=>{
          console.log(res)
        })

        this.$axios.get('/api/setting/'+'recommend_designer_items').then((res)=>{
          this.designerItemsIdRecommend = res.data.data
        })

        this.$axios.get('/api/setting/'+'hot_items').then((res)=>{
          this.hotItemsIdRecommend = res.data.data
        })
      },
      setBannerRecommend(){
        let value = this.updateBannerIdRecommend?this.updateBannerIdRecommend.join(','):''

        this.$axios.post('/api/setting/'+'recommend_banner',qs.stringify({value:value})).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfoRecommend()
            this.bannerVisible = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      setItemsRecommend(){
        let value = this.updateItemsIdRecommend?this.updateItemsIdRecommend.join(','):''

        this.$axios.post('/api/setting/'+'recommend_items',qs.stringify({value:value})).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfoRecommend()
            this.recommendVisible = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      designerSetItemsRecommend(){
        let value = this.designerUpdateItemsIdRecommend?this.designerUpdateItemsIdRecommend.join(','):''
        
        this.$axios.post('/api/setting/'+'recommend_designer_items',qs.stringify({value:value})).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfoRecommend()
            this.designerRecommendVisible = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      hotSetItemsRecommend(){
        let value = this.hotUpdateItemsIdRecommend ? this.hotUpdateItemsIdRecommend.join(','):''
        
        this.$axios.post('/api/setting/'+'hot_items',qs.stringify({value:value})).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfoRecommend()
            this.hotRecommendVisible = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      GetImageIdFromChildRecommend(data){
        this.updateBannerIdRecommend = data
      }
    },
    mounted(){
      this.getInfoRecommend()
    }
}
</script>

