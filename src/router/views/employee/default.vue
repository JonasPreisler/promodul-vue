<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";
import json from "@/helpers/country.json";
import moment from "moment";

import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import nbLocale from "@fullcalendar/core/locales/nb";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import Swal from "sweetalert2";

import {
  required,
  email,
  minLength,
  sameAs,numeric
  } from "vuelidate/lib/validators";

/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Employee",
    meta: [
      {
        name: "Employee",
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
      passwordFieldType: "password",
      repeatPasswordFieldType: "password",  
      passIcon: "mdi-eye",
      repeatPassIcon: "mdi-eye",
      country: json,
      title: "Users",
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "Users",
          active: true,
        },
      ],
      superAdmin: false,
      projectManager: false,
      modalFileTitle: this.$t("common.Add file"),
      addFileModal:false,
      alertText:null,
      showAddAlert: false,
      typesubmit:false,
      attachSubmit:false,
      transactions: [],
      userModal: false,
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
      userIdForCalendar:0,
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
          label: this.$t("common.Name"),
          key: "first_name"
      },
        {
          label: this.$t("common.Username"),
          key: "username"
      },{
        label: this.$t("common.Email"),
        key: "email"
      },
      {
        label: this.$t("common.Phone"),
        key: "phone_number"
      },
     
      {
          label: "",
          key: "id",
          sortable: true,
           class: "text-end"
      },
      ],
      typeform: {
        first_name: null,
        last_name: null,
        username: null,
        phone_number: null,
        phone_number_iso: "NO",
        email: null,
        password: null,
        password_confirmation: null
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
        editable: false,
        droppable: false,
        eventResizableFromStart: false,
        weekends: true,
        selectable: false,
        selectMirror: false,
        dayMaxEvents: true,
      },
      };
  },
  validations: {
    attachForm: {
      exp_date: {required},
      file: {required}
    },
    typeform: {
      first_name: { required },
      last_name: { required },
      email: { required, email },
       phone_number: { required, numeric },
      password: { required, minLength: minLength(6) },
      password_confirmation: { required, sameAsPassword: sameAs("password") },
      },
    },
  methods: {
    successmsg(text) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: text,
        showConfirmButton: false,
        timer: 2000,
      });
    },
     getfileType(filename) {
       if (filename) {
       // eslint-disable-next-line no-console
       const name = filename.substr(filename.lastIndexOf('.') + 1);
              return  this.filetype.hasOwnProperty(name)? this.filetype[name]:this.filetype["uknown"];
     }
     },
    submitForm() {
     this.typesubmit = true;
     this.showAddAlert = false;
     this.alertText = null;
     this.$v.typeform.$touch();
        if (!this.$v.typeform.$invalid) {
          ApiService.post("/account/registration", this.typeform).then(() => {
         
            ApiService.get("/users/list").then(
              response => {
                this.transactions = response.data.users
                // eslint-disable-next-line no-console
                }
            );
            this.successmsg(this.$t("common.Employee added successfully"));
            this.userModal = false;
          },
          error =>{
            this.showAddAlert = true;
            let err_text= ""
            error.response.data.errors.map(function(value,key){
              err_text =err_text+ (key+1)+"."+value["message"]+". &nbsp;&nbsp;&nbsp;"
            })
            this.alertText = err_text
            // eslint-disable-next-line no-console
          
          }
          )
          
          }
    },
    addUserModal(){
      this.userModal = true
      },
      resetModal() {
          this.showAddAlert = false;
          this.typeform.first_name = null;
          this.typeform.last_name = null;
          this.typeform.username = null;
          this.typeform.phone_number = null;
          this.typeform.phone_number_iso = null;
          this.typeform.password = null;
          this.typeform.password_confirmation = null;
          this.typeform.email = null;
      },
      refreshEvents() {
        // eslint-disable-next-line no-console
        const calendarApi = this.$refs.calendar.getApi();
        ApiService.get("/users/user_calendar/"+this.userIdForCalendar).then(
          response => {
             response.data.dates.map(function(value) {
                calendarApi.addEvent({  id: value.id,
           title: value.title,
      
          // user: value.first_name+" "+value.last_name,
           status: value.status=="open"?"Open": (value.status=="done"?"Done":(value.status=="in_progress"?"In Progress":"Reactivated")),
           sdate: moment(String(value.start)).format("DD MMM, YYYY"),
           edate: moment(String(value.end)).format("DD MMM, YYYY"),
           start: value.start,
           end: value.end,
           className: (Date.parse(value.end)< new Date()  && value.status != 'reactivated' && value.status != 'done')?"bg-danger  text-white":(value.status=="open"? 'bg-info text-white':
                     (value.status=="in_progress"?'bg-warning text-white':
                     (value.status=="done"?"bg-success  text-white": "bg-secondary text-white"))),  })
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
        showExtraModal(ident, item) {
          setTimeout(this.refreshEvents, 100);
          this.userIdForCalendar = item.id
          // eslint-disable-next-line no-console
          this.extraModelName = item.first_name.substring(0,1)+'.'+ item.last_name.substring(0,1)
          this.extraName = item.first_name+" "+item.last_name
          this.extraDesc = item.phone_number

    ApiService.get("/attachments/get_files?attached_on_type=UserAccount&attached_on_id="+item.id).then(
      response => {
        this.ExtraFileList = [];
        if (response.data.files.UserAccount)
        this.ExtraFileList = response.data.files.UserAccount[this.extraName].filter((item)=>{
          return item.file_name != null
        });
      
        },
        error => {
          this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
    this.extraModal = true;      
      },
      showAttachmentModal(model, id) {
     
        this.attachForm.attached_on_id = id;
        this.attachForm.attached_on_type= model;
  
        // eslint-disable-next-line no-console
        this.attachForm.exp_date = null
        this.attachForm.file = null
        this.addFileModal = true
      },
          download(item,name){
      axios({
  url: 'https://apipromodul.no/en/attachments/file?uuid='+item, //your url
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
             
              Swal.fire(this.$t("common.Warning"), this.$t("common.Data not exists"), "warning");
              }
        );
    },
    attachFormSubmit() {

        this.attachSubmit = true;
     this.showAddAlert = false;
     this.alertText = null;
     this.$v.attachForm.$touch();
        if (!this.$v.attachForm.$invalid) {
    // eslint-disable-next-line no-consol
       const formData = new FormData();
        
        formData.append("attached_on_id", this.attachForm.attached_on_id);
        formData.append("attached_on_type", this.attachForm.attached_on_type);
             formData.append("file", this.attachForm.file);
             formData.append("exp_date", this.attachForm.exp_date);
                
                      // eslint-disable-next-line no-unused-vars
                      ApiService.post("/attachments", formData).then(response => {
                 
                 
            this.successmsg(this.$t("common.File uploaded successfully"))
             this.addFileModal = false;
          
           // eslint-disable-next-line no-unused-vars
           },error => {
           Swal.fire(this.$t("common.File upload"), this.$t("common.Something went wrong"), "error");
        });
        }
    },
    switchVisibility() {
      
     this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
     this.passIcon = this.passwordFieldType === "password" ? "mdi-eye" : "mdi-eye-off";
   },
   switchRepeatVisibility(){
      this.repeatPasswordFieldType = this.repeatPasswordFieldType === "password" ? "text" : "password";
     this.repeatPassIcon = this.repeatPassIcon === "password" ? "mdi-eye" : "mdi-eye-off";
   },
  deleteUser(id) {
       Swal.fire({
        title: this.$t("common.All data related to the user will be deleted"),
        text: this.$t("common.Delete user?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText: this.$t("common.Cancel")
      }).then((result) => {
        if (result.value) {
          ApiService.post("/users/delete_user/"+id).then(
            () => {
              ApiService.get("/users/list").then(
              response => {
                this.transactions = response.data.users
                // eslint-disable-next-line no-console
                }
            );
            this.successmsg(this.$t("common.The employee deleted successfully"))

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
  },
  mounted() { 
    this.superAdmin = this.$store.state.authfack.user.role_group == "Super Admin"? true:false

      ApiService.setHeader();
       ApiService.get("/users/list").then(
      response => {
        this.transactions = response.data.users
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

  <div class="row" v-if="superAdmin">

    <div class="col-12 mb-4">
      <b-button size="sm"  variant="primary" @click="addUserModal()">
        <i class="bx bx-plus font-size-16 align-middle me-2"></i> {{$t('common.add')}}
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
                   <b-table striped hover outlined  bordered
                   class="datatables"
                   :items="transactions"
                   :fields="fields"
                   responsive="sm"
                   :sort-by.sync="sortBy"
                   :sort-desc.sync="sortDesc"
                   :filter="filter"
                   >
                                  <template #cell(first_name)="row" >
                                    <div @click="showExtraModal(1, row.item)">
                                    <div  class="rounded-circle bg-info text-center text-white text-uppercase font-size-10" style="width:1.5rem; height:1.5rem; line-height:1.5rem">
                                      {{ row.item.first_name.substring(0,1) }}.{{ row.item.last_name.substring(0,1) }}
                                    </div>
                                    </div>
                                    </template>
                                    <template #cell(username)="row">
                                      <div @click="showExtraModal(1, row.item)">{{row.item.username}}</div>
                                    </template>
                                      <template #cell(email)="row">
                                      <div @click="showExtraModal(1, row.item)">{{row.item.email}}</div>
                                    </template>
                                    <template #cell(phone_number)="row">
                                      <div @click="showExtraModal(1, row.item)">{{row.item.phone_number}}</div>
                                    </template>
                                 <template #cell(id)="row" class="text-end">
                                    <b-button @click="showAttachmentModal('UserAccount', row.item.id)" size="sm" variant="outline-warning" class="me-2"><i class="bx bx-paperclip font-size-12 pt-1"></i></b-button>
                                    <b-button v-if="superAdmin" @click="deleteUser(row.item.id)" size="sm" variant="outline-danger" class="me-2"><i class="bx bx-trash font-size-12 pt-1"></i></b-button>

                                </template>
                             </b-table>
                      </div>
         </div>
        </div>
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->

     

 <b-modal v-model="userModal"  hide-footer size="lg" :title="$t('common.Register user')" @hidden="resetModal()">
    
         <form action="#" @submit.prevent="submitForm">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="warning">
                         <h5> <span v-html="alertText"></span> </h5>
                      </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <input v-model="typeform.first_name" type="text" class="form-control" :placeholder="$t('common.First name')" name="first_name"
                        :class="{'is-invalid': typesubmit && $v.typeform.first_name.$error}" />
                    </div>
                    <div class="col-md-6">
                        <input v-model="typeform.last_name" type="text" class="form-control" :placeholder="$t('common.Last name')"  name="last_name"
                        :class="{'is-invalid': typesubmit && $v.typeform.last_name.$error}" />
                    </div>
                    <div class="col-md-6 pt-3">
                        <input v-model="typeform.username" type="text" class="form-control" :placeholder="$t('common.Username')" name="username"
                        />
                    </div>
                    <div class="col-md-6 pt-3">
                      <div class="input-group">
                        <b-select
                        v-model="typeform.phone_number_iso"
                        class="form-select"
                        id="phone_number_iso"
                        name="phone_number_iso"
                        >
                          <option value="null" disabled selected></option>
                          <option
                            v-for="ctn in country"
                            :key="ctn.name"
                            :value="ctn.code"
                            >{{ ctn.name }}
                          </option>
                       </b-select>
                       <input v-model="typeform.phone_number" type="text" class="form-control" :placeholder="$t('common.Phone')" name="phone_number"
                       :class="{'is-invalid': typesubmit && $v.typeform.phone_number.$error}"/>
                       </div>
                    </div>
                   
                    <div class="col-md-6 pt-3">
                        <input v-model="typeform.email" type="text" class="form-control" :placeholder="$t('common.Email')" name="email"
                         :class="{
                      'is-invalid': typesubmit && $v.typeform.email.$error,
                    }"
                />
                    </div>
                    <div class="col-md-6 pt-3">
                       <div class="input-group ">
                       <input :type="passwordFieldType" v-model="typeform.password" class="form-control" :placeholder="$t('common.Password')" name="password"
                        :class="{
                      'is-invalid': typesubmit && $v.typeform.password.$error,
                    }"
                       >
                        <span class="input-group-text"  @click="switchVisibility"><i class="mdi" :class="passIcon" ></i></span>
                       </div>
                    </div>

                    <div class="col-md-6 pt-3">
                       
                        <div class="input-group ">
                          <input :type="repeatPasswordFieldType" v-model="typeform.password_confirmation" class="form-control" :placeholder="$t('common.Repeat password')" name="password_confirmation"
                          :class="{
                      'is-invalid':
                        typesubmit && $v.typeform.password_confirmation.$error,
                    }"
                          >
                          <span class="input-group-text" id="basic-addon1" @click="switchRepeatVisibility"><i class="mdi" :class="repeatPassIcon" ></i></span>
                       </div>
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
                                <span  @click="download(row.item.uuid, row.item.file_name)"
                                target="_blank"
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
                :options="calendarOptions">
                  <template v-slot:eventContent='arg'>
                   <a :href="'/#/projects/overview/'+arg.event.id" :id="`taskView`+arg.event.id" class="text-white d-inline-block">
                         {{ arg.event.title }}    
                  </a>
                  <b-popover  variant="danger"  :target="`taskView`+arg.event.id" triggers="hover" placement="bottom">
                    {{$t("common.Title")}}:  {{ arg.event.title }} <br>
                    Status:  {{$t("common."+arg.event.extendedProps.status) }} <br>
                     {{$t("common.Start date")}}: {{arg.event.extendedProps.sdate}} <br>
                     {{$t("common.End date")}}: {{arg.event.extendedProps.edate}} 
                </b-popover>
                  </template>
              </FullCalendar>
            </div>
        </div>
      </div>

</b-modal>

<b-modal v-model="addFileModal" hide-footer centered  :title="modalFileTitle">
    <form action="#" @submit.prevent="attachFormSubmit">
      <div class="row">
        <div class="col-md-6">
          <label>{{$t("common.Expiration date")}}</label>
          <input v-model="attachForm.exp_date" v-mask="'##.##.####'" placeholder="DD.MM.YYYY" type="text" class="form-control"
            :class="{'is-invalid': attachSubmit && $v.attachForm.exp_date.$error}" 
           />
        </div>
        <div class="col-sm-6">
          <label>{{$t("common.Document")}}</label>
          <b-form-file v-model="attachForm.file"   :class="{'is-invalid': attachSubmit && $v.attachForm.file.$error}" ></b-form-file>
        </div>
        <div class="modal-footer mt-3">
          <button type="submit" class="btn btn-outline-success">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
        </div>
      </div>
    </form>
</b-modal>

  </Layout>
</template>
<style>
.pointer {
  cursor: pointer;
} 
.custom-file-label{
  display: none;
}
.is-invalid {
  color: #f46a6a;
}
.fc-time {
    display:none;
}
.fc .fc-timegrid-slot-label {
  display: none;
}
</style>
