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

        <v-card-text>
          <v-text-field
              width="500"
              v-model="nbArticle"
              hint="Nombre d'article préparé"
              label="Saisir le nombre d'article préparés :"
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
              @click="qrCodeValidation"
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
import mixin from "../mixin";

export default {
  name: 'dialog-qrcode',
  mixins: [mixin],
  data() {
    return {
      qrCode: '',
      parcelNumber: '',
      items: {},
      dialogError: false,
      errors: [],
      nbArticle: 0
    }
  },
  computed: mapState({
    dialogQrCode: state => state.dialogQrCode,
    order: state => state.order,
    parcels() {

      return this.$store.getters.getParcels;
    }
  }),
  methods: {
    isQuantityEnteredIsOK(item) {

      return this.getQuantityEnteredForProduct(item) < item.quantity;
    },
    qrCodeValidation() {
      this.errors = [];

      if (this.qrCode === '') {
        this.errors.push('Le numéro Qr code est obligatoire.');
      }

      if (this.nbArticle == 0) {
        this.errors.push('Au moins 1 article est obligatoire.');
      }

      if (this.parcelNumber === '') {
        this.errors.push('Un numéro de colis est obligatoire.');
      }

      // An parcel number is mandatory
      if (Object.keys(this.errors).length === 0) {
        let present = false;
        // Check if the qrCode is in order
        this.$store.state.order.items.forEach(item => {
          item.quantityEntered = parseInt(this.nbArticle);
          if (item.qrCode !== undefined && item.qrCode === this.qrCode) {
            if (!this.isQuantityEnteredIsOK(item) || item.quantityEntered > item.quantity) {
              this.errors.push('La quantité saisie est trop grande.');
            }

            if (item.qrCode === this.qrCode) {
              present = true;
              if (this.errors.length === 0) {
                // Add the parcel number to the item
                item.parcelNumber = this.parcelNumber;

                item.order = this.$store.state.order.number;

                // we push it in itemsReady array state
                this.$store.commit('pushItemsReady', {item: item});
              }
            }
          }
        });

        if (this.errors.length === 0) {
          this.$store.commit('toggleDialogQrCode')
          this.qrCode = ''
          this.parcelNumber = ''
          this.nbArticle = 0
        }

        // if the qrCode is not present in the orders, we show a dialog
        if (!present) {
          this.dialogError = true;
        }
      }
    },
    closeQrCode() {
      // reset
      this.qrCode = ''
      this.parcelNumber = ''
      this.nbArticle = 0
      this.errors = [];
      this.$store.commit('toggleDialogQrCode')
    }
  }

}
</script>