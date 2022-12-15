<template>
  <v-navigation-drawer
      v-model="loc_drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
  >
    <v-list dense>
      <v-list-item-group v-model="item" color="primary">
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.page"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "NavigationApp",
  props: {
    drawer: Boolean
  },
  computed: {
    loc_drawer: {
      get() {
        return this.drawer;
      },
      set(value) {
        this.$emit("update:drawer", value);
      }
    }
  },
  data() {
    return {
      item: 0,
      items: [
        { icon: 'mdi-view-dashboard-outline', text: 'Главная', page: 'home' },
        { icon: 'mdi-car-settings', text: 'Гараж', page: 'garage' },
        { icon: 'mdi-map-marker-multiple-outline', text: 'Мониторинг', page: 'monitoring' },
        { icon: 'mdi-chart-line', text: 'Отчёты', page: 'report' },
        { icon: 'mdi-map', text: 'Редактор геозон', page: 'geozone' },
        { icon: 'mdi-cog-outline', text: 'Настройки', page: 'settings' },
      ],
    }
  }
}
</script>

<style scoped>

</style>