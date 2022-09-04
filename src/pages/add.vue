<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item >添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-alert
      :closable = "false"
      title="添加商品信息"
      type="info"
      center
      show-icon
      style="margin-top:15px">
    </el-alert>
    <el-steps
    align-center
    style="margin: 15px 0" 
    :active="activeIndex - 0" 
    finish-status="success" 
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品照片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!-- 纵向标签页 -->
    <el-form
      :rules="goodsRules"
      ref="addFromRef"
      label-position="top"  
      label-width="80px" :model="addGoodsFrom">
    <el-tabs 
    tab-position="left" 
    v-model="activeIndex" 
    :before-leave="tabName"
    >
    <el-tab-pane label="基本信息" name="0">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addGoodsFrom.goods_name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="addGoodsFrom.goods_price" type="number" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="addGoodsFrom.goods_number" type="number" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="addGoodsFrom.goods_weight" type="number" style="width:400px"></el-input>
      </el-form-item>
      <!-- 商品联轴器 -->
      <el-form-item label="商品分类">
        <el-cascader
          v-model="selectCateKeys"
          :options="cateList"
          :props="cascaderProps" 
          @change="cateChange"
          clearable
          >
        </el-cascader>
      </el-form-item>
      </el-tab-pane>
      <!-- 渲染表单的many项 -->
      <el-tab-pane label="商品参数" name="1">
          <el-form-item 
          :label="item1.attr_name" 
          v-for="item1 in manyData" 
          :key="item1.attr_id">
            <!-- 复选框组 -->
            <el-checkbox-group v-model="item1.attr_vals" >
              <el-checkbox 
              v-for="(item2,index2) in item1.attr_vals " :key="index2"
              border
              :label="item2"
              style="margin:0px 10px 0px  0px">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
      </el-tab-pane>
      <!-- 渲染表单的only项 -->
      <el-tab-pane label="商品属性" name="2">
        <el-form-item :label="item3.attr_name" v-for="item3 in onlyData" :key="item3.attr_id">
          <el-input 
          v-for="(item4,index3) in item3.attr_vals" 
          :key="index3"
          :value="item4"
          style="width:400px"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品照片" name="3">
        <el-upload
          :action="uploadURL"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="uploadSuccess"
          list-type="picture"
          :headers="headerObj">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <quill-editor v-model="addGoodsFrom.goods_introduce">
        </quill-editor>
        <el-button
        @click="add" 
        type="primary" style="margin:15px 0">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
    </el-form>
    </el-card>
    <!-- 展示上传图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="pictureDialogVisible"
      width="50%">
      <img :src="pictureURL" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
