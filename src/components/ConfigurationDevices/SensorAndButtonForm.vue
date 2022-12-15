<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="pa-0">
        <v-row class="ma-1" align="center">
          <div style="font-size: small;">
          <strong>Измерительные датчики</strong>
        </div>
          <v-btn
              x-small
              fab
              dark
              color="indigo darken-2"
              class="ml-auto"
              @click="$emit('sensor-form-show', null)"
          >
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-row>
          <v-row class="ma-0 overflow-auto" style="height: 150px">
          <v-list
              class="py-0 overflow-auto"
              dense
              width="100%"
              height="150px"
              style="border: #3f51b5 1px solid"
          >
            <template v-for="(sensor, i) in selectedDevice.sensors">
              <v-list-item
                :key="i"
                class="list-item-sensor"
              >
                <v-list-item-content>
                <v-list-item-title>
                {{sensor.name}}
                </v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon
                      small
                      class="d-none mx-2 pointer-on-hover list-item-sensor__icon"
                      @click="$emit('sensor-form-show', sensor)"
                  >mdi-lead-pencil</v-icon>
                  <v-icon
                     class="d-none mx-2 pointer-on-hover list-item-sensor__icon"
                    small
                     @click="$emit('delete-sensor-form-show', sensor)"
                  >mdi-trash-can</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </template>

          </v-list>
        </v-row>
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
  name: "SensorAndButtonForm",
  props: {
    selectedDevice: Object,
    //show_form_sensor: Boolean,
  },
  data: () => ({
    show_form_sensor: false,
  })
}
</script>

<style scoped>
.list-item-sensor:hover {
  background: rgba(212, 212, 212, 0.48);
}
.list-item-sensor:hover .list-item-sensor__icon {
  display: inline-flex!important;
}
.list-item-sensor__icon:hover {
  color: #3f51b5;
}
::v-deep .v-list-item--dense, .v-list--dense .v-list-item {
    min-height: 34px;
}

</style>