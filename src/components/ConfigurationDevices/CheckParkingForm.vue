<template>
<div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="px-0 py-1 mt-2">
        <div style="font-size: small;">
          Время для фиксации состояния "стоянка", не менее
        </div>
        <div>
          <v-text-field
              v-model="selectedDevice.fix_parking_minutes"
              dense
              type="number"
              color="indigo darken-2"
              suffix=" минута"
              style="width: 200px"
          >
          </v-text-field>
        </div>
      </v-col>
      <v-col cols="12" class="px-0 py-1 mt-2">
        <div style="font-size: small;">
          Скорость для определения состояния "Остановился", менее
        </div>
        <div>
          <v-text-field
              v-model="selectedDevice.min_speed_for_fix_parking"
              dense
              type="number"
              color="indigo darken-2"
              suffix=" км/ч"
              style="width: 200px"
          >
          </v-text-field>
        </div>
      </v-col>
       <v-col
          cols="12"
          class="pa-0">
        <v-checkbox
            v-model="selectedDevice.fix_parking_ignition"
            label="Учитывать зажигание"
            color="indigo darken-3"
            hide-details
            class="mt-0"
        ></v-checkbox>
      </v-col>
       <v-col
          cols="12"
          class="pa-0">
        <v-checkbox
            v-model="selectedDevice.fix_parking_detected_motion"
            label="Учитывать датчик движения"
            color="indigo darken-3"
            hide-details
            class="mt-0"
        ></v-checkbox>
      </v-col>
       <v-col
          cols="12"
          class="pa-2 mt-2">
         <span
             class="text-decoration-underline indigo--text pointer-on-hover"
             style="font-size: small">
           Установить по умолчанию
         </span>
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
  name: "CheckParkingForm",
  props: {
    selectedDevice: Object
  },
}
</script>

<style scoped>
::v-deep .v-text-field .v-text-field__suffix {
  font-size: 13px;
}
</style>