<script>
import axios from "axios";
import ApiService from "@/state/modules/api.service";
import i18n from "../i18n";
import simplebar from "simplebar-vue";

import {  notifications } from '../firebase';
/**
 * Nav-bar Component
 */
export default {
  firebase: {
    anArray: notifications,
    count: [{id:12}] 
    },
  data() {
    return {
      anArray: [],
      count:null,
      anObject: null,
      languages: [
        {
          flag: require("@/assets/images/flags/us.jpg"),
          language: "en",
          title: "English",
        },
        {
          flag: require("@/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French",
        },
        {
          flag: require("@/assets/images/flags/spain.jpg"),
          language: "es",
          title: "Spanish",
        },
        {
          flag: require("@/assets/images/flags/chaina.png"),
          language: "zh",
          title: "Chinese",
        },
        {
          flag: require("@/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic",
        },
      ],
      username: null,
      FLName:null,
      lan: i18n.locale,
      notificationCount:0,
      text: null,
      flag: null,
      value: null,
      user_id : this.$store.state.authfack.user.id,
      uuid: this.$store.state.authfack.user.company_logo,
      companyLogo:false
    };
  },
  components: { simplebar },
  mounted: function () {
     // eslint-disable-next-line no-console
  this.$watch('anArray', function () {
   this.$forceUpdate()
    let t = Object.values(this.anArray);
    // eslint-disable-next-line no-console
    //  console.log(this.anArray)
    for (let i = 0; i < t.length; i++) {
 
      if(i==0)
       this.notificationCount = 0
      if (this.user_id == t[i].user_id)
        this.notificationCount++;
}



  }, {deep:false})
},
  created() {
    // eslint-disable-next-line no-console
     let t = Object.values(this.anArray);
    // eslint-disable-next-line no-console
    //  console.log(this.anArray)
    for (let i = 0; i < t.length; i++) {
 
      if(i==0)
       this.notificationCount = 0
      if (this.user_id == t[i].user_id)
        this.notificationCount++;
}
    axios({
  url: 'https://apipromodul.no/en/company_logos/logo?uuid='+this.$store.state.authfack.user.company_logo, //your url
  method: 'GET',
  responseType: 'blob', // important
}).then((response) => {
      // eslint-disable-next-line no-unused-vars
      const blob = new Blob([response.data], { type: response.data.type })
          this.companyLogo = 'https://apipromodul.no/en/company_logos/logo?uuid='+this.$store.state.authfack.user.company_logo;

        // eslint-disable-next-line no-unused-vars
        } ,error => {
             this.companyLogo = false
             
              }
        );

    // eslint-disable-next-line no-console
  
    //let user = JSON.parse(localStorage.getItem('user'));
    // ApiService.setHeader();
//  ApiService.get("/companies/"+user.company_id).then(
//       response => {
      
//         // eslint-disable-next-line no-console
//         console.log( response.data.company.company_logo.uuid);
       
//            // eslint-disable-next-line no-console
//       },
//       error => {
//         this.categories =
//           (error.response && error.response.companies) ||
//           error.message ||
//           error.toString();
//       }
//     );

    // eslint-disable-next-line no-console
    
    this.username = this.$store.state.authfack.user.username
    this.FLName = this.$store.state.authfack.user.first_name.substring(0,1)+"."+this.$store.state.authfack.user.last_name.substring(0,1)
    this.value = this.languages.find((x) => x.language === i18n.locale);
    this.text = this.value.title;
    this.flag = this.value.flag;
  },
  methods: {
    logout() {
       ApiService.setHeader();
        ApiService.delete("/auth").then(()=>{
          this.$router.push("/logout")
      })
     
    },
removeNogification(key){
  notifications.child(key).remove()
  this.notificationCount--;
},
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    setLanguage(locale, country, flag) {
      this.lan = locale;
      this.text = country;
      this.flag = flag;
      i18n.locale = locale;
    },
    logoutUser() {
      // eslint-disable-next-line no-unused-vars
      axios.get("http://127.0.0.1:8000/api/logout").then((res) => {
        this.$router.push({
          name: "default",
        });
      });
    },
  },
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <router-link tag="a" to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img :src="(companyLogo?companyLogo:require(`../assets/images/logo.svg`))"  alt height="55" />
            </span>
            <span class="logo-lg">
              <img :src="(companyLogo?companyLogo:require(`../assets/images/logo.svg`))" alt height="20" />
            </span>
          </router-link>

          <router-link tag="a" to="/" class="logo logo-light">
            <span class="logo-sm">
              <img :src="(companyLogo?companyLogo:require(`../assets/images/logo.svg`))" alt height="24" />
            </span>
            <span class="logo-lg">
              <img :src="(companyLogo?companyLogo:require(`../assets/images/logo.svg`))" alt height="55" />
            </span>
          </router-link>
        </div>

        <button
          id="vertical-menu-btn"
          type="button"
          class="btn btn-sm px-3 font-size-16 header-item"
          @click="toggleMenu"
        >
          <i class="fa fa-fw fa-bars"></i>
        </button>

        <!-- App Search-->
        <!-- <form class="app-search d-none d-lg-block">
          <div class="position-relative">
            <input
              type="text"
              class="form-control"
              :placeholder="$t('navbar.search.text')"
            />
            <span class="bx bx-search-alt"></span>
          </div>
        </form> -->
      </div>

      <div class="d-flex">


        <b-dropdown
          right
          menu-class="dropdown-menu-lg p-0 dropdown-menu-end"
          toggle-class="header-item noti-icon"
          variant="black"
        >
          <template v-slot:button-content>
            <i class="bx bx-bell bx-tada"></i>
            <span class="badge bg-danger rounded-pill">{{notificationCount}}</span>
          </template>

          <div class="p-3">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="m-0">
                  {{ $t("common.Notifications") }}
                </h6>
              </div>
              <!-- <div class="col-auto">
                <a href="#" class="small">{{
                  $t("navbar.dropdown.notification.subtext")
                }}</a>
              </div> -->
            </div>
          </div>
          <simplebar style="max-height: 230px">
             <li v-for="person of anArray" v-bind:key="person['.key']">
                <span v-if=" person.user_id == user_id"  class="text-reset notification-item">
                  <a :href="person.type=='Project'?'/#/projects/overview/'+person.type_id:'#'">
              <div  class="media">
                <div class="avatar-xs me-3">
                  <span
                    class="avatar-title bg-primary rounded-circle"
                  >
                  <i v-if="person.type=='Task'" class="bx bx-task font-size-18 "></i>
                  <i v-if="person.type=='Project'" class="bx bx-briefcase-alt-2 font-size-16"></i>
                  
                  </span>
                </div>
                <div class="media-body">
                  <h6 class="mt-0 mb-1">
                    {{ person.text }} <br>
                    
                  </h6>
                  <div class="font-size-12 text-muted">
                    <p class="mb-1">
                     {{ person.title }}
                    </p>
                  </div>
                </div>
                <i class="mdi mdi-check-all text-success font-size-18" style="cursor:pointer"  @click="removeNogification(person['.key'])"></i>
              </div>
                  </a>
            </span>
  </li>


          </simplebar>
          <!-- <div class="p-2 border-top d-grid">
            <a
              class="btn btn-sm btn-link font-size-14 text-center"
              href="javascript:void(0)"
            >
              <i class="mdi mdi-arrow-right-circle me-1"></i>
              {{ $t("navbar.dropdown.notification.button") }}
            </a>
          </div> -->
        </b-dropdown>

        <b-dropdown right variant="black" toggle-class="header-item" menu-class="dropdown-menu-end">
          <template v-slot:button-content>
             <div  class="rounded-circle bg-info text-center text-white text-uppercase float-start font-size-10" style="width:2rem; height:2rem; line-height:2rem">
               {{FLName}}
             </div>

            <span class="d-none d-xl-inline-block ms-1 pt-2">{{ username }}</span>
            <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
          </template>
          <!-- item-->
       
         <a @click="logout()"
            href="/#/logout"
           
            class="dropdown-item text-danger"
          >
            <i
              class="bx bx-power-off font-size-16 align-middle me-1 text-danger"
            ></i>
            {{ $t("common.Logout") }}
          </a>
        </b-dropdown>
      </div>
    </div>
  </header>
</template>
