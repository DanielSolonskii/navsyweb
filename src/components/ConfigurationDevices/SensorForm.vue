<template>
  <div>
    <v-row class="ma-0 pa-2">
      <v-col cols="12" class="pa-0">
        <div style="font-size: small">
          Название датчика:
        </div>
      </v-col>

      <v-col cols="12" class="pa-0">
        <v-text-field
            dense
            outlined
            hide-details
            :value="sensor.name"
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="pa-0 mt-2">
        <div style="font-size: small">
          Тип датчика:
        </div>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-select
            v-model="sensor.sensor_type_id"
            dense
            outlined
            item-value="id"
            hide-details="auto"
             :rules="rules"
            :items="sensor_types"
            item-color="indigo darken-2"
        >
        </v-select>
      </v-col>

      <v-col cols="12" class="pa-0 mt-2">
        <div style="font-size: small">
          Вход:
        </div>
      </v-col>

      <v-col cols="12" class="pa-0">
        <v-text-field
            v-model="sensor.pin"
            dense
            outlined
            :rules="rules"
            hide-details="auto"
            type="number"
            color="indigo darken-2"
            style="width: 110px"
            placeholder="№ Входа"
        >
        </v-text-field>
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
  name: "SensorForm",
  props: {
    selectedSensor: Object
  },
  created() {
    if (this.selectedSensor) {
      this.sensor = this.selectedSensor;
    }
  },
  data: () => ({
    sensor: {
      id: null,
      name: '',
      sensor_type_id: 0,
      pin: null
    },
    sensor_types: [
      {id: 1, text: 'Автосигнализация'},
      {id: 2, text: 'Внешнее питание'},
      {id: 3, text: 'Двери'}
    ],
    rules: [
      value => !!value || 'Обязательно.',
    ]
  })
}
</script>

<style scoped>

</style>