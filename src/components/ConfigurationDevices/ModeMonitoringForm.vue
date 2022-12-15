<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="px-0 py-1">
        <div style="font-size: small;">
          <strong>Обновлять GPS-местоположение:</strong>
        </div>
      </v-col>
      <v-col cols="12" class="px-0 py-1 mt-1">
        <div style="font-size: small;">
          <strong>В движении</strong>
        </div>
        </v-col>
      <v-col cols="4" class="px-0 py-1" align-self="center">
            <div style="font-size: small;">
              Каждые
            </div>
      </v-col>
      <v-col cols="8" class="px-0 py-1">
         <v-text-field
          v-model="selectedDevice.update_gps_meter"
          dense
          hide-details
          type="number"
          color="indigo darken-2"
          suffix=" метров"
      >
      </v-text-field>
      </v-col>
      <v-col cols="4" class="px-0 py-1" align-self="center">
        <div style="font-size: small;">
          или каждые:
        </div>
      </v-col>
        <v-col cols="8" class="px-0 py-1">
           <v-text-field
            v-model="selectedDevice.update_gps_sec"
            dense
            hide-details
            type="number"
            color="indigo darken-2"
            suffix=" секунд"
        >
        </v-text-field>
        </v-col>
      <v-col cols="8" class="px-0 py-1">
        <v-checkbox
            v-model="selectedDevice.fix_rotation"
            label="Отмечать повороты"
            color="indigo darken-3"
            hide-details
            class="mt-0"
        ></v-checkbox>
      </v-col>
      <v-col cols="4" class="px-0 py-1">
           <v-text-field
            v-model="selectedDevice.fix_rotation_deg"
            dense
            type="number"
            color="indigo darken-2"
            suffix=" градусов"
        >
        </v-text-field>
      </v-col>
       <v-col cols="12" class="px-0 py-1">
        <div style="font-size: small;">
          <strong>Без движении</strong>
        </div>
        </v-col>
       <v-col cols="4" class="px-0 py-1" align-self="center">
         <div style="font-size: small;">
              Каждые
            </div>
       </v-col>
      <v-col cols="8" class="px-0 py-1">
        <v-text-field
            v-model="selectedDevice.motionless_sec"
            dense
            hide-details
            type="number"
            color="indigo darken-2"
            suffix=" секунд"
        >
        </v-text-field>
       </v-col>
       <v-col cols="12" class="px-0 py-1">
        <div style="font-size: small;">
          <strong>Детекция состояния движения</strong>
        </div>
         <v-select
             v-model="selectedDevice.detected_motion_id"
            :items="detected_motion_by"
             item-value="id"
             dense
             hide-details
         >
         </v-select>
        </v-col>
      <v-col cols="12" class="px-0 py-1">
         <v-checkbox
            v-model="selectedDevice.sleep_in_motionless"
            label="Переходить в режим сна без движения"
            color="indigo darken-3"
            hide-details
            class="mt-0"
        ></v-checkbox>
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
  name: "ModeMonitoringForm",
   props: {
    selectedDevice: Object
  },
  data: () => ({
    detected_motion_by: [
      {id: 1, text: 'по GPS'},
      {id: 2, text: 'по зажиганию'},
      {id: 3, text: 'по датчику движения'},
    ]
  })
}
</script>

<style scoped>
::v-deep .v-text-field .v-text-field__suffix {
  font-size: 13px;
}
</style>
