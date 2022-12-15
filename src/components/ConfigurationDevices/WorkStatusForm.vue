<template>
<div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="px-0 py-1">
        <v-row class="ma-0">
          <div style="font-size: small;">
          <strong>Доступные списки статусов:</strong>
        </div>
        </v-row>
        <v-row class="ma-0">
          <v-list
              dense
              width="100%"
              class="py-0 overflow-auto"
              height="150px"
              style="border: #3f51b5 1px solid"
          >
            <v-list-item-group
              v-model="selectedDevice.group_work_status_id"
              mandatory
              color="indigo darken-3"
            >
              <v-list-item
                v-for="(group, i) in groups_work_status"
                :key="i"
                :value="group.id"
              >

               <v-list-item-title>{{group.text}}</v-list-item-title>

              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-row>
        <v-row class="ma-0 mt-2">
          <v-btn
            small
             text
            color="indigo darken-3"
            class="px-1"
            @click="$emit('control-work-status-form-show', selectedDevice.group_work_status_id)"
          >
            <v-icon
              small
            >
              mdi-lead-pencil
            </v-icon>
            <span style="font-size: 12px">
               Редактировать
            </span>

          </v-btn>
          <v-btn
              small
              text
              color="indigo darken-3"
              class="ml-auto px-1"
              @click="$emit('control-work-status-form-show', null)"
          >
            <v-icon
              small
            >
              mdi-plus
            </v-icon>
            <span style="font-size: 12px">
            Новый список
            </span>
          </v-btn>
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
  name: "WorkStatusForm",
  props: {
    selectedDevice: Object,
  },
  data: () => ({
    groups_work_status: [
      {id: 1, text: 'Список не назначен',},
      {id: 2, text: 'Водитель',},
      {id: 3, text: 'Сервисный инженер',}
    ]
  })
}
</script>

<style scoped>
::v-deep .v-list-item--dense, .v-list--dense .v-list-item {
    min-height: 34px;
}

</style>