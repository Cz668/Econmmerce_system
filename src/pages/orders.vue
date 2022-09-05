<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item >订单列表</el-breadcrumb-item>
  </el-breadcrumb>
    <!-- 卡片区 -->
  <el-card>
    <el-row style="margin-bottom: 20px;">
        <el-col :span="8">
        <el-input 
        clearable
        @clear="getOrdersList"
        v-model="queryInfo.query" placeholder="请输入内容">
          <el-button 
          @click="serachOrders"
          slot="append" icon="el-icon-search"
          ></el-button>
        </el-input>
        </el-col>
    </el-row>

    <!-- 列表区域 -->
    <el-table 
    :data="ordersList"
    border
    stripe
    style="width: 100%">
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
       <el-table-column
        prop="order_number"
        label="订单编号"
        width="400px">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格">
      </el-table-column>
      <el-table-column
        label="是否付款">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.order_pay == 1">已付款</el-tag>
          <el-tag type="warning" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货">
      </el-table-column>
      <el-table-column
        label="下单时间">
        <template slot-scope="scope">
          {{scope.row.create_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template  slot-scope="scope">
            <el-button 
             @click="showAddress(scope.row)"
             type="primary" icon="el-icon-edit"></el-button>
            <el-button 
             @click="showPhysical(scope.row)"
             type="success" icon="el-icon-location"></el-button>       
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码区 -->
      <div  style="margin-top: 15px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10,20,30,50]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo.total">
          </el-pagination>
    </div>
  </el-card>

  <!-- 修改地址的对话框 -->
  <el-dialog
  title="提示"
  :visible.sync="addresDialogVisible"
  width="50%"
  @close = "clearAddess">
  <el-form 
  :model="addresForm"
  :rules="addressFormRules"
  ref="addressFormRef"
  label-width="100px">
    <!-- 商品联轴器 -->
      <el-form-item label="省市区/县" prop="address1" >
        <el-cascader
          v-model="addresForm.address1"
          :options="cityData"
          @change="cityChange"
          :props="cascaderProps"
          clearable
          style="width:100%"
          >
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="addresForm.address2" ></el-input>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addresDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="alterAddress">确 定</el-button>
  </span>
 </el-dialog>

<!-- 展示物流对话框 -->
<el-dialog
  title="修改地址"
  :visible.sync="physicalDialogVisible"
  width="50%">
  <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
  <span slot="footer" class="dialog-footer">
    <el-button @click="physicalDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="physicalDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>


<script>
import cityData from '../store/citydata'
export default {
    name:'OrdeR',
    data(){
        return{
            // 订单信息数据
            ordersList:[],
            queryInfo:{
                query:'',
                //当前的页数
                pagenum:1,
                //当前每页显示多少条
                pagesize:10,   
            },
            // 订单总数
            total: 0,
            // 订单表单信息
            ordersFrom:{
                // 用户 ID
                user_id:0,
                // 支付状态
                pay_status:'',
                // 是否发货
                uis_send:'',
                // ['个人','公司']
                order_fapiao_title:'',
                // 公司名称
                order_fapiao_company:'',
                // 发票内容
                order_fapiao_content:'',
                // 发货地址
                consignee_addr:'',  
            },
            // 控制编辑对话框的显示与隐藏
            editDialogVisible:false,
            // 控制编辑对话框的显示与隐藏
            addresDialogVisible:false,
            // 城市Id
            selectCityKeys:[],
            // 城市数据
            cityData,
            // 当前选择的城市信息
            cityList:[],
            // 
            addresForm:{
                address1:[],
                address2:''
            },
            // 
            addressFormRules:{
                address1: [
                    { required: true, message: '请选择省市区/县', trigger: 'blur' },
                ],
                address2: [
                    { required: true, message: '请输入详情', trigger: 'blur' },
                ]
            },
            // 
            cascaderProps:{
                expandTrigger: 'hover'
            },
            // 
            laterAddressList:{
                id:0,
                is_send:'否',
                order_pay:0,
                order_price:40,
                order_number:0,
                pay_status:'0',
            },
            // 控制物流对话框的显示与隐藏
            physicalDialogVisible:false,
            // 写死订单物流信息（订单接口有问题）
             activities: [{
                content: '活动按期开始',
                timestamp: '2018-04-15'
                }, {
                content: '通过审核',
                timestamp: '2018-04-13'
                }, {
                content: '创建成功',
                timestamp: '2018-04-11'
            }]
        }
    },
    created(){
        this.getOrdersList()
    },
    methods:{
        // 发起get请求获取订单信息列表
        async getOrdersList(){
            const{data:res} = await this.$http.get('orders',{params:this.queryInfo})
            // console.log('res',res)
            if(res.meta.status !== 200){
                this.$message.error('获取订单信息失败')
            }
            this.ordersList = res.data.goods
            this.total = res.data.total
            this.$message.success('获取订单信息成功')
            // console.log('res.data.total',res.data.total)
        },
        // 发生页面显示数量变化时触发
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getOrdersList()
        },
        // 发生跳转页面时触发
        handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum
            this.getOrdersList()
        },
        // 搜索商品信息
        async serachOrders(){
            const{data:res} = await this.$http.get('orders',{params:this.queryInfo})
            console.log('res',res)
            if(res.meta.status !== 200) return this.$message.error('搜索订单失败')
            this.ordersList = res.data.goods
            this.total = res.data.total
            console.log('this.total',res.data.total)
            console.log('this.queryInfo',this.queryInfo.query)
        },

        // 展示修改地址的对话框
        showAddress(orderInfo){
            console.log('orderInfo',orderInfo)
            this.ordersFrom.user_id = orderInfo.user_id
            // this.laterAddressList.order_id = orderInfo.order_id
            // this.laterAddressList.is_send = orderInfo.is_send
            // this.laterAddressList.order_pay = orderInfo.order_pay
            // this.laterAddressList.order_price = orderInfo.order_price
            // this.laterAddressList.order_number = orderInfo.order_number
            // this.laterAddressList.pay_status = orderInfo.pay_status
            this.addresDialogVisible = true
            console.log('orderInfo.order_price',orderInfo.order_price)
            console.log('this.laterAddressList.order_price',this.laterAddressList.order_price)
        },
        // 因没有对应的APi接口模拟修改用户地址（通过修改订单的Api接口）
        async alterAddress(){
            const{data:res} = await this.$http.put('orders/'+this.ordersFrom.user_id,{...this.alterAddress})
            console.log('res',res)
            if(res.meta.status !== 200) return this.$message.error('更新信息失败')
            this.$message.success('更新信息成功')
        },
        cityChange(){},
        // 清除地址对话框的信息
        clearAddess(){
            this.$refs.addressFormRef.resetFields()
        },
        // 发送get请求查询物流信息
        async showPhysical(){
            this.physicalDialogVisible = true
            // const{data:res} = await this.$http.get('kuaidi/'+1106975712662)
            // console.log('res',res)
            // console.log('row.user_id',row.user_id)
            // if(res.meta.status !== 200) return this.$message.error('获取物流信息失败')
            this.$message.success('获取物流信息成功')
            
        }

    }
}
</script>

<style lang="less" scoped>

</style>