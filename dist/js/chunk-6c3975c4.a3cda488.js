(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6c3975c4"],{"13a2":function(t,e,a){"use strict";a("150a")},"150a":function(t,e,a){},"9d79":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t._self._c;return e("Layout",[e("div",{staticClass:"row"},[e("div",{staticClass:"col-lg-6"},[e("div",{staticClass:"card"},[e("div",{staticClass:"card-body"},[e("h4",{staticClass:"text-center"},[t._v(t._s(this.$t("common.Projects")))]),e("hr"),e("v-chart",{attrs:{options:t.projectChart,autoresize:""}})],1)])]),e("div",{staticClass:"col-lg-6"},[e("div",{staticClass:"card"},[e("div",{staticClass:"card-body"},[e("h4",{staticClass:"text-center"},[t._v(t._s(this.$t("common.Tasks")))]),e("hr"),e("v-chart",{attrs:{options:t.taskChart,autoresize:""}})],1)])]),e("div",{staticClass:"col-lg-6"},[e("div",{staticClass:"card"},[e("div",{staticClass:"card-body"},[e("h4",{staticClass:"text-center"},[t._v(t._s(this.$t("common.Resources")))]),e("hr"),e("v-chart",{attrs:{options:t.resourcesChart,autoresize:""}})],1)])]),e("div",{staticClass:"col-lg-6"},[e("div",{staticClass:"card"},[e("div",{staticClass:"card-body"},[e("h4",{staticClass:"text-center"},[t._v(t._s(this.$t("common.Employees")))]),e("hr"),e("v-chart",{attrs:{options:t.userChart,autoresize:""}})],1)])])])])},r=[],o=(a("a4d3"),a("e01a"),a("d3b7"),a("25f0"),a("9ca8")),l=(a("ef97"),a("94b1"),a("c037"),a("15af"),a("085d"),a("07e6"),a("d28f"),a("627c"),a("007d"),a("2f73"),a("b11c"),a("cd12"),a("af24"),a("8337")),c=a("444f"),i=a("c2a4"),n={page:{title:"Owner dashboard",meta:[{name:"description",content:i.description}]},components:{Layout:c["a"],"v-chart":o["a"]},data:function(){return{projectChart:{title:[{text:null,left:"center"}],visualMap:{show:!1},tooltip:{trigger:"item",formatter:"{a} <br/> {c} : ({d}%)"},label:{formatter:"{b} {c} ({d}%)"},legend:{orient:"vertical",left:"left",textStyle:{color:"#999"}},color:["#50a5f1","#f1b44c","#34c38f"],series:[{name:"Projects",type:"pie",radius:"70%",center:["45%","55%"],data:[],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},companiesChart:{title:[{text:null,left:"center"}],visualMap:{show:!1},tooltip:{trigger:"item",formatter:"{a} <br/> {c} : ({d}%)"},label:{formatter:"{b} {c} ({d}%)"},legend:{orient:"vertical",left:"left",textStyle:{color:"#999"}},color:["#50a5f1","#f1b44c","#34c38f"],series:[{name:"Companies",type:"pie",radius:"70%",center:["45%","55%"],data:[],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},taskChart:{title:[{text:null,left:"center"}],visualMap:{show:!1},tooltip:{trigger:"item",formatter:"{a} <br/> {c} : ({d}%)"},label:{formatter:"{b} {c} ({d}%)"},labelLine:{length:525,length2:2,maxSurfaceAngle:180},legend:{orient:"vertical",left:"left",textStyle:{color:"#999"}},color:["#50a5f1","#f1b44c","#34c38f"],series:[{name:"Tasks",type:"pie",radius:"70%",center:["50%","55%"],data:[],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},resourcesChart:{title:[{text:null,left:"center"}],visualMap:{show:!1},tooltip:{trigger:"item",formatter:"{a} <br/> {c} : ({d}%)"},label:{formatter:"{b} {c} ({d}%)"},labelLine:{length:525,length2:2,maxSurfaceAngle:180},legend:{orient:"vertical",left:"left",textStyle:{color:"#999"}},color:["#50a5f1","#f1b44c","#34c38f"],series:[{name:"Resources",type:"pie",radius:"70%",center:["50%","55%"],data:[],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},userChart:{title:[{text:null,left:"center"}],visualMap:{show:!1},tooltip:{trigger:"item",formatter:"{a} <br/> {c} : ({d}%)"},label:{formatter:"{b} {c} ({d}%)"},labelLine:{length:525,length2:2,maxSurfaceAngle:180},legend:{orient:"vertical",left:"left",textStyle:{color:"#999"}},color:["#50a5f1","#f1b44c","#34c38f"],series:[{name:"Employees",type:"pie",radius:"70%",center:["45%","55%"],data:[],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}}},created:function(){var t=this;l["default"].setHeader(),l["default"].get("/planner_owners/company_stats/"+this.$route.params.id).then((function(e){t.projectChart.title[0].text="Total "+e.data.projects.total,t.projectChart.series[0].data=[{value:e.data.projects.scheduled,name:t.$t("common.Scheduled")},{value:e.data.projects.current,name:t.$t("common.Current")},{value:e.data.projects.finished,name:t.$t("common.Finished")}],t.taskChart.title[0].text="Total "+e.data.tasks.total,t.taskChart.series[0].data=[{value:e.data.tasks.open,name:t.$t("common.Open")},{value:e.data.tasks.in_progress,name:t.$t("common.In progress")},{value:e.data.tasks.done,name:t.$t("common.Done")}],t.resourcesChart.title[0].text="Total "+e.data.resources.total,t.resourcesChart.series[0].data=[{value:e.data.resources.external,name:t.$t("common.External")},{value:e.data.resources.machine,name:t.$t("common.Machine")},{value:e.data.resources.tool,name:t.$t("common.Tool")}],t.userChart.title[0].text="Total "+e.data.users.total,t.userChart.series[0].data=[{value:e.data.users.employee,name:t.$t("common.Employee")},{value:e.data.users.project_manager,name:t.$t("common.Project manager")},{value:e.data.users.admin,name:t.$t("common.Admin")}]}),(function(e){t.categories=e.response&&e.response.companies||e.message||e.toString()}))}},d=n,m=(a("13a2"),a("2877")),u=Object(m["a"])(d,s,r,!1,null,null,null);e["default"]=u.exports}}]);
//# sourceMappingURL=chunk-6c3975c4.a3cda488.js.map