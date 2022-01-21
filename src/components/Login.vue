<template>
  <v-card
      class="d-flex justify-center mb-6"
      flat
      shaped
      align="center"
  >
    <v-card
        class="pa-15"
        outlined
        elevation="2"
    >
      <v-form ref="form" class="mx-2" lazy-validation>
        <v-alert
            type="error"
            v-if="showError"
        >Erreur identifiants</v-alert>

        <v-text-field
            v-model="form.username"
            :rules="userNameRules"
            label="User name"
            required
        ></v-text-field>

        <v-text-field
            v-model="form.password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-btn
            color="primary"
            @click="submit"
        >
          login
        </v-btn>

      </v-form>
    </v-card>
  </v-card>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: 'Login',
  data () {
    return {
      showError: false,
      userNameRules: [
        v => !!v || 'User name is required',
        v => (v && v.length > 1) || 'Name must be more than 10 characters',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      form: {
        username: "",
        password: "",
      },
      showPassword: false,
      nameErrors: 'The field name is mandatory',
    }
  },
  methods: {
    ...mapActions(["LogIn"]),
    async submit() {

      const User = new FormData();
      User.append("username", this.form.username);
      User.append("password", this.form.password);
      try {
        await this.LogIn(User);
      } catch (error) {
        this.showError = true
      }
    },
  }
}
</script>
