<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="pa-0" style="height: 20px">
        <v-btn
            color="indigo darken-1"
            dark
            small
        >
          Добавить моточасы
        </v-btn>
      </v-col>
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
  name: "EngineHoursForm",
  props: {
    selectedDevice: Object
  },
}
</script>

<style scoped>

</style>