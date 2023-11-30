<script>
import axios from "axios";
import Swal from "sweetalert2";
import {
  authFackMethods,
  notificationMethods,
} from "@/state/helpers";
import { mapState } from "vuex";

import appConfig from "@/app.config";
import { required, email } from "vuelidate/lib/validators";

/**
 * Login component
 */
export default {
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
  
  },
  data() {
    return {
       loginForm: {
        email: "",
        password: "" 
        },
        mailForm: {
          mailEmail: "",
          mailPhone: "" 
        },
      loginModal: false,

        submittedMail:false,
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    };
  },
  validations: {
    loginForm: {
      email: { required },
      password: { required }
    },
     mailForm: {
      mailEmail: { required,email },
      mailPhone: { required }
    },
  },
  computed: {
    ...mapState("authfack", ["status"]),
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  methods: {
 
    ...authFackMethods,
    ...notificationMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.notification.message = false
      this.isAuthError = false
      this.submitted = true;
      // stop here if form is invalid
      this.$v.loginForm.$touch();

      if (this.$v.loginForm.$invalid) {
        return;
      } else {
        if (process.env.VUE_APP_DEFAULT_AUTH === "fakebackend") {
          const  email = this.loginForm.email
          const  password  = this.loginForm.password;
          if (email && password) {
            this.login({
              email,
              password,
            });
          }
        }
      }
    },
       sendMail(){
         this.submittedMail = true;
      // stop here if form is invalid
      this.$v.mailForm.$touch();

      if (this.$v.mailForm.$invalid) {
        return;
      } else {
           axios.post("https://apipromodul.no/en/auth/send_email", {
                      email: this.mailForm.mailEmail,
                      phone: this.mailForm.mailPhone,
                    }).then(response=>{
                      // eslint-disable-next-line no-console
                      
                      if (response.data.success) {
                            Swal.fire({
                              position: "center",
                              icon: "success",
                              title: this.$t("common.Mail sent successfully"),
                              showConfirmButton: false,
                              timer: 2000,
                              });
                      } else {
 Swal.fire({
                              position: "center",
                              icon: "error",
                              title:  this.$t("common.Something went wrong, try latter"),
                              showConfirmButton: false,
                              timer: 2000,
                              });
                      }

      })
       

           
      }
    },
  },
  mounted() {},
};
</script>

