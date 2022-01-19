<template>
  <div>
    <DialogQrCode></DialogQrCode>

    <div class="order d-flex justify-space-between mb-4">

      <div class="d-inline-flex d-flex flex-row ">
        <v-text-field
            label="Numéro de la commande"
            hide-details="auto"
            :value="this.order.number"
            disabled

        ></v-text-field>

        <v-text-field
            label="Poids total"
            hide-details="auto"
            :value="totalWeight()"
            class="ml-3"
            disabled

        ></v-text-field>

        <v-text-field
            label="Client"
            hide-details="auto"
            :value="this.order.orderer"
            class="ml-3"
            disabled

        ></v-text-field>
      </div>

      <div class="d-flex justify-end mb-6">
        <v-btn
            elevation="2"
            class="mr-5"
            color="primary"
            @click="createParcelNumber"
        >Nouveau numéro colis
        </v-btn>

        <v-btn
            elevation="2"
            color="primary"
            @click="showDialogQrCode"
            :disabled="!isParcelCreated"
        >Saisir QR Code
        </v-btn>
      </div>

    </div>

    <v-chip
        :color="getColorStatus(status)"
        class="mb-4"
        outlined
    >
      {{ status }}
    </v-chip>

    <v-divider class="mb-4"></v-divider>

    <div class="items">
      <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          class="elevation-1"
      >

        <template v-slot:item.weight="{ item }">
          {{ item.weight }} Kg
        </template>

        <template v-slot:item.ready="{ item }">
          <v-chip
              :color="isReady(item)"
              dark
          >
            {{ statusWording(item) }}
          </v-chip>
        </template>

        <template v-slot:item.parcelNumber="{ item }">
          {{ getParcelNumber(item) }}
        </template>

      </v-data-table>
    </div>

    <ParcelsList></ParcelsList>

  </div>
</template>

<script>

import {fetchData} from "../services/fetchers";
import DialogQrCode from "./DialogQrCode";
import {mapState} from "vuex";
import mixin from '../mixin'
import ParcelsList from "./ParcelsList";

export default {
  name: 'details-order',
  mixins: [mixin],
  components: {
    ParcelsList,
    DialogQrCode
  },
  computed: {
    ...mapState({
      count: state => state.count,
      order: state => state.order,
      itemsReady: (state) => state.itemsReady,
      isParcelCreated: function () {

        return this.$store.state.parcels[this.order.number] !== null &&
            this.$store.state.parcels[this.order.number] !== undefined &&
            this.$store.state.parcels[this.order.number].length > 0;
      },
      status: function () {

        return this.realStatus(this.items, this.order.number);
      },
      parcels() {
        return this.$store.state.getParcels;
      }
    }),
  },
  data() {
    return {
      totalWeight: function () {
        let totalWeight = 0;
        if (this.items !== undefined) {
          this.items.forEach((item) => {
            totalWeight += item.weight;
          })
        }

        return totalWeight.toFixed(2) + ' Kg';
      },
      headers: [
        {
          text: 'Désignation',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        {
          text: 'Poids',
          align: 'start',
          sortable: true,
          value: 'weight',
        },
        {
          text: 'Préparé',
          align: 'start',
          sortable: true,
          value: 'ready',
        },
        {
          text: 'N° Colis',
          align: 'start',
          sortable: true,
          value: 'parcelNumber',
        }
      ],
      items: []
    }
  },
  mounted() {
    fetchData('order', this.$route.params.orderId).then((response) => {
      this.$store.commit('setOrder', response)
      this.items = response.items;
    });
  },
  methods: {
    createParcelNumber() {
      this.$store.dispatch('setOrderParcel', this.generateParcelNumber())
    },
    // get the item by the qrCode
    filterItem(item) {
      if (this.itemsReady[this.order.number] === null) {
        return [];
      }

      return Object.values(this.itemsReady[this.order.number]).filter(obj => {
        return obj.qrCode === item.qrCode
      });
    },
    showDialogQrCode() {
      this.$store.commit('toggleDialogQrCode')
    },
    getParcelNumber(item) {
      let result = this.filterItem(item);

      if (result[0] !== undefined) {
        return result[0].parcelNumber;
      }
    },
    isReady(item) {
      let result = this.filterItem(item);

      if (result[0] !== undefined) {
        return 'green';
      } else {
        return 'red';
      }
    },
    statusWording(item) {

      let result = this.filterItem(item);

      if (result[0] !== undefined) {
        return 'OK';
      } else {
        return 'N-OK';
      }
    }
  }
};
</script>
