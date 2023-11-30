<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";
import simplebar from "simplebar-vue";
import Swal from "sweetalert2";
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
  components: { Layout, simplebar },
  data() {
    return {
      machineModels: [],
      toolModels: [],
      externalSourceTypes: [],
      title: "Settings",
      
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "Settings",
          active: true,
        },
      ],
      typeform: {
        name: "",
      },
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
      ident: false,
      modalTitle: null,
      filterOn: [],
      sortBy: "name",
      sortDesc: false,
      fields: [
        {
          label: this.$t("common.Name"),
          key: "name",
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
    },
  },
    mounted() { 
      ApiService.setHeader();
      ApiService.get("/settings/machine_models").then(
      response => {
        this.machineModels = response.data.machine_models
        
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
    
      ApiService.get("/settings/tool_models").then(
      response => {
        this.toolModels = response.data.tool_models
           // eslint-disable-next-line no-console
        
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );

      ApiService.get("/settings/external_source_types").then(
      response => {
        this.externalSourceTypes = response.data.external_types
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
    methods: {
      successmsg(text) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: text,
          showConfirmButton: false,
          timer: 2500,
      });
    },
      resetModal() {
        this.ident = false;
        this.typeform.name = null
      },
        hideModal() {
   },
      ragac(type){
        this.showModal = true;
        this.modalTitle = type=="machine"? this.$t("common.Add machine models"):type=="tool"? this.$t("common.Add tool model") :this.$t("common.Add external source types");
        this.ident = type
      },
      submitForm() {
        this.typesubmit = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {
          var url = '';
          if(this.ident == 'machine')
            url = '/settings/machine_model';
          else if(this.ident == 'tool')
            url = '/settings/tool_model'
          else if(this.ident == 'external')
            url = '/settings/external_source_type'
            
            ApiService.post(url, this.typeform).then(response => {
              if (response.status === 200) {
                if(this.ident == 'machine')
                  this.machineModels.push(response.data.machine_model)
                if(this.ident == 'tool')
                  this.toolModels.push(response.data.tool_model)
                if(this.ident == 'external')
                  this.externalSourceTypes.push(response.data.external_type)
           this.successmsg(this.$t("common.Operation completed successfully"))
           this.showModal = false;
          } 
          });
      }
    },
    deleteMachineModel(item){
      const index = this.machineModels.indexOf(item);
      Swal.fire({
        title: this.$t("common.Are you sure delete selected machine model?"),
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText:this.$t("common.Cancel")
      }).then((result) => {
        if (result.value) {
            ApiService.delete("/settings/destroy_machine_model?id=" + item.id);
            this.machineModels.splice(index, 1)
        }
      });
      
    },
    deleteToolModel(item){
      
      const index = this.toolModels.indexOf(item);
      Swal.fire({
        title: this.$t("common.Are you sure delete selected tool model?"),
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
         confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText:this.$t("common.Cancel")
      }).then((result) => {
        if (result.value) {
          ApiService.delete("/settings/destroy_tool_model?id=" + item.id);
          this.toolModels.splice(index, 1)
        }
        });
      },
    deleteExternalSourceTypes(item){
      
      const index = this.externalSourceTypes.indexOf(item);
      Swal.fire({
        title: this.$t("common.Are you sure delete selected external source type?"),
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText:this.$t("common.Cancel")
      }).then((result) => {
        if (result.value) {
           ApiService.delete("/settings/destroy_external_source_type?id=" + item.id);
         this.externalSourceTypes.splice(index, 1)
         }
        });       
    
    },
      saveMachinesModel() {
      }
    }
  
};
</script>

<template>
  <Layout>
  
    <div class="row">
      <div class="col-12">
        <b-alert show variant="primary text-center "><span  class="alert-link">
          {{$t("common.Please add resource manufacturers into the system")}} <br>
          {{$t("common.You can search for resource manufacturers in resources menu item and add the model or resourcetype there")}}
          
          </span></b-alert>
       
      </div>
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">{{$t("common.Machine manufacturer")}}</h4>
            <hr>
            <div class="row">
            
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                  <label class="d-inline-flex align-items-center">
                    <b-form-input v-model="filter1" type="search" :placeholder="$t('common.Search')" class="form-control form-control-sm"></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
              <div class="col-sm-12 col-md-6 text-end">
                 <b-button size="sm"  variant="outline-primary" @click="ragac('machine')">
                <i class="bx bx-plus font-size-16 align-middle me-2"></i>
                {{$t("common.add")}}
                </b-button>
              </div>
            </div>       
            <simplebar style="max-height: 500px">
              <div class="row">
                    <div class="col-12">
                          <!-- Table -->
                          <div class="table-responsive mb-0">
                            <b-table striped hover outlined 
                              class="datatables"
                              :items="machineModels"
                              :fields="fields"
                              responsive="sm"
                              :sort-by.sync="sortBy"
                              :sort-desc.sync="sortDesc"
                              :filter="filter1"           
                            >
                 
                            <template #cell(id)="row" class="text-right">
                              <b-button @click="deleteMachineModel(row.item)" size="sm" variant="outline-danger"><i class="bx bx-trash-alt font-size-16"></i></b-button>
                            </template>
                            </b-table>
                          </div>
                        
                     </div>
              </div>
            </simplebar>
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">{{$t("common.Tool manufacturer")}}</h4>
            <hr>
            <div class="row">
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                  <label class="d-inline-flex align-items-center">
                    <b-form-input v-model="filter2" type="search" :placeholder="$t('common.Search')" class="form-control form-control-sm"></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
               <div class="col-sm-12 col-md-6 text-end">
                 <b-button size="sm"  variant="outline-primary" @click="ragac('tool')">
                <i class="bx bx-plus font-size-16 align-middle me-2"></i>
               {{$t("common.add")}}
                </b-button>
              </div>
            </div>       
            <simplebar style="max-height: 500px">
              <div class="row">
                    <div class="col-12">
                     
                       
                         <!-- Table -->
                          <div class="table-responsive mb-0">
                            <b-table striped hover outlined 
                              class="datatables"
                              :items="toolModels"
                              :fields="fields"
                              responsive="sm"
                              :sort-by.sync="sortBy"
                              :sort-desc.sync="sortDesc"
                              :filter="filter2"
                            >
                            <template #cell(id)="row" class="text-right">
                              <b-button @click="deleteToolModel(row.item)" size="sm" variant="outline-danger"><i class="bx bx-trash-alt font-size-16"></i></b-button>
                            </template>
                            </b-table>
                          </div>
                        
                        
                     
                    </div>
              </div>
            </simplebar>
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">
               {{$t("common.External source types")}}</h4>
            <hr>
            <div class="row">
                <div class="col-sm-12 col-md-6">
                <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                  <label class="d-inline-flex align-items-center">
                    <b-form-input v-model="filter" type="search" :placeholder="$t('common.Search')" class="form-control form-control-sm"></b-form-input>
                  </label>
                </div>
              </div>
              <div class="col-sm-12 col-md-6 text-end">
                 <b-button size="sm"  variant="outline-primary" @click="ragac('external')">
                <i class="bx bx-plus font-size-16 align-middle me-2"></i>
                {{$t("common.add")}}
                </b-button>
              </div>
              <!-- Search -->
            
              <!-- End search -->
            </div>       
            <simplebar style="max-height: 500px">
              <div class="row">
                    <div class="col-12">
                                               <!-- Table -->
                          <div class="table-responsive mb-0">
                            <b-table striped hover outlined 
                              class="datatables"
                              :items="externalSourceTypes"
                              :fields="fields"
                              responsive="sm"
                              :sort-by.sync="sortBy"
                              :sort-desc.sync="sortDesc"
                              :filter="filter"
                            
                            >
                            <template #cell(id)="row" class="text-right">
                              <b-button @click="deleteExternalSourceTypes(row.item)" size="sm" variant="outline-danger"><i class="bx bx-trash-alt font-size-16"></i></b-button>
                            </template>
                            </b-table>
                          </div>
                        
                      </div>
              </div>
            </simplebar>
          </div>
        </div>
      </div>
    </div>

      <b-modal v-model="showModal" hide-footer centered  :title="modalTitle"   @hidden="resetModal">
        <div class="row mb-4">
          <div class="col-xl-12">
            <form action="#" @submit.prevent="submitForm">
              <div class="input-group bg-light rounded">
                <input
                  v-model="typeform.name"
                  type="text"
                  class="form-control"
                  :placeholder="$t('common.Enter name')" 
                  name="name"
                  :class="{
                    'is-invalid': typesubmit && $v.typeform.name.$error,
                  }"
                />
                <button type="submit" class="btn btn-outline-success">  <i class="bx bx-save"></i> {{$t("common.Save")}} </button>

              </div>
            </form>
          </div>
        </div>
    </b-modal>
  </Layout>
</template>