<template>
  <div class=" d-md-block ">
      <div class="container-fluid" style="padding: 3rem 10% 0 10% !important">
          <header class="d-flex flex-wrap justify-content-center  border-bottom">
              <a href="/" class="d-flex align-items-center  mb-md-0 me-md-auto ">
                <img src="@/assets/images/main_logo.png" width="70%" />
              </a>

      <ul class="nav nav-pills">
        <li class="nav-item"><a href="#contacts" class="nav-link">Kontakt oss</a></li>
        <li class="nav-item"><div class="btn btn-info" @click="loginModal=true">LOGG INN</div></li>
      </ul>
    </header>
    <div class="row pt-4 ">
      <div class="col-6 pt-5 d-none d-md-block">
        <span style="font-size:3.8em;  " class="fw-bold">Fordeling av ressurser <br>enkelt og smart.</span> <br>
            <span style="color:#CED8DF; font-size:1.7rem">I ProModul ser du og planlegger enkelt ressurser og prosjekter i fargekoder</span>
      </div>
      <div class="col-6  d-none d-md-block">
        <img src="@/assets/images/undra.svg" width="100%">
      </div>
      
      <div class="col-12 d-block d-sm-none">
        <img src="@/assets/images/undra.svg" width="100%">
      </div>
        <div class="col-12 pt-5 d-block d-sm-none">
        <span style="font-size:3em;  " class="fw-bold">Fordeling av ressurser <br>enkelt og smart.</span> <br>
            <span style="color:#CED8DF; font-size:1.7rem">I ProModul ser du og planlegger enkelt ressurser og prosjekter i fargekoder</span>
      </div>
     
    </div>
 

   </div>
    <div class="clearfix"></div>
    <div class=" clearfix" style="background: #EFF4F8; padding:0 10%">
        <div class="col-12 fw-bold d-none d-md-block" style="font-size:3rem; padding: 6rem 0">
          Oversiktlig fordeling av ansatte, <br> maskiner og verktøy på prosjekter.
        </div>
           <div class="col-12 fw-bold d-block d-sm-none" style="font-size:1.9rem; padding: 4rem 0">
          Oversiktlig fordeling av ansatte, <br> maskiner og verktøy på prosjekter.
        </div>
      
            <div class="row ">
            <div class="col-sm-12 col-md-3  text-center " style="" >
              <div style="width:80%; margin:auto; background:white; height:90%">
              <img src="@/assets/images/calendar.png" class="mt-3" /> 
              <div class="mt-3 font-size-20">Kalenderoversikt</div>
              <div class="mt-4 text-left mb-5" style="color:#858683">
                Full oversikt over alle ansatte og ressurser i kalender.
              </div>
              </div>
            </div>
             <div class="text-center col-sm-12 col-md-3">
              <div style="width:80%; margin:auto; background:white;  height:90%">
              <img src="@/assets/images/clock1.png" class="mt-3" /> 
              <div class="mt-3 font-size-20">Varsler</div>
              <div class="mt-4 text-left mb-5" style="color:#858683">
                Utløpsdato og endringer i prosjekter og dokumenter.
              </div>
              </div>
            </div>

              <div class="text-center col-sm-12 col-md-3">
              <div style="width:80%; margin:auto; background:white;  height:90%">
              <img src="@/assets/images/trash.png" class="mt-3" /> 
              <div class="mt-3 font-size-20">Dokumentarkiv</div>
              <div class="mt-4 text-left mb-5" style="color:#858683">
                søkefunksjon over ansatte, prosjekt og dokumenter
              </div>
              </div>
            </div>
            <div class="text-center col-sm-12 col-md-3">
              <div style="width:80%; margin:auto; background:white;  height:90%" >
              <img src="@/assets/images/house.png" class="mt-3" /> 
              <div class="mt-3 font-size-20">Prosjekter</div>
              <div class="mt-4 text-left mb-5" style="color:#858683">
                Se detaljer oversikt over prosjekt, ansatte, ressurser og tidsfrister
              </div>
              </div>
            </div>
            </div>
     
        <div>
          <div style="color:#71A1C1; font-size:2rem; margin-top: 80px;" class="pb-5">
            “ProModul gjør det superenkelt og oversiktlig å fordele dine ressurser i et prosjekt.
            ProModul er et  nytt digitalt verktøy du blir glad i.
            ,,
          </div>
          <span></span>
        </div>
    </div>
    <div class="row mt-4 ">
      <div class="col-3 d-sm-none d-md-block">
            <div class="d-none d-md-block" style="position:absolute; right:1.5rem; bottom: -2.7rem">
                <img src="@/assets/images/mail_box.png" style="width:18rem" />
            </div>
      </div>
      <div class="col-sm-12 col-md-9" style="background: #EFF4F8">
              <div class="row ps-4 mt-4">
                <div class="col-sm-9 col-md-6">
                    <div class="display-6">Prøv ProModul GRATIS nå</div>
                    <div style="color:#404040; font-size:1rem" class="pt-2">fyll ut skjemaet så kontakter vi deg for en demo</div>
                </div>
                <div class="col-sm-1  col-md-2 offset-md-2  offset-sm-1 text-center d-none d-sm-block">
                  <img src="@/assets/images/main_logo.png" style="width:9.4rem" />
                </div>
              </div>



               <b-form class="p-2" @submit.prevent="sendMail">
             
              <div class="row ps-4 pt-5 pb-5">
                <div class="col-sm-4 col-md-3 ">
                <b-form-input
                  id="input-1"
                  v-model="mailForm.mailPhone"
                  type="text"
                  placeholder="Navn"
                  :class="{ 'is-invalid': submittedMail && $v.mailForm.mailPhone.$error}"
                ></b-form-input>
                  <div
                  v-if="submittedMail && $v.mailForm.mailPhone.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.mailForm.mailPhone.required">Navn er nødvendig.</span>
              
                </div>
                </div>
              
             <div class="col-sm-4 col-md-3 ">
               <div class="pt-3 d-block d-sm-none"></div>
                <b-form-input
                  id="input-2"
                  v-model="mailForm.mailEmail"
                  type="text"
                  placeholder="E-Post"
                  :class="{ 'is-invalid': submittedMail && $v.mailForm.mailEmail.$error }"
                ></b-form-input>
                <div v-if="submittedMail && !$v.mailForm.mailEmail.required" class="invalid-feedback">E-post er nødvendig.</div>
                <div v-if="submittedMail && !$v.mailForm.mailEmail.email" class="invalid-feedback">Skriv inn gyldig E-post. </div>
             </div>
             
             <div class="col-2 offset-2 d-none d-md-block">
                   <b-button type="submit" variant="info" class="btn-block w-100">{{$t("common.Send")}}</b-button>
              </div>

            <div class="col-2 d-block d-sm-none pt-2">
                   <b-button type="submit" variant="info" class="btn-block w-100">{{$t("common.Send")}}</b-button>
              </div>
              </div>
                           <!-- <div class="mt-4 text-center">
                <router-link tag="a" to="/forgot-password" class="text-muted">
                  <i class="mdi mdi-lock me-1"></i> Forgot your password?
                </router-link>
              </div> -->
            </b-form>
          
    
      </div>
    </div>
    <div class="row mt-4" style="background:#71A1C1; border:1px solid #707070;height:15.75rem" id="contacts">
      <div class="col-3 d-none d-md-block">
        <div style="position:absolute; top:5rem; right:8rem">
          <img src="@/assets/images/main_logo.png" style="width: 10.5rem"  />
        </div>
      </div>
      <div class="d-none d-md-block col-4 text-left text-white offset-2 font-size-16" style="margin-top:4rem">
        <span class="mdi mdi-email-outline"></span> E-post:  <a style="color:white !important; text-decoration: underline !important; " href="mailto:info@promodul.no">info@promodul.no</a> <br><br>
        <span class="mdi mdi-phone-outline"></span> Telefon:   411 40 700<br><br>
        <span class="mdi mdi-home-outline"></span> Firma: Promodul AS
      </div>
        <div class="d-block d-sm-none col-10 offset-2  text-left text-white font-size-16" style="margin-top:4rem">
        <span class="mdi mdi-email-outline"></span>  E-post:  <a style="color:white !important; text-decoration: underline !important; " href="mailto:info@promodul.no">info@promodul.no</a> <br><br>
        <span class="mdi mdi-phone-outline"></span> Telefon:   411 40 700<br><br>
        <span class="mdi mdi-home-outline"></span> Firma: Promodul AS
      </div>
      <div class="col-3 d-none d-md-block">
        <div style="position:absolute; right:0.7rem; top:0.4rem">
          <img src="@/assets/images/social_media.png"  style="height:15rem">
        </div>
      </div>
    </div>
      
