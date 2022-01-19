<template>
  <transition name="fade">
    <v-navigation-drawer app
                         bottom
                         v-if="this.drawer"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Dashboard
          </v-list-item-title>
          <v-list-item-subtitle>
            commandes
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-app-bar-nav-icon @click="toggleMenu"></v-app-bar-nav-icon>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
          dense
          nav
      >
        <v-list-item
            v-for="item in items"
            :key="item.title"
            link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              <router-link to="/orders">{{ item.title }}</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </transition>
</template>

<style>

</style>

<script>
import {mapState} from 'vuex'

export default {
  name: "side-menu",
  computed: mapState({
    drawer: state => state.drawer,
  }),
  data() {
    return {
      items: [
        {title: 'Commandes', icon: 'mdi-view-dashboard'},
      ],
    }
  },
  methods: {
    toggleMenu() {
      this.$store.commit('toggleMenu');
    },
  }
}
</script>
