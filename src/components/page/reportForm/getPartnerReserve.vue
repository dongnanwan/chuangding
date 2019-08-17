<template>
    <div>
        <div style="padding-bottom:8px">
            <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
            <el-button type="primary" @click="showExcelData()" plain  icon="el-icon-download" :disabled="excelDisable">导出数据</el-button>
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

            <div style="display:inline-block">
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
            </el-select>

            <div style="display:inline-block">
                <partnerSelect-app  @OnGetDataFromChild='getPartnerIdFromChild'></partnerSelect-app>
            </div>

            <el-button type="primary" @click='search' icon="el-icon-search" plain="">搜索</el-button>
        </div>

        <div ref="printTable">
            <el-table :data="items" style="width: 100%"  border highlight-current-row
                height="600"
                show-summary=""
                :summary-method="getSummaries"
                v-loading="indexLoading"
                element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                <el-table-column sortable="" show-overflow-tooltip prop="regionName" label="区域" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip prop="partnerName" label="合伙人" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip prop="provinceName" label="省" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip prop="cityName" label="市" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip  label="兑换" align="center">
                    <el-table-column show-overflow-tooltip label="储值"  align="center">
                        <el-table-column sortable="" show-overflow-tooltip label="金额" min-width="80" prop="storedValueAmount" align="center"></el-table-column>
                        <el-table-column sortable="" show-overflow-tooltip label="金豆" min-width="80" prop="storedFortunellaVenosa" align="center"></el-table-column>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="买卡" align="center">
                        <el-table-column sortable="" show-overflow-tooltip label="金卡" min-width="80" prop="goldCard" align="center"></el-table-column>
                        <el-table-column sortable="" show-overflow-tooltip label="金卡数" min-width="80" prop="goldCardNum" align="center"></el-table-column>
                        <el-table-column sortable="" show-overflow-tooltip label="银卡" min-width="80" prop="silverCard" align="center"></el-table-column>
                        <el-table-column sortable="" show-overflow-tooltip label="银卡数" min-width="80" prop="silverCardNum" align="center"></el-table-column>
                        <el-table-column sortable="" show-overflow-tooltip label="会员金豆奖励" prop="fortunellaVenosaAward" min-width="120" align="center"></el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="赠送"  align="center">
                    <el-table-column sortable="" show-overflow-tooltip label="活动赠送金豆" prop="giveAwayVenosa" min-width="120" align="center"></el-table-column>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="id" label="会员收益" align="center">
                    <el-table-column sortable="" show-overflow-tooltip label="推荐会员金豆奖励" prop="recommendMemberBeanAward" min-width="120" align="center"></el-table-column>
                    <el-table-column sortable="" show-overflow-tooltip label="会员消费现金返利" prop="membersCashRebates" min-width="120" align="center"></el-table-column>
                </el-table-column>
                <el-table-column sortable="" show-overflow-tooltip prop="consumptionFortunellaVenosa" label="消费金豆" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip prop="fortunellaVenosaFreight" label="运费" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip prop="refundFortunellaVenosa" label="退货金豆" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip prop="refundVenosaFreight" label="退货运费" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip prop="remainingFortunellaVenosa" label="结存金豆" min-width="80" align="center"></el-table-column>
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
import axios from 'axios'
import XLSX from 'xlsx'

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
            searchForm:{
            regionId:0
            },
            provinceList:[],
            cityList:[],
            totalList:[],
            excelData:[],
            excelDisable:true,
            paramsExport:{},
        }
    },
    components:{
        'regionSelect-app':regionSelect,
        'partnerSelect-app':parterSelect
    },
    methods:{
        showExcelData(){
            this.$confirm('是否确认导出所有数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.exportData()
            }).catch(() => {
                   
            });
        },
        exportData(){
            var data = this.excelData
            var ws = XLSX.utils.json_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "data");
            XLSX.writeFile(wb, "data.xlsx");
        },
        onProvinceChange(){
            this.$axios.get(`/api/address/city?page=1&size=40&provinceId=${this.searchForm.provinceId}`).then(res=>{
                if(res.data.code == 200){
                    this.cityList = res.data.data.data
                    this.cityList.unshift({id:0,name:'显示全部'})
                }else{
                    this.msgCreate = '获取市列表失败'
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
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
        getSummaries(param) {
            // console.log(param)
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[14] = this.totalList.consumptionFortunellaVenosaTotal
                    sums[10] = this.totalList.fortunellaVenosaAwardTotal
                    sums[15] = this.totalList.fortunellaVenosaFreightTotal
                    sums[11] = this.totalList.giveAwayVenosaTotal
                    sums[7] = this.totalList.goldCardNumTotal
                    sums[6] = this.totalList.goldCardTotal
                    sums[13] = this.totalList.membersCashRebatesTotal
                    sums[12] = this.totalList.recommendMemberBeanAwardTotal
                    sums[16] = this.totalList.refundFortunellaVenosaTotal
                    sums[17] = this.totalList.refundVenosaFreightTotal
                    sums[18] = this.totalList.remainingFortunellaVenosaTotal
                    sums[9] = this.totalList.silverCardNumTotal
                    sums[8] = this.totalList.silverCardTotal
                    sums[5] = this.totalList.storedFortunellaVenosaTotal
                    sums[4] = this.totalList.storedValueAmountTotal
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
        getRegionIdFromChild(data){
            this.searchForm.regionId = data
            this.getProvince()
        },
        search(){
            this.params.page = 1
            this.params.startTime = new Date(this.searchForm.startTime).getTime()
            this.params.endTime = new Date(this.searchForm.endTime).getTime()
            this.params.regionId = this.searchForm.regionId
            this.params.partnerId = this.searchForm.partnerId
            this.params.provinceId = this.searchForm.provinceId
            this.params.cityId = this.searchForm.cityId

            console.log(this.params)
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
            this.excelDisable = true
            this.indexLoading = true
            // this.params.cityId = this.searchForm.cityId
            // this.params.provinceId = this.searchForm.provinceId

            this.$axios.get('/api/salesReserveIncome/getPartnersReserveAndSettlemenSummaryTotal',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                    this.totalList = res.data.data
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                    this.indexLoading = false
                }
            })

            
            this.$axios.get('/api/salesReserveIncome/getPartnersReserveAndSettlementSummary',{params:this.params}).then(res=>{
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
            }).then(res=>{
                if(this.total != 0){
                    this.$axios.get('/api/salesReserveIncome/getPartnersReserveAndSettlementSummary',{params:Object.assign(this.paramsExport,this.params,{size:this.total})}).then(res=>{
                        if(res.data.code == 200){
                            this.excelData = res.data.data.data
                            this.excelDisable = false
                            console.log(this.paramsExport)
                            
                        }else{

                        }
                    })
                }
                
            })
            
        }
    },
    mounted(){
        this.indexLoading = false
        this.getProvince()
        // this.getInfo()
    }
}
</script>

<style scoped>
 
</style>

