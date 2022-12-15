<template>
  <v-app>
    <ModalMessages :visible="showModalMessages" @close="showModalMessages = false" />
    <app-navigation-drawer ref="navigationDrawer" v-if="isLoggedIn" />
    <v-main class="vh-100 application">
      <router-view />
      <AppNotification />
      <!--
      <chat-vue></chat-vue>
      -->
    </v-main>
  </v-app>
</template>
<style>
  .vh-100 {
    height: 100%;
  }
</style>
<script>
  // import ChatVue from "@/components/Chat/Chat.vue";


  import ModalMessages from '@/components/ModalMessages';
  import AppNotification from "@/components/AppNotification";
  import AppNavigationDrawer from "@/components/NavigationDrawer";
  export default {
    name: "App",
    components: {
      AppNotification,
      AppNavigationDrawer,
      ModalMessages,
      // ChatVue
    },

    data() {
      return {
        showModalMessages: false,
      }
    },
    computed: {
      isLoggedIn: function () {
        return this.$store.getters['auth/isLoggedIn']
      }
    },

  };
</script>
<style scoped>
  ::v-deep .sc-message--text-content {
    margin-bottom: 0 !important
  }

  ::v-deep .sc-message--text {
    display: flex !important
  }

  ::v-deep .sc-message--edited {
    margin-left: 3px !important
  }
</style>