<b-modal v-model="loginModal" hide-footer centered header-class="border-0">

                      <b-alert
              v-model="isAuthError"
              variant="danger"
              class="mt-3"
              dismissible
              >{{ authError }}</b-alert
            >

            <div
              v-if="notification.message"
              :class="'alert ' + notification.type"
            >
              {{ notification.message }}
            </div>

            <b-form class="p-2" @submit.prevent="tryToLogIn">
              <b-form-group
                class="mb-3"
                id="input-group-1"
                label="Brukernavn"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="loginForm.email"
                  type="text"
                  placeholder="Brukernavn"
                  :class="{ 'is-invalid': submitted && $v.loginForm.email.$error}"
                ></b-form-input>
                <div
                  v-if="submitted && $v.loginForm.email.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.loginForm.email.required">Brukernavn er nødvendig.</span>
              
                </div>
              </b-form-group>

              <b-form-group
                class="mb-3"
                id="input-group-2"
                label="Passord"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="loginForm.password"
                  type="password"
                  placeholder="Passord"
                  :class="{ 'is-invalid': submitted && $v.loginForm.password.$error }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.loginForm.password.required"
                  class="invalid-feedback"
                >
                  Passord er nødvendig.
                </div>
              </b-form-group>

              <div class="mt-3 d-grid">
                <b-button type="submit" variant="primary" class="btn-block"
                  >Log Inn</b-button
                >
              </div>
                           <!-- <div class="mt-4 text-center">
                <router-link tag="a" to="/forgot-password" class="text-muted">
                  <i class="mdi mdi-lock me-1"></i> Forgot your password?
                </router-link>
              </div> -->
            </b-form>
     
             </b-modal>

    <!-- end row -->
  </div>



  
</template>

<style>
  html, body {
    overflow-x: hidden;
  }
  .title {
    @include font-size(4rem);
}
@media screen and (max-width : 600px)
{
  html, body
  {
    font-size:5px;
  }
}
@media screen and (max-width : 1204px)
{
  html, body
  {
    font-size:10px;
  }
}

@media screen and (max-width : 1400px)
{
  html, body
  {
    font-size:11px;
  }
}

</style>