<template>
  <v-row class="ma-0" style="height: 100%">
    <v-col class="groups_list_wrap pa-0">
      <div class="pa-2" v-if="!newListForm">
        <v-btn
            small
            text
            outlined
            @click="openFormNewList"
            class="mx-4"
        >
          <v-icon left>
            mdi-folder-multiple-plus
          </v-icon>
          Новый список статусов
        </v-btn>
      </div>
      <div class="px-1 grey lighten-3" v-else>
        <v-row class="ma-0">
          <v-text-field
              class="px-2 pt-2"
              placeholder="Название нового списка"
              dense
              outlined
              hide-details="auto"
              background-color="white"
              v-model="newListName"
          >
          </v-text-field>


        </v-row>
        <v-row class="ma-0">
          <v-col class="ml-auto px-0" style="max-width: 190px">
            <v-btn class="mx-1"  small @click="newListForm=false">
              Отмена
            </v-btn>
            <v-btn class="mx-1" dark small color="indigo" @click="addList">
              Создать
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-list
          dense
          color="grey lighten-3"
          width="100%"
          :height="newListForm ? 'calc( 100% - 100px )' : 'calc( 100% - 50px )'"
      >
        <v-list-item-group
            v-model="selectedGroup"
            color="indigo"

        >
          <template v-for="(item, i) in groups_work_status">
            <v-list-item
                :key="i"
                :value="item"
                class="white"
            >
              <v-list-item-content class="pa-1">
                <v-text-field
                    v-if="editGroup && editGroup.id === item.id"
                    v-model="item.name"
                    background-color="white"
                    outlined
                    dense
                    color="indigo"
                    hide-details="auto"
                    @click.prevent.stop
                ></v-text-field>
                <v-list-item-title
                    v-if="!editGroup || editGroup.id !== item.id"
                >
                  {{item.name}}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon
                    v-if="!editGroup || editGroup.id !== item.id"
                    small
                    class="d-none mx-2 pointer-on-hover list-item-edit__icon"
                    @click.prevent.stop="editGroup = item"
                >mdi-lead-pencil</v-icon>
                <v-icon
                    v-if="!editGroup || editGroup.id !== item.id"
                    class="d-none mx-2 pointer-on-hover list-item-edit__icon"
                    small
                    @click.prevent.stop="deleteGroup = item"
                >mdi-trash-can</v-icon>
                <v-icon
                    v-if="editGroup && editGroup.id === item.id"
                    size="20"
                    class="mx-2 mt-2 pointer-on-hover grey--text"
                    @click.prevent.stop="editGroup = null"
                >mdi-close</v-icon>
                <v-icon
                    v-if="editGroup &&  editGroup.id === item.id"
                    class="mx-2 mt-2 pointer-on-hover"
                    size="20"
                    color="indigo"
                    @click.prevent.stop="editGroup = null"
                >mdi-check</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-divider
                v-if="i < groups_work_status.length - 1"
                :key="'br-'+i"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-col>
    <v-col v-if="selectedGroup">
      <v-row class="ma-0" v-if="newStatusForm" align="center">
        <v-text-field
            v-model="newStatus.name"
            background-color="white"
            outlined
            dense
            placeholder="Название нового статуса"
            color="indigo"
            hide-details="auto"
        ></v-text-field>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                small
                icon
                v-bind="attrs"
                v-on="on"
            >
              <v-icon :color="newStatus.color">
                mdi-square-rounded
              </v-icon>
            </v-btn>
          </template>
          <v-color-picker
              v-model="newStatus.color"
              dot-size="25"
              hide-canvas
              hide-inputs
              hide-mode-switch
              hide-sliders
              show-swatches
              swatches-max-height="200"
          ></v-color-picker>
        </v-menu>
        <v-icon
            size="20"
            class="mx-2 pointer-on-hover grey--text"
            @click="newStatusForm = null"
        >mdi-close</v-icon>
        <v-icon
            class="mx-2 pointer-on-hover"
            size="20"
            color="indigo"
            @click="newStatusForm = null"
        >mdi-check</v-icon>
      </v-row>
      <v-row class="ma-2 mt-0">
        <v-btn
            v-if="!newStatusForm"
            x-small
            fab
            color="indigo"
            @click="newStatusForm = true"
        >
          <v-icon
              small
              color="white"
          >
            mdi-plus
          </v-icon>
        </v-btn>
      </v-row>
      <v-list
          dense
          color="grey lighten-3"
          width="100%"
          :disabled="newListForm"
          height="calc( 100% - 150px )"
          class="pa-1"
      >
        <v-list-item-group
            v-model="selectedStatus"
            color="indigo"

        >
          <template v-for="(item, i) in selectedGroup.status">
            <v-list-item
                :key="'status-'+i"
                class="white"
            >
              <v-list-item-content class="pa-1">
                <v-list-item-title v-if="!editStatus || editStatus.id !== item.id">
                  <v-icon
                      :color="item.color" class="mr-2">
                    mdi-square-rounded
                  </v-icon>
                  {{item.name}}
                </v-list-item-title>

                <v-text-field
                    v-if="editStatus && editStatus.id === item.id"
                    v-model="item.name"
                    background-color="white"
                    outlined
                    dense
                    color="indigo"
                    hide-details="auto"
                    @click.prevent.stop
                ></v-text-field>
              </v-list-item-content>
              <v-list-item-icon>
                <v-menu offset-y v-if="editStatus && editStatus.id === item.id">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        small
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      <v-icon :color="editStatus.color">
                        mdi-square-rounded
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-color-picker
                      v-model="editStatus.color"
                      dot-size="25"
                      hide-canvas
                      hide-inputs
                      hide-mode-switch
                      hide-sliders
                      show-swatches
                      swatches-max-height="200"
                  ></v-color-picker>
                </v-menu>
                <v-icon
                    v-if="!editStatus || editStatus.id !== item.id"
                    small
                    class="d-none mx-2 pointer-on-hover list-item-edit__icon"
                    @click.prevent.stop="editStatus = item"
                >mdi-lead-pencil</v-icon>
                <v-icon
                    v-if="!editStatus || editStatus.id !== item.id"
                    class="d-none mx-2 pointer-on-hover list-item-edit__icon"
                    small
                    @click.prevent.stop="deleteStatus = item"
                >mdi-trash-can</v-icon>
                <v-icon
                    v-if="editStatus && editStatus.id === item.id"
                    size="20"
                    class="mx-2 mt-2 pointer-on-hover grey--text"
                    @click.prevent.stop="editStatus = null"
                >mdi-close</v-icon>
                <v-icon
                    v-if="editStatus && editStatus.id === item.id"
                    class="mx-2 mt-2 pointer-on-hover"
                    size="20"
                    color="indigo"
                    @click.prevent.stop="editStatus = null"
                >mdi-check</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-divider
                v-if="i < selectedGroup.status.length - 1"
                :key="'status_br' + i"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
      <div style="font-size: small" class="my-1">
        Разрешить менять статус в приложении:
      </div>
      <div>
        <v-checkbox
            v-model="selectedGroup.auth_change_status_for_user"
            label="Пользователю"
            color="indigo darken-3"
            hide-details
            class="mt-0"
        ></v-checkbox>
        <div>
          <v-checkbox
              v-model="selectedGroup.auth_change_status_for_watcher"
              label="Наблюдателю"
              color="indigo darken-3"
              hide-details
              class="mt-0"
          ></v-checkbox>
        </div>
      </div>
    </v-col>
    <v-overlay
        absolute
        v-if="deleteGroup"
    >
      <v-card
          width="350px"
          light
          class="pa-2"
      >
        <v-row class="ma-0">
          <div class="pa-4">Удалить лист статусов "{{deleteGroup.name}}"?</div>
        </v-row>
        <v-row class="ma-0" justify="end">
          <v-btn
              class="mx-2"
              small
              @click="deleteGroup=null"
          >
            Отмена
          </v-btn>
          <v-btn
              color="error"
              small
              @click="deleteGroup=null"
          >
            Удалить
          </v-btn>
        </v-row>
      </v-card>
    </v-overlay>
    <v-overlay
        absolute
        v-if="deleteStatus"
    >
      <v-card
          width="350px"
          light
          class="pa-2"
      >
        <v-row class="ma-0">
          <div class="pa-4">Удалить статус "{{deleteStatus.name}}"?</div>
        </v-row>
        <v-row class="ma-0" justify="end">
          <v-btn
              class="mx-2"
              small
              @click="deleteStatus=null"
          >
            Отмена
          </v-btn>
          <v-btn
              color="error"
              small
              @click="deleteStatus=null"
          >
            Удалить
          </v-btn>
        </v-row>
      </v-card>
    </v-overlay>
  </v-row>

