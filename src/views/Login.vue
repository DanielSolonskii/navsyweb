<template>
  <v-row class="fill-height d-flex  " fluid style="height: 100vh; overflow-y: auto">
    <v-col cols="3">
      <v-row align="center" justify="center">
        <v-col style="    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh; align-items: center">
          <v-card elevation="0">
            <v-card-title>
              <v-spacer></v-spacer>
              <img :src="require('../assets/Logo.png')" alt="lorem" class="image" width="250px">
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-title>
              <v-spacer></v-spacer>Авторизация<v-spacer></v-spacer>
            </v-card-title>
            <v-form ref="formLogin" @keyup.native.enter="login">
              <v-card-text>
                <v-text-field v-model="name" label="Name" name="name" prepend-icon="mdi-account" type="text"
                  :rules="nameRules"></v-text-field>
                <v-text-field v-model="password" id="password" label="Пароль" name="password" prepend-icon="mdi-lock"
                  type="password" :rules="passwordRules"></v-text-field>
              </v-card-text>
              <v-alert type="error" dismissible :value="login_error" transition="scale-transition"
                @input="login_error = !login_error">
                {{msg_error}}
              </v-alert>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="login" outlined color="blue" class="px-4">Вход</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
          <div>
          Служба поддержки пользователей: demo.navsy.ru
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="9" class="background-pic">

    </v-col>
  </v-row>
</template>

<script>
  import AuthService from "@/services/auth";

  export default {
    name: "Login",
    methods: {
      login: function () {
        if (this.$refs.formLogin.validate()) {
          this.msg_error = '';
          this.login_error = false;
          AuthService.authorization({
              name: this.name,
              password: this.password
            })
            .catch((err) => {
              this.msg_error = err;
              this.login_error = true;
            });
        }
      }
    },
    data() {
      return {
        msg_error: "",
        login_error: false,
        name: "",
        password: "",
        nameRules: [
          v => !!v || 'Имя обязательно',
        ],
        passwordRules: [
          v => !!v || 'Пароль обязательно',
        ],
      }
    },
  }
</script>

<style scoped>
  .fill-height {
    flex-wrap: nowrap
  }

  .background-pic {
    background-image: url('~@/assets/img/sp.jpg');
    background-size: cover;
  }

  ::v-deep .v-card__actions > .v-btn.v-btn {
    width: 80%
  }

  ::v-deep .v-card__actions {
    flex-direction: column !important;
  }
</style>