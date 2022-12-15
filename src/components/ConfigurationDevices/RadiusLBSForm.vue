<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" style="min-height: 0">
      <div style="font-size: small">
        Допустимый размер погрешности для точек, определенных методом LBS-геолокации
        (по сигналам GSM и WiFi).
        Игнорировать точки с погрешностью хуже:
      </div>
      <v-slider
          v-model="selectedDevice.radius_lbs_error"
          class="mx-3"
          step="0.1"
          max="5"
          min="0"
          thumb-label="always"
          dense
          hide-details
          color="indigo darken-3"
      >
      </v-slider>
      <div>км</div>
    </v-row>
    <div>
      <v-row class="ma-0 pa-2">
        <v-btn
            color="indigo darken-3"
            small
            outlined
            class="ml-auto"
        >
          Сохранить
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "RadiusLBSForm",
  props: {
    selectedDevice: Object
  },
}
</script>

<style scoped>

</style>