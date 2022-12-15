<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" style="min-height: 0">
      <v-text-field
          dense
          outlined
          :value="selectedDevice.name"
      ></v-text-field>
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
  name: "NameDeviceForm",
  props: {
    selectedDevice: Object
  },
}
</script>

<style scoped>

</style>