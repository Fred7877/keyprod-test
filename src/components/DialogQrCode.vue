<template>
  <div class="text-center">
    <v-dialog
        v-model="dialogQrCode"
        width="500"
        @click:outside="closeQrCode"
    >
      <v-card>
        <v-card-title class="text-h5 blue lighten-2 white--text">
          QR Code - Numéro de colis
        </v-card-title>

        <v-card-text>
          <v-text-field
              v-model="qrCode"
              hint="qrcode du produit"
              label="Saisir QrCode* :"
          ></v-text-field>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-text>
          <v-alert
              v-for="(error, index) in errors " :key="index"
              dense
              type="error"
          >{{ error }}
          </v-alert>
        </v-card-text>

        <!-- Parcel Number -->
        <v-card-text>
          <v-select
              v-model="parcelNumber"
              :items="parcels"
              label="Numéro du colis"
              solo
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="validerQrCode"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog error -->
    <v-dialog
        v-model="dialogError"
        width="500"
    >
      <v-card>
        <v-card-title class="text-h5 red lighten-2 white--text">
          Erreur
        </v-card-title>

        <v-card-text>
          Cette article ne figure pas dans la commande
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="dialogError = false"
          >
            compris
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'dialog-qrcode',
  data() {
    return {
      qrCode: '',
      parcelNumber: '',
      order: {},
      items: {},
      dialogError: false,
      errors: [],
    }
  },
  computed: mapState({
    dialogQrCode: state => state.dialogQrCode,
    parcels() {
      return this.$store.getters.getParcels.map(function(a) {
        if(a !== null) {
          return a.number;
        }
        return [];
      });
    }
  }),
  methods: {
    validerQrCode() {
      this.errors = [];
      if (this.qrCode === '') {
        this.errors.push('Le numéro Qr code est obligatoire.');
      }

      // An parcel number is mandatory
      if (Object.keys(this.errors).length === 0) {
        let present = false;
        // Check if the qrCode is in order
        this.$store.state.order.items.forEach(item => {
          if (item.qrCode !== undefined) {
            if (item.qrCode === this.qrCode) {
              // we push it in itemsReady array state
              item.parcelNumber = this.parcelNumber;
              this.$store.dispatch('addItemsReady', item);
              present = true;
            }
          }
        });

        this.$store.commit('toggleDialogQrCode')
        this.qrCode = ''
        this.parcelNumber = ''

        // if the qrCode is not present in the orders, we show a dialog
        if (!present) {
          this.dialogError = true;
        }
      }
    },
    closeQrCode() {
      this.$store.commit('toggleDialogQrCode')
    }
  }

}
</script>