<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col
          cols="12"
          class="pa-0">
        <v-checkbox
            v-model="selectedDevice.unauth_movement"
            label="Отслеживать несанкционированное перемещение"
            color="indigo darken-3"
            hide-details
            class="mt-0"
        ></v-checkbox>
      </v-col>
      <v-col v-show="selectedDevice.unauth_movement" cols="12" class="pb-0">
        <div style="font-size: small; height: 30px">
          Начало контроля через
        </div>
        <v-text-field
            v-model="selectedDevice.start_auth_move"
            dense
            type="number"
            color="indigo darken-2"
            suffix=" минут"
            style="width: 200px"
        >
        </v-text-field>
        <div style="font-size: small; height: 30px">
          Радиус контролируемой зоны
        </div>
        <v-text-field
            v-model="selectedDevice.radius_auth_move"
            dense
            color="indigo darken-2"
            type="number"
            suffix=" метров"
            style="width: 200px"
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
  name: "UnauthMovementForm",
  props: {
    selectedDevice: Object
  }

}
</script>

<style scoped>
::v-deep .v-text-field .v-text-field__suffix {
  font-size: 13px;
}
</style>