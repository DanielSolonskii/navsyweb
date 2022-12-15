<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" style="min-height: 0">
      <v-checkbox
          v-model="selectedDevice.danger_driving"
          label="Отслеживать опасное вождение"
          color="indigo darken-3"
          hide-details

      ></v-checkbox>
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
  name: "DangerDrivingForm",
  props: {
    selectedDevice: Object
  }
}
</script>

<style scoped>

</style>