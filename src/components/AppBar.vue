<template>
  <v-app-bar
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      dark
      absolute
  >
    <v-app-bar-nav-icon @click.stop="setDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
    >
      <span class="">{{$route.meta.heading}}</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
        icon
        color="white"
        @click="logout()"
    >
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import AuthService from "@/services/auth";
export default {
  name: "AppBar",
  props: {
    drawer: Boolean,
  },
  data: () => ({
    mini: false,
  }),
  methods: {
    logout() {AuthService.logout()},
    setDrawer() {
      this.$emit('update:drawer', !this.drawer);
      // this.mini = !mini;
    }
  },
}
</script>

<style scoped>

</style>