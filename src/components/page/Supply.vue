<template>
  <div>
      <el-button type="primary" @click="createNew()">创建</el-button>
      <!-- <el-button type="primary" @click="createErpPlan()">生成ERP计划</el-button> -->
      <el-button type="primary" @click="createErpSend()">生成ERP发货单</el-button>
      <el-table :data="items" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="verifyStatus" label="状态">
            <template slot-scope="scope">
                <span v-if="scope.row.verifyStatus == 'Verify_Success'">审核成功</span> 
                <span v-else-if="scope.row.verifyStatus == 'Created'">创建</span>
                <span v-else-if="scope.row.verifyStatus == 'Verify_Failure'">审核失败</span>
                <span v-else>{{scope.row.verifyStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="transitStatus" label="发货状态"></el-table-column>
          <el-table-column show-overflow-tooltip label="是否已生成erp">
             <template slot-scope="scope">
                <span v-if="scope.row.produced == true">是</span> 
                <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="code" label="单号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="shopName" label="店铺"></el-table-column>
          <el-table-column show-overflow-tooltip prop="items[0].bookCount" label="总件数"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="发货中"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="已发货"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="吊牌总额"></el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="备注"></el-table-column>
          <el-table-column show-overflow-tooltip prop="createByName" label="创建人"></el-table-column>
          <el-table-column show-overflow-tooltip prop="createOn" label="创建时间"></el-table-column>
          <el-table-column show-overflow-tooltip label="查看明细">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                @click="showDetail(scope.$index, scope.row)">查看明细</el-button>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="submitCheck(scope.$index, scope.row)">提交审核</el-button>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="" label="审核">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="checkPass(scope.$index, scope.row)">通过</el-button>

              <el-button
                size="mini"
                type="danger"
                @click="checkReject(scope.$index, scope.row)">拒绝</el-button>
            </template>
          </el-table-column>

      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="pageSizes"
          :page-size="pageSizes[0]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

      <!-- 明细弹出框 -->

      <el-dialog title="明细" :visible.sync="dialogTableVisible" class="detailTable"  width="95%" >
        <el-table 
            border
            :data="gridData"
            v-loading="loading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
          <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
          <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
          <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
          <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
          <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column>
          <el-table-column show-overflow-tooltip prop="bookCount" label="数量"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="未发货"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="发货中"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="已发货"></el-table-column>
          <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
          <el-table-column show-overflow-tooltip prop="series" label="系列"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="波段"></el-table-column>
          <el-table-column show-overflow-tooltip prop="barcode" label="条形码"></el-table-column>
        </el-table>
      </el-dialog>


       <!-- 创建弹出框 -->

      <el-dialog title="单据基本信息" :visible.sync="createTableVisible" class="detailTable"  width="95%" >

          <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
             <el-form-item label="发货店铺">
              <el-select v-model="form.shopId" placeholder="请选择">
                <el-option v-for="item in shopNameOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
           
            <br>

            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
            <br>

            <!-- <p>单据行信息</p> -->

            <el-button type="primary" @click='addDetailInfo()'>添加</el-button>


            <el-table :data="form.counts" style="width: 100%">
              <el-table-column  label="数量" width="180">
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.count" placeholder="请输入内容"></el-input>
                  </template>
              </el-table-column>
              <el-table-column  label="商品号" width="180">
                <template slot-scope="scope">
                      <el-input v-model="scope.row.itemId" placeholder="请输入内容"></el-input>
                  </template>
              </el-table-column>
              <el-table-column  label="skuID" width="180">
                <template slot-scope="scope">
                      <el-input v-model="scope.row.skuId" placeholder="请输入内容"></el-input>
                  </template>
              </el-table-column>
            </el-table>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">创建</el-button>
              <el-button @click="closeCreateTable()">取消</el-button>
            </el-form-item>
          </el-form>
      </el-dialog>


  </div>
</template>

<script>
  export default {
    data(){
        return {
            items:[],
            total:0,
            shopId:[],
            pageSizes:[4, 5, 10, 20],
            params:{
                size:4,
                page:1
            },
            gridData: [],
            dialogTableVisible: false,
            createTableVisible: false,
            loading:true,
            indexLoading:true,
            form: {
              shopId: '',
              remark: '',
              counts:[
                {}
              ]
            },
            shopNameOptions:[],
            multipleSelection: []
        }
    },
    computed:{
        status(){
            return 123
        }
    },
    methods:{
      handleSizeChange(val) {
        this.params.size = val 
        this.params.page = 1
        this.getInfo()
      },
      handleCurrentChange(val) {
        this.params.page = val
        this.getInfo()
      },
      getInfo(){
        this.$axios.get('/api/distribute/all/supply',{params:this.params}).then(res=>{
          // console.log(res)
            this.items = res.data.data.data
            this.total = res.data.data.total
            if(res.data.code){
              this.indexLoading = false
            }
            console.log(res.data)
        })
      },
      showDetail(index, row) {
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []
          
          this.$axios.get('/api/distribute/'+row.code).then(res=>{
            for(let i of res.data.data.items){
              this.gridData.push(i)
            }
            this.loading = false
            // console.log(res.data.data)
          })
      },
      submitCheck(a,b){
        this.$axios.put(`/api/distribute/${b.code}/verify`).then((res)=>{
          if(res.data.code == 200){
            alert('提交成功')
            this.getInfo()
          }else{
            alert(res.data.message)
          }
        })
      },
      checkPass(a,b){
          this.$axios.put(`/api/distribute/${b.code}/verify/success`).then((res)=>{
            // console.log(res.data)
            if(res.data.code == 200){
              alert('审核成功')
              this.getInfo()
              // this.$axios.put(`/api/distribute/${b.code}/send`).then((res)=>{
              //   console.log('.......................xxxxxxxxxxxx')
              // })
            }else{
              alert(res.data.message)
              this.getInfo()
              // this.$axios.put(`/api/distribute/${b.code}/send`).then((res)=>{
              //   console.log('.......................yyyyyyyyyyyy')
              // })
            }
          })
      },
      checkReject(a,b){
          this.$axios.put(`/api/distribute/${b.code}/verify/failure?reason='拒绝通过'`).then((res)=>{
            // console.log(res.data)
            if(res.data.code == 200){
              alert('已拒绝')
              this.getInfo()
            }else{
              alert(res.data.message)
            }
          })
      },
       createNew(){
        this.createTableVisible = true
        this.$axios.get('/api/shop').then((res)=>{
          this.shopNameOptions = res.data.data.data
        })
      },
       onSubmit() {
        this.$axios.post('/api/distribute/create/distribute',this.form).then((res)=>{
          if(res.data.code == 200){
            alert('创建成功')
             this.getInfo()
          }else{
            alert(res.data.message)
          }
        })
        // console.log(11111)
      },
      addDetailInfo(){
        this.form.counts.push({})
      },
      closeCreateTable(){
        this.createTableVisible = false
      },
      createErpPlan(){
        let arr = []
        this.multipleSelection.forEach((res)=>{
          arr.push(res.code)
        })
        if(arr.length > 0){
          this.$axios.put('/api/distribute/produce/plan?codes='+arr).then((res)=>{
            console.log(res)
          })
        }
      },
      createErpSend(){
        for(let i of this.multipleSelection){
          

          let counts =  i.items.map((val,ind)=>{
            return {count:val.bookCount,itemId:val.itemId,skuId:val.skuId}
          })

          let SendBody = {counts:counts,remark:i.remark}

          this.$axios.put(`/api/distribute/${i.code}/send`,SendBody).then((res)=>{
            console.log(res)
          })

          // this.$axios.put(`/api/distribute/${i.code}/send?SendBody=`+SendBody).then((res)=>{
          //   console.log(res)
          // })
         
          console.log(SendBody)
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
    mounted(){
       this.getInfo()
       
    }
  }
</script>

<style scoped>
 
</style>
