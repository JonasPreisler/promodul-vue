import  firebase  from 'firebase';
import store from '@/state/store'



const firebaseConfig = {
  apiKey: "AIzaSyB0AQzv_9wAdX3bPvvqEOU604FpwGHtGzs",
  authDomain: "planner-bergen.firebaseapp.com",
  databaseURL: "https://planner-bergen-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "planner-bergen",
  storageBucket: "planner-bergen.appspot.com",
  messagingSenderId: "42974106222",
  appId: "1:42974106222:web:481806d939c9c1d6c34c7f"
};

 const app = firebase.initializeApp(firebaseConfig)
  // eslint-disable-next-line no-console
 
  const role  = store.state.authfack.user.role_group

  export const db = app.database()

   let notificatons = db.ref(role)  
   export const notifications = notificatons