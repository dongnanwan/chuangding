<template>
    <div>
        <div style="padding-bottom:8px">
            <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
        </div>

        <div style="padding-bottom:8px">
        
            <div style="float:left">
                <span style="color:red;font-size:20px">*</span>
                <el-date-picker
                    v-model="searchForm.startTime"
                    type="datetime"
                    placeholder="开始日期">
                </el-date-picker>
            </div>

            <div style="float:left">
                <span style="color:red;font-size:20px">*</span>
                <el-date-picker
                    v-model="searchForm.endTime"
                    type="datetime"
                    placeholder="结束日期">
                </el-date-picker>
            </div>
        
            <!-- <div style="display:inline-block">
                <regionSelect-app @OnGetDataFromChild='getRegionIdFromChild'></regionSelect-app>
            </div>

            <el-select v-model="searchForm.provinceId" placeholder="省" @change="onProvinceChange">
                <el-option
                    v-for="item in provinceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="searchForm.cityId" placeholder="市">
                <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select> -->

            <div style="display:inline-block">
                <shopInput-app :fatherData='fatherList' componentName='调出门店' @OnGetDataFromChild="getSenderIdFromChild"></shopInput-app>
            </div>

            <div style="display:inline-block">
                <shopInput-app :fatherData='fatherList' componentName='调入门店' @OnGetDataFromChild="getReceiverIdFromChild"></shopInput-app>
            </div>

            <el-button type="primary" @click='search' icon="el-icon-search" plain="">搜索</el-button>

        </div>

        <div ref="printTable">
            <el-table :data="items" style="width: 100%"  border highlight-current-row
                height="600"
                v-loading="indexLoading"
                element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                show-summary=""
                :summary-method="getSummaries"
                >
                <el-table-column show-overflow-tooltip sortable="" label="通知单创立时间" min-width="160" align="center">
                    <template slot-scope="scope">
                        <span v-if='scope.row.created'>{{new Date(scope.row.created).toLocaleString()}}</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="status" label="处理状态" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 'Created'">新创建</span> 
                        <span v-else-if="scope.row.status == 'Picked'">备货中</span>
                        <span v-else-if="scope.row.status == 'Consigned'">已发货</span>
                        <span v-else-if="scope.row.status == 'Received'">已收货</span>
                        <span v-else-if="scope.row.status == 'Finished'">已完成</span>
                        <span v-else-if="scope.row.status == 'Cancelled'">已取消</span>
                        <span v-else>{{scope.row.status}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column show-overflow-tooltip sortable="" prop="sender" label="调出店铺" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="receiver" label="调入店铺" min-width="80" align="center"></el-table-column>

                <el-table-column show-overflow-tooltip sortable="" label="调拨通知"  align="center">
                    <el-table-column show-overflow-tooltip sortable="" label="数量" min-width="80" prop="noticeNum" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip sortable="" label="金额" min-width="80" prop="noticePrice" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip sortable="" label="时间" min-width="160" align="center">
                        <template slot-scope="scope">
                            <span v-if='scope.row.noticeCreated'>{{new Date(scope.row.noticeCreated).toLocaleString()}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column show-overflow-tooltip  label="调拨发货"  align="center">
                    <el-table-column show-overflow-tooltip sortable="" label="数量" min-width="80" prop="sendNum" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip sortable="" label="金额" min-width="80" prop="sendPrice" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip sortable="" label="时间" min-width="160" align="center">
                        <template slot-scope="scope">
                            <span v-if='scope.row.sendCreated'>{{new Date(scope.row.sendCreated).toLocaleString()}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="调拨收货"  align="center">
                    <el-table-column show-overflow-tooltip sortable="" label="数量" min-width="80" prop="receiveNum" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip sortable="" label="金额" min-width="80" prop="receivePrice" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip sortable="" label="时间" min-width="160" align="center">
                        <template slot-scope="scope">
                            <span v-if='scope.row.receiveCreated'>{{new Date(scope.row.receiveCreated).toLocaleString()}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                </el-table-column>
                
            </el-table>
        </div>

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
import regionSelect from '../../common/regionCustomizeSelect.vue'
import parterSelect from '../../common/ParterInput.vue'
import shopInput from "../../common/shopInput.vue";
import x from '../../common/Global'
export default {
data(){
    return {
        printClass:'#printTest',
        items:[],
        total:0,
        pageSizes:[10, 20,1000],
        params:{
            size:10,
            page:1
        },
        indexLoading:true,
        msgCreate:'msg',
        msgType:'success',
        provinceList:[],
        cityList:[],
        totalList:[],
        searchForm:{
         regionId:0
        },
        regionSelect:0,
        fatherList:{
            provinceId:0,
            regionId:0,
            cityId:0
        }
    }
},
components:{
    'regionSelect-app':regionSelect,
    'partnerSelect-app':parterSelect,
    "shopInput-app": shopInput
},
methods:{
    getRegionIdFromChild(data){
        this.searchForm.regionId = data
        this.fatherList.regionId = data
        this.getProvince()
    },
    getProvince(){
        this.$axios.get(`/api/address/province?page=1&size=40&name=&regionId=${this.searchForm.regionId}`).then(res=>{
            if(res.data.code == 200){
                this.provinceList = res.data.data.data
                this.provinceList.unshift({id:0,name:'显示全部'})
            }else{
                this.msgCreate = '获取省份列表失败'
                this.msgType = 'error'
                this.msgCreateOpen()
            }
        })
    },
    onCityChange(){
        this.fatherList.cityId = this.searchForm.cityId
    },
    onProvinceChange(){
        this.$axios.get(`/api/address/city?page=1&size=40&provinceId=${this.searchForm.provinceId}`).then(res=>{
            if(res.data.code == 200){
                this.cityList = res.data.data.data
                this.fatherList.provinceId = this.searchForm.provinceId
                this.cityList.unshift({id:0,name:'显示全部'})
            }else{
                this.msgCreate = '获取市列表失败'
                this.msgType = 'error'
                this.msgCreateOpen()
            }
        })
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
                sums[4] = this.totalList['noticeNum']
                sums[5] = this.totalList['noticePrice']
                sums[10] = this.totalList['receiveNum']
                sums[11] = this.totalList['receivePrice']
                sums[7] = this.totalList['sendNum']
                sums[8] = this.totalList['sendPrice']
                
            } else {
            }
        });
        return sums;
    },
    printCheck(){
        function myPrint(obj){
            var newWindow=window.open("打印窗口","_blank");//打印窗口要换成页面的url
            var docStr = obj.innerHTML;
            newWindow.document.write(docStr);
            newWindow.document.close();
            newWindow.print();
            newWindow.close();
        }
        myPrint(this.$refs.printTable)
    
    },
    getPartnerIdFromChild(data){
        this.searchForm.partnerId = data
    },
    getSenderIdFromChild(data) {
        this.params.senderId = data;
    },
    getReceiverIdFromChild(data) {
        this.params.receiverId = data;
    },
    search(){
        this.params.page = 1
        this.params.startTime = new Date(this.searchForm.startTime).getTime()
        this.params.endTime = new Date(this.searchForm.endTime).getTime()
        this.params.regionId = this.searchForm.regionId
        this.params.partnerId = this.searchForm.partnerId
        this.params.provinceId = this.searchForm.provinceId
        this.params.cityId = this.searchForm.cityId
        if(!this.params.startTime || !this.params.endTime){
            this.msgCreate = '请填写时间'
            this.msgType = 'error'
            this.msgCreateOpen()
        }else{
            this.getInfo()
        }
    },
    refreshData(){
    // this.getInfo()
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
        this.getInfo()
    },
    handleCurrentChange(val) {
        this.params.page = val
        this.getInfo()
    },
    getInfo(){
        this.indexLoading = true
        this.params.cityId = this.searchForm.cityId
        this.params.provinceId = this.searchForm.provinceId
        this.$axios.get('/api/shop-allocation/follow',{params:this.params}).then(res=>{
            if(res.data.code == 200){
                console.log(res.data.data.data)
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

        this.$axios.get('/api/shop-allocation/follow-total',{params:this.params}).then(res=>{
            if(res.data.code == 200){
                console.log(res.data.data)
                this.totalList = res.data.data
            }else{
                this.msgCreate = res.data.message
                this.msgType = 'error'
                this.msgCreateOpen()
                this.indexLoading = false
            }
        })
    }
},
mounted(){
    this.indexLoading = false
    this.getProvince()
}
}
</script>

<style scoped>

</style>

