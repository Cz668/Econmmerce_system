<template>
   <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item >编辑商品</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-alert
      :closable = "false"
      title="修改商品信息"
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
    name:'EdiT',
    data(){
        return{

        }
    },
    created(){
        // this.editList()
    },
    methods:{
        
    }
}
</script>

<style>

</style>