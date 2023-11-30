<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";
import axios from "axios";
import Swal from "sweetalert2";
/**
 * File-manager component
 */
export default {
  page: {
    title: "File manager",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout },
  data() {
    return {
      title: "File manager",
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "File Manager",
          active: true,
        },
      ],
      fields: [{
          label: this.$t("common.File name"),
          key: "file_name",
          sortable: true,
      }],
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
      showMain: true,
      showChild: false,
      showResourceChild: false,
      showFilesC:false,
      fileListBinder: false,
      filesTitle: null,
      filter:null,
      folderList: [],
      resourceFolderList: [],
      list: [],
      fileList:[],
      machineModels:[],
      toolModels:[],
      externalSource:[],
      showHideProjects: false,
      users: [],
      projects: [],
      resources: [],
      sortBy: "name",
      sortDesc: false,
    };
  },
  methods: {
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
        // eslint-disable-next-line no-unused-vars
        URL.revokeObjectURL(link.href)},  error => {

           
              Swal.fire(this.$t("common.Warning"), this.$t("common.Data not exists"), "warning");
              }
        );
    },
    home() {
      if (this.fileListBinder) {
          this.fileListBinder  = false
          this.showChild  =true
      } else if ( this.showChild) {
        
        this.showChild  =false
        this.showMain =true
      } else if(this.showResourceChild) {
        this.showResourceChild = false
         this.showMain =true
      }
      
    },
    showFiles(items, name){
        this.fileListBinder = true
        this.showResourceChild  =false
        this.showChild = false
        this.filesTitle = name
        this.fileList = items.filter((item)=>{
          return item.file_name != null
        })
    },


     getfileType(filename) {
       // eslint-disable-next-line no-console
         const name = (filename != null ? filename.substr(filename.lastIndexOf('.') + 1):"noFile.no");
              return  this.filetype.hasOwnProperty(name)? this.filetype[name]:this.filetype["uknown"];
     },
     showFolders(items){
       this.showMain =false
       this.showChild  =true
       this.showResourceChild = false
      this.folderList = items
     },
     showFoldersResources(items) {
       this.showMain =false
       this.showChild  =false
       this.showResourceChild = true
       this.resourceFolderList = items 
     }
  },
  mounted(){
    
    ApiService.setHeader();
    
    ApiService.get("/attachments/get_files").then(
      response => {
        this.fileList = response.data.files.Resource.MachineModel;
       
             this.list = response.data.files;
     
        
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

    <div class="btn btn-primary mb-3" @click="home" v-if="!showMain"><i class="mdi mdi-arrow-left"></i>{{$t("common.Back")}}</div>

        <div class="row" v-if="showMain">
          <div class="col-xl-4 col-sm-6" >
            <div class="card shadow-none border folderCard" v-on:dblclick="showFolders(list.UserAccount)">
              <div class="card-body p-3">
                <div class="">
                  <div class="avatar-md me-3 mb-3">
                    <div class="avatar-title bg-transparent rounded">
                      <i
                        class="bx bxs-folder font-size-50 text-warning"
                      ></i>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div class="overflow-hidden me-auto">
                      <h5 class="font-size-14 text-truncate mb-1">
                        <a
                          href="javascript: void(0);"
                          class="text-body"
                          >{{$t("common.Employees")}}</a
                        >
                      </h5>
                      
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="col-xl-4 col-sm-6" >
          <div class="card shadow-none border folderCard" v-on:dblclick="showFoldersResources(list.Resource)">
                        <div class="card-body p-3">
                          <div class="">
                            <div class="avatar-md me-3 mb-3">
                              <div class="avatar-title bg-transparent rounded">
                                <i
                                  class="bx bxs-folder font-size-50 text-warning"
                                ></i>
                              </div>
                            </div>
                            <div class="d-flex">
                              <div class="overflow-hidden me-auto">
                                <h5 class="font-size-14 text-truncate mb-1">
                                  <a
                                    href="javascript: void(0);"
                                    class="text-body"
                                    >{{$t("common.Resources")}}</a
                                  >
                                </h5>
                              
                              </div>
                              
                            </div>
                          </div>
                        </div>
          </div>
        </div>

        <div class="col-xl-4 col-sm-6" >
            <div class="card shadow-none border folderCard" v-on:dblclick="showFolders(list.Project)">
              <div class="card-body p-3">
                <div class="">
                  <div class="avatar-md mb-3">
                    <div class="avatar-title bg-transparent rounded">
                      <i
                        class="bx bxs-folder font-size-50 text-warning"
                      ></i>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div class="overflow-hidden me-auto">
                      <h5 class="font-size-14 text-truncate mb-1">
                        <a
                          href="javascript: void(0);"
                          class="text-body"
                          >{{$t("common.Projects")}}</a
                        >
                      </h5>
                    
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
        </div>
        </div>


        <div class="row"  v-if="showResourceChild">
           <div v-for="(name,key) in resourceFolderList" :key="key" class="col-xl-4 col-sm-6" >
                      <div class="card shadow-none border  folderCard" v-on:dblclick="showFolders(name, key)">
                        <div class="card-body p-3">
                          <div class="">
                            <div class="avatar-xs me-3 mb-3">
                              <div class="avatar-title bg-transparent rounded">
                                <i
                                  class="bx bxs-folder font-size-24 text-warning"
                                ></i>
                              </div>
                            </div>
                            <div class="d-flex">
                              <div class="overflow-hidden me-auto">
                                <h5 class="font-size-14 text-truncate mb-1">
                                  {{key}}
                                </h5>
                             
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
        </div>

        <div class="row"  v-if="showChild">
           <div v-for="(name,key) in folderList" :key="key" class="col-xl-4 col-sm-6" >
                      <div class="card shadow-none border  folderCard" v-on:dblclick="showFiles(name, key)">
                        <div class="card-body p-3">
                          <div class="">
                            <div class="avatar-xs me-3 mb-3">
                              <div class="avatar-title bg-transparent rounded">
                                <i
                                  class="bx bxs-folder font-size-24 text-warning"
                                ></i>
                              </div>
                            </div>
                            <div class="d-flex">
                              <div class="overflow-hidden me-auto">
                                <h5 class="font-size-14 text-truncate mb-1">
                                  {{key}}
                                </h5>
                             
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
        </div>

   

      <div class="card" v-if="fileListBinder">
          <div class="card-body">
          <div class="mt-4">
                  <div class="d-flex flex-wrap">
                    <h5 class="font-size-16 me-3">{{filesTitle}} {{$t("common.Files")}}</h5>
                  </div>
                  <hr class="mt-2" />

                  <div class="table-responsive">
                    <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                      <label class="d-inline-flex align-items-center">
                        <b-form-input v-model="filter" type="search" :placeholder='this.$t("common.Search")' class="form-control form-control-sm"></b-form-input>
                      </label>
                    </div>
                    <div class="table-responsive mb-0">
                                <b-table striped hover outlined 
                                  class="datatables"
                                  :items="fileList"
                                  :fields="fields"
                                  responsive="sm"
                                  :sort-by.sync="sortBy"
                                  :sort-desc.sync="sortDesc"
                                  :filter="filter"
                                
                                >
                                <template #cell(file_name)="row" class="text-right">
                                <span
                           
                                 @click="download(row.item.uuid, row.item.file_name)"
                                
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
      </div>
      
    <!-- end row -->
  </Layout>
</template>

<style scoped>
.folderCard {
      transition: border 300ms;
       border-left: 2px solid #f1b44c !important;
}
.folderCard:hover {
  cursor: pointer;
  border-left: 2px solid #34c38f !important;
}
.font-size-50 {
  font-size: 70px
}
.pointer {
  cursor: pointer;
}
</style>