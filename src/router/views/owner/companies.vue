<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";
import json from "@/helpers/country.json";
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
    title: "Settings",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
  },
  data() {
    return {
     transactions:[],
     companySubmit:false,
      title: "Owner",
      items: [
        {
          text: this.$t("common.Owner companies"),
          href: "/",
        },
        {
           text: this.$t("common.Users"),
          active: true,
        },
      ],

     fields: [
         {
           label: this.$t("common.name"),
           key: "name"
      },
       
      {
        label: this.$t("common.Address"),
          key: "address"
      },
        {
          label: this.$t("common.phone"),
          key: "phone_number"
      },

        {
          label: "Status",
          key: "active",
          class: "text-center",
          
      },
      {
          label: "",
          key: "id",
          sortable: true,
           class: "text-end"
      },
      ],
      passwordFieldType: "password",
      repeatPasswordFieldType: "password",
      passIcon: "mdi-eye",
      repeatPassIcon: "mdi-eye",
      editCompanyModal: false,
       country: json,
      CompanyModal:false,
      alertText:null,
      showAddAlert: false,
      companyForm: {
        name: null,
        description: null,
        address: null,
        phone_number: null,
        legal_entity: null,

        first_name: null,
        last_name: null,
        username: null,
        adminphone_number: null,
        phone_number_iso: "NO",
        email: null,
        password: null,
        password_confirmation: null
      },
      editCompanyForm: {
         name: null,
        description: null,
        address: null,
        phone_number: null,
        legal_entity: null,
      },
      fullPage: true,
      useSlot: false,
      filter:null,
      sortBy: "name",
      sortDesc: false,
      show: true
      };
  },
  validations: {
    companyForm: {
      name: { required },
      first_name: { required },
      last_name: { required },
      email: { required, email },
      adminphone_number: { required, numeric },
      password: { required, minLength: minLength(6) },
      password_confirmation: { required, sameAsPassword: sameAs("password") },
        },
    },
  methods: {
      addCompanyModal(){

          this.CompanyModal = true

      },
      
      editCompany(item) {

      this.editCompanyForm.id = item.id  
      this.editCompanyForm.name = item.name  
      this.editCompanyForm.address = item.address  
      this.editCompanyForm.phone_number = item.phone_number  



      this.editCompanyModal = true

    },
       addcompanyForm() {
        
        this.companySubmit = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {

           const companyFormData = new FormData();
           companyFormData.append("name", this.companyForm.name);
           companyFormData.append("description", this.companyForm.description);
           companyFormData.append("address", this.companyForm.address);
           companyFormData.append("phone_number", this.companyForm.phone_number);
           companyFormData.append("legal_entity", this.companyForm.legal_entity);
        
            ApiService.post("/companies", companyFormData).then(response => {
            // eslint-disable-next-line no-console
             this.transactions.push(response.data.company)
             const adminFormData = new FormData();

          adminFormData.append("company_id", response.data.company.id);
          adminFormData.append("first_name", this.companyForm.first_name);
          adminFormData.append("last_name", this.companyForm.last_name);
          adminFormData.append("username", this.companyForm.username);
          adminFormData.append("phone_number", this.companyForm.adminphone_number);
          adminFormData.append("phone_number_iso", this.companyForm.phone_number_iso);
          adminFormData.append("email", this.companyForm.email);
          adminFormData.append("password", this.companyForm.password);
          adminFormData.append("password_confirmation", this.companyForm.password_confirmation);
          
          ApiService.post("/companies/company_admin", adminFormData).then(() => {
          
             this.CompanyModal = false;
             Swal.fire(this.$t("common.add"),this.$t("common.The Company registered successfully"), "success");
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
          
          
        
          
          },
          error =>{
          this.showAddAlert = true;
            let err_text= ""
            error.response.data.errors.map(function(value,key){
              err_text =err_text+ (key+1)+"."+value["message"]+". &nbsp;&nbsp;&nbsp;"
            })
            this.alertText = err_text
          }
          )
          } 

    },
      deleteCompany(id) {
       Swal.fire({
        title: this.$t("common.All data related to the company will be deleted"),
        text: this.$t("common.Delete company?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
         confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText: this.$t("common.Cancel"),
      }).then((result) => {
        if (result.value) {

          ApiService.delete("/companies?id="+id).then(
            () => {
              
              Swal.fire({
                icon: "success",
                title: this.$t("common.The company deleted successfully"),
                showConfirmButton: false,
                timer: 2500});

   ApiService.get("/planner_owners/companies").then(
      response => {
        this.transactions = response.data.companies
           // eslint-disable-next-line no-console
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );

         // eslint-disable-next-line no-console
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
    switchVisibility() {
      
     this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
     this.passIcon = this.passwordFieldType === "password" ? "mdi-eye" : "mdi-eye-off";
   },
   switchRepeatVisibility(){
      this.repeatPasswordFieldType = this.repeatPasswordFieldType === "password" ? "text" : "password";
     this.repeatPassIcon = this.repeatPasswordFieldType === "password" ? "mdi-eye" : "mdi-eye-off";
   },
  activeDeactiveCompany(status,id) {
       Swal.fire({
        title: status? this.$t("common.Activete company") :this.$t("common.Dectivete company"),
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: this.$t("common.Yes"),
      }).then((result) => {
        if (result.value) {
          const url = status? "/planner_owners/activate_license/":"/planner_owners/stop_license/"
          ApiService.post(url+id).then(
            () => {
          ApiService.get("/planner_owners/companies").then(
              response => {
                this.transactions = response.data.companies
                // eslint-disable-next-line no-console
                }
            );
              Swal.fire(status? this.$t("common.Activate"):this.$t("common.Deactivate"), 
                        status ? this.$t("common.The Company  activated successfully"): this.$t("common.The Company  deactivated successfully"), "success");
       
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


      ApiService.setHeader();
       ApiService.get("/planner_owners/companies").then(
      response => {
        this.transactions = response.data.companies
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
      <b-button size="sm"  variant="primary" @click="addCompanyModal()">
        <i class="bx bx-plus font-size-16 align-middle me-2"></i> {{$t('common.add')}}
      </b-button>
    </div>

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
                                  <template #cell(active)="row" class="text-start">
                                   <i @click="activeDeactiveCompany(true, row.item.id)"  v-if="!row.item.active"  class="mdi mdi-do-not-disturb font-size-20 text-danger pt-1"></i>
                                   <i @click="activeDeactiveCompany(false, row.item.id)"  v-if="row.item.active" class="mdi mdi-check-circle font-size-20 text-success pt-1"></i>

                                </template>
                                 <template #cell(id)="row" class="text-start">
                                    <b-button  :href="'/#/owner_companies/overview/'+row.item.id"  size="sm" variant="outline-primary" class="me-2"><i class="bx bx-detail font-size-12 pt-1"></i></b-button>
                                    <!-- <b-button  size="sm" @click="editCompany(row.item)" variant="outline-warning" class="me-2"><i class="bx bx-edit font-size-12 pt-1"></i></b-button>
                                    <b-button @click="deleteCompany(row.item.id)" size="sm" variant="outline-danger" class="me-2"><i class="bx bx-trash font-size-12 pt-1"></i></b-button> -->

                                </template>
                             </b-table>
                      </div>
         </div>
        </div>
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->

    

 <b-modal v-model="CompanyModal"  hide-footer size="lg" :title="$t('common.Create new company')">
   

   <form action="#" @submit.prevent="addcompanyForm">
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
                      <label>Phone Number</label>  
                        <input v-model="companyForm.phone_number" type="text" class="form-control" :placeholder="$t('common.Phone')" name="phone_number"
                        />
                    </div>                   
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Address")}}</label>  
                        <input v-model="companyForm.address" type="text" class="form-control" :placeholder="$t('common.Address')" name="address"
                        />
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>Legal entity</label>  
                        <input v-model="companyForm.legal_entity" type="text" class="form-control" :placeholder="$t('common.Legal Entity')"  name="legal_entity"
                        />
                    </div>
                     <div class="col-md-12 pt-3">
                       <label>{{$t("common.description")}}</label>  
                        <textarea v-model="companyForm.description" type="text" class="form-control" rows="3" :placeholder="$t('common.Description')" name="description"
                        ></textarea>
                    </div> 
                  <div class="col-12 pt-3">
                  Add administrator
                  <hr>
                  </div>
                    <div class="col-md-6">
                        <input v-model="companyForm.first_name" type="text" class="form-control" :placeholder="$t('common.First name')" name="first_name"
                        :class="{'is-invalid': companySubmit && $v.companyForm.first_name.$error}" />
                    </div>
                    <div class="col-md-6">
                        <input v-model="companyForm.last_name" type="text" class="form-control"  :placeholder="$t('common.Lasat name')" name="last_name"
                        :class="{'is-invalid': companySubmit && $v.companyForm.last_name.$error}" />
                    </div>
                    <div class="col-md-6 pt-3">
                        <input v-model="companyForm.username" type="text" class="form-control"  :placeholder="$t('common.Username')" name="username"
                        />
                    </div>
                    <div class="col-md-6 pt-3">
                      <div class="input-group">
                        <b-select
                        v-model="companyForm.phone_number_iso"
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
  



   <input v-model="companyForm.adminphone_number" type="text" class="form-control"  :placeholder="$t('common.Phone')" name="adminphone_number"
        :class="{'is-invalid': companySubmit && $v.companyForm.adminphone_number.$error}"             />
</div>
                    </div>
                   
                    <div class="col-md-6 pt-3">
                        <input v-model="companyForm.email" type="text" class="form-control" :placeholder="$t('common.Email')" name="email"
                         :class="{
                      'is-invalid': companySubmit && $v.companyForm.email.$error,
                    }"
                />
                    </div>
                    <div class="col-md-6 pt-3">
                       <div class="input-group ">
                       <input :type="passwordFieldType" v-model="companyForm.password" class="form-control" :placeholder="$t('common.Password')" name="password"
                        :class="{
                      'is-invalid': companySubmit && $v.companyForm.password.$error}"
                       >
                        <span class="input-group-text"  @click="switchVisibility"><i class="mdi" :class="passIcon" ></i></span>
                       </div>
                    </div>
                    <div class="col-md-6 pt-3">
                       
                        <div class="input-group ">
                          <input :type="repeatPasswordFieldType" v-model="companyForm.password_confirmation" class="form-control"  :placeholder="$t('common.Repeat password')" name="password_confirmation"
                          :class="{
                      'is-invalid':
                        companySubmit && $v.companyForm.password_confirmation.$error,
                    }"
                          >
                          <span class="input-group-text" id="basic-addon1" @click="switchRepeatVisibility"><i class="mdi" :class="repeatPassIcon" ></i></span>
                       </div>
                    </div>

                  
                     <div class="col-md-12 mt-3">
                      <button type="submit" class="btn btn-outline-success float-end">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
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
          <label>{{$t("common.name")}}</label>
          <input v-model="editCompanyForm.name" type="text" class="form-control" :placeholder="$t('common.Company name')" name="name"/>
        </div>
        <div class="col-md-6">
          <label>{{$t('common.phone')}}</label>  
            <input v-model="editCompanyForm.phone_number" type="text" class="form-control"  :placeholder="$t('common.phone')" name="phone_number"
            />
        </div>                   
        <div class="col-md-6 pt-3">
          <label>{{$t("common.Address")}}</label>  
            <input v-model="editCompanyForm.address" type="text" class="form-control"  :placeholder="$t('common.Address')" name="address"
            />
        </div>
        <div class="col-md-6 pt-3">
          <label>{{$t('common.Legal entity')}}</label>  
            <input v-model="editCompanyForm.legal_entity" type="text" class="form-control"  :placeholder="$t('common.Legal entity')" name="legal_entity"
            />
        </div>
          <div class="col-md-12 pt-3">
            <label>{{$t("common.description")}}</label>  
            <textarea v-model="editCompanyForm.description" type="text" class="form-control" rows="3"  :placeholder="$t('common.description')" name="description"
            ></textarea>
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

</style>
