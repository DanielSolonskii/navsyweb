<template>
  <v-navigation-drawer fixed where-is-nav app permanent :mini-variant="mini" v-model="drawer" dark
    :mini-variant-width="72" class="app-sidebar">

    <div>

    </div>

    <v-dialog v-model="isShowing" width="800px">
      <v-card style="overflow: hidden">
        <v-row style="margin-left: 10px; margin-right: 10px; ">
          <v-col cols="5" class="pr-0" >
            <v-tabs v-model="tab" centered class="v-tabs-dialog">
              <v-tabs-slider></v-tabs-slider>
              <v-tab href="#tab-1">
                Чат
              </v-tab>
              <v-tab href="#tab-2">
                Рассылка
              </v-tab>
            </v-tabs>
            <div class="d-flex">
              <v-text-field style="max-width: 230px" append-icon="mdi-magnify" label="Поиск"></v-text-field>
              <v-icon class="ml-2">mdi-format-list-bulleted</v-icon>
            </div>
            <div class="mt-6">
              Совпадений не найдено
            </div>
            <!--
            <v-tabs-items v-model="tab">
              <v-tab-item key="0" value="tab-1">
                tab item 1
              </v-tab-item>
              <v-tab-item key="1" value="tab-2">
                tab item 2
              </v-tab-item>
            </v-tabs-items>
            -->
          </v-col>
          <v-col cols="7" class="pl-0">
            <v-row class="ma-0">
              <v-btn plain style="margin-left: auto; margin-top: 4px" @click="isShowing = !isShowing">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-row>
            <v-row class="ma-1" style="height:400px; padding-top: 20px; padding-bottom: 40px">
              <div style="height:40px; width: 100%">Кому</div>
              <div>Отправка сообщений доступна при использовании X-GPS Tracker</div>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-menu :close-on-click="true" class="main-menu">
      <template v-slot:activator="{ on }">
        <v-list-item v-show="!smallScreen" class="system-menu-wrapper">
          <v-list-item-icon>
            <button class="v-btn v-btn--icon" icon @click.stop="miniToggle()">
              <v-icon>{{ appBarIcon }}</v-icon>
            </button>
          </v-list-item-icon>
          <v-list-item-content class="pt-0">
            <!--main menu-->
            <template v-if="!mini">
              <div class="menu-system pt-0" @click="$router.push('start-page')">
                НАВСИ.ДУС
                <!--
                <v-select :items="menu.subSystemsMenu" :value="menu.subSystemsMenu[0].text" item-text="text"
                  :label="menu.subSystemsMenu[0].text" persistent-hint return-object single-line></v-select> -->
                <!--<v-select return-object :items="getMenus" label="Выберите систему" filled></v-select>
                                   <v-list-group>
                    <template v-slot:activator>
                      <v-list-item class="main-menu-link">
                        <v-list-item-title>
                          Навигатор
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                    <v-list-item v-for="link in linksToSystems" :to="link.to" :key="link.text">
                      <v-list-item-icon>
                        <v-icon>{{ link.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ link.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list-group> -->
              </div>
            </template>
            <!--main menu-->
          </v-list-item-content>
        </v-list-item>
        <button v-on="on">
          <v-list-item>
            <v-list-item-avatar>
              <img alt="Avatar" src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ username }}</v-list-item-title>
              <v-list-item-subtitle>{{ balance }} руб.</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-chevron-down</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </button>
      </template>
      <v-list class="menu-area">
        <v-list-item v-for="(link, index) in menu.profileMenu" :key="index" :to="link.to">
          <v-list-item-title class="tile"><v-icon>{{ link.icon }}</v-icon> {{ link.title }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title class="tile" @click.stop="logout()"><v-icon>mdi-logout</v-icon> Выйти</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-list nav dense>
      <!-- mobile menu -->
      <template v-if="mini">
        <v-list-item v-for="(link, i) in menu.mainMenu" :key="i" :to="link.to">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on }">
              <v-list-item-icon>
                <v-icon v-on="on">{{ link.icon }}</v-icon>
              </v-list-item-icon>
            </template>
            <v-list v-if="link.subLinks">
              <v-list-item v-for="sublink in link.subLinks" :to="sublink.to" :key="sublink.text">
                <v-list-item-title>{{ sublink.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </template>
      <!-- mobile menu -->
      <template v-if="!mini">
        <div v-for="(link, i) in menu.mainMenu" :key="i">
          <v-list-item v-if="!link.subLinks" :to="link.to" class="v-list-item v-list-group__header">
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>

          <v-list-group v-else :key="link.text">
            <v-icon slot="prependIcon">{{ link.icon }}</v-icon>
            <template v-slot:activator>
              <v-list-item :to="link.to" class="main-menu-link">
                <v-list-item-title>
                  <p class="line-break">{{ link.text }}</p>
                </v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item v-for="sublink in link.subLinks" :to="sublink.to" :key="sublink.text">
              <v-list-item-icon>
                <v-icon>{{ sublink.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ sublink.text }}</v-list-item-title>
            </v-list-item>

          </v-list-group>
        </div>
      </template>
    </v-list>

    <template v-slot:append>
      <template v-for="link in menu.linksBottom">
        <v-list-item v-if="link.text=='Сообщения'" :key="link.text" @click='toggleShow'>
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ link.text }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-else :to="link.to" :key="link.text">
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ link.text }}</v-list-item-title>
        </v-list-item>
      </template>
    </template>
  </v-navigation-drawer>
