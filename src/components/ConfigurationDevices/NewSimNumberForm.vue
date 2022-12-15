<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col
          v-show="!newSimInputShow"
          cols="12"
          class="pa-0" style="height: 20px">
        <v-btn
            color="indigo darken-1"
            dark
            small
            @click="newSimInputShow = true"
        >
          Сменить номер телефона
        </v-btn>
      </v-col>
      <v-col v-show="newSimInputShow" cols="12" class="pa-0">
        <v-text-field
            v-model="newSimNumber"
            dense
            placeholder="+7 (   )"
            label="Номер телефона новой SIM-карты"
            class="mt-2"
            color="indigo darken-3"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <div v-show="newSimInputShow">
      <v-row class="ma-0 pa-2">
        <v-btn
            color="indigo darken-3"
            small
            outlined
            @click="newSimInputShow = false"
        >
          Отмена
        </v-btn>
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
  name: "NewSimNumberForm",
  props: {
    selectedDevice: Object
  },
  data: () => ({
    newSimNumber: null,
    newSimInputShow: false,
  })
}
</script>

<style scoped>

</style>