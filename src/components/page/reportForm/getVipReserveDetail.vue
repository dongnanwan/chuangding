<template>
    <div>
        <div style="padding-bottom:8px">
            <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
            <el-button type="primary" @click="showExcelData()" plain  icon="el-icon-download" :disabled="excelDisable">导出数据</el-button>
        </div>

        <div style="padding-bottom:8px">

            <div style="display:inline-block">
            <span style="color:red;font-size:20px">*</span>
            <el-date-picker
                v-model="searchForm.startTime"
                type="datetime"
                placeholder="开始日期">
            </el-date-picker>
            </div>

            <div style="display:inline-block">
            <span style="color:red;font-size:20px">*</span>
            <el-date-picker
                v-model="searchForm.endTime"
                type="datetime"
                placeholder="结束日期">
            </el-date-picker>
            </div>

            <div style="display:inline-block">
                <regionInput-app  @OnGetDataFromChild='getRegionIdFromChild'></regionInput-app>
            </div>

            <el-select v-model="searchForm.provinceId" placeholder="省" @change="onProvinceChange">
                <el-option
                    v-for="item in provinceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="searchForm.cityId" placeholder="市" @change="onCityChange">
                <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="params.vipLevel"  placeholder="会员等级">
                <el-option
                    v-for="item in vipRank"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>
            <div style="display:inline-block">
                <vipInput-app @OnGetDataFromChild='getVipIdFromChild'></vipInput-app>
            </div>

            <el-button @click="search" icon="el-icon-search" type="primary" plain="">搜索</el-button>
    
        </div>

        
        <div ref="printTable">
            <el-table :data="items" style="width: 100%"  border highlight-current-row
            height="600"
            v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            >
            <el-table-column show-overflow-tooltip prop="regionName" label="时间" min-width="160" align="center">
                <template slot-scope="scope">
                <span>{{new Date(scope.row.created).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="regionName" label="大区" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="provinceName" label="省" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="cityName" label="市" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="shopName" label="店铺" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="memberId" label="会员ID" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="vip" label="会员身份" min-width="80" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.vip == 'GOLD'">金卡会员</span>
                    <span v-else-if="scope.row.vip == 'SILVER'">银卡会员</span>
                    <span v-else>非会员</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="mid" label="上级会员" min-width="80" align="center"></el-table-column>

            <el-table-column show-overflow-tooltip  label="兑换" align="center">
                <el-table-column show-overflow-tooltip label="储值"  align="center">
                    <el-table-column show-overflow-tooltip label="金额" min-width="80" prop="storedValueAmount" align="center">
                        <!-- <template slot-scope="scope">
                        <span v-if="scope.row.storedValueAmount == 0"></span>
                        <span v-else>{{scope.row.storedValueAmount}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="金豆" min-width="80" prop="storedFortunellaVenosa" align="center">
                
                    </el-table-column>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="买卡" align="center">
                    <el-table-column show-overflow-tooltip label="金卡" min-width="80" prop="goldCard" align="center">
                
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="银卡" min-width="80" prop="silverCard" align="center">
                
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="会员金豆奖励" prop="fortunellaVenosaAward" min-width="120" align="center">
                
                    </el-table-column>
                </el-table-column>
            </el-table-column>

            <el-table-column show-overflow-tooltip prop="name" label="赠送"  align="center">
                <el-table-column show-overflow-tooltip label="活动赠送金豆" prop="giveAwayVenosa" min-width="120" align="center">
                
                </el-table-column>
                <el-table-column show-overflow-tooltip label="会员消费现金返利" prop="membersCashRebates" min-width="120" align="center">
                
                </el-table-column>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="id" label="会员收益" align="center">
                <el-table-column show-overflow-tooltip label="推荐会员金豆奖励" prop="recommendMemberBeanAward" min-width="120" align="center">
                
                </el-table-column>
                <el-table-column show-overflow-tooltip label="会员消费现金返利" prop="membersCashRebates" min-width="120" align="center">
                
                </el-table-column>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="consumptionFortunellaVenosa" label="消费金豆" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="fortunellaVenosaFreight" label="运费" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="refundFortunellaVenosa" label="退货金豆" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="refundVenosaFreight" label="退货运费" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="remainingFortunellaVenosa" label="结存金豆" min-width="80" align="center"></el-table-column>
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
    import vipInput from '../../common/vipInput.vue'
    import regionInput from '../../common/regionCustomizeSelect.vue'
    import axios from 'axios'
    import XLSX from 'xlsx'

    export default {
        data(){
            return {
                vipRank:[
                    {value:'GOLD',label:'金卡会员'},
                    {value:'SILVER',label:'银卡会员'},
                    {value:'NON',label:'非会员'},
                    {value:'',label:'显示全部'}
                ],
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
                searchForm:{
                    regionId:0
                },
                regionSelect:0,
                fatherList:{
                    provinceId:0,
                    regionId:0,
                    cityId:0
                },
                excelData:[],
                excelDisable:true,
                paramsExport:{}
            }
        },
        components:{
            'vipInput-app':vipInput,
            'regionInput-app':regionInput
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
                        this.cityList.unshift({id:0,name:'显示全部'})
                    }else{
                        this.msgCreate = '获取市列表失败'
                        this.msgType = 'error'
                        this.msgCreateOpen()
                    }
                })
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
            getVipIdFromChild(data){
                this.searchForm.memberId = data
            },
            search(){
                this.params.page = 1
                this.params.startTime = new Date(this.searchForm.startTime).getTime()
                this.params.endTime = new Date(this.searchForm.endTime).getTime()
                this.params.regionId = this.searchForm.regionId
                this.params.memberId = this.searchForm.memberId
                this.params.provinceId = this.searchForm.provinceId
                this.params.cityId = this.searchForm.cityId
                // if(!this.params.startTime || !this.params.endTime || (!this.params.regionId && !this.params.shopId)){
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
                this.params.cityId = this.searchForm.cityId
                this.params.provinceId = this.searchForm.provinceId
                this.$axios.get('/api/salesReserveIncome/getMemberReserveAndSettlemenDetail',{params:this.params}).then(res=>{
                    if(res.data.code == 200){
                        console.log(res.data.data)
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
                        this.$axios.get('/api/salesReserveIncome/getMemberReserveAndSettlemenDetail',{params:Object.assign(this.paramsExport,this.params,{size:this.total})}).then(res=>{
                            if(res.data.code == 200){
                                this.excelData = res.data.data.data
                                this.excelDisable = false
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
        }
    }
</script>

<style scoped>
 
</style>

