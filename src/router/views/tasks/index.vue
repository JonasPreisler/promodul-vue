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
      upcomingTasks: [],
      taskList: [],
      progressTasks: [],
      completedTasks: [],
      taskData: [],
      taskDataModels:[],
      taskDataTools:[],
      taskDataResources:[],
      changed_task_id:0,
      change_task_status:null,
      roleEmployee: false,
      viewTaskModal: false,
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
     show_task_view(taskId) {
        ApiService.get("tasks/"+parseInt(taskId)).then(
      response => {
        this.taskData = response.data.task
        this.taskDataModels =  response.data.task.resources.models
        this.taskDataTools =  response.data.task.resources.tools
        this.taskDataResources =  response.data.task.resources.resources
           // eslint-disable-next-line no-console
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );

       this.viewTaskModal = true;
     },
      confirm(id) {
         Swal.fire({
        title: this.$t("common.Are you sure"),
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
        () => {
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
      if (draggedContext.element.status == "open") {
        if (relatedContext.component.$attrs.id == "in_progress") {
          self.changed_task_id = draggedContext.element.id;
          self.change_task_status = "in_progress";
          draggedContext.element.status = "in_progress";
          return true;
        } else return true;
      } else if (draggedContext.element.status == "in_progress") {
        if (relatedContext.component.$attrs.id == "done") {
          self.changed_task_id = draggedContext.element.id;
          self.change_task_status = "done";
          draggedContext.element.status = "done";
          return true;
        } else {
          if(this.$store.state.authfack.user.role_group =="Project Manager") {
           self.changed_task_id = draggedContext.element.id;
          self.change_task_status = "open";
          draggedContext.element.status = "open";
          return true;
          }
          return false
 
        }
      } else if (draggedContext.element.status == "done") {
         if(this.$store.state.authfack.user.role_group =="Project Manager") {
          self.changed_task_id = draggedContext.element.id;
          self.change_task_status = "in_progress";
          draggedContext.element.status = "in_progress";

        return true;
         }
         return false;
      }
    },
    onEnd() {
        ApiService.get("/tasks/status_progress/"+this.changed_task_id+"?id_name="+this.change_task_status).then(
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
    this. roleEmployee = (this.$store.state.authfack.user.role_group == "Employee"? true : false)
    ApiService.setHeader();
      ApiService.get("/tasks/user_task_list/").then(
        response => {
          this.taskList = response.data.tasks;
          this.upcomingTasks = this.taskList.filter(function(tasks) {
            return tasks.status == "open";
          });
          this.progressTasks = this.taskList.filter(function(tasks) {
            return tasks.status == "in_progress";
          });
          this.completedTasks = this.taskList.filter(function(tasks) {
            return tasks.status == "done";
          });
         
        },
        error => {
          this.open_task_list =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );

  }
};
</script>

<template>
  <Layout>
    <div class="drag-container">
      <div class="row drag-list">
        <div class="col-lg-4 drag-column">
          <div class="">
            <div class="">
              <!-- dropdown -->
              <span class="drag-column-header">
                <h4 class="card-title mb-4 pb-1 text-center text-info">{{$t("common.Upcoming Tasks")}}</h4>
              </span>
              <draggable class="list-group" group="tasks" style="padding-bottom:3rem"
               id="open"
               :list="upcomingTasks"
              @end="onEnd"
              :move="onMove"
               >
                <div
                  v-for="task in upcomingTasks"
                  :key="task.id"
                  class="card task-box"
                >
                  <div class="card-body">
                    <div class="float-end">
                      <span class="badge badge-soft-info rounded-pill font-size-12">{{$t("common.Upcoming")}}</span>
                     <!-- <b-button  size="sm" variant="outline-warning" class="me-2"><i class="bx bx-edit font-size-12 pt-1"></i></b-button>
                     <b-button @click="confirm(task.id)"  size="sm" variant="outline-danger" class="me-2"><i class="bx bx-trash font-size-12 pt-1"></i></b-button> -->
                    
                    </div>
                    <div>
                      <h5 class="font-size-15">
                        <a href="javascript: void(0);" class="text-dark">{{
                          task.title
                        }}</a>
                      </h5>
                    </div>
                    <p class="text-muted mb-4">{{task.project_name}}</p>
                    <div class="avatar-group">                        
                      <div
                        class="avatar-group-item"
                        v-for="(user, index) of task.users"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`upcomingTaskViewUser-${task.id}-${user.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-soft-primary text-white font-size-11">
                              {{user.first_name.substr(0,1)}}.{{user.last_name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`upcomingTaskViewUser-${task.id}-${user.id}`" triggers="hover" placement="bottom">
                          {{user.first_name}} {{user.last_name}}
                        </b-popover>
                      </div>
                    </div>
                    <hr>
                    <div class="avatar-group">
                      <div
                        class="avatar-group-item"
                        v-for="(resource, index) of task.resources.models"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`upcomingTask-${index}-${resource.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                              {{resource.name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`upcomingTask-${index}-${resource.id}`" triggers="hover" placement="bottom">
                          {{resource.name}}
                        </b-popover>
                      </div>
                      <div
                        class="avatar-group-item"
                        v-for="(resource, index) of task.resources.resources"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`upcomingTask-${index}-${resource.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                              {{resource.name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`upcomingTask-${index}-${resource.id}`" triggers="hover" placement="bottom">
                          {{resource.name}}
                        </b-popover>
                      </div>
                      <div
                        class="avatar-group-item"
                        v-for="(resource, index) of task.resources.tools"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`upcomingTask-${index}-${resource.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                              {{resource.name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`upcomingTask-${index}-${resource.id}`" triggers="hover" placement="bottom">
                          {{resource.name}}
                        </b-popover>
                      </div>
                    </div> 
                    <hr>   
                    <div class="d-flex justify-content-between">
                      <div>
                        <span class="mb-0 text-muted">{{$t("common.Start date")}}</span><br>
                        <span class="mb-4">{{ format_date(task.start_time)  }}</span>  
                      </div>
                      <div>
                        <span class="mb-0 text-muted">{{$t("common.Deadline")}}</span><br>
                        <span class="mb-4">{{ format_date(task.deadline)  }}</span>
                      </div>
                      <div>
                        <b-button v-if="!roleEmployee" :href="'/#/projects/overview/'+task.project_id" size="md" variant="outline-info" class="me-2">{{$t("common.View Project")}}</b-button>
                        <b-button v-if="roleEmployee"  @click="show_task_view(task.id)" size="md" variant="outline-info" class="me-2">{{$t("common.View task")}}</b-button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
        <!-- end col-->

        <div class="col-lg-4 drag-column">
          <div class="">
            <div class="">
              <!-- dropdown -->
              <span class="drag-column-header">
                <h4 class="card-title mb-4 pb-1 text-center text-warning">{{$t("common.In progress tasks")}}</h4>
              </span>
              <draggable class="list-group" style="padding-bottom:3rem"
               group="tasks" 
                id="in_progress"
                :list="progressTasks"
                @end="onEnd"
                :move="onMove"
               >
                <div
                  v-for="task in progressTasks"
                  :key="task.id"
                  class="card task-box"
                >
                  <div class="card-body">
                    <div class="float-end ml-2">
                      <span class="badge badge-soft-warning rounded-pill font-size-12">{{$t("common.In Progress")}}</span>
                    </div>
                    <div>
                      <h5 class="font-size-15">
                        <a href="javascript: void(0);" class="text-dark">{{
                          task.title
                        }}</a>
                      </h5>
                      <p class="text-muted mb-4">{{task.project_name}}</p>
                    </div>
                    <div class="avatar-group">                        
                      <div
                        class="avatar-group-item"
                        v-for="(user, index) of task.users"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`inprogrressTaskViewUser-${task.id}-${user.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-soft-primary text-white font-size-11">
                              {{user.first_name.substr(0,1)}}.{{user.last_name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`inprogrressTaskViewUser-${task.id}-${user.id}`" triggers="hover" placement="bottom">
                          {{user.first_name}} {{user.last_name}}
                        </b-popover>
                      </div>
                    </div>
                    <hr>
                    <div class="avatar-group">
                      <div
                        class="avatar-group-item"
                        v-for="(resource, index) of task.resources.models"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`inprogrressTaskView-${index}-${resource.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                              {{resource.name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`inprogrressTaskView-${index}-${resource.id}`" triggers="hover" placement="bottom">
                          {{resource.name}}
                        </b-popover>
                      </div>
                      <div
                        class="avatar-group-item"
                        v-for="(resource, index) of task.resources.tools"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`inprogrressTaskView-${index}-${resource.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                              {{resource.name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`inprogrressTaskView-${index}-${resource.id}`" triggers="hover" placement="bottom">
                          {{resource.name}}
                        </b-popover>
                      </div>
                            <div
                        class="avatar-group-item"
                        v-for="(resource, index) of task.resources.resources"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`inprogrressTaskView-${index}-${resource.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                              {{resource.name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`inprogrressTaskView-${index}-${resource.id}`" triggers="hover" placement="bottom">
                          {{resource.name}}
                        </b-popover>
                      </div>
                    </div> 
                    <hr>   
                    <div class="d-flex justify-content-between">
                      <div>
                        <span class="mb-0 text-muted">{{$t("common.Start date")}}</span><br>
                        <span class="mb-4">{{ format_date(task.start_time)  }}</span>  
                      </div>
                      <div>
                        <span class="mb-0 text-muted">{{$t("common.Deadline")}}</span><br>
                        <span class="mb-4">{{ format_date(task.deadline)  }}</span>
                      </div>
                      <div>
                           <b-button v-if="!roleEmployee" :href="'/#/projects/overview/'+task.project_id" size="md" variant="outline-info" class="me-2">{{$t("common.View Project")}}</b-button>
                        <b-button v-if="roleEmployee"  @click="show_task_view(task.id)" size="md" variant="outline-info" class="me-2">{{$t("common.View task")}}</b-button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
        <!-- end col-->

        <div class="col-lg-4 drag-column">
          <div class="">
            <div class="">
              <!-- dropdown -->
              <span class="drag-column-header">
                <h4 class="card-title mb-4 pb-1 text-center text-success">{{$t("common.Done task")}}</h4>
              </span>
              <draggable class="list-group" style="padding-bottom:3rem"
               id="done"
                group="tasks"
                :list="completedTasks"
                @end="onEnd"
                :move="onMove">
                <div
                  v-for="task in completedTasks"
                  :key="task.id"
                  class="card task-box">
                  <div class="card-body">
                  <div class="float-end ml-2 ">
                      <span class="badge badge-soft-success rounded-pill font-size-12">{{$t("common.Done")}}</span>
                    </div>
                    
                    <div>
                      <h5 class="font-size-15">
                        <a href="javascript: void(0);" class="text-dark">{{
                          task.title
                        }}</a>
                      </h5>
                      <p class="text-muted mb-4">{{task.project_name}}</p>
                    </div>
                    <div class="avatar-group">                        
                      <div
                        class="avatar-group-item"
                        v-for="(user, index) of task.users"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`doneTaskViewUser-${task.id}-${user.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-soft-primary text-white font-size-11">
                              {{user.first_name.substr(0,1)}}.{{user.last_name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`doneTaskViewUser-${task.id}-${user.id}`" triggers="hover" placement="bottom">
                          {{user.first_name}} {{user.last_name}}
                        </b-popover>
                      </div>
                    </div>
                    <hr>
                    <div class="avatar-group">
                      <div
                        class="avatar-group-item"
                        v-for="(resource, index) of task.resources.models"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`doneTaskView-${index}-${resource.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                              {{resource.name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`doneTaskView-${index}-${resource.id}`" triggers="hover" placement="bottom">
                          {{resource.name}}
                        </b-popover>
                      </div>
                      <div
                        class="avatar-group-item"
                        v-for="(resource, index) of task.resources.tools"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`doneTaskView-${index}-${resource.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                              {{resource.name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`doneTaskView-${index}-${resource.id}`" triggers="hover" placement="bottom">
                          {{resource.name}}
                        </b-popover>
                      </div>
                      <div
                        class="avatar-group-item"
                        v-for="(resource, index) of task.resources.resources"
                        :key="index"
                      >
                        <a href="javascript: void(0);" :id="`doneTaskView-${index}-${resource.id}`" class="d-inline-block">
                          <div class="avatar-xs">
                            <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                              {{resource.name.substr(0,1)}}
                            </span>
                          </div>
                        </a>
                        <b-popover  variant="danger"  :target="`doneTaskView-${index}-${resource.id}`" triggers="hover" placement="bottom">
                          {{resource.name}}
                        </b-popover>
                      </div>
                    </div> 
                    <hr>   
                    <div class="d-flex justify-content-between">
                      <div>
                        <span class="mb-0 text-muted">{{$t("common.Start date")}}</span><br>
                        <span class=" mb-4">{{ format_date(task.start_time)  }}</span>  
                      </div>
                      <div>
                        <span class="mb-0 text-muted">{{$t("common.Deadline")}}</span><br>
                        <span class="mb-4">{{ format_date(task.deadline)  }}</span>
                      </div>
                      <div>
                           <b-button v-if="!roleEmployee" :href="'/#/projects/overview/'+task.project_id" size="md" variant="outline-info" class="me-2">{{$t("common.View Project")}}</b-button>
                        <b-button v-if="roleEmployee"  @click="show_task_view(task.id)" size="md" variant="outline-info" class="me-2">{{$t("common.View task")}}</b-button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
        <!-- end col-->
      </div>
    </div>


    
    <b-modal  :title="this.$t('common.View task')" size="xl" v-model="viewTaskModal" hide-footer>

    <div class="card-body">
      <div class="media">
        <img src="@/assets/images/companies/img-1.png" alt class="avatar-sm me-4" />

        <div class="media-body overflow-hidden">
          <h5 class="text-truncate font-size-15">{{taskData.title}}</h5>
        </div>
      </div>

      <h5 class="font-size-15 mt-4">{{$t("common.Task description")}} :</h5>

      <p
        class="text-muted"
      >{{taskData.description}}</p>

      <div class="text-muted mt-4">
        <div class="row">
            <div class="col-2">
                <i class="mdi mdi-chevron-right text-primary me-1"></i>{{$t("common.Ressurser")}}: 
            </div>
            <div class="col-10">        
              <div class="avatar-group">
                
                <div
                  class="avatar-group-item"
                  v-for="(resource, index) of taskDataModels"
                  :key="index"
                >
                  <a href="javascript: void(0);" :id="`taskView-${index}-${resource.id}`" class="d-inline-block">
                    <div class="avatar-xs">
                      <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                        {{resource.name.substr(0,1)}}
                      </span>
                    </div>
                  </a>
                  <b-popover  variant="danger"  :target="`taskView-${index}-${resource.id}`" triggers="hover" placement="bottom">
                    {{resource.name}}
                  </b-popover>
                </div>
                <div
                  class="avatar-group-item"
                  v-for="(resource, index) of taskDataTools"
                  :key="index"
                >
                  <a href="javascript: void(0);" :id="`taskView-${index}-${resource.id}`" class="d-inline-block">
                    <div class="avatar-xs">
                      <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                        {{resource.name.substr(0,1)}}
                      </span>
                    </div>
                  </a>
                  <b-popover  variant="danger"  :target="`taskView-${index}-${resource.id}`" triggers="hover" placement="bottom">
                    {{resource.name}}
                  </b-popover>
                </div>
                <div
                  class="avatar-group-item"
                  v-for="(resource, index) of taskDataResources"
                  :key="index"
                >
                  <a href="javascript: void(0);" :id="`taskView-${index}-${resource.id}`" class="d-inline-block">
                    <div class="avatar-xs">
                      <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                        {{resource.name.substr(0,1)}}
                      </span>
                    </div>
                  </a>
                  <b-popover  variant="danger"  :target="`taskView-${index}-${resource.id}`" triggers="hover" placement="bottom">
                    {{resource.name}}
                  </b-popover>
                </div>
              </div>      
            </div>
             <hr class="mt-2">
            <div class="col-2">
                <i class="mdi mdi-chevron-right text-primary me-1"></i>{{$t("common.Users")}}: 
            </div>
            <div class="col-10">
              <div class="avatar-group">
                        <div
                          class="avatar-group-item"
                          v-for="(user, index) of taskData.users"
                          :key="index"
                        >
                          <a href="javascript: void(0);" :id="`taskViewUser-${index}-${user.id}`" class="d-inline-block">
                           <div class="avatar-xs">
                             <span class="avatar-title rounded-circle bg-soft-primary text-white font-size-11">
                               {{user.first_name.substr(0,1)}}.{{user.last_name.substr(0,1)}}
                             </span>
                            </div>
                          </a>
                          <b-popover  variant="danger"  :target="`taskViewUser-${index}-${user.id}`" triggers="hover" placement="bottom">
                            {{user.first_name}} {{user.last_name}}
                          </b-popover>
                        </div>
              </div>
            </div>
          </div>
        </div>

      <div class="row task-dates">
        <div class="col-sm-3 col-3">
          <div class="mt-4">
            <h5 class="font-size-14">
              <i class="bx bx-calendar me-1 text-primary"></i> {{$t("common.Start date")}}
            </h5>
            <p class="text-muted mb-0">{{format_date(taskData.start_time)}}</p>
          </div>
        </div>
        <div class="col-sm-3 col-3">
          <div class="mt-4">
            <h5 class="font-size-14">
              <i class="bx bx-calendar me-1 text-primary"></i> {{$t("common.Deadline")}}
            </h5>
            <p class="text-muted mb-0">{{format_date(taskData.deadline)}}</p>
          </div>
        </div>
      </div>
    </div>
    </b-modal>
    <!-- end row -->
  </Layout>
</template>
