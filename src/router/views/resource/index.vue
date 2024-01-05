<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";

import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import nbLocale from "@fullcalendar/core/locales/nb";

import Swal from "sweetalert2";
import axios from "axios";



import {
  required,
  } from "vuelidate/lib/validators";

/**
 * Crypto Dashboard Component
 */
export default {
  page: {
    title: "Settings",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout,  FullCalendar, },
  data() {
    return {
      machineModels: [],
      toolModels: [],
      externalSourceTypes: [],
      title: "Resources",
      showAddAlert:false,
      alertText: null,
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "Resources",
          active: true,
        },
      ],
      typeform: {
        name: null,
        description: null,
        resource_type_id: 0,
        model_on_type: null,
        model_on_id: 0

      },
      attachForm: {
        file: null,
        attached_on_id:0,
        attached_on_type: null,
        exp_date: null
      },
      resourceIdForCalendar:0,
      typesubmit:false,
      isLoading: false,
      loader: "spinner",
      totalRows: 1,
      currentPage: 1,
      perPage: 1,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filter2: null,
      filter1: null,
      showModal: false,
      addFileModal:false,
      ident: false,
      modalTitle: this.$t("common.Add resources"),
      modalFileTitle: this.$t("common.Add file"),
      filterOn: [],
      sortBy: "name",
      selected: null,
      sortDesc: false,
      resourceTypeList: [],
      resourceTypeSubList: [],
      extraModal: false,
      extraModelName: null,
      extraName: null,
      extraDesc:null,
      extraFilter:null,
      ExtraFileList: [],
      calendarEvents: [],
      filetype: { 
        "xls": "mdi-microsoft-excel",
        "xlsx": "mdi-microsoft-excel",
        "doc":"mdi-microsoft-word",
        "pdf":"mdi-file-pdf-outline",
        "jpg":"mdi-file-image",
        "png":"mdi-file-image",
        "gif":"mdi-file-image",
        "jpeg":"mdi-file-image",
        "uknown":"mdi-file-cancel-outline",
        "zip":"mdi-folder-zip",
        "rar":"mdi-folder-zip"
      },
      calendarOptions: {
        locale: nbLocale,
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrapPlugin,
          listPlugin,
        ],
        initialView: "dayGridMonth",
        themeSystem: "bootstrap",
        initialEvents: [],
        editable: false,
        droppable: false,
        eventResizableFromStart: false,
        weekends: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
      },

      fields: [
        {
          label: this.$t('common.name'),
          key: "name",
          sortable: false,
        },
        {
            label: this.$t('common.description'),
          key: "description",
          sortable: true,
        },
        {
          label: this.$t('common.model'),
          key: "mod_name",
          sortable: false,
        },

        {
          label:"",
          key: "id",
          sortable: false,
          class: "text-end"
        }
      ],
        ExtraFields: [
        {
          label: this.$t("common.File name"),
          key: "file_name",
          sortable: true,
        },
      ],
      toolsField: [
        {
          label: this.$t('common.name'),
          key: "name",
          sortable: true,
        },
        {
           label: this.$t('common.description'),
          key: "description",
          sortable: true,
        },
        {
           label: this.$t('common.model'),
          key: "tool_name",
          sortable: true,
        },

        {
          label:"",
          key: "id",
          sortable: false,
          class: "text-end"
        }
      ],
        externalResourceField: [
        {
           label: this.$t('common.name'),
          sortable: true,
        },
        {
           label: this.$t('common.description'),
          key: "description",
          sortable: true,
        },
        {
           label: this.$t('common.type'),
          key: "external_name",
          sortable: true,
        },

        {
          label:"",
          key: "id",
          sortable: false,
          class: "text-end"
        }
      ],
      
    };
  },
  validations: {
    typeform: {
      name: { required },
      description: { required }
    },
  },
    mounted() { 
      ApiService.setHeader();
      
      ApiService.get("/resources/resource_list").then(
      response => {
        this.machineModels = response.data.resources.machines
        this.toolModels = response.data.resources.tools
        this.externalSourceTypes = response.data.resources.external_resources
           // eslint-disable-next-line no-console
        
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
          ApiService.get("/resources/resource_type_list").then(
      response => {    
        this.resourceTypeList = response.data.types
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
    
    
    },
    methods: {
      refreshEvents() {
        // eslint-disable-next-line no-console
        const calendarApi = this.$refs.calendar.getApi();
        ApiService.get("/resources/resource_calendar/"+this.resourceIdForCalendar).then(
          response => {
            response.data.dates.map(function(value) {
              calendarApi.addEvent({
                id: value.id,
                title: value.title,
                project_id: value.title,
                start: value.start,
                end: value.end,
                status: value.status=="open"? this.$t("common.Open"): (value.status=="done"?this.$t("common.Done"):(value.status=="in_progress"?this.$t("common.In progress"):this.$t("common.Reactivated"))),
                className: value.task_status=="open"? 'bg-info text-white':
                     value.task_status=="in_progress"?'bg-warning text-white':
                     value.task_status=="done"?"bg-success  text-white": "bg-secondary text-white",
          
            })
        });
        
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      })
        calendarApi.render()
      },
    getfileType(filename) {
       // eslint-disable-next-line no-console
       const name = filename.substr(filename.lastIndexOf('.') + 1);
              return  this.filetype.hasOwnProperty(name)? this.filetype[name]:this.filetype["uknown"];
     },
      resetModal() {
        this.ident = false;
        this.typeform.name = null
        this.typeform.description = null
         this.typeform.resource_type_id = 0
         this.typeform.model_on_type = 0,
         this.typeform.model_on_id = 0

      },
      ragac(type){
        this.showModal = true;
        this.ident = type
      },
      submitForm() {
        this.typesubmit = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {
              this.typeform.resource_type_id == 1 ?
                this.typeform.model_on_type = "MachineModel" :
                  this.typeform.resource_type_id ==2 ?  this.typeform.model_on_type = 'ToolModel':  this.typeform.model_on_type = "ExternalResourceType"

               ApiService.post("/resources", this.typeform).then(() => {
                       ApiService.get("/resources/resource_list").then(
                         response => {
                           this.machineModels = response.data.resources.machines
                           this.toolModels = response.data.resources.tools
                           this.externalSourceTypes = response.data.resources.external_resources
                           });
                           ApiService.get("/resources/resource_type_list").then(
                             response => {
                               this.resourceTypeList = response.data.types
                              });
                              this.successmsg("Resource added successfully")
                              this.showModal = false;
                              }, 
                              error =>{
                                this.showAddAlert = true;
                                let err_text= ""
                                // eslint-disable-next-line no-console
                                if(error.response.data.errors[0][0]) {
                                  error.response.data.errors[0].map(function(value,key){
                                  err_text =err_text+ (key+1)+"."+value["message"]+". &nbsp;&nbsp;&nbsp;"
                                })
                                } else {
                                  error.response.data.errors.map(function(value,key){
                                  err_text =err_text+ (key+1)+"."+value["message"]+". &nbsp;&nbsp;&nbsp;"
                                })
                                }
                                
            this.alertText = err_text
            // eslint-disable-next-line no-console
          
          });
      }
    },
    successmsg(text) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: text,
        showConfirmButton: false,
        timer: 2000,
      });
    },
    attachFormSubmit() {
    // eslint-disable-next-line no-console
       const formData = new FormData();
        
        formData.append("attached_on_id", this.attachForm.attached_on_id);
        formData.append("attached_on_type", this.attachForm.attached_on_type);
             formData.append("file", this.attachForm.file);
             formData.append("exp_date", this.attachForm.exp_date);
            // eslint-disable-next-line no-unused-vars
            ApiService.post("/attachments", formData).then(response => {
                 Swal.fire("File uploaded successfully", "", "success");
             this.addFileModal = false;
          
           });

    },
    deleteResource(id, item){

      Swal.fire({
        title: this.$t("common.Are you sure to delete this resource?"),
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText:this.$t("common.Cancel")
              }).then((result) => {
        if (result.value) {
              var  index;
              ApiService.delete("/resources?id=" + item.id).then(()=>{
                if (id == 1) {
                  index = this.machineModels.indexOf(item);
                  this.machineModels.splice(index, 1)
                  }   
                if(id == 2) {
                  index = this.toolModels.indexOf(item);
                  this.toolModels.splice(index, 1)
                }
                if(id == 3) {
                  index = this.externalSourceTypes.indexOf(item);
                  this.externalSourceTypes.splice(index, 1)
              }
              this.successmsg(this.$t("common.Resource deleted successfully"))
    });
        
        }
      });

   
    
    },
    showList(event) {
        const val = event.target.value
        if (val == 1)
            ApiService.get("/settings/machine_models").then(
                response => {
                    this.resourceTypeSubList = response.data.machine_models
                    });
        else if (val==2)
            ApiService.get("/settings/tool_models").then(
                response => {
                    this.resourceTypeSubList = response.data.tool_models
                    });
        else if(val == 3)
            ApiService.get("/settings/external_source_types").then(
                response => {
                    this.resourceTypeSubList = response.data.external_types
                    });
        else this.resourceTypeSubList = []; 

    },
      showAttachmentModal(model, id) {
        this.attachForm.attached_on_id = id;
        this.attachForm.attached_on_type= model;
        this.attachForm.exp_date = null
        this.attachForm.file = null
        this.addFileModal = true
      },
    download(item,name){
      axios({
  url: 'http://localhost:3000/en/attachments/file?uuid='+item, //your url
  method: 'GET',
  responseType: 'blob', // important
}).then((response) => {
      const blob = new Blob([response.data], { type: response.data.type })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = name
        link.click()
        URL.revokeObjectURL(link.href)
        // eslint-disable-next-line no-unused-vars
        } ,error => {
             
              Swal.fire(this.$("commmon.Warning"), this.$("common.Data not exists"), "warning");
              }
        );
    },
      showExtraModal(ident, item) {
        this.resourceIdForCalendar = item.id
        
        setTimeout(this.refreshEvents, 100);
        
    
        // eslint-disable-next-line no-console
        this.extraModelName = ident==1?item.mod_name.substring(0,1):ident==2?item.tool_name.substring(0,1):item.external_name.substring(0,1)
        this.extraName = item.name
        this.extraDesc = item.description

    ApiService.get("/attachments/get_files?attached_on_type=Resource&attached_on_id="+item.id).then(
      response => {
        this.ExtraFileList = ident==1?response.data.files.Resource.MachineModel[item.name]:ident==2?response.data.files.Resource.ToolModel[item.name]:response.data.files.Resource.ExternalResourceType[item.name];   
        // eslint-disable-next-line no-console

        
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
this.extraModal = true;

              //   this.$refs.blablabla.innerHTML = 'Hello Bro';
        //      document.querySelector('#blablabla').style.display = 'none'
       
      
      }
    }
  
};
</script>

<template>
  <Layout>
   
     <div class="row">
       
       <div class="col-12 mb-4 ps-0">
         <b-button size="sm"  variant="primary" @click="ragac('machine')">
           <i class="bx bx-plus font-size-16 align-middle me-2"></i> {{$t("common.add")}}
          </b-button>
        </div>

         <div class="card">
          <div class="card-body">
              
              <div role="tablist">
              <b-card no-body class="mb-2 shadow-none">
                <b-card-header header-tag="header" role="tab">
                  <h6 class="m-0">
                    <a
                      v-b-toggle.accordion-1
                      class="text-dark"
                      href="javascript: void(0);"
                    >Maskiner</a>
                  </h6>
                </b-card-header>
                <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                        <div class="table-responsive mb-0">
                            <b-table striped hover outlined 
                                class="datatables"
                                :items="machineModels"
                                :fields="fields"
                                responsive="sm"
                                :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc"
                                :filter="filter"           
                            >
                                <template #cell(name)="row" @click="extraModal=true">
                                  <div @click="showExtraModal(1, row.item)">{{row.item.name}}</div>
                                </template>
                                     <template #cell(description)="row" @click="extraModal=true">
                                  <div  @click="showExtraModal(1, row.item)">{{row.item.description}}</div>
                                </template>
                                <template #cell(mod_name)="row" @click="extraModal=true">
                                  <div  @click="showExtraModal(1, row.item)">{{row.item.mod_name}}</div>
                                </template>
                                
                                <template #cell(id)="row" class="text-right">
                                    <b-button @click="showAttachmentModal('Resource', row.item.id)" size="sm" variant="outline-warning" class="me-2"><i class="bx bx-paperclip font-size-12 pt-1"></i></b-button>
                                    <b-button @click="deleteResource(1, row.item)" size="sm" variant="outline-danger"><i class="bx bx-trash-alt font-size-12 pt-1"></i></b-button>
                                </template>
                            </b-table>
                        </div>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>

              <b-card no-body class="mb-2 shadow-none">
                <b-card-header header-tag="header" role="tab">
                  <h6 class="m-0">
                    <a
                      v-b-toggle.accordion-2
                      class="text-dark"
                      href="javascript: void(0);"
                    >Verktøy</a>
                  </h6>
                </b-card-header>
                <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                        <div class="table-responsive mb-0">
                            <b-table striped hover outlined 
                              class="datatables"
                              :items="toolModels"
                              :fields="toolsField"
                              responsive="sm"
                              :sort-by.sync="sortBy"
                              :sort-desc.sync="sortDesc"
                              :filter="filter1"
                            >
                             <template #cell(name)="row" @click="extraModal=true">
                                  <div @click="showExtraModal(2,row.item)">{{row.item.name}}</div>
                                </template>
                                 <template #cell(tool_name)="row" @click="extraModal=true">
                                  <div @click="showExtraModal(2,row.item)">{{row.item.tool_name}}</div>
                                </template>
                                 <template #cell(description)="row" @click="extraModal=true">
                                  <div @click="showExtraModal(2,row.item)">{{row.item.description}}</div>
                                </template>
                            <template #cell(id)="row" class="text-right">
                              <b-button @click="showAttachmentModal('Resource', row.item.id)" size="sm" variant="outline-warning" class="me-2"><i class="bx bx-paperclip font-size-12 pt-1"></i></b-button>
                              <b-button @click="deleteResource(2, row.item)" size="sm" variant="outline-danger"><i class="bx bx-trash-alt font-size-16"></i></b-button>
                            </template>
                            </b-table>
                          </div>

                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>

              <b-card no-body class="mb-2 shadow-none">
                <b-card-header header-tag="header" role="tab">
                  <h6 class="m-0">
                    <a
                      v-b-toggle.accordion-3
                      class="text-dark"
                      href="javascript: void(0);"
                    >Eksterne ressurser</a>
                  </h6>
                </b-card-header>
                <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                        <div class="table-responsive mb-0">
                            <b-table striped hover outlined 
                              class="datatables"
                              :items="externalSourceTypes"
                              :fields="externalResourceField"
                              responsive="sm"
                              :sort-by.sync="sortBy"
                              :sort-desc.sync="sortDesc"
                              :filter="filter2"
                            >
                             <template #cell(name)="row" @click="extraModal=true">
                              <div @click="showExtraModal(3, row.item)">{{row.item.name}}</div>
                             </template>
                             <template #cell(external_name)="row" @click="extraModal=true">
                              <div @click="showExtraModal(3, row.item)">{{row.item.external_name}}</div>
                             </template>
                             <template #cell(description)="row" @click="extraModal=true">
                              <div @click="showExtraModal(3, row.item)">{{row.item.description}}</div>
                             </template>
                            <template #cell(id)="row" class="text-right">
                              <b-button @click="showAttachmentModal('Resource', row.item.id)" size="sm" variant="outline-warning" class="me-2"><i class="bx bx-paperclip font-size-12 pt-1"></i></b-button>
                              <b-button @click="deleteResource(3, row.item)" size="sm" variant="outline-danger"><i class="bx bx-trash-alt font-size-16"></i></b-button>
                            </template>
                            </b-table>
                          </div>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </div>
        </div>
    </div>
  

    <b-modal v-model="showModal" hide-footer centered  :title="modalTitle"   @hidden="resetModal">
      <form action="#" @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="warning">
                         <h5> <span v-html="alertText"></span> </h5>
                      </b-alert>    
                    </div>
            
            <div class="col-md-6">
                  <select v-model="typeform.resource_type_id"  class="form-select" @change="showList">
                      <option value="0" selected>{{$t("common.Select type")}}</option>
                      <option v-for="rt in resourceTypeList" :key="rt.id" :value="rt.id">{{rt.name}}</option>
                  </select>
              </div>
              <div class="col-md-6 ">
                  <select v-model="typeform.model_on_id"  class="form-select">
                     <option value="0" selected>{{$t('common.Select model')}}</option>
                      <option v-for="rt in resourceTypeSubList" :key="rt.id" :value="rt.id">{{rt.name}}</option>
                  </select>
              </div>
              <div class="col-md-6 mt-3">
                  <input v-model="typeform.name" type="text" class="form-control" :placeholder="$t('common.Enter name')" name="name"
                  :class="{'is-invalid': typesubmit && $v.typeform.name.$error}" />
              </div>
              <div class="col-md-12 mt-3">
                  <textarea
                  rows="3"
                  v-model="typeform.description"
                  type="text"
                  class="form-control"
                  :placeholder="$t('common.Enter description')"
                  name="description"
                  :class="{
                      'is-invalid': typesubmit && $v.typeform.description.$error,
                  }"
                  ></textarea>
                  
              </div>
              <div class="modal-footer mt-3">      
                <button type="submit" class="btn btn-outline-success">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
              </div>
          </div>
      </form>
    </b-modal>

    
     <b-modal v-model="addFileModal" hide-footer centered  :title="modalFileTitle">
        <div class="mb-4">
            <form action="#" @submit.prevent="attachFormSubmit">
                <div class="row">
                
                    <div class="col-md-6">
                      <label>{{$t("common.Expiration date")}}</label>
                      <input v-model="attachForm.exp_date" v-mask="'##.##.####'" placeholder="DD.MM.YYYY" type="text" class="form-control" />
                    </div>
               
                  <div class="col-sm-6">
                  <div>
                    <label>{{$t("common.Document")}}</label>
                     <b-form-file
      v-model="attachForm.file"


    ></b-form-file>
                  
                  </div>
                </div>
                    <div class="col-md-4 mt-3">
                      <button type="submit" class="btn btn-primary">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
                    </div>
                </div>
            </form>
        </div>
    </b-modal>


    
    <b-modal v-model="extraModal"  hide-footer size="xl" title="" style="height:500px">
      <div class="row">
        <div class="col-md-5 border-end">
           <div  class="rounded-circle bg-info text-center text-white text-uppercase" style="display:inline-block; width:2.2rem; height:2.2rem; line-height:2.2rem">
              {{ extraModelName }}
            </div>
            <span class="ms-2">{{ extraName }}</span>
            <div class="mt-2">
              {{ extraDesc }}
            </div>
            <hr>
            <div>
                                <div class="table-responsive">
                    <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                      <label class="d-inline-flex align-items-center">
                        <b-form-input v-model="extraFilter" type="search" :placeholder="$t('common.Search')" class="form-control form-control-sm"></b-form-input>
                      </label>
                    </div>
                    <div class="table-responsive mb-0">
                                <b-table striped hover outlined 
                                  class="datatables"
                                  :items="ExtraFileList"
                                  :fields="ExtraFields"
                                  responsive="sm"
                                  :sort-by.sync="sortBy"
                                  :sort-desc.sync="sortDesc"
                                  :filter="extraFilter"
                                 
                                
                                >
                                <template #cell(file_name)="row" class="text-right"  >
                                <span @click="download(row.item.uuid, row.item.file_name)"
                                  class="text-dark fw-medium pointer"
                                  ><i
                                  class="mdi font-size-18 align-middle text-primary me-2"
                                    :class="getfileType(row.item.file_name)"
                                  ></i>
                                  {{row.item.file_name}}</span
                                >
                              </template>
                                </b-table>
                      </div>
                  </div>
            </div>
        </div>
        <div class="col-md-7" style="height:600px !important">
            <div  id="blablabla" href="blablabla">
             
             <FullCalendar 
                ref="calendar"
                :options="calendarOptions"
              ></FullCalendar>
            </div>
        </div>
      </div>

    </b-modal>


  </Layout>

</template>

<style>
.fc .fc-daygrid-body {
  width: 100% !important;
}

.fc-col-header {
  width: 100% !important;
}
.fc .fc-scrollgrid, .fc .fc-scrollgrid table {
  width: 100%  !important;
}
.custom-file-label{
  display: none;
}
.pointer {
  cursor: pointer;
}
</style>