<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";
import json from "@/helpers/country.json";
import moment from "moment";
import Swal from "sweetalert2";
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/locale/nb';



import {
  required,
  } from "vuelidate/lib/validators";

/**
 * Dashboard Component
 */
export default {
  
  page: {
    title: "Companys",
    meta: [
      {
        name: this.$t("common.description"),
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    DatePicker,
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
      title: "Companys",
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "Companys",
          active: true,
        },
      ],
      modalFileTitle: this.$t("common.New company") ,
      addFileModal:false,
      alertText:null,
      showAddAlert: false,
      companySubmit:false,
      Companys: [],
      CompanyModal: false,
      editCompanyModal: false,
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
      fields: [
        
         {
          label: this.$t("common.Company Id"),
          key: "Company_id"
      },{
          label: this.$t("common.Title"),
          key: "Title"
      },
        {
          label: this.$t("common.Contact person"),
          key: "contact_person"
      },
      {
          label: this.$t("common.Company manager"),
          key: "post_number"
          
      },    
      {
          label: "",
          key: "id",
          sortable: true,
           class: "text-end"
      },
      ],
      CompanyId: 0, 
      companyForm: {
        name: null,
        description: null,
        address: null,
        phone_number: null,
        legal_entity: null,
      },
      editcompanyForm: {
        id: 0,
         name: null,
        description: null,
        address: null,
        phone_number: null,
        legal_entity: null,
      },

    
       calendarEvents: [],
      };
  },
  validations: {
    companyForm: {
      name: { required },
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
    onAddUser(option){
      
      this.addDeleteUserList.push({
      user_account_id:option.id
      })
     
    },
    onDeleteUsers(option) {
      this.addDeleteUserList.push({
         id: option.Company_user_id,
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
         id: option.Company_resource_id,
         resource_id: option.id,
         _destroy: true
      })

    },

     getfileType(filename) {
       // eslint-disable-next-line no-console
       const name = filename.substr(filename.lastIndexOf('.') + 1);
              return  this.filetype.hasOwnProperty(name)? this.filetype[name]:this.filetype["uknown"];
     },
     deleteCompany(id) {
       Swal.fire({
        title: this.$t("common.All the tasks and documents related to the Company will be deleted"),
        text: this.$t("common.Delete Company?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
          confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText: this.$t("common.Cancel"),
      }).then((result) => {
        if (result.value) {
          ApiService.delete("/Companys?id="+id).then(
            // eslint-disable-next-line no-unused-vars
            response => {
                   this.get_Company_list();
              Swal.fire(this.$t("common.Deleted"), this.$t("common.The company is deleted successfully"), "success");

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
    addCompanyForm() {
        this.companySubmit = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {
        

        
          if(this.CompanyId ==0) {

           

          this.userValue.forEach(element => {
            this.companyForm.user_account_Companys_attributes.push({"user_account_id":element.id})
          });
          if(this.machineValue) {
           this.machineValue.forEach(element => {
            this.companyForm.Company_resources_attributes.push({"resource_id":element.id})
          });
          }
          if(this.toolValue) {
              this.toolValue.forEach(element => {
              this.companyForm.Company_resources_attributes.push({"resource_id":element.id})
            });
          }
          if (this.resoourceValue) {
            this.resoourceValue.forEach(element => {
            this.companyForm.Company_resources_attributes.push({"resource_id":element.id})
          });
          }
            ApiService.post("/Companys", this.companyForm).then(response => {
            // eslint-disable-next-line no-console
            this.Companys.push(response.data.Company)
         
            this.CompanyModal = false;
          
          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0].message
           
          }
          )
               } 
               else if (this.CompanyId > 0) {
               const form  = new FormData();
               form.append("id",this.CompanyId);
               form.append("title",  this.companyForm.title)
               form.append('description',  this.companyForm.description)
               form.append("address",  this.companyForm.address)
               form.append("post_number",  this.companyForm.post_number)
               form.append("contact_person",  this.companyForm.contact_person)
               form.append("start_date",  this.companyForm.start_date)
               form.append("deadline",  this.companyForm.deadline)

               
                 ApiService.put("/Companys", form).then(() => {
            // eslint-disable-next-line no-console
             this.get_Company_list();         
            this.CompanyModal = false;
            this.CompanyId = 0;
          
          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0].message
          
          }
          )
               }
           }
    },
    SubmitEditCompany() {

      
    
        this.editcompanyForm.user_account_Companys_attributes = this.addDeleteUserList
        this.editcompanyForm.Company_resources_attributes = this.addDeleteResourceList 

          this.editcompanyForm.start_time = this.format_date(this.editcompanyForm.start_time)
          this.editcompanyForm.deadline = this.format_date(this.editcompanyForm.deadline)
  

         

            // eslint-disable-next-line no-unused-vars
            ApiService.put("/Companys", this.editcompanyForm).then(response => {
           
            this.editCompanyModal = false;
            this.get_Company_list()

          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0]["message"]
          
          
          }
          )
       
    },
    editCompany(item) {
      // eslint-disable-next-line no-console

       ApiService.get("/Companys/get_Company/"+item.id).then(
      response => {
        // eslint-disable-next-line no-console
        this.editUserValue = response.data.Company.users
        this.editResoourceValue   =response.data.Company.resources.resources
        this.editMachineValue = response.data.Company.resources.models
        this.editToolValue = response.data.Company.resources.tools

   
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
    
      this.editcompanyForm.id = item.id  
      this.editcompanyForm.title = item.title  
      this.editcompanyForm.description = item.description  
      this.editcompanyForm.address = item.address  
      this.editcompanyForm.post_number = item.post_number  
      this.editcompanyForm.contact_person = item.contact_person  
      this.editcompanyForm.start_date = new Date(item.start_date)  
      this.editcompanyForm.deadline =new Date(item.deadline)
      this.editCompanyModal = true

    },
    addCompanyModal(){
  
          this.companyForm.start_date = new Date()  
      this.companyForm.deadline = new Date()
      // eslint-disable-next-line no-console
          this.CompanyModal = true
          this.getUserResourceList()
      },
      resetModal() {
          this.showAddAlert = false;
          this.companyForm.title = null;
          this.companyForm.description = null;
          this.companyForm.address = null;
          this.companyForm.post_number = null;
          this.companyForm.contact_person = null;
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
    get_Company_list() {
      ApiService.get("/companys/Companys_list").then(
      response => {
        this.Companys = response.data.Companys
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
      ApiService.get("/resources/task_resource_list?start_date="+this.format_date(this.companyForm.start_date)+"&deadline="+this.format_date(this.companyForm.deadline)).then(
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

    },
  },
  mounted() { 

      ApiService.setHeader();
      this.get_Company_list();
    },
};
</script>

<template>
  <Layout>

  <div class="row">

    <div class="col-12 mb-4">
      <b-button size="sm"  variant="primary" @click="addCompanyModal()">
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
                                  :items="Companys"
                                  :fields="fields"
                                  responsive="sm"
                                  :sort-by.sync="sortBy"
                                  :sort-desc.sync="sortDesc"
                                  :filter="filter"
                                >
                                    <template #cell(title)="row" >
                                    {{ row.item.title }}
                                    </template>
                                    <template #cell(contact_person)="row">
                                      <div>{{row.item.contact_person}}</div>
                                    </template>
                                      <template #cell(post_number)="row">
                                      {{row.item.user_account.first_name}} {{row.item.user_account.last_name}}
                                    </template>
                                        <template #cell(id)="row" class="text-end">
                                            <b-button :href="'Companys/overview/'+row.item.id" size="sm" variant="outline-info" class="me-2"><i class="bx bx-detail font-size-12 pt-1"></i></b-button>
                                            <b-button  size="sm" @click="editCompany(row.item)" variant="outline-warning" class="me-2"><i class="bx bx-edit font-size-12 pt-1"></i></b-button>
                                            <b-button @click="deleteCompany(row.item.id)" size="sm" variant="outline-danger" class="me-2"><i class="bx bx-trash font-size-12 pt-1"></i></b-button>
                                    </template>
                                    
                             </b-table>
                      </div>
         </div>
        </div>
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->

     

 <b-modal v-model="CompanyModal"  hide-footer size="lg" :title="$t('common.Create new company')" @hidden="resetModal()">
   <form action="#" @submit.prevent="addCompanyForm">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <label>{{$t("common.name")}}</label>  
                        <input v-model="companyForm.name" type="text" class="form-control" :placeholder="$t('common.Company name')" name="name"
                        :class="{'is-invalid': companySubmit && $v.companyForm.name.$error}" />
                    </div>

                    <div class="col-md-6">
                      <label>{{$t("common.Phone")}}</label>  
                        <input v-model="companyForm.phone_number" type="text" class="form-control" :placeholder='$t("common.Phone")' name="phone_number"
                        />
                    </div>                   
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Address")}}</label>  
                        <input v-model="companyForm.address" type="text" class="form-control" :placeholder='$t("common.Address")' name="address"
                        />
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Legal entity")}}</label>  
                        <input v-model="companyForm.address" type="text" class="form-control" :placeholder='$t("common.Legal Entity")' name="legal_entity"
                        />
                    </div>
                     <div class="col-md-12 pt-3">
                       <label>{{$t("common.description")}}</label>  
                        <textarea v-model="companyForm.description" type="text" class="form-control" rows="3" :placeholder='$t("common.description")' name="description"
                        ></textarea>
                    </div> 
                    <div class="col-md-12 mt-3">
                      <button type="submit" class="btn btn-primary">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
                    </div>
                </div>
   </form>     
</b-modal>


 <b-modal v-model="editCompanyModal"  hide-footer size="lg" :title="$t('common.Edit company')" @hidden="resetEditModal()">
   <form action="#" @submit.prevent="SubmitEditCompany">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <label>{{$t("common.Name")}}</label>  
                        <input v-model="editcompanyForm.title" type="text" class="form-control" :placeholder="$t('common.Company name')" name="title" />
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                        <label>{{$t("common.Start date")}}</label>  
                        <div class="col-lg-12">
                          <date-picker  :formatter="myFormat"  v-model="editcompanyForm.start_date" @change="getUserResourceList"   append-to-body lang="nb"
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                       <label>{{$t("common.Deadline")}}</label>
                        <div class="col-lg-12">
                          <date-picker  :formatter="myFormat"  v-model="editcompanyForm.deadline" @change="getUserResourceList"  append-to-body lang="nb" ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Add post number")}}</label>  
                        <input v-model="editcompanyForm.post_number" type="text" class="form-control" :placeholder="$t('common.Post number')" name="post_number"
                        />
                    </div>                   
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Address")}}</label>  
                        <input v-model="editcompanyForm.address" type="text" class="form-control" :placeholder="$t('common.Address')" name="address"
                />
                    </div>
                     <div class="col-md-12 pt-3">
                       <label>{{$t("common.description")}}</label>  
                        <textarea v-model="editcompanyForm.description" type="text" class="form-control" rows="3" :placeholder="$t('common.description')" name="description"
                        ></textarea>
                    </div> 
                    <div class="col-md-12 mt-3">
                      <button type="submit" class="btn btn-primary">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
                    </div>
                </div>
   </form>     
</b-modal>




  </Layout>
</template>
<style>
.mx-datepicker.is-invalid  input{
  border:1px solid #f46a6a  !important;
 
}
</style>