export default {
    name:'aDD',
    data(){
        return{
        // 当前完成的步骤
        activeIndex: '0',
        // 添加商品数据列表
        addGoodsFrom:{
          goods_name:'',
          goods_cat:'',
          goods_price:'0',
          goods_number:'0',
          goods_weight:'0',
          goods_introduce:'',
          pics:[],
          attrs:[]
        },
        // 商品分类数据列表
        cateList:[],
        // 用来指定级联选择器的配置对象
        cascaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
          expandTrigger: 'hover'
        },
        // 商品添加规则
        goodsRules:{
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
          ],
        },
        // 商品分类动态参数数据
        Catechecked:[],
        // 分类参数名称
        categoriesName:'many',
        // 动态数据列表
        manyData:[],
        // 静态数据列表
        onlyData:[],
        // 选中的父级分类的Id数组
        selectCateKeys:[],
        // 给图片上传设置请求头
        uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
        // 上传图片数据
        fileList:[],
        // 为上传图片设置请求token值
        headerObj:{
          Authorization: window.sessionStorage.getItem('token')
        },
        // 控制图片对话框的显示与隐藏
        pictureDialogVisible:false,
        // 图片地址
        pictureURL:'',
      }
    },
    created(){
      this.getcateList()
    },
    methods:{
      // 发起get请求获取商品分类数列表
      async getcateList(){
        const {data:res} = await this.$http.get('categories')
        // console.log('res',res)
        if(res.meta.status !== 200)  return this.$message.error('获取商品分类数列表失败')
        this.cateList = res.data
      },
      // 当联轴器发生变化时接收当前的selectgoodsKeys数组
      async cateChange(){
        if(this.selectCateKeys.length !== 3){
          this.$message.error('必须选择三级商品分类')
          this.selectCateKeys = []
        }else if(this.selectCateKeys.length === 0){
          this.selectCateKeys = []
          this.manyData = []
          this.onlyData = []
        }else{
          this.getGoods('many')
          this.getGoods('only')
        }

      },
      // 接收切换标签的name值当联轴器选择的商品分类不是三级分类时禁止进去下一次标签页
      tabName(){
        if(this.selectCateKeys.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
        // this.activeIndex = after
        // console.log(before,after) 在这不需要接收这两个参数也能实现功能
      },
      // 封装一个获取（动态/静态）商品参数的函数
      async getGoods(value){
        const {data:res} = await this.$http.get(`categories/${this.selectCateKeys[this.selectCateKeys.length-1]}/attributes`,
          {params:{sel:value}})
          // console.log('res',res.data)
          if(res.meta.status !== 200)  return this.$message.error('获取商品分类数列表失败')
          this.$message.success('获取商品参数列表成功')
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          })
          if(value === 'many'){
            this.manyData = res.data
          }else{
            this.onlyData = res.data
            // console.log('this.only',this.onlyData)
          }
          
          // console.log('this.manyData',this.manyData)
        },
        // 点击弹出图片对话框
        handlePreview(file){
          this.pictureURL = file.response.data.url
          // console.log('file',file)
          this.pictureDialogVisible = true
        },
        // 移除上传图片（可以接收两个参数）
        handleRemove(removeFile){
          // console.log('file',removeFile)
          // console.log('filelist',resFileList)
          // 1。获取将要删除的图片的临时路径
          const filePath = removeFile.response.data.tmp_path
          // 2.从pics数组中，找到这个图片对于的索引值
          const i = this.addGoodsFrom.pics.findIndex(x => 
            x.pic === filePath)
          // 调用数组的splice方法，把图片信息对象，从pics数组中移除
          this.addGoodsFrom.pics.splice(i,1)
          // console.log('i',i)
          // console.log(' this.addGoodsFrom.pics', this.addGoodsFrom.pics)

        },
        // 将图片上传成功接收到的信息赋值给addGoodsFrom
        uploadSuccess(successMessage){
          this.addGoodsFrom.pics.push({pic:successMessage.data.tmp_path})
          // console.log('this.addGoodsFrom.pics',this.addGoodsFrom.pics)
        },
        // 添加商品
        async add(){
          this.$refs.addFromRef.validate(valid => {
            if(!valid) return this.$message.error('请填写必要的表单项')
          })
          this.addGoodsFrom.goods_cat = this.selectCateKeys.toString()
          this.manyData.forEach(item => {
            const Info = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals.toString()
            }
            this.addGoodsFrom.attrs.push(Info)
          })
          this.onlyData.forEach(item => {
            const Info = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals.toString()
            }
            this.addGoodsFrom.attrs.push(Info)
          })
          // console.log('this.addGoodsFrom.attrs',this.addGoodsFrom.attrs)
          // console.log('this.manyData',this.manyData)
          // console.log('this.onlyData',this.onlyData)
        const {data:res} = await this.$http.post('goods',{...this.addGoodsFrom})
        // console.log('res',res)
        if(res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')


        }
    }
}
</script>


<style lang="less">
// 加了scoped以下element-UI属性无法生效（就算加了!important也不行）
 .el-step__title {
    font-size: 15px !important;

}
.el-step__icon {
    width: 24px !important;
    height: 24px;
    font-size: 14px;
}

.ql-editor{
  height: 500px !important;
}
</style>