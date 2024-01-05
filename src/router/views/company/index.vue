<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";
import { required } from "vuelidate/lib/validators";

/**
 * Projects-overview component
 */
export default {
  page: {
    title: "Company",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout },
  data() {
    return {
      title: this.$t("common.Company"),
      cName: null,
      cDescription: null,
      cAddress: null,
      cPhoneNumber: null,
      editCompanyModal:false,
      editSubmit: false,
      showAddAlert:false,
      alertText:null,
      file:null,
      companyLogo: null,
      companyForm: {
        id:null,
        name: null,
        address: null,
        phone_number: null,
        description: null
      }
      
    };
  },
  validations: {
      companyForm: {
        name: { required }
      }
    },
    methods:{
      showEditModal(){
        this.editCompanyModal = true
      },
      submitCompanyForm() {
 
          
        this.editSubmit = true;
        this.$v.$touch();
        if (!this.$v.$invalid) 
        {

       if (this.file) {
                 const formData = new FormData();
        
        formData.append("company_id", this.companyForm.id);
        formData.append("logo", this.file);
        
        ApiService.post("/company_logos", formData).then(response => {
                  // eslint-disable-next-line no-console
               this.companyLogo = "http://localhost:3000/en/company_logos/logo/?uuid="+response.data.uuid
                
                  
               
          
          
           });

        }


           ApiService.put("/companies", this.companyForm).then(response => {
          
            this.editCompanyModal = false;
              this.companyForm.id = response.data.company.id 
        this.cPhoneNumber = this.companyForm.phone_number = response.data.company.phone_number
        this.cName = this.companyForm.name = response.data.company.name
        this.cDescription =this.companyForm.description = response.data.company.description
        this.cAddress = this.companyForm.address = response.data.company.address

          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0]["message"]
            // eslint-disable-next-line no-console
          
          }
          )}
      }
    },
  mounted(){
      let user = JSON.parse(localStorage.getItem('user'));
    

    ApiService.setHeader();
    ApiService.get("/companies/"+user.company_id).then(
      response => {
        this.companyForm.id = response.data.company.id 
        this.cPhoneNumber = this.companyForm.phone_number = response.data.company.phone_number
        this.cName = this.companyForm.name = response.data.company.name
        this.cDescription =this.companyForm.description = response.data.company.description
        this.cAddress = this.companyForm.address = response.data.company.address
      
        this.companyLogo = response.data.company.company_logo ? "http://localhost:3000/en/company_logos/logo/?uuid="+response.data.company.company_logo.uuid: "@/assets/images/companies/img-1.png"
           // eslint-disable-next-line no-console
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
      <div class="col">
        <div class="card">
          <div class="card-body">
            <div class="media">
              <img :src="companyLogo" alt class="avatar-sm me-4" />
              <div class="media-body overflow-hidden">
                <h5 class="text-truncate font-size-15">{{cName}}</h5>
              </div>
            </div>
            <div class="btn btn-primary" style="position:absolute; top:1rem; right:1rem" @click="showEditModal">
              <i class="mdi mdi-pencil"></i> {{$t("common.Edit")}}</div>
            <h5 class="font-size-15 mt-4">{{$t("common.description")}} :</h5>

            <p
              class="text-muted"
            >{{cDescription}}</p>

            <div class="text-muted mt-4">
              <p>
                <i v-if="cPhoneNumber" class="mdi mdi-phone  text-primary"></i> {{cPhoneNumber}}
              
                <i class="mdi mdi-home-map-marker text-primary me-2"></i> {{cAddress}}
              </p>
              
            </div>

          
          </div>
        </div>
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->

    <b-modal  :title="this.$t('common.Edit Company')" size="lg" v-model="editCompanyModal" hide-footer>
               <form action="#" @submit.prevent="submitCompanyForm" href="addTaskFrom">
                 <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                      <div class="form-group row">
                         <label>{{$t("common.Company name")}}</label>
                         <div class="col-ld-12">
                        <input v-model="companyForm.name" type="text" class="form-control" :placeholder="$t('common.Enter name')" name="name"
                        :class="{'is-invalid': editSubmit && $v.companyForm.name.$error}" />
                      </div>
                      </div>
                    </div>
                     <div class="col-md-6">
                      <div class="form-group row">
                         <label>{{$t("common.Address")}}</label>
                         <div class="col-ld-12">
                        <input v-model="companyForm.address" type="text" class="form-control" :placeholder='$t("common.Address")' name="address"/>
                      </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-2">
                      <div class="form-group row">
                         <label>{{$t("common.Phone")}}</label>
                         <div class="col-ld-12">
                        <input v-model="companyForm.phone_number" type="text" class="form-control" :placeholder='$t("common.Phone")' name="phone_number"/>
                      </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-2">
                      <div class="form-group row">
                        <label>{{$t("common.Logo")}}</label>
                      <b-form-file v-model="file"></b-form-file>
                      </div>
                    </div>
                    <div class="col-md-12 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.description")}}</label>
                        <div class="col-lg-12">
                          <textarea v-model="companyForm.description" :placeholder='$t("common.description")' rows="3" class="form-control"></textarea>    
                        </div>
                      </div>
                    </div>
     
                  
                    <div class="col-md-12 mt-3 text-end">
                      <b-button type="submit" variant="outline-success">  <i class="bx bx-save"></i> {{$t("common.Save")}}</b-button>
                    </div>
                </div>
            </form>   
     
             </b-modal>


  </Layout>
</template>
<style>
.form-file-text {
  display: none !important;
}
</style>