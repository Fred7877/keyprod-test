<template>
  <div>
    <v-form v-model="valid">
      <div
          class="d-inline-flex pa-2 "
      >
        <v-text-field
            v-model="parcelNumber"
            label="Saisir n° de colis"
            :rules="rules"
        ></v-text-field>

      </div>

      <div
          class="d-inline-flex pa-2"
      >
        <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="search"
        >
          Rechercher
        </v-btn>
      </div>

      <v-card class="pa-4"
              max-width="500"
              outlined
              v-if="find">

        <div class="d-flex align-start flex-column">
          {{ status }}
        </div>
        <v-divider class="mb-2"></v-divider>

        <div class="d-flex align-start flex-column">
          N° de commande : {{ orderNumber }}
        </div>

        <div class="d-flex align-start flex-column">
          Nombre d' article : {{ articleCount }}
        </div>

        <div class="d-flex align-start flex-column">
          Poids : {{ totalWeight }}
        </div>

      </v-card>
    </v-form>
  </div>
</template>

<script>

import {fetchData} from "../services/fetchers";
import mixin from "../mixin";

export default {
  name: 'tracking-parcel',
  mixins: [mixin],
  data() {
    return {
      rules: [
        v => !!v || 'Le n° de colis est obligatoire',
        v => v.length === 12 || 'Le n° de colis doit avoir 12 caractères'
      ],
      parcelNumber: '',
      valid: false,
      status: '',
      orderNumber: '',
      ArticleCount: '',
      find: false,
      articleCount: 0,
      totalWeight: 0,
    }
  },
  methods: {
    search() {
      // QWSo0ceY3fRd
      // E68rfMqgr9l1
      // ZBNf96omME8e
      fetchData('orders').then((orders) => {
        // We want the order status, we loop in all order
        orders.forEach((order) => {
          this.$store.state.itemsParcel.forEach((parcel) => {
            if (order.number === parcel[1].order && this.parcelNumber === parcel[0]) {
              this.find = true;
              this.orderNumber = parcel[1].order
              this.articleCount = this.sumItem(parcel[1].items);
              this.totalWeight = this.sumWeight(parcel[1].items);

              switch (this.realStatus(order)) {
                case 'Traité':
                  this.status = 'Commande traité, colis expédié.'
                  break;

                case 'En cours':
                  this.status = 'Commande en cours de traitement, colis non expédié.'
                  break;

                case 'Non traité':
                  this.status = 'Commande non traité, colis non expédié.'
                  break;
              }
            }
          });
        });
      })


      /*
      this.$store.state.itemsParcel.forEach((parcel) => {
        if (this.parcelNumber === parcel[0]) {
          console.log(parcel);
          this.parcel = parcel
        }
      });
       */
    }
  }
}
</script>
