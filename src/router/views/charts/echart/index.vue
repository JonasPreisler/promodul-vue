<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/scatter";
import "echarts/lib/chart/candlestick";
import "echarts/lib/chart/gauge";

import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/polar";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/grid";
import "echarts/lib/component/axis";
import ApiService from "@/state/modules/api.service";


import Layout from "../../../layouts/main";
import appConfig from "@/app.config";



export default {
  page: {
    title: "Dashboard",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout,  "v-chart": ECharts },
  data() {
    return {
   
  projectChart: {
    title: [{
        text: null,
        left: 'center',
    }],
    visualMap: {
        show: false,
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/> {c} : ({d}%)'
    },
    
      label: {
                    formatter: '{b} {c} ({d}%)'
                },
        
       
    legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
            color: '#999'
        }
    },
    color: ['#50a5f1', '#f1b44c', '#34c38f'],
    series: [
        {
            name: this.$t('common.Projects'),
            type: 'pie',
            radius: '70%',
            center: ['70%', '55%'],
            data: [

                // { value: 10, name: 'finished ' },
                // { value: 50, name: 'current' },
                // { value: 140, name: 'scheduled' },
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
},
 taskChart: {
    title: [{
        text: null,
        left: 'center',
    }],
    visualMap: {
        show: false,
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/> {c} : ({d}%)'
    },
    
      label: {
                    formatter: '{b} {c} ({d}%)'
                },
        
        labelLine: {
                length: 525,
                length2: 2,
                maxSurfaceAngle: 180
            },
    legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
            color: '#999'
        }
    },
    color: ['#50a5f1', '#f1b44c', '#34c38f'],
    series: [
        {
            name: this.$t('common.Tasks'),
            type: 'pie',
            radius: '70%',
            center: ['70%', '55%'],
            data: [

                // { value: 10, name: 'finished ' },
                // { value: 50, name: 'current' },
                // { value: 140, name: 'scheduled' },
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
},
 resourcesChart: {
    title: [{
        text: null,
        left: 'center',
    }],
    visualMap: {
        show: false,
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/> {c} : ({d}%)'
    },
    
      label: {
                    formatter: '{b} {c} ({d}%)'
                },
        
        labelLine: {
                length: 525,
                length2: 2,
                maxSurfaceAngle: 180
            },
    legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
            color: '#999'
        }
    },
    color: ['#50a5f1', '#f1b44c', '#34c38f'],
    series: [
        {
            name: this.$t('common.Resources'),
            type: 'pie',
            radius: '70%',
            center: ['70%', '55%'],
            data: [],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
},
 userChart: {
    title: [{
        text: null,
        left: 'center',
    }],
    visualMap: {
        show: false,
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/> {c} : ({d}%)'
    },
    
      label: {
                    formatter: '{b} {c} ({d}%)'
                },
        
        labelLine: {
                length: 525,
                length2: 2,
                maxSurfaceAngle: 180
            },
    legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
            color: '#999'
        }
    },
    color: ['#50a5f1', '#f1b44c', '#34c38f'],
    series: [
        {
            name: this.$t('common.Employees'),
            type: 'pie',
            radius: '70%',
            center: ['70%', '55%'],
            data: [],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
},

      title: "ECharts",
      items: [
        {
          text: "Charts",
          href: "/"
        },
        {
          text: "ECharts",
          active: true
        }
      ]
    };
  },
    created(){
       ApiService.setHeader();
    ApiService.get("/dashboards/view").then(
      response => {
                 
                  this.projectChart.title[0].text = this.$t("common.Total")+" "+response.data.projects.total
                  this.projectChart.series[0].data = [
                    { value:  response.data.projects.scheduled, name: this.$t("common.Scheduled") },
                    { value: response.data.projects.current, name: this.$t("common.Current") },                  
                    { value: response.data.projects.finished, name: this.$t("common.Finished") },
                  ]
                  this.taskChart.title[0].text = this.$t("common.Total")+" "+response.data.tasks.total
                  this.taskChart.series[0].data = [
                    { value:  response.data.tasks.open, name: this.$t("common.Open") },
                    { value: response.data.tasks.in_progress, name: this.$t("common.In progress") },                  
                    { value: response.data.tasks.done, name: this.$t("common.Done") },
                  ]
                  this.resourcesChart.title[0].text = this.$t("common.Total")+" "+response.data.resources.total
                  this.resourcesChart.series[0].data = [
                    { value:  response.data.resources.external, name: this.$t("common.External") },
                    { value: response.data.resources.machine, name: this.$t("common.Machine") },                  
                    { value: response.data.resources.tool, name: this.$t("common.Tool") },
                  ]
                    this.userChart.title[0].text = this.$t("common.Total")+" "+response.data.users.total
                  this.userChart.series[0].data = [
                    { value:  response.data.users.employee, name: this.$t("common.Employee") },
                    { value: response.data.users.project_manager, name: this.$t("common.Project manager") },                  
                  ]
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
      
   
     }
};
</script>

<template>
  <Layout>
   
    

    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center">{{$t("common.Projects")}}</h4>
            <hr>
            <v-chart :options="projectChart" autoresize />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center">{{$t("common.Tasks")}}</h4>
            <hr>
            <v-chart :options="taskChart" autoresize />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center">{{$t("common.Resources")}}</h4>
            <hr>
            <v-chart :options="resourcesChart" autoresize />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center">{{$t("common.Employees")}}</h4>
            <hr>
            <v-chart :options="userChart" autoresize />
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>
<style>
.echarts {
  height: 182px;
}
</style>