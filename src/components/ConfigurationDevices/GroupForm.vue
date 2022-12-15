<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" style="min-height: 0">
      <v-select
          v-model="selectedDevice.group_id"
          :items="groups"
          item-value="id"
          item-text="name"
          dense
          outlined
           item-color="indigo darken-2"
      >
        <template v-slot:selection="{item}">
          <v-icon
              class="px-2"
              :style="{'color': item.color}"
          >
            mdi-square-rounded
          </v-icon>
          <span style="font-size: small">{{item.name}}</span>
        </template>
        <template v-slot:item="{item}">
          <v-icon
              class="mr-2"
              :style="{'color': item.color}"
          >
            mdi-square-rounded
          </v-icon>
          <span style="font-size: small">{{item.name}}</span>
        </template>
      </v-select>
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
  name: "GroupForm",
  props: {
    selectedDevice: Object
  },
  data: () => ({
    groups: [
      {
        id: 1,
        name: 'Группа 1',
        color: '#f54040',
      },
      {
        id: 2,
        name: 'Группа 2',
        color: '#4097f5',
      },
      {
        id: 3,
        name: 'Группа 3',
        color: '#aaf540',
      },
      {
        id: 4,
        name: 'Группа 4',
        color: '#d440f5',
      }
    ],
  })
}
</script>

<style scoped>

</style>