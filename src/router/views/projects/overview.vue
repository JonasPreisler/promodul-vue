<script>
import FullCalendar  from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import nbLocale from "@fullcalendar/core/locales/nb";


import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import ApiService from "@/state/modules/api.service";
import moment from "moment";
import Multiselect from "vue-multiselect";
import simplebar from "simplebar-vue";
import Swal from "sweetalert2";
import axios from "axios";

import { barChart } from "./data-overview";
import DatePicker from 'vue2-datepicker'
import { required } from "vuelidate/lib/validators";
import 'vue2-datepicker/locale/nb';

/**
 * Projects-overview component
 */
export default {
  page: {
    title: "Projects Overview",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: {
    Layout,
    DatePicker,
    Multiselect,
    simplebar,
    FullCalendar,
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
      barChart: barChart,
      title: "Projects Overview",
      items: [
        {
          text: "Projects",
          href: "/"
        },
        {
          text: "Projects Overview",
          active: true
        },
      
      ],
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
        eventResizableFromStart: true,
        dateClick: this.dateClicked,
        eventClick: this.editEvent,
        eventsSet: this.handleEvents,
        weekends: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
      },
      currentEvents: [],
        projects: [],
        fileList:[],
        addFileModal: false,
        addTaskModal: false,
        addUserAccountTaskModal: false,
        editTaskModal:false,
        viewTaskModal: false,
        
        timeSlots: this.generateTimeSlots(),
        isSelecting: false,
        startSelectIndex: null,
        endSelectIndex: null,
        hoverIndex: null,


        taskList: [],
        memberList: [],
        projectResourceList:[],
        project_id: this.$route.params.id,
        modalFileTitle: this.$t("common.Add file"),
        attachForm: {
          file: null,
          attached_on_id:0,
          attached_on_type: null,
          exp_date: null
      },
      taskForm: {
        title:null,
        description: null,
        start_time: null,
        deadline: null,
        task_resources_attributes: []
      },
      editTaskForm: {
        project_id:0,
        id:0,
        title:null,
        description: null,
        start_time: null,
        deadline: null,
        task_resources_attributes: []
      },
      showAddAlert:false,
      showEditAlert:false,
      typesubmit:false,
      editSubmit:false,
      attachSubmit: false,
      alertText:null,
      taskUsersList:[],
      taskExternalResourceList:[],
      taskMachinesList:[],
      taskToolsList:[],
      addDeleteUserList:[],
      addDeleteResourceList:[],

      value: [],
      options: [],
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
      value1:null,
      machineValue: null,
      toolValue:null,
      resoourceValue: null,
      editMachineValue: null,
      editToolValue:null,
      editResoourceValue: null,
      taskData: [],
      taskDataModels:[],
      taskDataTools:[],
      taskDataResources:[],
      machineList: [],
      toolList: [],
      resourceList: [],
      userList: [],
    };
  },
    validations: {
      editTaskForm: {
        title: {required},
        start_time: {required},
        deadline: {required},
      },
       attachForm: {
          file: {required},
          exp_date: {required}
      },
      taskForm: {
        title: { required },
        start_time: {required},
        deadline: {required}
      },
      
    },
    mounted() {
      // Add event listeners for mousemove and mouseup
      document.addEventListener('mousemove', this.onDragging);
      document.addEventListener('mouseup', this.stopDragging);
    },
    beforeDestroy() {
      // Cleanup event listeners
      document.removeEventListener('mousemove', this.onDragging);
      document.removeEventListener('mouseup', this.stopDragging);
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
        URL.revokeObjectURL(link.href)
        },
        () => {
              Swal.fire(this.$t("common.Warning"),  this.$t("common.Data not exists"), "warning");
              }
        
        );
    },
    editEvent(info){
  
      const t  = this.taskList.filter(function(tasks) {
            return tasks.id == info.event.id;
          });
              // eslint-disable-next-line no-console
            this.editTask(t[0])
          

    },
    customLabelUser (option) {
      return ` ${option.first_name} ${option.last_name}`
    },
    customLabelMachine (option) {
      return ` ${option.name}`
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
         id: option.task_user_id,
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
         id: option.task_resource_id,
         resource_id: option.id,
         _destroy: true
      })
      
    },
    
    showTaskModal() {
      this.showAddAlert = false;
      this.addTaskModal = true
      this.taskForm.start_time = new Date()
      this.taskForm.deadline = new Date()
    },
    dateClicked(info) {
      // eslint-disable-next-line no-console
         ApiService.get("/resources/task_resource_list?start_date="+this.format_date(this.projects.start_date)+"&deadline="+this.format_date(this.projects.deadline)).then(
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
      ApiService.get("users/task_user_list?start_date="+this.format_date(this.projects.start_date)+"&deadline="+this.format_date(this.projects.deadline)).then(
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

      this.taskForm.start_time = new Date(info.date )
      this.taskForm.deadline = new Date(info.date)
      this.newEventData = info;
      this.showAddAlert = false;
      this.addTaskModal = true
    },

    // USER ACCOUNT TASKS
    
    generateTimeSlots() {
      // const slots = [];
      // for (let time = 480; time <= 1080; time += 15) {
      //   slots.push({
      //     time: this.formatTime(time),
      //     isAvailable: true, 
      //   });
      // }
      // return slots;

      const slots = [];
      for (let time = 480; time <= 1080; time += 15) {
        // Calculate the index based on the number of slots created so far
        const index = (time - 480) / 15;
        // Specifically set indices 3 and 5 as unavailable
        const isAvailable = index !== 3 && index !== 5;

        slots.push({
          time: this.formatTime(time),
          isAvailable: isAvailable, // Manually set for indices 3 and 5
        });
      }
      return slots;
    },
    expandSelection(event) {
      // if (this.isSelecting) {
      //   const index = Number(event.target.dataset.index);
      //   if (index !== undefined && this.timeSlots[index].isAvailable) {
      //     this.endSelectIndex = index;
      //   }
      // }

      if (!this.isSelecting) return;

      const hoverIndex = Number(event.target.dataset.index);

      // Find the direction of the drag
      const isDraggingForward = hoverIndex > this.startSelectIndex;

      // Check if timeslot range is selectable
      let startIndex = Math.min(this.startSelectIndex, hoverIndex);
      let endIndex = Math.max(this.startSelectIndex, hoverIndex);

      for (let i = startIndex; i <= endIndex; i++) {
        // If any timeslot in the range is not available, limit selection
        if (!this.timeSlots[i].isAvailable) {
          // If dragging forward, limit the end index to the timeslot just before the unavailable slot
          if (isDraggingForward) {
            this.endSelectIndex = i - 1;
          } else {
            // If dragging backward, limit the start index to the timeslot just after the unavailable slot
            this.startSelectIndex = i + 1;
          }
          return; // Exit as we've hit an unavailable slot
        }
      }

      // If all slots are available, update the selection as usual
      this.endSelectIndex = hoverIndex;
    },
    formatTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours < 10 ? '0' + hours : hours}:${mins === 0 ? '00' : mins}`;
    },
    startSelecting(event) {
      const index = Number(event.target.dataset.index);
      if (index !== undefined) {
        this.isSelecting = true;
        this.startSelectIndex = index;
        this.endSelectIndex = index;
      }
    },
    stopSelecting() {
      this.isSelecting = false;

    if (this.startSelectIndex > this.endSelectIndex) {
        [this.startSelectIndex, this.endSelectIndex] = [this.endSelectIndex, this.startSelectIndex];
      }
    },
    selectSlot(index) {
      if (this.startSelectIndex === index && this.endSelectIndex === index) {
        // Deselect the timeslot
        this.startSelectIndex = null;
        this.endSelectIndex = null;
      }
      else if (this.startSelectIndex === null || this.endSelectIndex === null) {
        // Start a new selection
        this.startSelectIndex = index;
        this.endSelectIndex = index;
      } else {
        // Modify the existing selection
        if (index < this.startSelectIndex) this.startSelectIndex = index;
        if (index > this.endSelectIndex) this.endSelectIndex = index;
      }
    },
    setHoverIndex(index) {
      if (!this.isSelecting || index === undefined || !this.timeSlots[index].isAvailable) {
        return; // Do not proceed if the hovered timeslot is unavailable
      }

      const isDraggingForward = index > this.startSelectIndex;
      const checkingIndex = isDraggingForward ? this.startSelectIndex : index;
      const directionModifier = isDraggingForward ? 1 : -1;

      for (let i = checkingIndex; ; i += directionModifier) {
        if (i < 0 || i >= this.timeSlots.length || i === index + directionModifier) {
          break;
        }
        if (!this.timeSlots[i].isAvailable) {
          this.hoverIndex = null;
          return;
        }
      }

      this.hoverIndex = index;
    },
    isSelected(index) {
      return this.timeSlots[index].isAvailable &&
            index >= Math.min(this.startSelectIndex, this.endSelectIndex) &&
            index <= Math.max(this.startSelectIndex, this.endSelectIndex);
    },
   isInRange(index) {
      if (!this.isSelecting || this.hoverIndex === null) return false;

      const isDraggingForward = this.hoverIndex > this.startSelectIndex;
      if (isDraggingForward) {
        return index > this.startSelectIndex && index <= this.hoverIndex;
      } else {
        return index < this.startSelectIndex && index >= this.hoverIndex;
      }
    },


    // END OF USER ACCOUNT TASKS

    addUserAccountTask(task) {
                // eslint-disable-next-line no-console
          console.log(task)
          

      // ApiService.get(`resources/user_account_tasks_list?task_id=${task.id}`).then(
      //   response => {
      //     this.userAccountTasksList = response.data.user_account_tasks
      //     // eslint-disable-next-line no-console
      //     console.log('LETS GOOOOO')
      //     // eslint-disable-next-line no-console
      //     console.log(this.userAccountTasksList)
      //   },
      //   error => {
      //     this.categories =
      //       (error.response && error.response.companies) ||
      //       error.message ||
      //       error.toString();
      //   }
      // );

      this.addUserAccountTaskModal = true;
    },

    editTask(task){
    
   
     this.addDeleteResourceList = [];
     this.addDeleteUserList = [];
     this.editTaskForm.task_resources_attributes = [];
   
     ApiService.get("/resources/task_resource_list?start_date="+this.format_date(this.projects.start_date)+"&deadline="+this.format_date(this.projects.deadline)).then(
      response => {
        
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
     ApiService.get("users/task_user_list?start_date="+this.format_date(this.projects.start_date)+"&deadline="+this.format_date(this.projects.deadline)).then(
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
   
    this.editMachineValue = task.resources.models
    this.editToolValue = task.resources.tools
    this.editResoourceValue = task.resources.resources
    this.editTaskForm.id = task.id
    this.editTaskForm.title = task.title
    this.editTaskForm.start_time = new Date(task.start_time)
    this.editTaskForm.deadline = new Date(task.deadline)
    this.editTaskForm.description = task.description


      this.editTaskModal = true;
    },
    deleteTask(item) {
      const index = this.taskList.indexOf(item);
   
         Swal.fire({
        title: this.$t("common.Are you sure delete task"),
        text: item.title+" ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: this.$t("common.Yes, delete it!"),
        cancelButtonText: this.$t("common.Cancel"),
      }).then((result) => {
        if (result.value) {
          ApiService.delete("/tasks?id="+item.id).then(
            () => {

   let calendarApi = this.$refs.calendar.getApi()
      calendarApi.getEventById(item.id).remove();
      
      this.taskList.splice(index, 1)
      this.successmsg(this.$t("common.The task deleted successfully"))         
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
    
    submitTaskForm() {
         
        this.typesubmit = true;
        this.$v.taskForm.$touch();
        if (!this.$v.taskForm.$invalid) 
        {
           this.taskForm.task_resources_attributes = [];

          this.taskForm.start_time = this.format_date(this.taskForm.start_time)
          this.taskForm.deadline = this.format_date(this.taskForm.deadline)
          if(this.machineValue) {
           this.machineValue.forEach(element => {
            this.taskForm.task_resources_attributes.push({"resource_id":element.id})
          });
          }
          if(this.toolValue) {
              this.toolValue.forEach(element => {
              this.taskForm.task_resources_attributes.push({"resource_id":element.id})
            });
          }
          if (this.resoourceValue) {
            this.resoourceValue.forEach(element => {
            this.taskForm.task_resources_attributes.push({"resource_id":element.id})
          });
        }         
          this.taskForm.project_id = this.project_id
          // eslint-disable-next-line no-console
          console.log(this.taskForm)
          ApiService.post("/tasks", this.taskForm).then(() => {
            ApiService.get("/tasks/tasks_list/"+this.project_id).then(
              response => {
                this.taskList = response.data.tasks
                this.calendarOptions.initialEvents = []
                response.data.tasks.forEach(element => {
                  this.calendarOptions.initialEvents.push(
                    {
                      id: element.id,
                      task_title: element.title,
                      title: element.project_id,
                      start: element.start_time,
                      end: element.deadline,
                      task_status: element.status
                    
                    })
                  });
      let calendarApi = this.$refs.calendar.getApi()
      calendarApi.removeAllEvents();
      this.refreshEvents();
          },
          error => {
            this.categories =
              (error.response && error.response.companies) ||
              error.message ||
              error.toString();
          }
        );
                
        this.resoourceValue = [];
        this.machineValue = [];
        this.toolValue =[];
        this.addTaskModal = false;
        this.successmsg(this.$t("common.The task added successfully"))
      },
      error =>{
        this.alertText = null;
        this.showAddAlert = true;
        this.alertText = error.response.data.errors[0]["message"]
        // eslint-disable-next-line no-console
      
      }
      )}
    },

    submitAddEmployeesForm() {
      this.editSubmit = true;
      this.$v.editTaskForm.$touch();
      this.$v.editUserValue.$touch();
      if (!this.$v.editTaskForm.$invalid && !this.$v.editUserValue.$invalid) {
    
        this.editTaskForm.task_resources_attributes = this.addDeleteResourceList 

        this.editTaskForm.start_time = this.format_date(this.editTaskForm.start_time)
        this.editTaskForm.deadline = this.format_date(this.editTaskForm.deadline)
        this.editTaskForm.project_id = this.project_id

        ApiService.put("/tasks", this.editTaskForm).then(() => {
            
          ApiService.get("projects/"+parseInt(this.$route.params.id)).then(
            response => {
              this.projects = response.data.project
              this.memberList = response.data.members
                // eslint-disable-next-line no-console
            },
            error => {
              this.categories =
                (error.response && error.response.companies) ||
                error.message ||
                error.toString();
            }
          );

          ApiService.get("/tasks/tasks_list/"+parseInt(this.$route.params.id)).then(
            response => {

              response.data.tasks.forEach(element => {
              // eslint-disable-next-line no-console
              this.calendarOptions.initialEvents.push({
                  id: element.id,
                  task_title: element.title,
                  title: element.project_id,
                  start: element.start_time,
                  end: element.deadline,
                  task_status: element.status
                
                })     
              });
          
            this.refreshEvents()
            this.taskList = response.data.tasks
            
          },
          error => {
            this.categories =
              (error.response && error.response.companies) ||
              error.message ||
              error.toString();
          }
        );
        this.successmsg(this.$t("common.The task updated successfully"))
        this.editTaskModal = false;

      },
      error => {
        this.showAddAlert = true;
        this.alertText = error.response.data.errors[0]["message"]
        // eslint-disable-next-line no-console
      }
      )
    }
    },

    submitEditTaskForm() {
        this.editSubmit = true;
        this.$v.editTaskForm.$touch();
        if (!this.$v.editTaskForm.$invalid) 
        {
      
        this.editTaskForm.task_resources_attributes = this.addDeleteResourceList 

          this.editTaskForm.start_time = this.format_date(this.editTaskForm.start_time)
          this.editTaskForm.deadline = this.format_date(this.editTaskForm.deadline)
            this.editTaskForm.project_id = this.project_id
          // eslint-disable-next-line no-console
         

            ApiService.put("/tasks", this.editTaskForm).then(() => {
            
                   ApiService.get("projects/"+parseInt(this.$route.params.id)).then(
      response => {
        this.projects = response.data.project
        this.memberList = response.data.members
           // eslint-disable-next-line no-console
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
     ApiService.get("/tasks/tasks_list/"+parseInt(this.$route.params.id)).then(
      response => {

   response.data.tasks.forEach(element => {
        // eslint-disable-next-line no-console
        this.calendarOptions.initialEvents.push(
          {
            id: element.id,
            task_title: element.title,
            title: element.project_id,
            start: element.start_time,
            end: element.deadline,
            task_status: element.status
          
          }
        )
        
       
      });
      
       this.refreshEvents()

        this.taskList = response.data.tasks
         
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
        this.successmsg(this.$t("common.The task updated successfully"))
        this.editTaskModal = false;

          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0]["message"]
            // eslint-disable-next-line no-console
          
          }
          )
        }
    },
    resetTaskModal() {
        this.taskForm.title =null
        this.taskForm.description =  null
        this.taskForm.start_time = null
        this.taskForm.deadline = null
        this.taskForm.project_id = 0
        this.taskForm.task_resources_attributes = []
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
    showAttachmentModal(model) {
     
        this.attachForm.attached_on_id = this.project_id;
        this.attachForm.attached_on_type= model;
  
     
              this.addFileModal = true
      },
    attachFormSubmit() {
      
      this.attachSubmit = true;
        this.$v.attachForm.$touch();
         if (!this.$v.attachForm.$invalid)  {
        const formData = new FormData();
        
        formData.append("attached_on_id", this.attachForm.attached_on_id);
        formData.append("attached_on_type", this.attachForm.attached_on_type);
        formData.append("file", this.attachForm.file);
        formData.append("exp_date", this.attachForm.exp_date);
        
        ApiService.post("/attachments", formData).then(() => {      
          this.getAttachments()
             this.addFileModal = false;
             this.successmsg(this.$t("common.The file uploaded successfully")) 
           });
        }
    },
    getfileType(filename) {
       // eslint-disable-next-line no-console
       const name = (filename != null ? filename.substr(filename.lastIndexOf('.') + 1):"noFile.no");
              return  this.filetype.hasOwnProperty(name)? this.filetype[name]:this.filetype["uknown"];
     },
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
     refreshEvents() {
    
            
      let calendarApi = this.$refs.calendar.getApi()
       this.calendarOptions.initialEvents.map(function(value) {
         calendarApi.addEvent({
          id: value.id,
          title: value.task_title,
          project_id: value.title,
          start: value.start,
          end: value.end,
          className: value.task_status=="open"? 'bg-info text-white':
                     value.task_status=="in_progress"?'bg-warning text-white':
                     value.task_status=="done"?"bg-success  text-white": "bg-secondary text-white",
        })
   });


        },
      getAttachments() {
          ApiService.get("/attachments/get_files?attached_on_type=Project&attached_on_id="+this.$route.params.id,).then(
            response => {
                if(response.data.files && Object.keys(response.data.files).length !== 0) {
                  this.fileList = response.data.files.Project;
                  const ob = Object.keys(this.fileList);
                  this.fileList = this.fileList[ob].filter((item)=>{
                    return item.file_name != null
                  });
                  }
                  },
        error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
   
        },
        successmsg(text) {
          Swal.fire({
        position: "center",
        icon: "success",
        title: text,
        showConfirmButton: false,
        timer: 2000,
      });
    },
        
  },
  created() {
    
    ApiService.setHeader();
    ApiService.get("projects/"+parseInt(this.$route.params.id)).then(
      response => {
    // eslint-disable-next-line no-console
        this.projects = response.data.project
        this.memberList = response.data.members
        this.projectResourceList = response.data.resources
           // eslint-disable-next-line no-console
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
    
    this.getAttachments()

      ApiService.get("/resources/resource_list").then(
            response => {
        this.machineList = response.data.resources.machines
        this.toolList = response.data.resources.tools
        this.resourceList = response.data.resources.external_resources
           // eslint-disable-next-line no-console
        
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );

    ApiService.get("/users/list").then(
      response => {
        
      response.data.users.forEach(element => {
        // eslint-disable-next-line no-consol
        

      this.userList.push({name: element.first_name+" "+element.last_name, id: element.id})
      });
      



           // eslint-disable-next-line no-console
      },
      error => {
        this.userList =
          (error.response && error.response.users) ||
          error.message ||
          error.toString();
      }
    );

   ApiService.get("/tasks/tasks_list/"+parseInt(this.$route.params.id)).then(
      response => {

   response.data.tasks.forEach(element => {
        // eslint-disable-next-line no-console
        this.calendarOptions.initialEvents.push(
          {
            id: element.id,
            task_title: element.title,
            title: element.project_id,
            start: element.start_time,
            end: element.deadline,
            task_status: element.status
          
          }
        )

       
      });
      
       this.refreshEvents()

        this.taskList = response.data.tasks
         
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
    <div class="row ">
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-body">
            <div class="media">
              <img src="@/assets/images/companies/img-1.png" alt class="avatar-sm me-4" />

              <div class="media-body overflow-hidden">
                <h5 class="text-truncate font-size-15">{{projects.title}} - {{projects.project_id}}</h5>
              </div>
            </div>

            <h5 class="font-size-15 mt-4">{{$t("common.Project description")}} :</h5>

            <p
              class="text-muted"
            >{{projects.description}}</p>

            <div class="text-muted mt-4">
              <p>
                <i class="mdi mdi-chevron-right text-primary me-1"></i> <strong>{{$t('common.Contact person')}}: </strong> {{projects.contact_person}}
              </p>
              <p>
                <i class="mdi mdi-chevron-right text-primary me-1"></i><strong>{{$t('common.Address')}}: </strong> {{projects.address}}
              </p>
              <p>
                <i class="mdi mdi-chevron-right text-primary me-1"></i><strong>{{$t("common.Post number")}}: </strong> {{projects.post_number}}
              </p>
            </div>

            <div class="row task-dates">
              <div class="col-sm-4 col-md-4">
                <div class="mt-4">
                  <h5 class="font-size-14">
                    <i class="bx bx-calendar me-1 text-primary"></i> {{$t("common.Start date")}}
                  </h5>
                  <p class="text-muted mb-0">{{format_date_m(projects.start_date)}}</p>
                </div>
              </div>
              <div class="col-sm-4 col-md-4">
                <div class="mt-4">
                  <h5 class="font-size-14">
                    <i class="bx bx-calendar me-1 text-primary"></i> {{$t("common.Deadline")}}
                  </h5>
                  <p class="text-muted mb-0">{{format_date_m(projects.deadline)}}</p>
                </div>
              </div>
                            <div class="col-sm-4 col-md-4">
                <div class="mt-4">
                  <h5 class="font-size-14">
                    <i class="bx bx-check-circle me-1 text-primary"></i> Status
                  </h5>
                  <p class="text-muted mb-0">{{$t("common."+projects.project_status.name)}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end col -->

      <div class="col-lg-3">
        <div class="card h-100">
          <div class="card-body">
            <h4 class="card-title mb-4">{{$t("common.Team members")}}</h4>
              <simplebar style="max-height: 290px">
                <div class="table-responsive">
                  <table class="table table-nowrap align-middle">
                    <tbody>

                      <tr v-for="(member, index) in memberList" :key="index">
                        <td style="width: 50px;">
                          <div class="avatar-xs">
                            <span
                              class="avatar-title rounded-circle bg-soft-primary text-white font-size-14"
                            >{{member.first_name.substr(0,1)}}{{member.last_name.substr(0,1)}}</span>
                            
                          </div>
                        </td>
                        <td>
                          <h5 class="font-size-14 m-0">
                            <a href class="text-dark">{{member.first_name}} {{member.last_name}}</a>
                          </h5>
                        </td>
                        <td>
                          <div>
                            <a
                              href="javascript: void(0);"
                              class="badge bg-primary bg-soft text-primary font-size-11"
                            >{{$t("common."+member.status)}}</a>
                          </div>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </simplebar>
          </div>
        </div>
      </div>
       <div class="col-lg-3">
        <div class="card h-100">
          <div class="card-body">
            <h4 class="card-title mb-4">{{$t("common.Resources")}}</h4>
              <simplebar style="max-height: 290px">
                <div class="table-responsive">
                  <table class="table table-nowrap align-middle">
                    <tbody>

                      <tr v-for="(reource, index) in projectResourceList" :key="index">
                        <td style="width: 50px;">
                          <div class="avatar-xs">
                            <span
                              class="avatar-title rounded-circle bg-soft-primary text-white font-size-14"
                            >{{reource.name.substr(0,1)}}</span>
                            
                          </div>
                        </td>
                        <td>
                          <h5 class="font-size-14 m-0">
                            <a href class="text-dark">{{reource.name}} </a>
                          </h5>
                        </td>

                      </tr>

                    </tbody>
                  </table>
                </div>
              </simplebar>
          </div>
        </div>
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->

  
    <div class="row mt-4">
      <div class="col-lg-8">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-start">
              <h4 class="card-title mb-4">{{$t("common.Task list")}}</h4>
              <b-button
              variant="outline-primary"
                class=" ms-auto"
                @click="showTaskModal()"
                ><i class="bx bx-plus"></i>{{$t("common.Add new task")}}</b-button
              >
            </div>
            <hr>
            
            <simplebar style="max-height: 290px">
              <div class="table-responsive mb-0">
                <table class="table table-nowrap align-middle mb-0">
                  <tbody>
                    <tr v-for="task of taskList" :key="task.index" :style="(Date.parse(task.deadline)< new Date()  && task.status != 'done' )?'background:#ffd6db':''">
                      <td>
                        <h5 class="text-truncate font-size-14 m-0">
                          <a href="javascript: void(0);" @click="show_task_view(task.id)" class="text-dark">{{
                            task.title
                          }}</a>
                        </h5>
                      </td>
                      <td>
                        <div class="avatar-group">
                          <div
                            class="avatar-group-item"
                            v-for="(user, index) of task.users"
                            :key="index"
                          >
                            <a href="javascript: void(0);" :id="`taskUser-${task.id}-${user.id}`" class="d-inline-block">
                            <div class="avatar-xs">
                              <span class="avatar-title rounded-circle bg-soft-primary text-white font-size-11">
                                {{user.first_name.substr(0,1)}}.{{user.last_name.substr(0,1)}}
                              </span>
                              </div>
                            </a>
                              <b-popover  variant="danger"  :target="`taskUser-${task.id}-${user.id}`" triggers="hover" placement="top">
                                {{user.first_name}} {{user.last_name}}
                              </b-popover>
                          </div>
                        </div>
                      </td>
                        <td>
                        <div class="avatar-group">
                          <div
                            class="avatar-group-item"
                            v-for="(resource, index) of task.resources.models"
                            :key="index"
                          >
                            <a href="javascript: void(0);"  :id="`taskResource-${task.id}-${resource.id}`" class="d-inline-block">
                            <div class="avatar-xs">
                              <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                                {{resource.name.substr(0,1)}}
                              </span>
                              </div>
                            </a>
                              <b-popover  variant="danger"  :target="`taskResource-${task.id}-${resource.id}`" triggers="hover" placement="top">
                                {{resource.name}}
                              </b-popover>
                          </div>
                          <div
                            class="avatar-group-item"
                            v-for="(resource, index) of task.resources.resources"
                            :key="index"
                          >
                            <a href="javascript: void(0);"  :id="`taskResource-${task.id}-${resource.id}`" class="d-inline-block">
                            <div class="avatar-xs">
                              <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                                {{resource.name.substr(0,1)}}
                              </span>
                              </div>
                            </a>
                              <b-popover  variant="danger"  :target="`taskResource-${task.id}-${resource.id}`" triggers="hover" placement="top">
                                {{resource.name}}
                              </b-popover>
                          </div>
                            <div
                            class="avatar-group-item"
                            v-for="(resource, index) of task.resources.tools"
                            :key="index"
                          >
                            <a href="javascript: void(0);"  :id="`taskResource-${task.id}-${resource.id}`" class="d-inline-block">
                            <div class="avatar-xs">
                              <span class="avatar-title rounded-circle bg-warning text-white font-size-11">
                                {{resource.name.substr(0,1)}}
                              </span>
                              </div>
                            </a>
                              <b-popover  variant="danger"  :target="`taskResource-${task.id}-${resource.id}`" triggers="hover" placement="top">
                                {{resource.name}}
                              </b-popover>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <span
                            class="badge rounded-pill font-size-12"
                            :class="{
                              'badge-soft-info': task.status === 'open',
                              'badge-soft-warning': task.status === 'in_progress',
                              'badge-soft-success': task.status === 'done'
                            }"
                            >{{ $t("common."+task.status) }}</span
                          >
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <span>{{format_date_m(task.start_time)}}</span
                          >
                        </div>
                      </td>
                                            <td>
                        <div class="text-center">
                          <span>{{format_date_m(task.deadline)}}</span
                          >
                        </div>
                      </td>
                      <td class="text-end">
                        <b-button @click="addUserAccountTask(task)" size="sm" variant="outline-warning" class="me-2"><i class="bx bx-edit font-size-12 pt-1"></i></b-button>
                        <b-button @click="editTask(task)" size="sm" variant="outline-warning" class="me-2"><i class="bx bx-edit font-size-12 pt-1"></i></b-button>
                        <b-button @click="deleteTask(task)"  size="sm" variant="outline-danger" class="me-2"><i class="bx bx-trash font-size-12 pt-1"></i></b-button>
                    
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </simplebar>
          </div>
        </div>
      </div>
      <!-- end col -->

      <div class="col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            

<div class="d-flex justify-content-between">
  <h4 class="card-title mb-4">{{$t("common.Attached files")}}</h4>
  <div>
    <b-button @click="showAttachmentModal('Project')" size="sm" variant="outline-warning" class="me-2"><i class="bx bx-paperclip font-size-12 pt-1"></i></b-button>
  </div>
</div>

            <div class="table-responsive">
            <simplebar style="max-height: 350px">
              <table class="table table-nowrap table-centered table-hover mb-0 align-middle">
                <tbody>
                  <tr v-for="file in fileList" :key="file.id" >
                    <td style="width: 45px;">
                      <div class="avatar-sm">
                        <span
                          class="avatar-title rounded-circle bg-soft bg-primary text-primary font-size-24"
                        >
                          <i class="mdi "
                          :class="getfileType(file.file_name)"
                          ></i>
                        </span>
                      </div>
                    </td>
                    <td @click="download(file.uuid,file.file_name)">
                      <h5 class="font-size-14 mb-1">
                        <a href="javascript: void(0);" class="text-dark">{{file.file_name.substr(0,15)}}....{{file.file_name.substr(file.file_name.lastIndexOf('.') + 1)}}</a>
                      </h5>
                    </td>
                    <td>
                      <div class="text-center">
                         <span
                               
                                 
                                  class="text-dark fw-medium"
                                  > <i class="bx bx-download h3 m-0"></i>
                         </span
                                >
                      
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </simplebar>
            </div>
          </div>
        </div>
      </div>
      <!-- end col -->

    
      <!-- end col -->
    </div>
    <!-- end row -->

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="app-calendar">
              <FullCalendar
              style="height:300px"
                ref="calendar"
                :options="calendarOptions">
                  <template v-slot:eventContent='arg'>
                   <span :id="`taskView-`+arg.event.id" class="text-white d-inline-block">
                   
                     {{ arg.event.title }}    
                     
                  </span>
                  <b-popover  variant="danger"  :target="`taskView-`+arg.event.id" triggers="hover" placement="bottom">
                  {{$t("common.Title")}}:  {{ arg.event.title }} <br>
                 </b-popover>
                  </template>
              </FullCalendar>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  <b-modal  :title="$t('common.Add task')" size="xl" v-model="addTaskModal" hide-footer @hidden="resetTaskModal()">
    <form action="#" @submit.prevent="submitTaskForm" href="addTaskFrom">
      <div class="row">
        <div class="col-md-12">
            <b-alert v-model="showAddAlert" dismissible variant="danger">
          <h5>{{alertText}}</h5>         
              </b-alert>    
        </div>
    
        <div class="col-md-6">
          <div class="form-group row">
              <label>{{$t("common.Task title")}}</label>
              <div class="col-ld-12">
            <input v-model="taskForm.title" type="text" class="form-control" :placeholder="$t('common.Enter title')" name="title"
            :class="{'is-invalid': typesubmit && $v.taskForm.title.$error}" />
          </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group row">
            <label>{{$t("common.Start date")}}</label>  
            <div class="col-lg-12">
              <date-picker :formatter="myFormat"  v-model="taskForm.start_time" dateFormat='dd/mm/yyyy'  append-to-body lang="nb"
              :class="{'is-invalid': typesubmit && $v.taskForm.start_time.$error}"
                ></date-picker>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group row">
            <label>{{$t("common.Deadline")}}</label>
            <div class="col-lg-12">
              <date-picker :formatter="myFormat"  v-model="taskForm.deadline" append-to-body lang="nb"
              :class="{'is-invalid': typesubmit && $v.taskForm.deadline.$error}"
                ></date-picker>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mt-3">
          <div class="form-group row">
          <label>{{$t("common.Add machine")}}</label>  
            <div class="col-lg-12">
              <multiselect 
                            :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
                    v-model="machineValue" 
                    :options="taskMachinesList"
                    :multiple="true"
                    :placeholder="$t('common.Select option')"
                    track-by="name"
                    :custom-label="customLabelMachine"
                    :close-on-select="false"
                    @select=onSelectMachine($event)
                    @remove=onRemoveMachine($event)
                    >
                    <span slot="noOptions">{{$t("common.Not an available machine for this dates")}}</span>
                    <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                      <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
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
            <label>{{$t("common.Add tool")}}</label>  
            <div class="col-lg-12">
              <multiselect         :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"

                    v-model="toolValue" 
                    :options="taskToolsList"
                    :multiple="true"
                    track-by="name"
                    :placeholder="$t('common.Select option')"
                    :custom-label="customLabelMachine"
                    :close-on-select="false"
                    @select=onSelectTool($event)
                    @remove=onRemoveTool($event)
                    >
                    <span slot="noOptions">{{$t("common.Not an available tool for this dates")}}</span>
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
            <label>{{$t("common.Add external resource")}}</label>
            <div class="col-lg-12">
                <multiselect 
                           :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
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
                    <span slot="noOptions">{{$t("common.Not an available resource for this dates")}}</span>
                    <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                      <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
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
        <div class="col-md-12 mt-3">
          <div class="form-group row">
            <label>{{$t("common.description")}}</label>
            <div class="col-lg-12">
              <textarea v-model="taskForm.description" rows="3" class="form-control"></textarea>    
            </div>
          </div>
        </div>

      
         <div class="modal-footer mt-3"> 
          <b-button type="submit" variant="outline-success">  <i class="bx bx-save"></i> {{$t("common.Save")}}</b-button>
        </div>
    </div>
</form>   

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
                  <div>
                    <label>{{$t("common.Document")}}</label>
                     <b-form-file v-model="attachForm.file" 
                      :class="{'is-invalid': attachSubmit && $v.attachForm.exp_date.$error}"
                     ></b-form-file>
                  
                  </div>
                </div>
                    <div class="modal-footer mt-3"> 
                      <button type="submit" class="btn btn-outline-success">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
                    </div>
                </div>
      </form>
    </b-modal>


    <b-modal  title="View task" size="xl" v-model="viewTaskModal" hide-footer>

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
                <i class="mdi mdi-chevron-right text-primary me-1"></i>{{$t("common.Resources")}}: 
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

  <b-modal
    :title="$t('common.Add employees')"
    size="xl"
    v-model="addUserAccountTaskModal"
    hide-footer
  >
    <form action="#" @submit.prevent="submitAddEmployeesForm">
      
      <div
        class="time-slots-container"
        @mousedown="startSelecting"
        @mousemove="expandSelection"
        @mouseup="stopSelecting"
        @mouseleave="stopSelecting"
      >
        <div
          v-for="(slot, index) in timeSlots"
          :key="index"
          :class="['time-slot', { 'selected': isSelected(index), 'selecting': isSelecting && isInRange(index) }]"
          @mouseenter="setHoverIndex(index)"
          :data-index="index"
        >
          {{ slot }}
        </div>
      </div>

      <div class="modal-footer mt-3">
        <b-button type="submit" variant="outline-success">
          <i class="bx bx-save"></i> {{$t("common.Save")}}
        </b-button>
      </div>
    </form>
  </b-modal>
    
  <b-modal  :title="$t('common.Edit task')" size="xl" v-model="editTaskModal" hide-footer>
               <form action="#" @submit.prevent="submitEditTaskForm" href="">
                 <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showEditAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                      <div class="form-group row">
                         <label>{{$t('common.Task title')}}</label>
                         <div class="col-ld-12">
                        <input v-model="editTaskForm.title" type="text" class="form-control" :placeholder="$t('common.Enter title')" name="title"
                         :class="{'is-invalid': editSubmit && $v.editTaskForm.title.$error}" 
                         />
                      </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                        <label>{{$t("common.Start date")}}</label>  
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="editTaskForm.start_time" dateFormat='dd/mm/yyyy'  append-to-body lang="nb" 
                          :class="{'is-invalid': editSubmit && $v.editTaskForm.start_time.$error}" 
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                       <label>{{$t("common.Deadline")}}</label>
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="editTaskForm.deadline"  append-to-body lang="nv" 
                          :class="{'is-invalid': editSubmit && $v.editTaskForm.deadline.$error}" 
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                      <label>{{$t('common.Add machine')}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                                       :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
                                v-model="editMachineValue" 
                                :options="taskMachinesList"
                                :multiple="true"
                                :placeholder="$t('common.Select option')"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t('common.Not an available machine for this dates')}}</span>
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
                     <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t('common.Add tool')}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                                        :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
                                v-model="editToolValue" 
                                :options="taskToolsList"
                                :multiple="true"
                                :placeholder="$t('common.Select option')"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t('common.Not an available tool for this dates')}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"   v-model="scope.option.checked" @focus.prevent/>
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
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t('common.Add external resource')}}</label>
                        <div class="col-lg-12">
                            <multiselect 
                                        :select-label="'klikk enter for å velge'"
                                :selected-label="'valgt'"
                                :deselect-label="'klikk enter for å fjerne'"
                                v-model="editResoourceValue" 
                                :options="taskExternalResourceList"
                                :multiple="true"
                                :placeholder="$t('common.Select option')"
                                track-by="name"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
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
                    <div class="col-md-12 mt-3">
                      <div class="form-group row">
                        <label>{{$t('common.description')}}</label>
                        <div class="col-lg-12">
                          <textarea v-model="editTaskForm.description" rows="3" class="form-control"></textarea>    
                        </div>
                      </div>
                    </div>
     
                  
                    <div class="modal-footer mt-3"> 
                      <b-button type="submit" variant="outline-success">  <i class="bx bx-save"></i> {{$t("common.Save")}}</b-button>
                    </div>
                </div>
            </form>   
     
    </b-modal>

  </Layout>
</template>

<style >
.popover-body {
  border: 1px solid #ccc !important;
  padding: 0.5rem !important;
}
.custom-file-label {
  display: none;
}

.mx-datepicker.is-invalid  input{
  border:1px solid #f46a6a  !important;
 
}

.multiselect.is-invalid .multiselect__tags {
    border:1px    solid #f46a6a  !important;
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


.time-slots-container {
  display: flex;
  user-select: none;
}

.time-slot {
  padding: 5px 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.time-slot.selected,
.time-slot.selecting {
  background-color: #007bff;
  color: white;
}

</style>