<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item >商品列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片区 -->
  <el-card>
    <el-row style="margin-bottom: 20px;">
      <el-col :span="8" style="margin-right: 50px;">
        <el-input 
        clearable
        @clear="getGoodsList"
        v-model="queryInfo.query" placeholder="请输入内容">
          <el-button 
          @click="serachGoods"
          slot="append" icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-col>
        <el-col :span="5">
        <el-button
        type="primary"
         @click="showaddGoodsPage"
        >添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 列表区域 -->
    <el-table 
    :data="goodsList"
    border
    stripe
    style="width: 100%">
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
       <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template  slot-scope="scope">
            <el-button 
             @click="showEditGoodsDialog(scope.row)"
            size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button 
            @click="removeGoodsById(scope.row)" 
            size="mini" type="danger" icon="el-icon-delete">删除</el-button>       
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码区 -->
      <div  style="margin-top: 15px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1,2,3,5,10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
    </div>
  </el-card>
  <!-- 添加商品对话框 -->
  <!-- <el-dialog
  title="添加商品"
  :visible.sync="addGoodsDialogVisible"
  width="50%">
    <el-form  label-width="80px" :model="addGoodsFrom">
    <el-form-item label="商品名称">
      <el-input v-model="addGoodsFrom.goods_name"></el-input>
    </el-form-item>
    <el-form-item label="商品分类">
      <el-input v-model="addGoodsFrom.goods_cat"></el-input>
    </el-form-item>
    <el-form-item label="商品价格">
      <el-input v-model="addGoodsFrom.goods_price"></el-input>
    </el-form-item>
    <el-form-item label="商品数量">
      <el-input v-model="addGoodsFrom.goods_number"></el-input>
    </el-form-item>
    <el-form-item label="商品重量">
      <el-input v-model="addGoodsFrom.goods_weight"></el-input>
    </el-form-item>
    <el-form-item label="商品介绍">
      <el-input v-model="addGoodsFrom.goods_introduce"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addGoods">确 定</el-button>
  </span>
</el-dialog> -->

<!-- 编辑对话框 -->
  <el-dialog
  title="编辑商品"
  :visible.sync="editGoodDialogVisible"
  width="50%">
  <el-form  label-width="80px" :model="editGoodsFrom">
    <el-form-item label="商品名称">
      <el-input v-model="editGoodsFrom.goods_name"></el-input>
    </el-form-item>
    <el-form-item label="商品价格">
      <el-input v-model="editGoodsFrom.goods_price"></el-input>
    </el-form-item>
    <el-form-item label="商品数量">
      <el-input v-model="editGoodsFrom.goods_number"></el-input>
    </el-form-item>
    <el-form-item label="商品重量">
      <el-input v-model="editGoodsFrom.goods_weight"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editGoodDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editGoodsSubmit(editGoodsFrom)">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
    name:'GoodS',
    data(){
      return{
        // 商品数据列表
        goodsList:[],
        // 添加商品数据列表
        addGoodsFrom:{
          goods_name:'',
          goods_cat:'',
          goods_price:'',
          goods_number:'',
          goods_weight:'',
          goods_introduce:'',
          pics:'',
          attrs:[]
        },
        // 添加商品数据列表
        editGoodsFrom:{
          
        },
        queryInfo:{
                query:'',
                //当前的页数
                pagenum:1,
                //当前每页显示多少条
                pagesize:10
        },
        // 商品总数数据
        total:0,
        // 控制编辑商品对话框的显示与隐藏
        editGoodDialogVisible:false,

      }
    },
    created(){
      this.getGoodsList()
    },
    methods:{
      async getGoodsList(){
        const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
        // console.log('res',res)
        if(res.meta.status !== 200) return this.$message.error('获取商品列表失败')
        this.$message.success('获取商品列表成功')
        this.goodsList = res.data.goods
        this.total = res.data.total
        // console.log('this.goodsList',this.goodsList)
      },
      // 
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      handleCurrentChange(newNum){
        this.queryInfo.pagenum = newNum
        this.getGoodsList()
      },
      // 进入添加商品组件页面
      showaddGoodsPage(){
        this.$router.push('/goods/add')
      },

      // 进入商品编辑组件页面
      // showEditGoodsDialog(){
      //   this.$router.push('/goods/edit')
      // },
      async showEditGoodsDialog(row){
        const{data:res} = await this.$http.get(`goods/${row.goods_id}`)
        this.editGoodsFrom.goods_cat = res.data.goods_cat
        // console.log('res',res)
        // console.log('this.editGoodsFrom.goods_cat',this.editGoodsFrom.goods_cat)
        if(res.meta.status !== 200) return this.$message.error('获取商品信息失败')
        this.editGoodsFrom = res.data
        // console.log('goods_introduce',this.editGoodsFrom.goods_introduce)
        this.editGoodDialogVisible = true
      },
      // 发起put请求编辑提交商品
      async editGoodsSubmit(goodId){
        const{data:res} = await this.$http.put(`goods/${goodId.goods_id}`,{...this.editGoodsFrom})
        // console.log('res',res)
        if(res.meta.status !== 200) return this.$message.error('提交编辑商品信息失败')
        this.editGoodDialogVisible = false
        this.getGoodsList()
        // console.log('goods_introduce',this.editGoodsFrom.goods_introduce)
      },

      // 搜索商品信息
      async serachGoods(){
        const{data:res} = await this.$http.get('goods',{params:this.queryInfo})
        console.log('res',res)
        if(res.meta.status !== 200) return this.$message.error('搜索商品失败')
        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      // 删除商品
      async removeGoodsById(row){
          const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log('err',err)
        if(confirmResult === 'confirm'){
          const {data : res} = await this.$http.delete(`goods/${row.goods_id}`)
          if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            return    
        }
        this.$message('已取消删除权限操作')
      },
      
    }
}
</script>

<style lang="less" scoped>
.btn {
  margin-right: 15px;
}
</style>