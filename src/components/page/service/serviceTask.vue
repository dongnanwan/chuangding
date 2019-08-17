<template>
    <div>
        <div style="padding-bottom:10px">
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        </div>

        <div style="margin-bottom:10px">
            <el-input  v-model="searchForm.tradeId" placeholder="请输入交易ID" style="width:150px"></el-input>
            <el-select v-model="type" placeholder="请选择任务类型" >
                <el-option
                    v-for="item in taskType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="status" placeholder="请选择任务类型">
                <el-option
                    v-for="item in taskStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button @click="search()" type="primary" size="mini" plain="" icon='el-icon-search'>搜索</el-button>
        </div>
        
        <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row
            v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-table-column show-overflow-tooltip min-width="70"  prop="tradeId" label="交易ID"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="120" prop="type" label="任务类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 'ORDER'">订单</span> 
                    <span v-else-if="scope.row.type == 'REFUND'">退款单</span>
                    <span v-else-if="scope.row.type == 'INVOICE'">发货单</span>
                    <span v-else-if="scope.row.type == 'LADING_BILL'">提货单</span>
                    <span v-else>{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="订单状态" >
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 'PENDING'">待处理</span> 
                    <span v-else-if="scope.row.status == 'UNASSIGNED'">未分配</span>
                    <span v-else-if="scope.row.status == 'PROCESSING'">处理中</span>
                    <span v-else-if="scope.row.status == 'PROCESSED'">已完成</span>
                    <span v-else>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="160" prop="trade.memberNick" label="会员"></el-table-column>
            <el-table-column show-overflow-tooltip label="商品" min-width="240">
                <template slot-scope="scope">
                    <span v-for="order in scope.row.trade.orders" :key="order.id">
                        {{order.title+','}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="100" prop="trade.dispatchOption" label="提货方式">
                <template slot-scope="scope">
                    <span v-if="scope.row.trade.dispatchOption == 'deliveryByHQ'">总部发货</span> 
                    <span v-else-if="scope.row.trade.dispatchOption == 'pickInShop'">门店自取</span>
                    <span v-else>{{scope.row.trade.dispatchOption}}</span>
                </template>
            </el-table-column>
            
            <el-table-column show-overflow-tooltip min-width="80"  label="总金额">
                <template slot-scope="scope">
                    <span v-if="scope.row.trade.totalAmount != undefined">{{scope.row.trade.totalAmount.toFixed(2)}}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="邮费">
                <template slot-scope="scope">
                    <span v-if="scope.row.trade.postFee != undefined">{{scope.row.trade.postFee.toFixed(2)}}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80"  label="优惠金额">
                <template slot-scope="scope">
                    <span v-if="scope.row.trade.discountAmount != undefined">{{scope.row.trade.discountAmount.toFixed(2)}}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip  label="付款时间" min-width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.trade.payTime == null"></span>
                    <span v-else>{{new Date(parseInt(scope.row.trade.payTime)).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip  label="分配时间" min-width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.assignedTime == null"></span>
                    <span v-else>{{new Date(parseInt(scope.row.assignedTime)).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip  label="开始处理时间" min-width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.startTime == null">未处理</span>
                    <span v-else>{{new Date(parseInt(scope.row.startTime)).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip  label="完成时间" min-width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.endTime == null">未完成</span>
                    <span v-else>{{new Date(parseInt(scope.row.endTime)).toLocaleString()}}</span>
                </template>
            </el-table-column>
           
            <el-table-column show-overflow-tooltip label="操作" width="145" fixed="right">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.status == 'PENDING' || scope.row.status == 'UNASSIGNED'"
                        :disabled="scope.row.status == 'UNASSIGNED'"
                        size="mini"
                        type="danger"
                        plain
                        @click="startTask(scope.$index, scope.row)">处理</el-button>
                    <el-button
                        v-if="scope.row.status == 'PROCESSING' || scope.row.status == 'PROCESSED'"
                        :disabled="scope.row.status == 'PROCESSED'"
                        size="mini"
                        type="success"
                        plain
                        @click="endTask(scope.$index, scope.row)">完成</el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="showDetail(scope.$index, scope.row)">详情</el-button>
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

    </div>
</template>

<script>
  export default {
    data(){
        return {
            items:[],
            total:0,
            shopId:[],
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1
            },
            indexLoading:true,
            msgCreate:'msg',
            msgType:'success',
            searchForm:{},
            taskType:[
                {value:'',label:'全部'},
                {value:'ORDER',label:'订单'},
                {value:'INVOICE',label:'发货单'},
                {value:'LADING_BILL',label:'提货单'},
                {value:'REFUND',label:'退款单'}
            ],
            type:'',
            taskStatus:[
                {value:'',label:'全部'},
                {value:'PENDING',label:'待处理'},
                {value:'PROCESSING',label:'处理中'},
                {value:'PROCESSED',label:'处理完成'}
            ],
            status:''
        }
    },
    computed:{
    },
    methods:{

        search(){
            this.params.page = 1
            this.params.tradeId = this.searchForm.tradeId
            this.params.type = this.type
            this.params.status = this.status
            this.getInfo()
        },
        refreshData(){
            this.getInfo()
        },
        startTask(index,row){
            this.$axios.put(`/api/customer-service/processing/${row.id}`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        endTask(index,row){
            this.$axios.put(`/api/customer-service/processing/${row.id}`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        msgCreateOpen() {
            this.$message({
            message:this.msgCreate,
            type:this.msgType,
            showClose: true
            });
        },
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
            this.indexLoading = true
            this.$axios.get('/api/customer-service/tasks',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                    this.items = res.data.data.data
                    this.total = res.data.data.total
                    this.indexLoading = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                    this.indexLoading = false
                }
            })
        },
        showDetail(index, row) {
            if(row.type == 'REFUND'){
                this.$router.push({ path: '/refund', query: {routerData:row.tradeId}})
            }else if(row.type == 'ORDER'){
                this.$router.push({ path: '/trade_index', query: {routerData:row.tradeId}})
            }else if(row.type == 'INVOICE'){
                this.$router.push({ path: '/trade_delivery', query: {routerData:row.tradeId}})
            }else if(row.type == 'LADING_BILL'){
                this.$router.push({ path: '/ticket', query: {routerData:row.tradeId}})
            }else{
                console.log(row.type)
            }
        }
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 
</style>
