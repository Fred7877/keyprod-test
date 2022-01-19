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
          </thead>
          <tbody>
          <tr
              v-for="(parcel, i) in ItemsParcel"
              :key="i"
          >
            <td>{{ parcel[0] }}</td>
            <td>{{ parcel[1]}}</td>
            <td>{{ parcel[2]}}&nbsp;Kg</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>

</template>

<script>

export default {
  name: 'parcels-list',
  computed: {
    ItemsParcel() {
console.log(this.$store.getters.getItemsParcel);
      return this.$store.getters.getItemsParcel;
    },
    getParcels() {

      return this.$store.getters.getParcels;
    },
  }
}
</script>