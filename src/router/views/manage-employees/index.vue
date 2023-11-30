<script>
import draggable from "vuedraggable";
import moment from "moment";
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import Swal from "sweetalert2";
import ApiService from "@/state/modules/api.service";

/**
 * Kanban-board component
 */
export default {
  page: {
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    draggable,
    Layout
  },
  data() {
    return {
      form:{
        user_account_id:0,
        id_name:null
      }          
      ,
      employeesList: [],
      taskList: [],
      managersList: [],
      completedTasks: [],
      changed_task_id:0,
      change_task_status:null,
      title: "Kanban Board",
      items: [
        {
          text: "Tasks",
          href: "/",
        },
        {
          text: "Kanban Board",
          active: true,
        },
      ],
    };
  },
  methods: {
      confirm(id) {
         Swal.fire({
        title: this.$t("common.Yes, Are you sure"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText: this.$t("common.Cancel"),
      }).then((result) => {
        if (result.value) {
          // eslint-disable-next-line no-console
                 ApiService.delete("/tasks/"+id).then(
        // eslint-disable-next-line no-unused-vars
        response => {
            Swal.fire(this.$t("common.Deleted"), this.$t("common.Task has been deleted"), "success");
       
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
        format_date(value) {
      if (value) {
        return moment(String(value)).format("DD MMM ,YYYY");
      }
    },
   onMove({ relatedContext, draggedContext }) {
      const self = this;
     
       if (draggedContext.element.user_role == "employee") {
         if (relatedContext.component.$attrs.id == "project_manager") {
           self.changed_task_id = draggedContext.element.id;
           self.change_task_status = "project_manager";
           draggedContext.element.user_role = "project_manager";
           return true;
         } else return false;
       } else if (draggedContext.element.user_role == "project_manager") {
         if (relatedContext.component.$attrs.id == "employee") {
           self.changed_task_id = draggedContext.element.id;
           self.change_task_status = "employee";
           draggedContext.element.user_role = "employee";
           return true;
         } else return false;
       }
       return true;
    },
    onEnd() {
      // const form = new FormData();
      // form.append("user_account_id",this.changed_task_id)
      // form.append("id_name ", this.change_task_status)
      this.form.user_account_id = this.changed_task_id
      this.form.id_name = this.change_task_status
        ApiService.post("user_roles", this.form).then(
        () => {
        
        },
        error => {
          this.open_task_list =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
    }
  },
  mounted() {
    ApiService.setHeader();

       ApiService.get("/users/list").then(
      response => {
        
        this.employeesList = response.data.users.filter(function(user) {
            return user.user_role == "employee";
          });
          this.managersList = response.data.users.filter(function(user) {
            return user.user_role == "project_manager";
          });
           
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
      <div class="col-10 offset-1">
        <b-alert show variant="primary text-center "><span  class="alert-link">
          {{$t("common.Choose simply, whom to be a project manager, drag and drop")}}
          </span></b-alert>
       
      </div>
    </div>
    <div class="drag-container">
      
      <div class="row drag-list">
        <div class="col-1"></div>
        <div class="col  drag-column">
          <div class="">
            <div class="">
              <!-- dropdown -->
              <span class="drag-column-header">
                <h4 class="card-title mb-4 pb-1 text-center">{{$t("common.Project Manager")}}</h4>
                <hr>
              </span>
              <draggable class="list-group" style="height:60vh;"
               group="tasks" 
                id="project_manager"
                :list="managersList"
                @end="onEnd"
                :move="onMove"
               >
                <div
                  v-for="manager in managersList"
                  :key="manager.id"
                  class="card task-box m-0"
                >
                   <div class="card-body p-1">
                    
                    <div>
                      <h5 class="font-size-15">
                        <a href="javascript: void(0);" class="text-dark">     
                          <div style="display:inline-block" class=" pt-2">
                          <i class="mdi mdi-account-circle-outline text-info"></i>
                            <span class="text-muted"> {{ manager.first_name }} {{manager.last_name}} </span>
                          <i class="mdi mdi-email-outline ms-3 text-info"></i>
                          <span class="text-muted"> {{ manager.email }}</span>
                          </div>
                          </a>
                      </h5>
                    </div>
                  
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
        <!-- end col-->
        <div class="col offset-1  drag-column">
          <div class="">
            <div class="">
              <!-- dropdown -->
              <span class="drag-column-header">
                <h4 class="card-title mb-4 pb-1 text-center">{{$t("common.Employees")}}</h4>
              </span>
              <hr>
              <draggable class="list-group" group="tasks" style="height:60vh;"
               id="employee"
               :list="employeesList"
              @end="onEnd"
              :move="onMove"
               >
                <div
                  v-for="employee in employeesList"
                  :key="employee.id"
                  class="card task-box m-0"
                >
                  <div class="card-body p-1">
                    
                    <div>
                      <h5 class="font-size-15">
                        <a href="javascript: void(0);" class="text-dark">
                           <div style="display:inline-block" class=" pt-2">
                          <i class="mdi mdi-account-circle-outline text-info"></i>
                            <span class="text-muted"> {{ employee.first_name }} {{employee.last_name}} </span>
                          <i class="mdi mdi-email-outline ms-3 text-info"></i>
                          <span class="text-muted"> {{ employee.email }}</span>
                          </div>
                          </a>
                      </h5>
                    </div>
          
                     
                  
                    
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>  
        <div class="col-1"></div>    
        <!-- end col-->
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>
