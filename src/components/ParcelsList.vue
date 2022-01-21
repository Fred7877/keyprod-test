<template>
  <div>
    <v-card
        max-width="320"
        class="mt-10"
    >
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              N° colis
            </th>
            <th class="text-left">
              Nombre d'articles
            </th>
            <th class="text-left">
              Poids
            </th>
          </tr>
          <tr></tr>
          </thead>
          <tbody>
          <tr
              v-for="(parcel, i) in ItemsParcel"
              :key="i"
          >
            <td>{{ parcel[0] }}</td>
            <td>{{ parcel[1] }}</td>
            <td>{{ parcel[2] }}&nbsp;Kg</td>
            <td>
              <v-icon
                  small
                  @click="deleteParcel(parcel)"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <div class="text-center ma-2">
      <v-snackbar
          :value="snackbar"
          absolute
          top
          right
          tile
          color="red accent-2"
      >
        Il y a des articles dans ce colis, impossible de le supprimer
      </v-snackbar>
    </div>


  </div>
</template>

<script>

export default {
  name: 'parcels-list',
  data() {
    return {
      snackbar: false,
      timeoutSnackbar: 2000,
    }
  },
  computed: {
    ItemsParcel() {

      return this.$store.getters.getItemsParcels;
    },
  },
  methods: {
    deleteParcel(parcel) {
      if (!this.$store.commit('deleteParcel', parcel)) {
        this.snackbar = true;
        // This is for keep the control of the snackbar
        setTimeout(() => {
          this.snackbar = false;
        }, this.timeoutSnackbar)
      }
    }
  }
}
</script>