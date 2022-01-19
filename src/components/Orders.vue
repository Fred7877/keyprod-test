<template>
  <v-data-table
      :headers="headers"
      :items="orders"
      :items-per-page="5"
      class="elevation-1"
  >

    <template v-slot:item.nb_article="{ item }">
      {{ item.items !== undefined ? item.items.length : 0 }}
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip
          :color="getColorStatus(statusWording(item), item.number)"
          outlined
      >
        {{ statusWording(item) }}
      </v-chip>
    </template>


    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
          small
          @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>

    <template v-slot:item.progress="{ item }">
      <v-progress-linear
          :value="progress(item)"
          color="blue"
          height="25"
      >
        <template v-slot:default="{ value }">
          <strong class="white--text">{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
    </template>


  </v-data-table>
</template>

<script>

import {fetchData} from "../services/fetchers";
import mixin from '../mixin'

export default {
  name: 'Login',
  mixins: [mixin],
  data() {
    return {
      headers: [
        {
          text: 'Numéro',
          align: 'start',
          sortable: true,
          value: 'number',
        },
        {
          text: 'Order',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        {
          text: 'Nombre d\'articles',
          align: 'center',
          sortable: true,
          value: 'nb_article',
        },
        {
          text: 'Date et heure',
          align: 'start',
          sortable: true,
          value: 'datetime_order',
        },
        {
          text: 'Commandé par',
          align: 'start',
          sortable: true,
          value: 'orderer',
        }, {
          text: 'État',
          align: 'start',
          sortable: true,
          value: 'progress',
        },
        {
          text: 'Statut',
          align: 'start',
          sortable: true,
          value: 'status',
        },
        {
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: 'actions',
        },
      ],
      orders: []
    }
  },
  mounted() {
    fetchData('orders').then((response) => {

      this.orders = response;
    })
  },
  methods: {
    progress(item) {
      if (item.items === undefined ||
          this.$store.state.itemsReady[item.number] === undefined ||
          this.$store.state.itemsReady[item.number] === null) {
        return 0;
      }

      return this.$store.state.itemsReady[item.number].length * 100 / item.items.length;
    },
    editItem(item) {

      this.$router.push({name: 'details-order', params: {orderId: item.number}})
    },
    statusWording(order) {

      return this.realStatus(order.items, order.number);
    }
  }
};
</script>
