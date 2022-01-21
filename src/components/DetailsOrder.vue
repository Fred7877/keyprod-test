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
            :disabled="status === 'Traité'"
        >Nouveau numéro colis
        </v-btn>

        <v-btn
            elevation="2"
            color="primary"
            @click="showDialogQrCode"
            :disabled="!isParcelCreated || status === 'Traité'"
        >Scanner un QR Code
        </v-btn>
      </div>

    </div>

    <v-chip
        :color="getColorStatusOrder(status)"
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

        <template v-slot:item.totalWeightItems="{ item }">
          {{ totalWeightItems(item) }} Kg
        </template>

        <template v-slot:item.quantity="{ item }">
          {{ getQuantityEntered(item) }} / {{ item.quantity }}
        </template>

        <template v-slot:item.ready="{ item }">
          <v-chip
              :color="getColorStatus(item)"
              dark
          >
            {{ statusWording(item) }}
          </v-chip>
        </template>

        <template v-slot:item.parcelsNumber="{ item }">
          <ul style="list-style: none; padding: 0">
            <li
                v-for="(parcelsNumber, i) in getParcelsNumber(item)"
                :key="i"
            > {{ parcelsNumber }}
            </li>
          </ul>
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
        let isParcelCreated = false;

        if (this.$store.state.itemsParcel !== undefined &&
            this.$store.state.itemsParcel.length > 0) {

          this.$store.state.itemsParcel.forEach((obj) => {
            if (obj[1].order === this.order.number) {
              isParcelCreated = true;
            }
          });
        }

        return isParcelCreated;
      },
      status: function () {

        return this.realStatus(this.items, this.order);
      }
    }),
  },
  data() {
    return {
      totalWeight: function () {
        let totalWeight = 0;
        if (this.items !== undefined) {
          this.items.forEach((item) => {
            totalWeight += item.weight * item.quantity;
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
          text: 'Poids / unité',
          align: 'start',
          sortable: true,
          value: 'weight',
        },
        {
          text: 'Poids total',
          align: 'start',
          sortable: true,
          value: 'totalWeightItems',
        },
        {
          text: 'Nombre d\'articles',
          align: 'center',
          sortable: true,
          value: 'quantity',
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
          value: 'parcelsNumber',
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
    getQuantityEntered(item) {
      let quantityEntered = 0;

      this.$store.state.itemsParcel.forEach((obj) => {
        obj[1].items.forEach((itemParcel) => {
          if (itemParcel.qrCode === item.qrCode &&
              this.$store.state.order.number === item.order) {
            quantityEntered += itemParcel.quantityEntered
          }
        });
      });

      return quantityEntered;
    },
    totalWeightItems(item) {
      let totalWeightItems = 0;

      if (item.weight !== undefined) {
        totalWeightItems = item.weight * item.quantity;
      }

      return totalWeightItems;
    },
    createParcelNumber() {
      this.$store.dispatch('setOrderParcel', this.generateParcelNumber())
    },
    showDialogQrCode() {
      this.$store.commit('toggleDialogQrCode')
    },
    getParcelsNumber(item) {

      var parcelsNumber = [];
      if (this.$store.state.itemsParcel !== undefined) {
        this.$store.state.itemsParcel.forEach((obj) => {
          obj[1].items.forEach((parcelItem) => {
            if (parcelItem.qrCode === item.qrCode &&
                this.$store.state.order.number === parcelItem.order) {
              parcelsNumber.push(obj[0]);
            }
          });
        });
      }

      return parcelsNumber;
    },
    isStatusOk(item) {

      return item.quantity === this.getQuantityEnteredForProduct(item);
    },
    getColorStatus(item) {

      return this.isStatusOk(item) ? 'green' : 'red';
    },
    statusWording(item) {

      return this.isStatusOk(item) ? 'OK' : 'N-OK';
    }
  }
};
</script>
