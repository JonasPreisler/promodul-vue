<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";
import json from "@/helpers/country.json";
import moment from "moment";
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";
import DatePicker from 'vue2-datepicker'
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import nbLocale from "@fullcalendar/core/locales/nb";
import 'vue2-datepicker/locale/nb';




import {
  required,
  } from "vuelidate/lib/validators";

/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Projects",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    FullCalendar,
    DatePicker,
    Multiselect
  },
  data() {
    return {
      myFormat: {
       // Date to String
        stringify: (date) => {
          return date ? moment(date).format('DD.MM.YYYY') : null
        },
        // String to Date
        parse: (value) => {
          return value ? moment(value, 'DD.MM.YYYY').toDate() : null
        }
      },
      country: json,
      title: this.$t("common.Projects"),
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "Projects",
          active: true,
        },
      ],
      superAdmin:false,
      projectManager:false,
      changegProjectId:0,
      changeStatusModal:false,
      taskUsersList:[],
      taskExternalResourceList:[],
      taskMachinesList:[],
      taskToolsList:[],
      userValue:null,
      machineValue: null,
      toolValue:null,
      resoourceValue: null,
      editUserValue:null,
      editMachineValue: null,
      editToolValue:null,
      editResoourceValue: null,
      addDeleteUserList: [],
      addDeleteResourceList:[],
      modalFileTitle: this.$t("common.New project"),
      addFileModal:false,
      alertText:null,
      showAddAlert: false,
      projectSubmit:false,
      projects: [],
      projectModal: false,
      editProjectModal: false,
      isLoading: false,
      fullPage: true,
      canCancel: false,
      useSlot: false,
      loader: "spinner",
      color: "#007bff",
      bgColor: "#ffffff",
      height: 128,
      width: 128,
      timeout: 3000, //ms
      fetchingStats: false,
      earningStatus: false,
      filter:null,
      sortBy: "name",
      sortDesc: false,
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
      fields: [
        {
          label: this.$t('common.Project id'),
          key: "project_id",
        
      },{
        label: this.$t('common.Title'),
        key: "Title"
      },
        {
          label: this.$t('common.Contact person'),
          key: "contact_person"
      },
      { 
          label: this.$t('common.Project manager'),
          key: "post_number"
          
      },
      {
          label: "Status",
          key: "project_status.name"
          
      },   
      {
          label: "",
          key: "id",
          sortable: true,
           class: "text-end"
      },
      ],
      projectId: 0, 
      projectForm: {
        user_account_projects_attributes:[],
        project_resources_attributes:[],
        title: null,
        description: null,
        address: null,
        post_number: null,
        contact_person: null,
        start_date: null,
        deadline: null
      },
      editProjectForm: {
        user_account_projects_attributes:[],
        project_resources_attributes:[],
        id: 0,
        title: null,
        description: null,
        address: null,
        post_number: null,
        contact_person: null,
        start_date: null,
        deadline: null
      },
        ExtraFields: [
        {
          label: this.$t("common.File name"),
          key: "file_name",
          sortable: true,
        },
      ],
      attachForm: {
        file: null,
        attached_on_id:0,
        attached_on_type: null,
        exp_date: null
      },
      extraModal: false,
      extraModelName: null,
      extraName: null,
      extraDesc:null,
      extraFilter:null,
      ExtraFileList: [],
       calendarEvents: [],
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
        editable: true,
        droppable: true,
        eventResizableFromStart: true,
        weekends: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
      },
      };
  },
  validations: {
    userValue: {required},
    editUserValue: {required},
    projectForm: {
      title: { required },
      contact_person: { required },
       start_date: {required},
      deadline: {required}
      },
      editProjectForm: {
        title:  {required},
        contact_person:  {required},
        start_date:  {required},
        deadline:  {required}
      },
      
    },
  methods: {
     // eslint-disable-next-line no-unused-vars
    actionChangeStatus(status) {
      
       ApiService.get("/projects/status_progress/"+this.changegProjectId+"?id_name="+status).then(
      () => {
        // eslint-disable-next-line no-console
        this.successmsg(this.$t("common.Status changed successfully"))
        this.changeStatusModal = false;
        this.get_project_list()


   
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
   

    },
    changeStatus (id){
      this.changegProjectId = id
      this.changeStatusModal = true
    },
   customLabelUser (option) {
      return ` ${option.first_name} ${option.last_name}`
    },
    customLabelMachine (option) {
      return ` ${option.name}`
    },
    onSelectUser (option) {
      // eslint-disable-next-line no-unused-vars
      let index = this.taskUsersList.findIndex(item => item.id==option.id);
      this.taskUsersList[index].checked = true;
            // eslint-disable-next-line no-console
    },
    onSelectMachine (option) {
      // eslint-disable-next-line no-unused-vars
      let index = this.taskMachinesList.findIndex(item => item.id==option.id);
      this.taskMachinesList[index].checked = true;
            // eslint-disable-next-line no-console
    },
    onSelectTool (option) {
      // eslint-disable-next-line no-unused-vars
      let index = this.taskToolsList.findIndex(item => item.id==option.id);
      this.taskToolsList[index].checked = true;
            // eslint-disable-next-line no-console
    },
    onSelectExternalResource (option) {
      // eslint-disable-next-line no-unused-vars
      let index = this.taskExternalResourceList.findIndex(item => item.id==option.id);
      this.taskExternalResourceList[index].checked = true;
            // eslint-disable-next-line no-console
    },   
    onRemoveUsers (option) {
      let index = this.taskUsersList.findIndex(item => item.library==option.library);
      this.taskUsersList[index].checked = false;

    },
    onRemoveMachine (option) {
      let index = this.taskMachinesList.findIndex(item => item.library==option.library);
      this.taskMachinesList[index].checked = false;

    },
    onRemoveTool (option) {
      let index = this.taskToolsList.findIndex(item => item.library==option.library);
      this.taskToolsList[index].checked = false;

    },
    onRemoveExternalResource (option) {
      let index = this.taskExternalResourceList.findIndex(item => item.library==option.library);
      this.taskExternalResourceList[index].checked = false;

    },
    onAddUser(option){
      
      this.addDeleteUserList.push({
      user_account_id:option.id
      })
    
    },
    onDeleteUsers(option) {
      this.addDeleteUserList.push({
         id: option.project_user_id,
         user_account_id: option.id,
         _destroy: true
      })
    
    },
    onAddResource(option){
      
      this.addDeleteResourceList.push({
      resource_id:option.id
      })
    
    },
    onDeleteResource(option) {
      this.addDeleteResourceList.push({
         id: option.project_resource_id,
         resource_id: option.id,
         _destroy: true
      })
    
    },

     getfileType(filename) {
       // eslint-disable-next-line no-console
       const name = filename.substr(filename.lastIndexOf('.') + 1);
              return  this.filetype.hasOwnProperty(name)? this.filetype[name]:this.filetype["uknown"];
     },
     deleteProject(id) {
       Swal.fire({
        title: this.$t("common.All the tasks and documents related to the project will be deleted"),
        text: this.$t("common.Delete project"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText: this.$t("common.Cancel"),
      }).then((result) => {
        if (result.value) {
          ApiService.delete("/projects?id="+id).then(
            () => {
              this.get_project_list();
              this.successmsg(this.$t("common.The project is deleted successfully"))
        
        },
        error => {
          this.open_task_list =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
        //  this.deleteEvent();
        
        }
      });
    },
    addProjectForm() {
        this.projectSubmit = true;
        this.$v.projectForm.$touch();
        this.$v.userValue.$touch();


        if (!this.$v.projectForm.$invalid && !this.$v.userValue.$invalid) {
        
           this.projectForm.start_date = this.format_date(this.projectForm.start_date)
            this.projectForm.deadline = this.format_date(this.projectForm.deadline)
          if(this.projectId ==0) {
            this.projectForm.user_account_projects_attributes = [];
            this.projectForm.project_resources_attributes = [];

          this.userValue.forEach(element => {
            this.projectForm.user_account_projects_attributes.push({"user_account_id":element.id})
          });
          if(this.machineValue) {
           this.machineValue.forEach(element => {
            this.projectForm.project_resources_attributes.push({"resource_id":element.id})
          });
          }
          if(this.toolValue) {
              this.toolValue.forEach(element => {
              this.projectForm.project_resources_attributes.push({"resource_id":element.id})
            });
          }
          if (this.resoourceValue) {
            this.resoourceValue.forEach(element => {
            this.projectForm.project_resources_attributes.push({"resource_id":element.id})
          });
          }
            ApiService.post("/projects", this.projectForm).then(response => {
            // eslint-disable-next-line no-console
            this.projects.push(response.data.project)
            this.successmsg(this.$t("common.The project added successfully"))
            this.projectModal = false;
          
          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0].message
            
          }
          )
               } else if (this.projectId > 0) {
               const form  = new FormData();
               form.append("id",this.projectId);
               form.append("title",  this.projectForm.title)
               form.append('description',  this.projectForm.description)
               form.append("address",  this.projectForm.address)
               form.append("post_number",  this.projectForm.post_number)
               form.append("contact_person",  this.projectForm.contact_person)
               form.append("start_date",  this.projectForm.start_date)
               form.append("deadline",  this.projectForm.deadline)
               ApiService.put("/projects", form).then(() => {
      
             this.get_project_list();         
            this.projectModal = false;
            this.projectId = 0;
          
          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0].message
          
          }
          )
               }
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
    SubmitEditProject() {

        this.projectSubmit = true;
        this.$v.editProjectForm.$touch();
        this.$v.editUserValue.$touch();


        if (!this.$v.editProjectForm.$invalid && !this.$v.editUserValue.$invalid) {
    
        this.editProjectForm.user_account_projects_attributes = this.addDeleteUserList
        this.editProjectForm.project_resources_attributes = this.addDeleteResourceList 

          this.editProjectForm.start_time = this.format_date(this.editProjectForm.start_time)
          this.editProjectForm.deadline = this.format_date(this.editProjectForm.deadline)
  
          // eslint-disable-next-line no-console
         

            ApiService.put("/projects", this.editProjectForm).then(() => {
            this.successmsg(this.$t("common.The project updated successfully"))  
            this.editProjectModal = false;
            this.get_project_list()
          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0]["message"]
            // eslint-disable-next-line no-console
          
          }
          )
        }
    },
    editProject(item) {
      // eslint-disable-next-line no-console

       ApiService.get("/projects/get_project/"+item.id).then(
      response => {

        this.editUserValue = response.data.project.users
        this.editResoourceValue   =response.data.project.resources.resources
        this.editMachineValue = response.data.project.resources.models
        this.editToolValue = response.data.project.resources.tools

   
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
   

      ApiService.get("/resources/task_resource_list?start_date="+this.format_date(item.start_date)+"&deadline="+this.format_date(item.deadline)).then(
      response => {
           // eslint-disable-next-line no-console
          this.taskExternalResourceList = response.data.resources.external_resources
          this.taskMachinesList = response.data.resources.machines
          this.taskToolsList = response.data.resources.tools
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
      ApiService.get("users/task_user_list?start_date="+this.format_date(item.start_date)+"&deadline="+this.format_date(item.deadline)).then(
      response => {
           // eslint-disable-next-line no-console
          this.taskUsersList = response.data.employees
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );



      this.editProjectForm.id = item.id  
      this.editProjectForm.title = item.title  
      this.editProjectForm.description = item.description  
      this.editProjectForm.address = item.address  
      this.editProjectForm.post_number = item.post_number  
      this.editProjectForm.contact_person = item.contact_person  
      this.editProjectForm.start_date = new Date(item.start_date)  
      this.editProjectForm.deadline =new Date(item.deadline)
      this.editProjectModal = true

    },
    addProjectModal(){
  
          this.projectForm.start_date = new Date()  
      this.projectForm.deadline = new Date()
      // eslint-disable-next-line no-console
          this.projectModal = true
          this.getUserResourceList()
      },
      resetModal() {
          this.showAddAlert = false;
          this.projectForm.title = null;
          this.projectForm.description = null;
          this.projectForm.address = null;
          this.projectForm.post_number = null;
          this.projectForm.contact_person = null;
      },
      refreshEvents() {
        let calendarApi = this.$refs.calendar.getApi()
        calendarApi.render()
        },
        showExtraModal(ident, item) {
        setTimeout(this.refreshEvents, 100);
        
        // eslint-disable-next-line no-console
        this.extraModelName = item.first_name+'.'+ item.last_name
        this.extraName = item.first_name+" "+item.last_name
        this.extraDesc = item.phone_number

    ApiService.get("/attachments/get_files?attached_on_type=UserAccount&attached_on_id="+item.id).then(
      response => {
        this.ExtraFileList = response.data.files;   
      
        
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
    
    this.extraModal = true;
       //      document.querySelector('#blablabla').style.display = 'none'
       
      },
      showAttachmentModal(model, id) {
     
        this.attachForm.attached_on_id = id;
        this.attachForm.attached_on_type= model;
  
      
              this.addFileModal = true
      },

      attachFormSubmit() {
    // eslint-disable-next-line no-console
       const formData = new FormData();
        
        formData.append("attached_on_id", this.attachForm.attached_on_id);
        formData.append("attached_on_type", this.attachForm.attached_on_type);
             formData.append("file", this.attachForm.file);
             formData.append("exp_date", this.attachForm.exp_date);
                
                      ApiService.post("/attachments", formData).then(() => {
                 
               
            
             this.addFileModal = false;
          
           });

    },
    format_date(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
      }
    },
    format_date_m(value) {
      if (value) {
        return moment(String(value)).format("DD MMM, YYYY");
      }
    },
     format_date_edit(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
      }
      },
    get_project_list() {
      ApiService.get("/projects/projects_list").then(
      response => {
        this.projects = response.data.projects
           // eslint-disable-next-line no-console
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );

    },
    getUserResourceList() {
      // eslint-disable-next-line no-console
 
      ApiService.get("/resources/task_resource_list?start_date="+this.format_date(this.projectForm.start_date)+"&deadline="+this.format_date(this.projectForm.deadline)).then(
      response => {
           // eslint-disable-next-line no-console
          this.taskExternalResourceList =  response.data.resources.external_resources
          this.taskMachinesList = response.data.resources.machines
          this.taskToolsList = response.data.resources.tools
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
      ApiService.get("users/task_user_list?start_date="+this.format_date(this.projectForm.start_date)+"&deadline="+this.format_date(this.projectForm.deadline)).then(
      response => {
           // eslint-disable-next-line no-console
          this.taskUsersList = response.data.employees
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
 
    },
      getUserResourceListEdit() {
      // eslint-disable-next-line no-console
 
      ApiService.get("/resources/task_resource_list?start_date="+this.format_date(this.editProjectForm.start_date)+"&deadline="+this.format_date(this.editProjectForm.deadline)).then(
      response => {
           // eslint-disable-next-line no-console
          this.taskExternalResourceList =  response.data.resources.external_resources
          this.taskMachinesList = response.data.resources.machines
          this.taskToolsList = response.data.resources.tools
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
      ApiService.get("users/task_user_list?start_date="+this.format_date(this.editProjectForm.start_date)+"&deadline="+this.format_date(this.editProjectForm.deadline)).then(
      response => {
           // eslint-disable-next-line no-console
          this.taskUsersList = response.data.employees
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
 
    },
  },
  mounted() {
    this.superAdmin = this.$store.state.authfack.user.role_group == "Super Admin"? true:false
    this.projectManager = this.$store.state.authfack.user.role_group == "Project Manager"? true:false
      ApiService.setHeader();
      this.get_project_list();
    },
};
</script>

<template>
  <Layout>

  <div class="row">

    <div class="col-12 mb-4">
      <b-button size="sm"  variant="primary" @click="addProjectModal()">
        <i class="bx bx-plus font-size-16 align-middle me-2"></i> {{$t("common.add")}}
      </b-button>
    </div>
  </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
             <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                      <label class="d-inline-flex align-items-center">
                        <b-form-input v-model="filter" type="search" :placeholder="$t('common.Search')" class="form-control form-control-sm"></b-form-input>
                      </label>
                    </div>
                        <div class="table-responsive mb-0">
                              <b-table  striped hover outlined  bordered
                                  class="datatables"
                                  :items="projects"
                                  :fields="fields"
                                  responsive="sm"
                                  :sort-by.sync="sortBy"
                                  :sort-desc.sync="sortDesc"
                                  :filter="filter"
                                >
                                    <template #cell(title)="row">
                                    {{ row.item.title }}
                                    </template>
                                    <template #cell(contact_person)="row">
                                      <div>{{row.item.contact_person}}</div>
                                    </template>
                                      <template #cell(post_number)="row">
                                      {{row.item.user_account.first_name}} {{row.item.user_account.last_name}}
                                    </template>
                                       <template #cell(project_status.name)="row">
                                     <span :class="(Date.parse(row.item.deadline)< new Date()  && row.item.project_status.id_name != 'done'  && row.item.project_status.id_name != 'reactivated')?'badge-soft-danger':(row.item.project_status.id_name=='open'?'badge-soft-info':
                                                    row.item.project_status.id_name=='in_progress'?'badge-soft-warning':
                                                    row.item.project_status.id_name=='done'?'badge-soft-success':
                                                    'badge-soft-secondary')" class="badge  rounded-pill font-size-12">
                                       {{$t("common."+row.item.project_status.name)}} 
                                
                                       </span>
                                       </template>
                                        <template #cell(id)="row" class="text-end">
                                            <b-button v-if="superAdmin || projectManager" @click="changeStatus(row.item.id)" size="sm" variant="outline-success" class="me-2"><i class="bx bx-check-circle font-size-12 pt-1"></i></b-button>
                                            <b-button :href="'#/projects/overview/'+row.item.id" size="sm" variant="outline-info" class="me-2"><i class="bx bx-detail font-size-12 pt-1"></i></b-button>
                                            <b-button v-if="row.item.project_status.name != 'Done'"  size="sm" @click="editProject(row.item)" variant="outline-warning" class="me-2"><i class="bx bx-edit font-size-12 pt-1"></i></b-button>
                                            <b-button @click="deleteProject(row.item.id)" size="sm" variant="outline-danger" class="me-2"><i class="bx bx-trash font-size-12 pt-1"></i></b-button>
                                    </template>
                                    
                             </b-table>
                      </div>
         </div>
        </div>
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->

     
 <b-modal v-model="changeStatusModal" centered  hide-footer :title="$t('common.Change status')" >
   <div class="d-flex justify-content-center">
      <div><b-button size="md"  variant="primary me-2" @click="actionChangeStatus('open')"> {{$t("common.Open")}} </b-button></div>
      <div><b-button size="md"  variant="warning  me-2"  @click="actionChangeStatus('in_progress')"> {{$t("common.In progress")}} </b-button></div>
      <div><b-button size="md"  variant="success  me-2" @click="actionChangeStatus('done')"> {{$t("common.Done")}} </b-button></div>
      <div><b-button size="md"  variant="secondary  me-2"  @click="actionChangeStatus('reactivated')"> {{$t("common.Reactivate")}} </b-button></div>
   </div>
</b-modal>

 <b-modal v-model="projectModal"  hide-footer size="lg" :title="$t('common.Create new project')" @hidden="resetModal()">
   <form action="#" @submit.prevent="addProjectForm">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <label>{{$t("common.Name")}}</label>  
                        <input v-model="projectForm.title" type="text" class="form-control" :placeholder="$t('common.Project name')"  name="title"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.title.$error}" />
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                        <label>{{$t("common.Start date")}}</label>  
                        <div class="col-lg-12">
                          <date-picker lang="nb" :formatter="myFormat"  v-model="projectForm.start_date" @change="getUserResourceList"   append-to-body 
                           :class="{'is-invalid': projectSubmit && $v.projectForm.start_date.$error}" 
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                       <label>{{$t("common.Deadline")}}</label>
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="projectForm.deadline" @change="getUserResourceList"  append-to-body lang="nb" 
                           :class="{'is-invalid': projectSubmit && $v.projectForm.deadline.$error}" 
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add employee")}}</label>  
                        <div class="col-lg-12">
                             <multiselect 
                            
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                name="userValue"
                                v-model="userValue" 
                                :options="taskUsersList"
                                :multiple="true"
                                track-by="first_name"
                                :class="{'is-invalid': projectSubmit && $v.userValue.$error}" 
                                :custom-label="customLabelUser"
                                :close-on-select="false"
                                :placeholder="$t('common.Select option')"
                                @select=onSelectUser($event)
                                @remove=onRemoveUsers($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available employee for this dates")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"   @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.first_name }} {{ scope.option.last_name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                              </multiselect>
                           
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                      <label>Legg til maskin</label>  
                        <div class="col-lg-12">
                          <multiselect
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="machineValue" 
                                :options="taskMachinesList"
                                :multiple="true"
                                :placeholder="$t('common.Select option')"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onSelectMachine($event)
                                @remove=onRemoveMachine($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available machine for this dates")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                            
                        </div>
                      </div>
                    </div>
                     <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add tool")}}</label>  
                        <div class="col-lg-12">
                          <multiselect
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="toolValue" 
                                :options="taskToolsList"
                                :multiple="true"
                                :placeholder="$t('common.Select option')"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onSelectTool($event)
                                @remove=onRemoveTool($event)
                                >
                                 <span slot="noOptions">{{$t("common.Not an available tool for this dates")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"   v-model="scope.option.checked" @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>

                            
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add external resource")}}</label>
                        <div class="col-lg-12">
                            <multiselect 
                                        :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
                                v-model="resoourceValue" 
                                :options="taskExternalResourceList"
                                :multiple="true"
                                :placeholder="$t('common.Select option')"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onSelectExternalResource($event)
                                @remove=onRemoveExternalResource($event)
                                >
                                 <span slot="noOptions">{{$t("common.Not an available resource for this dates")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Add contact pesron")}}</label>  
                        <input v-model="projectForm.contact_person" type="text" class="form-control" :placeholder="this.$t('common.Contact person')" name="contact_person"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.contact_person.$error}" />
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Add post number")}}</label>  
                        <input v-model="projectForm.post_number" type="text" class="form-control" :placeholder="$t('common.Post number')" name="post_number"
                        />
                    </div>                   
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Address")}}</label>  
                        <input v-model="projectForm.address" type="text" class="form-control"  :placeholder="$t('common.Address')" name="address"
                />
                    </div>
                     <div class="col-md-12 pt-3">
                       <label>{{$t("common.description")}}</label>  
                        <textarea v-model="projectForm.description" type="text" class="form-control" rows="3" :placeholder="$t('common.description')" name="description"
                        ></textarea>
                    </div> 
                    <div class="modal-footer mt-3">  
                      <button type="submit" class="btn btn-outline-success">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
                    </div>
                </div>
   </form>     
</b-modal>


 <b-modal v-model="editProjectModal"  hide-footer size="lg" :title="$t('common.Edit project')" @hidden="resetEditModal()">
   <form action="#" @submit.prevent="SubmitEditProject">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <label>{{$t("common.Name")}}</label>  
                        <input v-model="editProjectForm.title" type="text" class="form-control" :placeholder="$t('common.Project name')" name="title"
                         :class="{'is-invalid': SubmitEditProject && $v.editProjectForm.title.$error}" />

                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                        <label>{{$t("common.Start date")}}</label>  
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="editProjectForm.start_date" @change="getUserResourceListEdit"   append-to-body lang="nb"
                          :class="{'is-invalid': SubmitEditProject && $v.editProjectForm.start_date.$error}"
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                       <label>{{$t("common.Deadline")}}</label>
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="editProjectForm.deadline" @change="getUserResourceListEdit"  append-to-body lang="nb" 
                          :class="{'is-invalid': SubmitEditProject && $v.editProjectForm.deadline.$error}" 
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                                        <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add employee")}}</label>  
                        <div class="col-lg-12">
                             <multiselect 
                                        :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
                                v-model="editUserValue" 
                                :options="taskUsersList"
                                :multiple="true"
                                track-by="first_name"
                                :custom-label="customLabelUser"
                                :close-on-select="false"
                                :placeholder="$t('common.Select option')"
                                @select=onAddUser($event)
                                @remove=onDeleteUsers($event)
                                :class="{'is-invalid': SubmitEditProject && $v.editUserValue.$error}" 
                                >
                                  <span slot="noOptions">{{$t("common.Not an available employee for this dates")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"   @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.first_name }} {{ scope.option.last_name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                              </multiselect>
                           
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                      <label>{{$t('common.Add-machine')}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                                       :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
                                v-model="editMachineValue" 
                                :options="taskMachinesList"
                                :multiple="true"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                :placeholder="$t('common.Select option')"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available machine for this dates")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                            
                        </div>
                      </div>
                    </div>
                     <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add tool")}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                                        :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
                                v-model="editToolValue" 
                                :options="taskToolsList"
                                :multiple="true"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                :placeholder="$t('common.Select option')"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available tool for this dates")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"   v-model="scope.option.checked" @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>

                            
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add external resource")}}</label>
                        <div class="col-lg-12">
                            <multiselect 
                                       :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
                                v-model="editResoourceValue" 
                                :options="taskExternalResourceList"
                                :multiple="true"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                :placeholder="$t('common.Select option')"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available resource for this dates")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Add contact pesron")}}</label>  
                        <input v-model="editProjectForm.contact_person" type="text" class="form-control" :placeholder="this.$t('common.Contact person')" name="contact_person"
                        :class="{'is-invalid': projectSubmit && $v.editProjectForm.contact_person.$error}" />
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Add post number")}}</label>  
                        <input v-model="editProjectForm.post_number" type="text" class="form-control" :placeholder="$t('common.Post number')" name="post_number"
                        />
                    </div>                   
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Address")}}</label>  
                        <input v-model="editProjectForm.address" type="text" class="form-control" :placeholder="$t('common.Address')" name="address"
                />
                    </div>
                     <div class="col-md-12 pt-3">
                       <label>{{$t("common.description")}}</label>  
                        <textarea v-model="editProjectForm.description" type="text" class="form-control" rows="3" :placeholder='$t("common.description")' name="description"
                        ></textarea>
                    </div> 
                     <div class="modal-footer mt-3">  
                      <button type="submit" class="btn btn-outline-success">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
                    </div>
                </div>
   </form>     
</b-modal>






<b-modal v-model="extraModal"  hide-footer size="xl" title="" style="height:500px">
      <div class="row">
        <div class="col-md-5 border-end">
           <div class="row">
              <div class="col-md-2">
                 <div class="rounded-circle bg-info text-center text-white text-uppercase font-size-20" style="display:inline-block; width:4rem; height:4rem; line-height:4rem">
                    {{ extraModelName }}
                </div>
            </div>
            <div class="col pt-2">
           <i class="bx bx-user-circle font-size-14 text-warning"></i>
            <span class="ms-2">{{ extraName }}</span>
            <hr class="p-0 mb-1 mt-1">
           <i class="bx bxs-phone-call font-size-14 text-warning"></i>    
            <span class="ms-2">{{ extraDesc }}</span>
              </div> 
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
                                <template #cell(file_name)="row" class="text-right">
                                <a
                                target="_blank"
                                  :href="'http://localhost:3000/en/attachments/file?uuid='+row.item.uuid"
                                  class="text-dark fw-medium"
                                  ><i
                                  class="mdi font-size-18 align-middle text-primary me-2"
                                    :class="getfileType(row.item.file_name)"
                                  ></i>
                                  {{row.item.file_name}}</a
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

  </Layout>
</template>
<style>
.mx-datepicker.is-invalid  input{
  border:1px solid #f46a6a  !important;
 }

.multiselect.is-invalid .multiselect__tags {
    border:1px solid #f46a6a  !important;
}
</style>
