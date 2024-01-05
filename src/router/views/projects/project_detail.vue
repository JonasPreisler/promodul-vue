<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";
import json from "@/helpers/country.json";


import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import nbLocale from "@fullcalendar/core/locales/nb";


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
    FullCalendar
  },
  data() {
    return {
      country: json,
      title: this.$t('common.Projects'),
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
      modalFileTitle: this.$t("common.New project"),
      addFileModal:false,
      alertText:null,
      showAddAlert: false,
      projectSubmit:false,
      projects: [],
      projectModal: false,
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
          label: this.$t('common.Title'),
          key: "project_id"
      },{
          label: this.$t('common.Title'),
          key: "Title"
      },
        {
          label: this.$t('common.Contact person'),
          key: "contact_person"
      },
      {
          label: this.$t("common.Manager"),
          key: "post_number"
          
      },    
      {
          label: "",
          key: "id",
          sortable: true,
           class: "text-end"
      },
      ],
      projectForm: {
        title: null,
        description: null,
        address: null,
        post_number: null,
        contact_person: null
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
    projectForm: {
      title: { required },
      contact_person: { required }
      },
    },
  methods: {
     getfileType(filename) {
       // eslint-disable-next-line no-console
       const name = filename.substr(filename.lastIndexOf('.') + 1);
              return  this.filetype.hasOwnProperty(name)? this.filetype[name]:this.filetype["uknown"];
     },
    addProjectForm() {
        this.projectSubmit = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {
          ApiService.post("/projects", this.projectForm).then(response => {
           

             this.projects.push(response.data.project)
         
            this.projectModal = false;
          
          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0]["message"]
            // eslint-disable-next-line no-console
          
          }
          )}
    },
    addProjectModal(){
      this.projectModal = true
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
        this.extraModelName = item.first_name.substring(0,1)+'.'+ item.last_name.substring(0,1)
        this.extraName = item.first_name+" "+item.last_name
        this.extraDesc = item.phone_number

    ApiService.get("/attachments/get_files?attached_on_type=UserAccount&attached_on_id="+item.id).then(
      response => {
        this.ExtraFileList = response.data.files.UserAccount.customer;   
      
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
  },
  mounted() { 
      

      ApiService.setHeader();
       ApiService.get("projects/"+parseInt(this.$route.params.id)).then(
      response => {
        this.projects = response.data.project
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
};
</script>

<template>
  <Layout>

  <div class="row">

    <div class="col-12 mb-4">
      <b-button size="sm"  variant="primary" @click="addProjectModal()">
        <i class="bx bx-plus font-size-16 align-middle me-2"></i> {{$t('common.add')}}
      </b-button>
    </div>
  </div>

    <div class="row">
      <div class="col-lg-12">
 <div class="card">
          <div class="card-body">
            <div class="media">
              <div class="avatar-md me-4">
                <span
                  class="avatar-title rounded-circle bg-light text-danger font-size-16"
                >
                                 </span>
              </div>

              <div class="media-body overflow-hidden">
                <h5 class="text-truncate font-size-15">
                  <a href="javascript: void(0);" class="text-dark">{{
                    projects.title
                  }}</a>
                </h5>
                <p class="text-muted mb-4">{{ projects.description }}</p>
                <div class="avatar-group">
                  <div class="avatar-group-item">
                    <a
                      href="javascript: void(0);"
                      class="d-inline-block"
                    >
                      
                    </a>
                  </div>
                
              
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 border-top">
            <ul class="list-inline mb-0">
              <li class="list-inline-item me-3">
                <span
                  class="badge bg-success"
                
                  >{{$t("common.Completed")}}</span>
              </li>
              <li
                v-b-tooltip.hover.top
                class="list-inline-item me-3"
                title="Due Date"
              >
                <i class="bx bx-ca_atlendar me-1"></i>
                {{projects.created_at}}
              </li>
              <li
                v-b-tooltip.hover.top
                class="list-inline-item me-3"
                title="Comments"
              >
                <i class="bx bx-comment-dots me-1"></i>
                {{$t("common.comment")}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->

     

 <b-modal v-model="projectModal"  hide-footer size="lg" :title="$t('common.Resgister user')" @hidden="resetModal()">
    
         <form action="#" @submit.prevent="addProjectForm" href="formula">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <input v-model="projectForm.title" type="text" class="form-control" :placeholder="$t('common.Project name')" name="title"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.title.$error}" />
                    </div>
                    <div class="col-md-6">
                        <input v-model="projectForm.contact_person" type="text" class="form-control" :placeholder="$t('common.Contact person')" name="contact_person"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.contact_person.$error}" />
                    </div>
                    <div class="col-md-6 pt-3">
                        <input v-model="projectForm.post_number" type="text" class="form-control" :placeholder="$t('common.Post number')" name="post_number"
                        />
                    </div>
                   
                    <div class="col-md-6 pt-3">
                        <input v-model="projectForm.address" type="text" class="form-control" :placeholder="$t('common.Address')" name="address"
                />
                    </div>
                     <div class="col-md-12 pt-3">
                        <textarea v-model="projectForm.description" type="text" class="form-control" rows="3" :placeholder="$t('common.description')" name="description"
                        ></textarea>
                    </div> 
                    <div class="col-md-12 mt-3">
                      <button type="submit" class="btn btn-primary">  <i class="bx bx-save"></i> {{$t('common.Save')}}</button>
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
                      <button type="submit" class="btn btn-primary">  <i class="bx bx-save"></i> {{$t('common.Save')}}</button>
                    </div>
                </div>
            </form>
        </div>
</b-modal>

  </Layout>
</template>
