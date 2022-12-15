<template>
  <v-slide-x-transition>
    <l-control v-if="displayInfoWidget" position="topleft" class="panel-on-map left leaflet-control info-widget"
      disableClickPropagation disableScrollPropagation ref='sidebar-content-left'>
      <div class="event-control-single elevation-10">
        <div class="tracker-list-header tracker-list-row d-flex justify-space-between align-center">
          <div>
            <v-icon @click="closeInfoWidget()">mdi-close</v-icon>
          </div>
        </div>
        <div class="speed-up-info">
          <div>{{ this.selectedInfo.first_name }}: Превышение скорости - {{ this.selectedInfo.speed }}</div>
          <div>Местоположение:</div>
          <div>{{ this.selectedInfo.address }}</div>
          <div>{{ this.selectedInfo.time }}</div>
          <div>{{ this.selectedInfo.lat }}</div>
          <div>{{ this.selectedInfo.lng }}</div>
          <!-- test -->
          <v-list-item class="pr-0 align-center" @click="active = true">
            <v-avatar size="36px" class="mr-2">
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-avatar>
            <v-list-item-content style="justify-content: space-between">
              <div class="pa-0 flex-column">
                <v-list-item-title style="align-self: start">
                  {{ this.selectedInfo.first_name }}
                </v-list-item-title>
                <v-list-item-subtitle style="align-self: start">
                  {{ this.selectedInfo.last_name }}
                </v-list-item-subtitle>
              </div>
            </v-list-item-content>
          </v-list-item>
          <!-- test -->
        </div>
      </div>
    </l-control>
  </v-slide-x-transition>
