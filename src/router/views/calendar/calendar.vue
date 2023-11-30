<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import ApiService from "@/state/modules/api.service";
import nbLocale from "@fullcalendar/core/locales/nb";
import DatePicker from 'vue2-datepicker'

import moment from "moment";
import Multiselect from "vue-multiselect";

import { required } from "vuelidate/lib/validators";
import Swal from "sweetalert2";

import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import 'vue2-datepicker/locale/nb';
import {  categories } from "./data-calendar";

/**
 * Calendar component
 */
export default {
  page: {
    title: "Calendar",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    FullCalendar,
    Multiselect,
    Layout,
    DatePicker
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
      title: "Calendar",
      items: [
        {
          text: "Home",
        },
        {
          text: "Calendar",
          active: true,
        },
      ],
      showAddAlert: false,
      projectSubmit:false,
       taskUsersList:[],
      taskExternalResourceList:[],
      taskMachinesList:[],
      taskToolsList:[],
      userValue:null,
      machineValue: null,
      toolValue:null,
      resoourceValue: null,
      alertText:null,
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
      calendarEvents: [],
      calendarOptions: {
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        locale: nbLocale,
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
        eventResizableFromStart: true,
        dateClick: this.dateClicked,
        eventClick: this.editEvent,
        eventsSet: this.handleEvents,
        weekends: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
      },
      isEmployee:false,
      currentEvents: [],
      showModal: false,
      eventModal: false,
      categories: categories,
      submitted: false,
      submit: false,
      newEventData: {},
      edit: {},
      deleteId: {},
      event: {
        title: "",
        category: "",
      },
      editevent: {
        editTitle: "",
        editcategory: "",
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
    addProjectForm() {
        this.projectSubmit = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {
        
           this.projectForm.start_date = this.format_date(this.projectForm.start_date)
            this.projectForm.deadline = this.format_date(this.projectForm.deadline)
       

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
          const calendarApi = this.$refs.calendar.getApi()
            // eslint-disable-next-line no-unused-vars
            ApiService.post("/projects", this.projectForm).then(response => {
            // eslint-disable-next-line no-console
           // this.projects.push(response.data.project)
          
              const value = response.data.project

              
           calendarApi.addEvent({
           id: value.id,
           title: value.title,
           project_id: value.title,
           user: value.contact,
           status: value.status=="open"?"Åpen": (value.status=="done"?"Utført":(value.status=="in_progress"?"Påbegynt":"Reaktivert")),
           sdate: moment(String(value.start_date)).format("DD MMM, YYYY"),
           edate: moment(String(value.deadline)).format("DD MMM, YYYY"),
           start: value.start_date,
           end: value.deadline,
          className: (Date.parse(value.deadline)< new Date()  && value.status != 'reactivated' && value.status != 'done')?"bg-danger":(value.status=="open"? 'bg-info text-white':
                     value.status=="in_progress"?'bg-warning text-white':
                     value.status=="done"?"bg-success  text-white": "bg-secondary text-white"),
        })
            this.successmsg(this.$t("common.Project has been saved"));
            this.showModal = false;
          
          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0].message
         
          }
          )

               
           }
    },
          resetModal() {
          this.showAddAlert = false;
          this.projectForm.title = null;
          this.projectForm.description = null;
          this.projectForm.address = null;
          this.projectForm.post_number = null;
          this.projectForm.contact_person = null;
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
    getUserResourceList() {
      ApiService.get("/resources/task_resource_list?start_date="+this.format_date(this.projectForm.start_date)+"&deadline="+this.format_date(this.projectForm.deadline)).then(
      response => {
           // eslint-disable-next-line no-console
          this.taskExternalResourceList = []
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
    deleteEvent() {
      this.edit.remove();
      this.eventModal = false;
    },
    /**
     * Modal open for add event
     */
    dateClicked(info) {
      // eslint-disable-next-line no-console
 
      this.projectForm.start_date = info.date 
      this.projectForm.deadline = info.date
      this.newEventData = info;
      this.showModal = true;
      this.getUserResourceList();
    },
    /**
     * Modal open for edit event
     */
    editEvent(info) {
      this.edit = info.event;
      this.editevent.editTitle = this.edit.title;
      this.editevent.editcategory = this.edit.classNames[0];
      this.eventModal = true;
    },

    closeModal() {
      this.eventModal = false;
    },

    confirm() {
      Swal.fire({
        title: this.$t("common.Are you sure"),
        text: this.$t("common.You won't be able to delete this"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText: this.$t("common.Cancel"),
      }).then((result) => {
        if (result.value) {
          this.deleteEvent();
          Swal.fire(this.$t("common.Deleted"), this.$t("common.Event has been deleted"), "success");
        }
      });
    },

    /**
     * Show list of events
     */
    handleEvents(events) {
      this.currentEvents = events;
    },

    /**
     * Show successfull Save Dialog
     */
    successmsg(text) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: text,
        showConfirmButton: false,
        timer: 2000,
      });
    },
    asd(id){
      return this.$store.state.authfack.user.role_group=='Employee'?'#':'/#/projects/overview/'+id
    },
     refreshEvents() {
       // eslint-disable-next-line no-console
      
            
      let calendarApi = this.$refs.calendar.getApi()



       if (this.$store.state.authfack.user.role_group == "Employee")  {
         
         this.calendarOptions.initialEvents.map(function(value) {

           
           calendarApi.addEvent({
           id: value.id,
           title: value.title,
           address: value.address,
           project_id: value.id,
           user: value.contact,
           status: value.status=="open"?"Åpen": (value.status=="done"?"Utført":(value.status=="in_progress"?"Påbegynt":"Reaktivert")),           sdate: moment(String(value.start)).format("DD MMM, YYYY"),
           edate: moment(String(value.end)).format("DD MMM, YYYY"),
           start: value.start,
           end: value.end,
            className: (Date.parse(value.end)< new Date()  && value.status != 'reactivated' && value.status != 'done')?"bg-danger  text-white":(value.status=="open"? 'bg-info text-white':
                     (value.status=="in_progress"?'bg-warning text-white':
                     (value.status=="done"?"bg-success  text-white": "bg-secondary text-white"))),
           })
   });


       } else {
       this.calendarOptions.initialEvents.map(function(value) {
         if(value.title != null)
           
           calendarApi.addEvent({
           id: value.id,
           title: value.title,
           project_id: value.project_id,
           user: value.first_name+" "+value.last_name,
           status: value.status=="open"?"Åpen": (value.status=="done"?"Utført":(value.status=="in_progress"?"Påbegynt":"Reaktivert")),
           sdate: moment(String(value.start)).format("DD MMM, YYYY"),
           edate: moment(String(value.end)).format("DD MMM, YYYY"),
           start: value.start,
           end: value.end,
           className: (Date.parse(value.end)< new Date()  && value.status != 'reactivated' && value.status != 'done')?"bg-danger  text-white":(value.status=="open"? 'bg-info text-white':
                     (value.status=="in_progress"?'bg-warning text-white':
                     (value.status=="done"?"bg-success  text-white": "bg-secondary text-white"))),    
        })
   });
       }
      
   
        }
  },

  created(){
    this.isEmployee = this.$store.state.authfack.user.role_group=="Employee"?true:false
    // eslint-disable-next-line no-console
    let url = (this.$store.state.authfack.user.role_group=="Employee"?"/users/employee_calendar":"projects/project_calendar")

      ApiService.setHeader();
       ApiService.get(url).then(
      response => {

        this.calendarOptions.initialEvents =  response.data.dates;
         this.refreshEvents();
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
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="app-calendar">
              <FullCalendar
                ref="calendar"
                :options="calendarOptions">
                  <template v-slot:eventContent='arg'>
                   <a :href="asd(arg.event.id)" :id="`taskView-`+arg.event.id" class="text-white d-inline-block">
                   
                        {{ arg.event.extendedProps.project_id }}   {{ arg.event.title }}    
                     
                  </a>
                  <b-popover  variant="danger"  :target="`taskView-`+arg.event.id" triggers="hover" placement="bottom">
                   <span v-if="!isEmployee">ID:  {{ arg.event.extendedProps.project_id }} <br></span>
                 
                     {{$t("common.Title")}}:  {{ arg.event.title }} <br>
                     Status:  {{arg.event.extendedProps.status }} <br>
                     {{$t("common.Contact person")}}:  {{ arg.event.extendedProps.user }} <br>
                      <span v-if="isEmployee">{{$t("common.Address")}}:  {{ arg.event.extendedProps.address }} <br></span>
                     {{$t("common.Start date")}}: {{arg.event.extendedProps.sdate}} <br>
                     {{$t("common.End date")}}: {{arg.event.extendedProps.edate}} 
                                      </b-popover>
                  </template>
              </FullCalendar>
            </div>
          </div>
        </div>
      </div>
    </div>

     <b-modal v-model="showModal"  hide-footer size="lg" :title="$t('common.Create new project')" @hidden="resetModal()">
   <form action="#" @submit.prevent="addProjectForm">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <label>{{$t("common.Name")}}</label>  
                        <input v-model="projectForm.title" type="text" class="form-control" :placeholder="$t('common.Project name')" name="title"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.title.$error}" />
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                        <label>{{$t("common.Start date")}}</label>  
                        <div class="col-lg-12">
                          <date-picker  :formatter="myFormat"  v-model="projectForm.start_date" @change="getUserResourceList"   append-to-body lang="nb" 
                          
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                       <label>{{$t("common.Deadline")}}</label>
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="projectForm.deadline" @change="getUserResourceList"  append-to-body lang="nb" 
                          
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
                                v-model="userValue" 
                                :options="taskUsersList"
                                :multiple="true"
                                track-by="first_name"
                                :custom-label="customLabelUser"
                                :close-on-select="false"
                                :placeholder="$t('common.Select option')"
                                @select=onSelectUser($event)
                                @remove=onRemoveUsers($event)
                                >
                                  <span slot="noOptions">{{$t('common.Not an available resource for this dates')}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"   @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.first_name }} {{ scope.option.last_name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t('common.Avialable dates')}}: </span> 
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
                      <label>{{$t('common.Add machine')}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="machineValue" 
                                :options="taskMachinesList"
                                :multiple="true"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                :placeholder="$t('common.Select option')"
                                @select=onSelectMachine($event)
                                @remove=onRemoveMachine($event)
                                >
                                  <span slot="noOptions">{{$t('common.Not an available resource for this dates')}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">Avialable dates: </span> 
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
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                :placeholder="$t('common.Select option')"
                                @select=onSelectTool($event)
                                @remove=onRemoveTool($event)
                                >
                                  <span slot="noOptions">{{$t('common.Not an available resource for this dates')}}</span>
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
                        <label>{{$t('common.Add external resource')}}</label>
                        <div class="col-lg-12">
                            <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="resoourceValue" 
                                :options="taskExternalResourceList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onSelectExternalResource($event)
                                @remove=onRemoveExternalResource($event)
                                >
                                  <span slot="noOptions">{{$t('common.Not an available resource for this dates')}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t('common.Avialable dates')}}: </span> 
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
                      <label>{{$t('common.Add contact pesron')}}</label>  
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
                        <input v-model="projectForm.address" type="text" class="form-control" :placeholder="$t('common.Address')" name="address"
                />
                    </div>
                     <div class="col-md-12 pt-3">
                       <label>{{$t('common.description')}}</label>  
                        <textarea v-model="projectForm.description" type="text" class="form-control" rows="3" :placeholder="$t('common.description')" name="description"
                        ></textarea>
                    </div>
                    <div class="modal-footer">
                         <button type="submit" class="btn btn-outline-success">  <i class="bx bx-save"></i> {{$t('common.Save')}}</button>
                      </div>
                  </div>
   </form>     

</b-modal>

  <!-- <b-modal
      size="lg"
      v-model="showModal"
      title="Add New Project"
      title-class="text-black font-18"
      body-class="p-3"
      hide-footer
    >
   <form action="#" @submit.prevent="addProjectForm">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <label>Name</label>  
                        <input v-model="projectForm.title" type="text" class="form-control" placeholder="Project Name" name="title"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.title.$error}" />
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                        <label>Start Date</label>  
                        <div class="col-lg-12">
                          <date-picker v-model="projectForm.start_date"  append-to-body lang="nb"   name="start_date"
                           :class="{'is-invalid': projectSubmit && $v.projectForm.start_date.$error}"
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                       <label>Deadline</label>
                        <div class="col-lg-12">
                          <date-picker v-model="projectForm.deadline"  append-to-body lang="nb"  name="deadline"
                          :class="{'is-invalid': projectSubmit && $v.projectForm.deadline.$error}"
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>Add Contact Pesron</label>  
                        <input v-model="projectForm.contact_person" type="text" class="form-control" placeholder="Contact Person" name="contact_person"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.contact_person.$error}" />
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>Add Post Number</label>  
                        <input v-model="projectForm.post_number" type="text" class="form-control" placeholder="Post Number" name="post_number"
                        />
                    </div>
                   
                    <div class="col-md-6 pt-3">
                      <label>Address</label>  
                        <input v-model="projectForm.address" type="text" class="form-control" placeholder="Address" name="address"
                />
                    </div>
                     <div class="col-md-12 pt-3">
                       <label>Description</label>  
                        <textarea v-model="projectForm.description" type="text" class="form-control" rows="3" placeholder="Description" name="description"
                        ></textarea>
                    </div> 
                    <div class="col-md-12 mt-3">
                      <button type="submit" class="btn btn-primary">  <i class="bx bx-save"></i> Save</button>
                    </div>
                </div>
   </form>  
  </b-modal> -->

  </Layout>
</template>
<style >
.popover-body {
  font-size: 14px;
  padding: 6px;
  border: 1px solid #d3d3d3 !important;
  background: #f8f8f8;
  border-radius: 5px;
}
.fc-event{
    cursor: default !important;
}
.mx-datepicker.is-invalid  input{
  border:1px solid #f46a6a  !important;
 
}
.fc-time {
    display:none;
}
.fc .fc-timegrid-slot-label {
  display: none;
}
</style>
