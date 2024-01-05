import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { authHeader } from '../../helpers/authservice/auth-header';
import router from "../../router";
/**
 * Service to call HTTP request via Axios
 */
const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL =
      "http://localhost:3000/en/";
  },

  /**
   * Set the default HTTP request headers
   */
  getLang() {
    return "en";
  },
  setHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
    ] =  `Bearer ${authHeader()}`;
  },
  removeHeader() {
    delete axios.defaults.headers.common["Authorization"];
  },
  query(resource, params) {
    return Vue.axios.get(resource, params);
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource, slug = "") {
    return Vue.axios.get(`${resource}${slug}`).catch(function(error){
      // eslint-disable-next-line no-console
      if (error.response.status === 401)
        router.push("/logout")
        else return Promise.reject(error);
        
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    return Vue.axios.post(`${resource}`, params)
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params).catch(function(error){
      // eslint-disable-next-line no-console
      if (error.response.status === 401)
        router.push("/logout")
           else return Promise.reject(error);
    });
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return Vue.axios.put(`${resource}`, params).catch(function(error){
      // eslint-disable-next-line no-console
      if (error.response.status === 401)
        router.push("/logout")
       else return Promise.reject(error);
    });
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource, params) {
    return Vue.axios.delete(resource, params).catch(function(error){
      // eslint-disable-next-line no-console
      if (error.response.status === 401)
        router.push("/logout")
    });
  }
};

export default ApiService;
