<template>
  <v-app>
    <v-main>
      <v-app-bar
          elevation="1"
          v-if="showAppBar"
      >
        <v-app-bar-nav-icon @click="toggleMenu" v-show="!drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <v-btn
              elevation="2"
              color="primary"
              small
              rounded
              @click="logout"
          >Logout </v-btn>

      </v-app-bar>
      <v-container fluid>
        <router-view/>
        <SideMenu v-if="showSideMenu"></SideMenu>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>

import SideMenu from "./components/SideMenu";

export default {
  name: 'App',
  components: {
    SideMenu
  },

  computed: {
    drawer: function () {
      return this.$store.state.drawer
    },
    showSideMenu: function () {
      return this.$store.getters.isAuthenticated
    },
    showAppBar: function () {
      return this.$store.getters.isAuthenticated
    },
  },
  methods: {
    toggleMenu() {
      this.$store.commit('toggleMenu');
    },
    async logout() {
      await this.$store.dispatch('logOut')
    },
  }
};
</script>
