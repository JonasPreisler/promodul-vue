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


import Layout from "../../layouts/main";
import appConfig from "@/app.config";



export default {
  page: {
    title: "Owner dashboard",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout,  "v-chart": ECharts },

  data() {
    return {
       anArray: [],
    anObject: null,
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
            name: 'Projects',
            type: 'pie',
            radius: '70%',
            center: ['45%', '55%'],
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
companiesChart: {
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
            name: 'Companies',
            type: 'pie',
            radius: '70%',
            center: ['45%', '55%'],
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
            name: 'Tasks',
            type: 'pie',
            radius: '70%',
            center: ['50%', '55%'],
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
            name: 'Resources',
            type: 'pie',
            radius: '70%',
            center: ['50%', '55%'],
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
            name: 'Employees',
            type: 'pie',
            radius: '70%',
            center: ['45%', '55%'],
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

    };
  },
    created(){
      ApiService.setHeader();
      ApiService.get("/planner_owners/dashboard").then(
      response => {
                
                  this.projectChart.title[0].text = "Total "+response.data.projects.total
                  this.projectChart.series[0].data = [
                    { value:  response.data.projects.scheduled, name: 'Scheduled' },
                    { value: response.data.projects.current, name: 'Current' },                  
                    { value: response.data.projects.finished, name: 'Finished ' },
                  ]
                  this.taskChart.title[0].text = "Total "+response.data.tasks.total
                  this.taskChart.series[0].data = [
                    { value:  response.data.tasks.open, name: 'Open' },
                    { value: response.data.tasks.in_progress, name: 'In progress' },                  
                    { value: response.data.tasks.done, name: 'Done ' },
                  ]
                  this.resourcesChart.title[0].text = "Total "+response.data.resources.total
                  this.resourcesChart.series[0].data = [
                    { value:  response.data.resources.external, name: 'External' },
                    { value: response.data.resources.machine, name: 'Machine' },                  
                    { value: response.data.resources.tool, name: 'tool' },
                  ]
                    this.userChart.title[0].text = "Total "+response.data.users.total
                    this.userChart.series[0].data = [
                    { value:  response.data.users.employee, name: 'employee' },
                    { value: response.data.users.project_manager, name: 'Project manager' },                  
                    { value: response.data.users.admin, name: 'Admin' },                  
                  ]
                  this.companiesChart.title[0].text = "Total "+response.data.companies.total
                  this.companiesChart.series[0].data = [
                    { value:  response.data.companies.active_companies, name: 'active' },
                    { value: response.data.companies.not_active_companies, name: 'not active' },                  
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
   
    
    <div>

    </div>
    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center">Companies</h4>
            <hr>
            <v-chart :options="companiesChart" autoresize />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center">Projects</h4>
            <hr>
            <v-chart :options="projectChart" autoresize />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center">Tasks</h4>
            <hr>
            <v-chart :options="taskChart" autoresize />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center">Resources</h4>
            <hr>
            <v-chart :options="resourcesChart" autoresize />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="text-center">Employees</h4>
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