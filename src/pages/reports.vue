<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item >数据报表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片区域 -->
  <el-card>
        <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
  </div>
</template>

<script>
    import * as echarts from 'echarts';
    import _ from 'lodash'
    
export default {
    name:'RePorts',
    data(){
        return{
            options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    // boundaryGap: false
                }
                ],
                yAxis: [
                {
                    // type: 'value'
                }
                ]
            }
        }
    },
    created(){},
    async mounted(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        const{data:res} = await this.$http.get('reports/type/1')
        console.log('res.data',res.data)
        if(res.meta.status !== 200) return this.$message.error('获取统计信息失败')
        // 和并数据
        const result = _.merge(this.options,res.data)
        console.log('result',result)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
    },
    methods:{
        
    }
}
</script>

<style>

</style>