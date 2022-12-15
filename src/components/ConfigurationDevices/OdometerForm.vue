<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="px-0 py-1">
        <div style="font-size: small;">
          <strong>Источник:</strong>
        </div>
        <div style="font-size: small;">
          Выберите источник данных
        </div>
        <v-select
            v-model="selectedDevice.source_gps_data_id"
            dense
            item-value="id"
            hide-details
            :items="sources_gps_data"
             item-color="indigo darken-2"
        >
        </v-select>
      </v-col>
      <v-col cols="12" class="px-0 py-1 mt-2">
        <div style="font-size: small;">
         <strong>Значение:</strong>
        </div>
        <div style="font-size: small;">
          Установите значение одометра.
        </div>
        <div>
          <v-sheet
            v-for="(number, i) in selectedDevice.odometer.toString().split('')"
            :key="i"
            height="20"
            width="20"
            elevation="1"
            color="indigo darken-4"
            class="float-left text-center white--text"
            style="line-height: 20px; vertical-align: middle; margin: 1px"

          >
            <strong>{{number}}</strong>
          </v-sheet>
          <v-btn-toggle
              class="px-2"
              v-model="selectedDevice.units_odometer_id"
              mandatory
              color="indigo darken-2"
          >
            <v-btn
                v-for="unit in units_odometer"
                :key="unit.id"
                x-small
                :value=unit.id
                @click="set_unit_odometer(unit.id)"
            >
              {{ unit.text }}
            </v-btn>
          </v-btn-toggle>
        </div>
      </v-col>
      <v-col cols="12" class="px-0 py-1 mt-2">
        <div style="font-size: small;">
          <strong>Правка:</strong>
        </div>
        <div style="font-size: small;">
          Установите значение правки.
        </div>
        <div>
          <v-text-field
              v-model="selectedDevice.correction_gps"
              dense
              type="number"
              color="indigo darken-2"
              suffix=" %"
              style="width: 60px"
          >
          </v-text-field>
        </div>
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
  name: "OdometerForm",
  props: {
    selectedDevice: Object
  },
  methods: {
    set_unit_odometer(unit_id) {
      if (unit_id === 1) {
        this.selectedDevice.odometer = Math.floor(this.selectedDevice.odometer / 1.60934)
      } else {
        this.selectedDevice.odometer = Math.floor(this.selectedDevice.odometer * 1.60934)
      }
    }
  },
  data: () => ({
    sources_gps_data: [
      {id: 1, text: 'Данные GPS'}
    ],
    units_odometer: [
      {id: 1, text: 'мили'},
      {id: 2, text: 'км'},
    ]
  })
}
</script>

<style scoped>

</style>