</template>
<script>
  import {
    LControl,
  } from 'vue2-leaflet';

  export default {
    name: 'InfoWidget',

    components: {
      LControl
    },
    data() {
      return {
        showHistory: false,
        expandIcon: [false, false, false, false, false, false, false, ],
        selectedInfo: {},
        trackersListDetailed: {
          "success": true,
          "list": [{
              "id": 44819,
              "icon_id": 12,
              "tracker_id": 324710,
              "time": '22.02.2022 13:26',
              "speed": 63,
              "first_name": "MAN фура",
              "middle_name": "MAN фура",
              "last_name": "Лебедев",
              "email": "a.lebedev@company.ru",
              "phone": "79154992235",
              "driver_license_number": "",
              "driver_license_cats": "",
              "driver_license_valid_till": null,
              "hardware_key": null,
              "department_id": 4,
              "personnel_number": "",
              "lat": '59.83967282',
              "lng": '30.37996531',
              "location": {
                "lat": '59.83967282',
                "lng": '30.37996531',
                "address": "улица, 1 корпус 2, Санкт-Петербург, Россия, 192281",
                "radius": 150
              },
            },
            {
              "id": 45479,
              "icon_id": 5,
              "speed": 63,
              "time": '22.02.2022 13:26',
              "tracker_id": 545806,
              "first_name": "Фургон Ford",
              "middle_name": "MAN фура",
              "last_name": "Бухтияров",
              "email": "o.buhtiyarov@company.com",
              "phone": "79991923302",
              "driver_license_number": "",
              "driver_license_cats": "",
              "driver_license_valid_till": null,
              "hardware_key": null,
              "department_id": 4,
              "personnel_number": "",
              "lat": '59.83967282',
              "lng": '30.37996531',
              "location": {
                "lat": '59.83967282',
                "lng": '30.37996531',
                "address": "любая улица, 1 корпус 2, Санкт-Петербург, Россия, 192281",
                "radius": 150
              },
            },

          ]
        },
        singleInfoTest: {},
        infoWidgetOptions: [{
            title: 'Статус устройства',
            display: true
          },
          {
            title: 'Водитель',
            display: true
          },
          {
            title: 'Местоположение',
            display: true
          },
          {
            title: 'Тарифный план',
            display: true
          },
          {
            title: 'OBD2 & CAN',
            display: true
          },
          {
            title: 'Показания датчиков',
            display: true
          },
          {
            title: 'Одометер',
            display: true
          },
          {
            title: 'Моточасы',
            display: true
          },
          {
            title: 'Входы',
            display: true
          },
          {
            title: 'Выходы',
            display: true
          },
          {
            title: 'Последние события',
            display: true
          },
        ],
        enableDraggable: false,
        displayInfoWidget: true,
        distance: '32112 км',
        drivers: [
          'Петр Петров',
          'Иван Иванов'
        ],
        singleInfo: {
          "data": {
            "source_id": 104930,
            "gps": {
              "updated": "2021-10-08 11:07:09",
              "signal_level": 100,
              "location": {
                "lat": 55.8624133,
                "lng": 36.9392216
              },
              "heading": 199,
              "speed": 63,
              "alt": 168
            },
            "connection_status": "active",
            "movement_status": "moving",
            "gsm": {
              "updated": "2021-10-08 11:07:09",
              "signal_level": 77,
              "network_name": "МТС",
              "roaming": false
            },
            "last_update": "2021-10-08 11:07:13",
            "battery_level": 90,
            "battery_update": "2021-10-08 11:07:09",
            "inputs": [true, false, false],
            "inputs_update": "2021-10-08 11:07:09",
            "outputs": [true, true],
            "outputs_update": "2021-10-08 11:07:09",
            "actual_track_update": "2021-10-08 09:27:05"
          },
          "user_time": "2021-10-08 11:07:13",
          "type": "event",
          "event": "state"
        },
        password: 'Password',
        show: false,
        message: '341111 км',
        marker: true,
        iconIndex: 0,
        icons: [
          'mdi-emoticon',
          'mdi-emoticon-cool',
          'mdi-emoticon-dead',
          'mdi-emoticon-excited',
          'mdi-emoticon-happy',
          'mdi-emoticon-neutral',
          'mdi-emoticon-sad',
          'mdi-emoticon-tongue',
        ],
      }
    },
    mounted() {
      this.closeInfoWidget()
      this.$root.$on("some-root-event", (data) => {
        this.closeInfoWidget()
        this.selectedInfo = this.selectInfo(data);
        if (this.displayInfoWidget == false) {
          this.closeInfoWidget()
        }
      });
      this.$root.$on("show-history", (data) => {
        this.closeDatePicker = data
        // console.log('[jq' + data)
        this.displayInfoWidget = false
        this.showHistory = true
        // this.launchHidtoryWidget()
      });


    },
    computed: {
      icon() {
        return this.icons[this.iconIndex]
      },
    },
    methods: {

      displayExpandIcon(i) {
        this.expandIcon[i] = !this.expandIcon[i];
      },
      selectInfo(id) {
        const list = this.trackersListDetailed.list;
        const result = list.find(item => item.tracker_id === id);
        return result;
      },
      // fix meeeeeee
      closeInfoWidget() {
        this.displayInfoWidget = !this.displayInfoWidget;
      },
      toggleMarker() {
        this.marker = !this.marker
      },
      sendMessage() {
        this.resetIcon()
        // this.clearMessage()
      },
      clearMessage() {
        this.message = ''
      },
      resetIcon() {
        this.iconIndex = 0
      },
      changeIcon() {
        this.iconIndex === this.icons.length - 1 ?
          this.iconIndex = 0 :
          this.iconIndex++
      },
    }
  }
</script>
<style scoped>
.event-control-single {
    width: 372px;
    background-color: rgb(255, 255, 255);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    max-height: calc(100% - 40px);
    min-height: 250px;
    transition: transform 0.2s ease-in-out 0s;
    position: fixed;
    background-color: #f4efed;
    position: absolute;
    left: 70px;
    box-shadow: 0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%) !important;
}
  .v-list .v-list-item--active .v-icon {
    color: rgba(0, 0, 0, 0.38);
  }

  /*
  .v-ripple__container {
    display:none !important;
    
}
*/

  .fade-enter-active,
  .fade-leave-active {
    /*
  transition: opacity .5s ease;
  transform: rotate(180deg);
  
  transition: opacity 150ms ease;
    transform: rotate( 180deg ); 
    */
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: rotate(-180deg);
    transition: transform 150ms ease;
  }

  .v-list-item__title,
  .v-list-item__subtitle {
    flex: 1 1 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  .online-trackers {
    position: absolute;
    left: 70px;
    box-shadow: 0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%) !important;

  }

  .tracker-list-row {}

  .v-list-item__title {
    font-size: 14px
  }

  .widget-title-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
  }

  .speed-up-info {
    display: flex;
    flex-direction: column;
    padding: 20px
  }
</style>