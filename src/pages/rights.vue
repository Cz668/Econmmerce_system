<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item >权限列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <el-table
      border
      stripe
      :data="rightsList"
      style="width: 100%">
      <!-- 添加数字排序 -->
      <el-table-column type="index">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="level"
        label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level == 1">等级一</el-tag>
          <el-tag type="success" v-else-if="scope.row.level == 2">等级二</el-tag>
          <el-tag type="warning" v-else>等级三</el-tag>
        </template>
      </el-table-column>
    </el-table> 
  </el-card>
  </div>
</template>

<script>
export default {
    name:'RigHts',
    data(){
        return{
            // 所有的权限列表
            rightsList:[],
        }
    },
    created(){
      this.getRightList()
    },
    methods:{
      async getRightList(){
        const {data:res} = await this.$http.get('rights/list')
        if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
        this.rightsList = res.data
        // console.log('res',res)
      }
    }
}
</script>

<style>

</style>