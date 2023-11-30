<script>

/**
 * Transactions component
 */
export default {
  components: {
    
  },
  props: {
    transactions: {
      type: Array,
      default: function () {
        return [];
      },
    },
    updating: {
      type: Boolean,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
};
</script>

<template>
    <div class="table-responsive mb-0">
      <table class="table table-sm border-info  align-middle table-nowrap table-hover table-striped">
        <thead class="table-light">
          <tr>
            <th class="align-middle">{{$t("common.name")}}</th>
            <th class="align-middle">{{$t("common.Email")}}</th>
            <th class="align-middle">{{$t("common.Phone")}}</th>
            <th class="align-middle">{{$t("common.Username")}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in transactions" :key="data.id">
           
            <td> 
              <div class="rounded-circle bg-info text-center text-white text-uppercase" style="width:2.2rem; height:2.2rem; line-height:2.2rem">
                {{ data.username.substring(0,1) }}
            
              </div>
               {{ data.last_name }}
              </td>
              
            <td>{{ data.email }}</td>
            <td>{{ data.phone_number }}</td>
            <td>{{ data.username }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- end table -->
</template>