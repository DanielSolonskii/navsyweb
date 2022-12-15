<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="pa-0" style="height: 20px">
        <div style="font-size: small; height: 30px">
          Добавить тег:
        </div>
      </v-col>
      <v-combobox
          v-model="selectedDevice.tags"
          :items="tags"
          item-value="id"
          multiple
          chips
          dense
          class="px-2 mb-auto"
          color="indigo darken-3"
           item-color="indigo darken-2"
      ></v-combobox>
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
  name: "TagsDeviceForm",
  props: {
    selectedDevice: Object
  },
  data: () => ({
    tags: [
      {id: 1, text: 'tag 1'},
      {id: 2, text: 'tag 2'},
      {id: 3, text: 'tag 3'},
      {id: 4, text: 'tag 4'},
    ],
  })
}
</script>

<style scoped>

</style>