</template>

<script>
export default {
  name: "ControlListStatusForm",
  props: {
    selectedGroupWorkStatus: null
  },
  created() {
    if (this.selectedGroupWorkStatus) {
      this.selectedGroup = this.groups_work_status.find(x => x.id === this.selectedGroupWorkStatus);
    }
  },
  methods: {
    openFormNewList() {
      this.newListForm = true;
      this.newListName = null;
    },
    addList() {
    }
  },
  data: () => ({
    newListForm: false,
    newListName: null,
    newStatusForm: false,
    newStatus: {
      name: '',
      color: '#000000'
    },
    selectedGroup: null,
    selectedStatus: null,
    editGroup: null,
    deleteGroup: null,
    editStatus: null,
    deleteStatus: null,
    groups_work_status: [
      {
        id: 2,
        name: 'Водитель',
        auth_change_status_for_user: true,
        auth_change_status_for_watcher: true,

        status: [
          {id: 1, name: 'В пути', color: '#a13333'},
          {id: 2, name: 'Личная поездка', color: '#4a911b'},
          {id: 3, name: 'Обед', color: '#6c328d'}
        ]
      },
      {
        id: 3,
        name: 'Сервисный инженер',
        auth_change_status_for_user: true,
        auth_change_status_for_watcher: false,
        status: [
          {id: 1, name: 'В пути', color: '#e8c329'},
          {id: 3, name: 'Осмотр объекта', color: '#1ce0e0'},
          {id: 4, name: 'Обед', color: '#5ce03e'}
        ]
      }
    ]
  })
}
</script>

<style scoped>
.v-list-item:hover .list-item-edit__icon, .v-list-item.v-list-item--active .list-item-edit__icon {
  display: inline-flex!important;
}
.list-item-edit__icon:hover {
  color: #3f51b5;
}
.groups_list_wrap {
  height: 100%;
  min-width: 300px;
  max-width: 300px;
  border-right: #d4d4d4 1px solid;
}
</style>