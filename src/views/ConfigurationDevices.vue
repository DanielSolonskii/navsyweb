<template>
  <v-container fluid class="h-100 pa-0 grey lighten-4">
    <v-row class="h-100 ma-0">
      <v-col class="h-100" style="max-width: 320px; min-width: 320px">
        <v-card height="100%">
          <v-toolbar
              dense
              dark
              color="indigo darken-3"
          >
            <v-icon class="mr-2">
              mdi-map-marker-radius
            </v-icon>
            <v-toolbar-title
                class="font-weight-bold"
                style="font-size: medium"
            >
              Маячки
            </v-toolbar-title>
          </v-toolbar>
          <div class="mt-2">
            <v-text-field
                dense
                solo
                single-line
                flat
                hide-details
                placeholder="Быстрый поиск"
            >
            </v-text-field>
          </div>
          <div class="px-1" v-if="!newGroupForm.open">
            <v-btn
                small
                text
                outlined
                @click="openFormNewGroup"
            >
              <v-icon left>
                mdi-folder-multiple-plus
              </v-icon>
              Новая группа
            </v-btn>
            <v-btn
                v-if="emptyGroupShow"
                icon
                small
                class="mx-2"
                title="Скрыть пустые группы"
                @click="emptyGroupShow = false"
            >
              <v-icon>
                mdi-eye
              </v-icon>
            </v-btn>
            <v-btn
                v-else
                icon
                small
                title="Показать пустые группы"
                class="mx-2"
                @click="emptyGroupShow = true"
            >
              <v-icon>
                mdi-eye-off
              </v-icon>
            </v-btn>
          </div>
          <div class="px-1 grey lighten-3" v-else>
            <v-row class="ma-0">
              <v-text-field
                  class="px-2"
                  placeholder="Название новой группы"
                  dense
                  hide-details
                  v-model="newGroupForm.name"
              >
              </v-text-field>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      small
                      icon
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon :color="newGroupForm.color">
                      mdi-square-rounded
                    </v-icon>
                  </v-btn>
                </template>
                <v-color-picker
                    v-model="newGroupForm.color"
                    dot-size="25"
                    hide-canvas
                    hide-inputs
                    hide-mode-switch
                    hide-sliders
                    show-swatches
                    swatches-max-height="200"
                ></v-color-picker>
              </v-menu>

            </v-row>
            <v-row class="ma-0">
              <v-col class="ml-auto px-0" style="max-width: 190px">
                <v-btn class="mx-1"  small @click="newGroupForm.open=false">
                  Отмена
                </v-btn>
                <v-btn class="mx-1" dark small color="indigo" @click="addGroup">
                  Создать
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <v-list
              :height="newGroupForm.open ? 'calc(100% - 175px)' : 'calc(100% - 120px)'"
              class="overflow-y-auto"
          >
            <v-list-group
                v-for="(group, i) in computed_grouping_devices"
                :key="'group-' + i"
                :value="group"
                class="group-devises"
                color="indigo darken-3"
                sub-group
                prepend-icon=""
            >
              <template v-slot:appendIcon>
                <v-icon class="">
                  mdi-chevron-down
                </v-icon>
              </template>

              <template v-slot:activator>
                <v-list-item>
                  <div
                      class="group-devises__color"
                      :style="{'background-color': group.color}"
                  >
                  </div>
                  <v-list-item-title
                      class=" font-weight-bold pr-3"
                      style="font-size: 14px"
                  >
                    {{group.name}} ({{group.devices.length}})
                  </v-list-item-title>
                  <v-icon
                      small
                      right
                      class="mx-1"
                      title="Редактировать группу"
                      color="indigo darken-3"
                      @click.stop="openFormEditGroup(group)"
                  >
                    mdi-lead-pencil
                  </v-icon>
                  <v-icon
                      small
                      class="mx-1"
                      title="Удалить группу"
                      color="indigo darken-3"
                      dark
                      @click.stop="openFormRemoveGroup(group.id)"
                  >
                    mdi-trash-can
                  </v-icon>
                </v-list-item>
              </template>

              <div class="px-1 grey lighten-3" v-if="deleteGroupForm.group_id === group.id">
                <v-row class="ma-0">
                  <div class="px-2 mt-1"  style="font-size: small">
                    Укажите группу для переноса объектов:
                  </div>
                  <v-autocomplete
                      v-model="deleteGroupForm.devicesMoveToGroupId"
                      :items="groups"
                      item-text="name"
                      dense
                      hide-details="auto"
                      outlined
                      background-color="white"
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
                  </v-autocomplete>
                </v-row>
                <v-row class="ma-0">
                  <v-col class="ml-auto px-0" style="max-width: 190px">
                    <v-btn class="mx-1"  small @click="deleteGroupForm.group_id = null">
                      Отмена
                    </v-btn>
                    <v-btn class="mx-1" dark small color="indigo" @click="removeGroup">
                      Удалить
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <div class="px-1 grey lighten-3" v-if="editGroupForm.group_id === group.id">
                <v-row class="ma-0 pt-1" align="center">
                  <v-text-field
                      class="px-2"
                      dense
                      v-model="editGroupForm.name"
                      hide-details="auto"
                      outlined
                      background-color="white"
                  >
                  </v-text-field>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          small
                          icon
                          v-bind="attrs"
                          v-on="on"
                      >
                        <v-icon :color="editGroupForm.color">
                          mdi-square-rounded
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-color-picker
                        v-model="editGroupForm.color"
                        dot-size="25"
                        hide-canvas
                        hide-inputs
                        hide-mode-switch
                        hide-sliders
                        show-swatches
                        swatches-max-height="200"
                    ></v-color-picker>
                  </v-menu>
                </v-row>
                <v-row class="ma-0">
                  <v-col class="ml-auto px-0" style="max-width: 220px">
                    <v-btn class="mx-1"  small @click="editGroupForm.group_id = null">
                      Отмена
                    </v-btn>
                    <v-btn class="mx-1" dark small color="indigo" @click="editGroup">
                      Сохранить
                    </v-btn>
                  </v-col>
                </v-row>
              </div>

              <v-list-item-group
                  v-model="selectedDevice"
              >
                <v-list-item
                    v-for="(device, i) in group.devices"
                    :key="i"
                    :value="device"
                    dense
                    class="group-devises__item px-4"

                >
                  <div style="font-size: 13px">{{device.name}}</div>
                </v-list-item>
              </v-list-item-group>
            </v-list-group>
          </v-list>

        </v-card>
      </v-col>
      <v-col class="h-100 pa-0">
        <v-row class="h-100 ma-0 overflow-auto" align-content="start" v-if="selectedDevice">

          <box-form-setting
              :show_cover="nameDevice.coverShow"
              v-on:change-show-cover="nameDevice.coverShow = $event"
            title="Название объекта"
              icon_cover="mdi-lead-pencil"
          >
            <template v-slot:subtitle>
                {{selectedDevice.name}}
            </template>
            <template v-slot:form>
             <name-device-form :selected-device="selectedDevice"></name-device-form>
            </template>
          </box-form-setting>

          <box-form-setting
              :show_cover="changeGroup.coverShow"
              v-on:change-show-cover="changeGroup.coverShow = $event"
              title="Группа"
              icon_cover="mdi-folder-open"
          >
            <template v-slot:subtitle>
                {{selectedDevice.group_name}}
            </template>
            <template v-slot:form>
             <group-form :selected-device="selectedDevice"></group-form>
            </template>
          </box-form-setting>

           <box-form-setting
              :show_cover="tagsDevice.coverShow"
              v-on:change-show-cover="tagsDevice.coverShow = $event"
              title="Тэги"
              icon_cover="mdi-bookmark"
          >
            <template v-slot:subtitle>
               <div
                     v-for="tag in selectedDevice.tags" :key="tag.id"
                  >
                    <span>{{tag.text}}</span>
                  </div>
            </template>
            <template v-slot:form>
             <tags-device-form :selected-device="selectedDevice"></tags-device-form>
            </template>
          </box-form-setting>

          <box-form-setting
              :show_cover="proxyNumber.coverShow"
              v-on:change-show-cover="proxyNumber.coverShow = $event"
              title="Доверенные номера"
              icon_cover="mdi-phone"
          >
            <template v-slot:subtitle>
              Нет номеров
            </template>
            <template v-slot:form>
             <proxy-number-form :selected-device="selectedDevice"></proxy-number-form>
            </template>
          </box-form-setting>

          <box-form-setting
              :show_cover="newSim.coverShow"
              v-on:change-show-cover="newSim.coverShow = $event"
              title="Номер телефона"
              icon_cover="mdi-sim"
          >
            <template v-slot:subtitle>
              Установлена комплектная SIM-карта
            </template>
            <template v-slot:form>
             <new-sim-number-form :selected-device="selectedDevice"></new-sim-number-form>
            </template>
          </box-form-setting>


          <box-form-setting
              :show_cover="odometer.coverShow"
              v-on:change-show-cover="odometer.coverShow = $event"
              title="Одометр"
              icon_cover="mdi-numeric"
          >
            <template v-slot:subtitle>
             <div>Источник {{selectedDevice.source_gps_data}}</div>
             <div>Погрешность {{selectedDevice.correction_gps}}</div>
            </template>
            <template v-slot:form>
             <odometer-form :selected-device="selectedDevice"></odometer-form>
            </template>
          </box-form-setting>

           <box-form-setting
              :show_cover="engineHours.coverShow"
              v-on:change-show-cover="engineHours.coverShow = $event"
              title="Моточасы"
              icon_cover="mdi-clock-time-ten-outline"
          >
            <template v-slot:subtitle>
              Моточасы не подключены
            </template>
            <template v-slot:form>
             <engine-hours-form :selected-device="selectedDevice"></engine-hours-form>
            </template>
          </box-form-setting>

           <box-form-setting
              :show_cover="modeMonitoring.coverShow"
              v-on:change-show-cover="modeMonitoring.coverShow = $event"
              title="Режим мониторинга"
              icon_cover="mdi-satellite-variant"
          >
            <template v-slot:subtitle>
                <div>
                  Получение данных каждые {{selectedDevice.update_gps_meter}} метров
                  или {{selectedDevice.update_gps_sec}} секунд или при повороте
                  на {{selectedDevice.fix_rotation_deg}} градусов
                  </div>
            </template>
            <template v-slot:form>
             <mode-monitoring-form :selected-device="selectedDevice"></mode-monitoring-form>
            </template>
          </box-form-setting>

           <box-form-setting
              :show_cover="unauthMovement.coverShow"
              v-on:change-show-cover="unauthMovement.coverShow = $event"
              title="Несанкционированное перемещение"
              icon_cover="mdi-tow-truck"
          >
            <template v-slot:subtitle>
              Ведётся контроль несанкционированного перемещения
            </template>
            <template v-slot:form>
              <UnauthMovementForm :selected-device="selectedDevice"></UnauthMovementForm>
            </template>
          </box-form-setting>


          <box-form-setting
              :show_cover="ignition.coverShow"
              v-on:change-show-cover="ignition.coverShow = $event"
              title="Настройки зажигания"
              icon_cover="mdi-camera-timer"
          >
            <template v-slot:subtitle>
                <div>
                  {{selectedDevice.ignition}}
                  </div>
            </template>
            <template v-slot:form>
             <ignition-form :selected-device="selectedDevice"></ignition-form>
            </template>
          </box-form-setting>

          <box-form-setting
              :show_cover="dangerDriving.coverShow"
              v-on:change-show-cover="dangerDriving.coverShow = $event"
              title="Опасное вождение"
              icon_cover="mdi-rocket-launch"
          >
            <template v-slot:subtitle>
                <div v-if="selectedDevice.danger_driving">
                    Контролируется
                  </div>
                  <div v-else>
                    Не контролируется
                  </div>
            </template>
            <template v-slot:form>
             <danger-driving-form :selected-device="selectedDevice"></danger-driving-form>
            </template>
          </box-form-setting>

          <box-form-setting
              :show_cover="radiusLBS.coverShow"
              v-on:change-show-cover="radiusLBS.coverShow = $event"
              title="Радиус определения LBS"
              icon_cover="mdi-radio-tower"
          >
            <template v-slot:subtitle>
               {{selectedDevice.radius_lbs_error}} км
            </template>
            <template v-slot:form>
             <radius-l-b-s-form :selected-device="selectedDevice"></radius-l-b-s-form>
            </template>
          </box-form-setting>

          <box-form-setting
              :show_cover="workStatus.coverShow"
              v-on:change-show-cover="workStatus.coverShow = $event"
              title="Рабочие статусы"
              icon_cover="mdi-steam"
          >
            <template v-slot:subtitle>
               {{selectedDevice.group_work_status}}
            </template>
            <template v-slot:form>
             <work-status-form :selected-device="selectedDevice"
              v-on:control-work-status-form-show="openFormControlWorkStatus($event)"
             ></work-status-form>
            </template>
          </box-form-setting>

          <box-form-setting
              :show_cover="checkParking.coverShow"
              v-on:change-show-cover="checkParking.coverShow = $event"
              title="Определение стоянок"
              icon_cover="mdi-alpha-p-box"
          >
            <template v-slot:subtitle>
              Время для фиксации состояния "стоянка",
              не менее {{ selectedDevice.fix_parking_minutes }} минута
              Скорость для определения состояния
              "Остановился", менее {{selectedDevice.min_speed_for_fix_parking}} км/ч
            </template>
            <template v-slot:form>
             <check-parking-form :selected-device="selectedDevice"></check-parking-form >
            </template>
          </box-form-setting>


          <box-form-setting
              :show_cover="sensorAndButton.coverShow"
              v-on:change-show-cover="sensorAndButton.coverShow = $event"
              title="Датчики и кнопки"
              icon_cover="mdi-speedometer"
          >
            <template v-slot:subtitle>
              Подключено устройство {{selectedDevice.sensors.length}}
            </template>
            <template v-slot:form>
             <sensor-and-button-form
                 :selected-device="selectedDevice"
                 v-on:sensor-form-show="openFormSensor($event)"
                 v-on:delete-sensor-form-show="deleteSensor=$event"
             ></sensor-and-button-form >
            </template>
          </box-form-setting>

          <box-form-setting
              :show_cover="retranslation.coverShow"
              v-on:change-show-cover="retranslation.coverShow = $event"
              title="Ретрансляция"
              icon_cover="mdi-graph"
          >
            <template v-slot:subtitle>
              Нет привязанных ретрансляторов
            </template>
            <template v-slot:form>
             <repeaters-form :selected-device="selectedDevice"></repeaters-form>
            </template>
          </box-form-setting>

        </v-row>
      </v-col>
    </v-row>
     <v-overlay
        absolute
        :value="sensorAndButton.sensor_form_show"
    >
       <v-card light width="300px" rounded="0">
         <v-toolbar
           dense
            dark
            color="indigo darken-3"
            height="40px"
            max-height="40px"
         >
           <div
              style="font-size: medium; text-overflow: ellipsis; white-space: nowrap;"
              class="font-weight-bold overflow-hidden">
            Дискретный датчик
          </div>
          <v-spacer></v-spacer>
           <v-icon
            right
              small
              @click="sensorAndButton.sensor_form_show = false"
           >
              mdi-close
           </v-icon>
         </v-toolbar>
         <sensor-form :selected-sensor="selectedSensor"></sensor-form>
       </v-card>
     </v-overlay>
    <v-overlay
        absolute
        :value="sensorAndButton.sensor_form_show"
    >
       <v-card light width="300px" rounded="0">
         <v-toolbar
           dense
            dark
            color="indigo darken-3"
            height="40px"
            max-height="40px"
         >
           <div
              style="font-size: medium; text-overflow: ellipsis; white-space: nowrap;"
              class="font-weight-bold overflow-hidden">
            Дискретный датчик
          </div>
          <v-spacer></v-spacer>
           <v-icon
            right
              small
              @click="sensorAndButton.sensor_form_show = false"
           >
              mdi-close
           </v-icon>
         </v-toolbar>
       </v-card>
    </v-overlay>
         <v-overlay
        absolute
        :value="sensorAndButton.sensor_form_show"
    >
       <v-card light width="300px" rounded="0">
         <v-toolbar
           dense
            dark
            color="indigo darken-3"
            height="40px"
            max-height="40px"
         >
           <div
              style="font-size: medium; text-overflow: ellipsis; white-space: nowrap;"
              class="font-weight-bold overflow-hidden">
            Дискретный датчик
          </div>
          <v-spacer></v-spacer>
           <v-icon
            right
              small
              @click="sensorAndButton.sensor_form_show = false"
           >
              mdi-close
           </v-icon>
         </v-toolbar>
         <sensor-form :selected-sensor="selectedSensor"></sensor-form>
       </v-card>
     </v-overlay>
    <v-overlay
        absolute
        :value="workStatus.control_status_form_show"
    >
       <v-card light width="700px" height="500px" rounded="0">
         <v-toolbar
           dense
            dark
            color="indigo darken-3"
            height="40px"
            max-height="40px"
         >
           <div
              style="font-size: medium; text-overflow: ellipsis; white-space: nowrap;"
              class="font-weight-bold overflow-hidden">
            Управление списками статусов
          </div>
          <v-spacer></v-spacer>
           <v-icon
            right
              small
              @click="workStatus.control_status_form_show = false"
           >
              mdi-close
           </v-icon>
         </v-toolbar>
         <control-list-status-form :selected-group-work-status="selectedGroupWorkStatus"
          style="height: calc( 100% - 40px )"
         >
         </control-list-status-form>
       </v-card>
    </v-overlay>
    <v-overlay
        absolute
        v-if="deleteSensor"
    >
      <v-card
          width="350px"
          light
          class="pa-2"
      >
        <v-row class="ma-0">
          <div class="pa-4">Удалить датчик "{{deleteSensor.name}}"?</div>
        </v-row>
        <v-row class="ma-0" justify="end">
          <v-btn
              class="mx-2"
              small
              @click="deleteSensor=null"
          >
            Отмена
          </v-btn>
          <v-btn
              color="error"
              small
              @click="deleteSensor=null"
          >
            Удалить
          </v-btn>
        </v-row>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script>
