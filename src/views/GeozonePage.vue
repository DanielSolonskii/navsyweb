<template>
  <l-map
      ref="geozone_map"
      style="height: 100%; width:100%"
      :zoom="zoom"
      :center="center"
      @ready="mapOnReady()"
  >
    <l-tile-layer
        :url="url"
    />
    <transition name="fade">
      <l-control
          v-show="tgl_left_panel"
          position="topleft"
          class="panel-on-map left leaflet-control"
          :class="{visible: tgl_left_panel}"
          disableClickPropagation
          disableScrollPropagation
          ref='sidebar-content-left'
      >
        <v-card
            class="d-flex flex-column mx-auto relative"
            width="340"
            height="100%"
        >
          <v-card
              class="mx-auto new-geozone"
              :class="{visible: openAddNewGeozone}"
              width="340"
              height="100%"
          >
            <v-card-text class="pa-3">
              <v-row>
                <v-col>
                  <span class="text-h6 blue--text text--darken-3">Новая геозона</span>
                </v-col>
                <v-col align-self="center" cols="2" class="pa-0 text-center">
                  <v-btn
                      color="blue darken-3"
                      dark
                      icon
                      title="К списку геозон"
                      @click="openAddNewGeozone = !openAddNewGeozone"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                      label="Название геозоны"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row class="mb-6">
                <v-btn
                    color="purple darken-3"
                    outlined
                    rounded
                    width="200"
                    title="Нарисовать"
                    class="mx-auto my-2"
                    @click="tgl_left_panel = !tgl_left_panel"
                >
                  Нарисовать
                </v-btn>
              </v-row>
              <v-row>
                <v-btn
                    color="blue darken-3"
                    dark
                    rounded
                    width="150"
                    title="Создать"
                    class="mx-auto my-2"
                    @click="openAddNewGeozone = !openAddNewGeozone"
                >
                  Создать
                </v-btn>
              </v-row>
              <v-row class="text-center">
                <v-btn
                    color="blue darken-3"
                    outlined
                    rounded
                    width="150"
                    title="Отмена"
                    class="mx-auto my-2"
                    @click="openAddNewGeozone = !openAddNewGeozone"
                >
                  Отмена
                </v-btn>
              </v-row>
            </v-card-text>

          </v-card>
          <v-card-text>
            <v-row>
              <v-col class="pb-0">
                <v-btn
                    icon
                    title="Добавить геозону"
                    color="blue darken-3"
                    @click="openAddNewGeozone = !openAddNewGeozone"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>

            </v-row>
            <v-row>
              <v-col class="pa-0">
                <v-text-field
                    v-model="searchGeozone"
                    label="Поиск геозоны"
                    dense
                    flat
                    solo
                    single-line
                    hide-details
                    clearable
                    clear-icon="mdi-close"
                >
                  <template v-slot:append>
                    <v-icon v-if="!searchGeozone" color="blue darken-3"> mdi-magnify </v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <div
              v-if="loadingListGeozone"
              class="text-center py-2">
            <v-progress-linear
                indeterminate
                color="primary"
            ></v-progress-linear>
          </div>
          <v-alert
              type="error"
              :value="errorListGeozone.value"
              transition="scale-transition"
          >
            {{errorListGeozone.text}}
          </v-alert>
          <v-list
              dense
              class="overflow-y-auto"
              style="min-height: 0"
          >
            <v-list-item-group
                v-model="selectedGeozone"
                color="primary"
                class="px-4"
                @change="changeGeozone()"
            >
              <template v-for="n in 100">
                <v-list-item
                    :key="n"
                >
                  <v-list-item-content class="py-4">
                    <span class="text-body-2">Geozone {{n}}</span>
                  </v-list-item-content>

                </v-list-item>
                <v-divider
                    v-if="n < 100"
                    :key="'border_' + n"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </l-control>
    </transition>
    <l-control position="topleft" class="tgl-btn__left-panel">
      <v-btn
          color="blue darken-3"
          dark
          @click="tgl_left_panel = !tgl_left_panel"
      >
        <v-icon>mdi-layers-triple</v-icon>

      </v-btn>
    </l-control>
  </l-map>
</template>

<script>
import {latLng} from "leaflet";
import { LMap, LTileLayer, LControl } from 'vue2-leaflet';

export default {
  name: "GeozonePage",
  components: {
    LMap,
    LTileLayer,
    LControl
  },
  watch: {
    tgl_left_panel: function (val) {
      if (val) {
        this.$refs['geozone_map'].mapObject.panBy([-320 / 2, 0], {
          duration: 0.5
        });
      } else {
        this.$refs['geozone_map'].mapObject.panBy([320 / 2, 0], {
          duration: 0.5
        });
      }
    },
    openAddNewGeozone: function (val) {
      if (val) {
        this.map.pm.addControls({
          position: 'topleft',
          drawCircle: false,
          drawPolyline: false,
          drawCircleMarker: false,
          drawRectangle: false,
          drawMarker: false
        });
      } else {
        this.map.pm.removeControls()
      }
    }
  },
  methods: {
    mapOnReady() {
      this.map = this.$refs['geozone_map'].mapObject
      this.map.zoomControl.setPosition('topright');

      let controlContainer = this.map._controlContainer
      controlContainer.insertBefore(this.$refs['sidebar-content-left'].$el, controlContainer.firstChild);
    },

    changeGeozone() {
      console.log(window.innerWidth)
      window.innerWidth < 500 ? this.tgl_left_panel = false : ''
    },

  },
  data: () => ({
    zoom: 10,
    center: latLng(59.930967, 30.302636),
    url: process.env.VUE_APP_OSM_SERVER + '/osm/{z}/{x}/{y}.png',
    tgl_left_panel: true,
    selectedGeozone: null,
    searchGeozone: null,
    openAddNewGeozone: false,
    loadingListGeozone: false,
    errorListGeozone: {
      value: false,
      text: ''
    },
  }),
}

</script>

<style>
.panel-on-map.left.visible ~ .leaflet-left {
  left: 360px;
}
.leaflet-left {
  transition: left 0.5s;
}
</style>
<style scoped>
.fade-enter-active, .fade-leave-active {
  left: 0;
  transition: left 0.5s, width 0.5s;
}
.fade-enter, .fade-leave-to {
  left: -400px;
}
.new-geozone {
  position: absolute;
  left: -420px;
  transition: left 0.5s, width 0.5s;
  width: 0;
  z-index: 1003;
}
.new-geozone.visible {
  left: 0;
  width: 100%;
}
</style>