</template>
<script>
  import httpClient from '@/api'
  import {
    mapState
  } from 'vuex'
  import AuthService from "@/services/auth";
  export default {
    name: "NavigationDrawer",
    components: {

    },
  
    computed: {
      ...mapState({
        menu: state => state.layout.menu,
        isLoggedIn: state => state.auth.isLoggedIn
      }),
      appBarIcon() {
        return this.mini ? "mdi-chevron-right" : "mdi-chevron-left";
      },
      smallScreen() {
        return this.$vuetify.breakpoint.mdAndDown
      },
      mini: {
        get() {
          return this.$vuetify.breakpoint.mdAndDown || this.overwriteBreakpoint;
        },
        set(value) {
          this.mini = value;
        }
      }

    },
    methods: {
      getMoney(){
        httpClient.api.getAccountInfo(localStorage.getItem('username'))
                .then(resp =>{
                    this.username = resp.data.username;
                    this.balance = resp.data.balance
                    console.log(this.id, this.balance);
                });
      },
      toggleShow() {
        this.isShowing = !this.isShowing;
        console.log('this.isShowing = ' + this.isShowing)
      },
      messagesCall() {
        console.log('messagesCall')
        this.toggleShow
      },
      miniToggle() {
        return this.overwriteBreakpoint = !this.overwriteBreakpoint;
      },
      logout() {
        AuthService.logout()
      },
     
    },
    beforeMount(){
      this.getMoney();
      },
    data() {
      return {
        isShowing: false,
        drawer: null,
        overwriteBreakpoint: false,
        tab: null,
        username: 'null',
        balance: 0
      };
    }
    
  }
</script>
<style scoped>
  .app-sidebar {
    height: 100% !important;
  }

  .v-list-item--link:before {
    background-color: #626262;
  }

  .v-deep .v-ripple__animation {
    display: none !important
  }

  .v-list-item__title,
  .v-list-item__subtitle {
    white-space: normal;
  }

  .v-application .primary--text {
    color: white !important;
  }

  .v-list-item--active {
    background-color: inherit;

    color: white;
  }

  .v-list-group--active {
    background-color: #363636;
    color: white;
  }

  .v-application a {
    color: white;
  }


  .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
    align-self: flex-start;
  }


  .nav-aside {
    top: 48px !important;
  }

  .menu-system:hover {
    cursor: pointer
  }

  ::v-deep .v-navigation-drawer__content {
    overflow-y: unset;
    overflow-x: unset;
  }

  ::v-deep .menu-area{
    margin: 2px;
    border-radius: 2px;
    background: rgb(153, 153, 153);
  }

  .tile:hover {
    background: rgb(215, 215, 215);
  }
  .tile:active {
    background: rgb(26, 26, 26);
  }
  ::v-deep .line-break,
  ::v-deep .v-list--dense .v-list-item .v-list-item__title {
    font-size: 14px;
  }

  ::v-deep .v-tabs-dialog a {
    color: inherit !important;
  }
</style>