import BoxFormSetting from "../components/ConfigurationDevices/BoxFormSetting";
import UnauthMovementForm from "../components/ConfigurationDevices/UnauthMovementForm";
import NewSimNumberForm from "../components/ConfigurationDevices/NewSimNumberForm";
import EngineHoursForm from "../components/ConfigurationDevices/EngineHoursForm";
import TagsDeviceForm from "../components/ConfigurationDevices/TagsDeviceForm";
import RadiusLBSForm from "../components/ConfigurationDevices/RadiusLBSForm";
import DangerDrivingForm from "../components/ConfigurationDevices/DangerDrivingForm";
import GroupForm from "../components/ConfigurationDevices/GroupForm";
import NameDeviceForm from "../components/ConfigurationDevices/NameDeviceForm";
import ProxyNumberForm from "../components/ConfigurationDevices/ProxyNumberForm";
import OdometerForm from "../components/ConfigurationDevices/OdometerForm";
import ModeMonitoringForm from "../components/ConfigurationDevices/ModeMonitoringForm";
import IgnitionForm from "../components/ConfigurationDevices/IgnitionForm";
import WorkStatusForm from "../components/ConfigurationDevices/WorkStatusForm";
import CheckParkingForm from "../components/ConfigurationDevices/CheckParkingForm";
import SensorAndButtonForm from "../components/ConfigurationDevices/SensorAndButtonForm";
import RepeatersForm from "../components/ConfigurationDevices/RepeatersForm";
import SensorForm from "../components/ConfigurationDevices/SensorForm";
import ControlListStatusForm from "../components/ConfigurationDevices/ControlListStatusForm";
export default {
  name: "ConfigurationDevices.vue",
  components: {
    ControlListStatusForm,
    SensorForm,
    RepeatersForm,
    SensorAndButtonForm,
    CheckParkingForm,
    WorkStatusForm,
    IgnitionForm,
    ModeMonitoringForm,
    OdometerForm,
    ProxyNumberForm,
    NameDeviceForm,
    GroupForm,
    DangerDrivingForm,
    RadiusLBSForm, TagsDeviceForm, EngineHoursForm, NewSimNumberForm, UnauthMovementForm, BoxFormSetting},
  computed: {
    computed_grouping_devices: function () {
      if (this.emptyGroupShow) {
        return this.grouping_devices;
      } else {
        return this.grouping_devices.reduce(
            (arr, group) => {
              group.devices.length ? arr.push(group) : '';
              return arr
            },
            [])
      }
    },

  },
  methods: {
    openFormControlWorkStatus(group_id) {
      this.workStatus.control_status_form_show = true;
      this.selectedGroupWorkStatus = group_id;
    },
    openFormSensor(sensor) {
      this.sensorAndButton.sensor_form_show = true;
      this.selectedSensor = sensor;
    },
    openFormNewGroup() {
      this.newGroupForm.open = true;
      this.newGroupForm.name = '';
      this.newGroupForm.color = '#000000';
    },
    addGroup() {
      console.log(this.newGroupForm)
    },
    openFormRemoveGroup(group_id) {
      this.deleteGroupForm.group_id = group_id;
      this.deleteGroupForm.devicesMoveToGroupId = null;

      this.editGroupForm.group_id = null;
      this.editGroupForm.name = '';
      this.editGroupForm.color = '';
    },
    removeGroup() {
      this.deleteGroupForm.group_id = null;
      this.deleteGroupForm.devicesMoveToGroupId = null;
    },
    openFormEditGroup(group) {
      this.editGroupForm.group_id = group.id;
      this.editGroupForm.name = group.name;
      this.editGroupForm.color = group.color;

      this.deleteGroupForm.group_id = null;
      this.deleteGroupForm.devicesMoveToGroupId = null;
    },
    editGroup() {
      this.editGroupForm.group_id = null;
      this.editGroupForm.name = '';
      this.editGroupForm.color = '';
    }
  },
  data: () => ({
    retranslation: {coverShow: true},
    sensorAndButton: {coverShow: true, sensor_form_show: false},
    checkParking: {coverShow: true},
    workStatus: {coverShow: true, control_status_form_show: false},
    ignition: {coverShow: true},
    modeMonitoring: {coverShow: true},
    odometer: {coverShow: true},
    proxyNumber: {coverShow: true},
    unauthMovement: {coverShow: true},
    newSim: {coverShow: true},
    engineHours: {coverShow: true},
    tagsDevice: {coverShow: true},
    radiusLBS: {coverShow: true},
    dangerDriving: {coverShow: true},
    nameDevice: {coverShow: true},
    changeGroup: {coverShow: true},
    selectedGroupWorkStatus: null,
    deleteSensor: null,
    selectedSensor: null,
    selectedGroup: null,
    deleteGroupForm: {
      group_id: null,
      devicesMoveToGroupId: null,
    },
    editGroupForm: {
      group_id: null,
      name: '',
      color: '',
    },
    newGroupForm: {
      open: false,
      name: null,
      color: '#000000'
    },
    selectedDevice: null,
    search: null,
    caseSensitive: false,
    emptyGroupShow: false,
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
    tags: [
      {id: 1, text: 'tag 1'},
      {id: 2, text: 'tag 2'},
      {id: 3, text: 'tag 3'},
      {id: 4, text: 'tag 4'},
    ],
    grouping_devices: [
      {
        id: 1,
        name: 'Группа 1',
        color: '#f54040',
        devices: [
          {
            id: 201,
            name: '201 Машина',
            group_name: 'Группа 1',
            group_id: 1,
            danger_driving: false,
            radius_lbs_error: 3,
            unauth_movement: true,
            start_auth_move: 1,
            radius_auth_move: 100,
            proxy_numbers: ['111', '222', '333'],
            source_gps_data_id: 1,
            source_gps_data: 'GPS',
            odometer: 312404,
            units_odometer_id: 1,
            correction_gps: 0,
            update_gps_meter: 100,
            update_gps_sec: 60,
            fix_rotation_deg: 15,
            motionless_sec: 180,
            detected_motion_id: 1,
            detected_motion: 'по GPS',
            sleep_in_motionless: false,
            fix_rotation:true,
            ignition_id: 1,
            ignition: 'Наприжение бортовой сети',
            ignition_min_v: 13.00,
            ignition_max_v: 30.00,
            group_work_status: 'Не назначен',
            group_work_status_id: 1,
            fix_parking_minutes: 1,
            min_speed_for_fix_parking: 3,
            fix_parking_ignition: false,
            fix_parking_detected_motion: true,
            sensors: [
              {id: 8, name: 'Уровень топлива', sensor_type_id: 1, sensor_type_name: 'Датчик топлива', pin: 1},
              {id: 5, name: 'Автосигнализация', sensor_type_id: 2, sensor_type_name: 'Автосигнализация', pin: 4},
            ],
            tags: [
              {id: 1, text: 'tag 1'},
              {id: 2, text: 'tag 2'},
              {id: 3, text: 'tag 3'},
              {id: 4, text: 'tag 4'},
            ]
          },
          {
            id: 202,
            name: '202 Машина',
            group_name: 'Группа 1',
            group_id: 1,
            danger_driving: true,
            radius_lbs_error: 2,
            unauth_movement: true,
            start_auth_move: 1,
            radius_auth_move: 100,
            proxy_numbers: [],
            source_gps_data_id: 1,
            odometer: 312404,
            source_gps_data: 'GPS',
            units_odometer_id: 1,
            correction_gps: 0,
            update_gps_meter: 100,
            update_gps_sec: 60,
            fix_rotation_deg: 15,
            motionless_sec: 180,
            detected_motion_id: 1,
            detected_motion: 'по GPS',
            sleep_in_motionless: false,
            fix_rotation:true,
            ignition_id: 1,
            ignition: 'Наприжение бортовой сети',
            ignition_min_v: 13.00,
            ignition_max_v: 30.00,
            group_work_status: 'Не назначен',
            group_work_status_id: 1,
            fix_parking_minutes: 1,
            min_speed_for_fix_parking: 3,
            fix_parking_ignition: false,
            fix_parking_detected_motion: true,
            sensors: [
              {id: 1, name: 'Уровень топлива', sensor_type_id: 1, sensor_type_name: 'Датчик топлива', pin: 1},
            ],
            tags: [
              {id: 1, text: 'tag 1'},
              {id: 4, text: 'tag 4'},
            ]
          },
          {
            id: 203,
            name: '203 Машина',
            group_name: 'Группа 1',
            group_id: 1,
            danger_driving: false,
            radius_lbs_error: 3,
            unauth_movement: true,
            start_auth_move: 1,
            radius_auth_move: 100,
            proxy_numbers: [],
            source_gps_data_id: 1,
            source_gps_data: 'GPS',
            odometer: 312404,
            units_odometer_id: 1,
            correction_gps: 0,
            update_gps_meter: 100,
            update_gps_sec: 60,
            fix_rotation_deg: 15,
            motionless_sec: 180,
            detected_motion_id: 1,
            detected_motion: 'по GPS',
            sleep_in_motionless: false,
            fix_rotation:true,
            ignition_id: 1,
            ignition: 'Наприжение бортовой сети',
            ignition_min_v: 13.00,
            ignition_max_v: 30.00,
            group_work_status: 'Не назначен',
            group_work_status_id: 1,
            fix_parking_minutes: 1,
            min_speed_for_fix_parking: 3,
            fix_parking_ignition: false,
            fix_parking_detected_motion: true,
            sensors: [
              {id: 1, name: 'Уровень топлива', sensor_type_id: 1, sensor_type_name: 'Датчик топлива', pin: 1},
              {id: 2, name: 'Автосигнализация', sensor_type_id: 2, sensor_type_name: 'Автосигнализация', pin: 2},
            ],
            tags: [
              {id: 3, text: 'tag 3'},
              {id: 4, text: 'tag 4'},
            ]
          },
          {
            id: 204,
            name: '204 Машина',
            group_name: 'Группа 1',
            group_id: 1,
            danger_driving: true,
            radius_lbs_error: 4,
            unauth_movement: true,
            start_auth_move: 1,
            radius_auth_move: 100,
            proxy_numbers: [],
            source_gps_data_id: 1,
            source_gps_data: 'GPS',
            odometer: 312404,
            units_odometer_id: 1,
            correction_gps: 0,
            update_gps_meter: 100,
            update_gps_sec: 60,
            fix_rotation_deg: 15,
            motionless_sec: 180,
            detected_motion_id: 1,
            detected_motion: 'по GPS',
            sleep_in_motionless: false,
            fix_rotation:true,
            ignition_id: 1,
            ignition: 'Наприжение бортовой сети',
            ignition_min_v: 13.00,
            ignition_max_v: 30.00,
            group_work_status: 'Не назначен',
            group_work_status_id: 1,
            fix_parking_minutes: 1,
            min_speed_for_fix_parking: 3,
            fix_parking_ignition: false,
            fix_parking_detected_motion: true,
            sensors: [
              {id: 3, name: 'Автосигнализация', sensor_type_id: 2, sensor_type_name: 'Автосигнализация', pin: 1},
            ],
            tags: [
              {id: 1, text: 'tag 1'},
              {id: 2, text: 'tag 2'},
              {id: 3, text: 'tag 3'},
              {id: 4, text: 'tag 4'},
            ]
          },
          {
            id: 205,
            name: '205 Машина',
            group_name: 'Группа 1',
            group_id: 1,
            danger_driving: false,
            radius_lbs_error: 1,
            unauth_movement: true,
            start_auth_move: 1,
            radius_auth_move: 100,
            proxy_numbers: [],
            source_gps_data_id: 1,
            odometer: 312404,
            units_odometer_id: 1,
            correction_gps: 0,
            update_gps_meter: 100,
            update_gps_sec: 60,
            fix_rotation_deg: 15,
            motionless_sec: 180,
            detected_motion_id: 1,
            detected_motion: 'по GPS',
            sleep_in_motionless: false,
            fix_rotation:true,
            ignition_id: 1,
            ignition: 'Наприжение бортовой сети',
            ignition_min_v: 13.00,
            ignition_max_v: 30.00,
            group_work_status: 'Не назначен',
            group_work_status_id: 1,
            fix_parking_minutes: 1,
            min_speed_for_fix_parking: 3,
            fix_parking_ignition: false,
            fix_parking_detected_motion: true,
            sensors: [
            ],
            tags: [
              {id: 4, text: 'tag 4'},
            ]
          },
        ],
      },
      {
        id: 2,
        name: 'Группа 2',
        color: '#4097f5',
        devices: [
          {
            id: 301,
            name: '301 Машина',
          },
          {
            id: 302,
            name: '302 Машина',
          },
        ],
      },
      {
        id: 3,
        name: 'Группа 3',
        color: '#aaf540',
        devices: [
          {
            id: 401,
            name: '401 Машина',
          },
          {
            id: 402,
            name: '402 Машина',
          },
          {
            id: 403,
            name: '403 Машина',
          },
        ],
      },
      {
        id: 4,
        name: 'Группа 4',
        color: '#d440f5',
        devices: [

        ]
      }
    ],
  })
}
</script>

<style>

</style>
<style scoped>
::v-deep .group-devises.v-list-group .v-list-item__icon.v-list-group__header__append-icon {
  min-width: 24px;
  margin-left: 4px;
}
::v-deep .group-devises.v-list-group .v-list-item {
  min-height: 34px;
  padding: 0 10px;
}
.h-100 {
  height: 100%;
}
.group-devises__color {
  height: 100%;
  width: 5px;
  position: absolute;
  left: -10px;
  top: 0;
}
::v-deep .group-devises__item.v-item--active {
  background-color: #3949AB;
  color: white;
}
::v-deep .v-text-field .v-input__control .v-input__slot .v-text-field__slot input{
  font-size: 13px;
}
::v-deep .v-input__slot .v-select__slot{
  font-size: 13px;
}
::v-deep .v-input__control label{
  font-size: 14px;
}
.cover-form {
  z-index: 3;
  background: #757575;
  color: white;

}
.cover-form:hover {
  background: #283593;
}
</style>