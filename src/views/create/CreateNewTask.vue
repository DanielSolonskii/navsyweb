<template>
  <l-map ref="monitoring_map" style="height: 100%; width:100%; position:relative" :zoom="zoom"
    :options="{zoomControl: false,  editable: true}" :center="center" @ready="mapOnReady()">
    <l-tile-layer :url="tileProviderSelected" layer-type="base" />
    <!--
    <v-overlay class="elevation-10" style="z-index: 99999">
      <v-date-picker />
    </v-overlay>
    -->
    <l-feature-group ref="layerCars">
      <!--      <l-moving-marker-->
      <!--           v-for="item in cars" :key="item.deviceId"-->
      <!--          :lat-lng="item.ll"-->
      <!--          :visible="item.visible_marker"-->
      <!--          :ref="'car-' + item.id"-->
      <!--          :icon="getIcon(item.id)"-->
      <!--          :duration="2000"-->
      <!--           @click="test(item.id)"-->
      <!--      />-->

      <l-marker v-for="item in cars" :key="item.deviceId" :lat-lng="item.ll" :visible="item.visible_marker"
        @click="test(item.id)">
        <l-icon :icon-size="iconSize" :icon-anchor="iconAnchor">
          <icon-course :style="{ transform: 'rotate(' + item.course + 'deg)' }" class="marker-icon__course">
          </icon-course>
          <!--        <img class="marker-icon__course" :src="require('../assets/img/marker_blue.svg')"-->
          <!--          :style="{ transform: 'rotate(' + item.course + 'deg)' }"-->
          <!--        />-->
          <!-- <div class="marker-icon__container"> -->
          <!-- <v-icon :size="iconSizeText" color="primary" style="z-index: 900">
          mdi-car
            </v-icon > -->
          <svg viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg">
            <g>
              <circle cx="320" cy="320" r="280" fill="#FF6600" />
              <text x="320" y="320" font-size="320" font-family="sans-serif" fill="#FFFFFF" text-anchor="middle"
                alignment-baseline="central" dominant-baseline="central">P</text>
            </g>
          </svg>
          <!--  </div>-->
        </l-icon>
        <!--            <l-popup>-->
        <!--              <div>-->
        <!--                {{item.deviceId}}-->
        <!--              </div>-->
        <!--            </l-popup>-->
      </l-marker>

    </l-feature-group>
    <map-info-control />

    <l-control-zoom position="bottomright"></l-control-zoom>
    
    <v-icon>mdi-map</v-icon>
    <!--<l-marker :lat-lng="markerLatLng"></l-marker> -->
    <l-marker v-for="place in places" :key="place.id" :lat-lng="place.coordinates"
      @click="markerClicked(place.coordinates)">
      <l-popup>{{place.name}}</l-popup>
    </l-marker>
    <v-slide-y-transition>
      <l-control class="map-provider-control elevation-4 pa-4 rounded" v-if="mapProviderControl">
        <div class="d-flex justify-space-between">
          <div class="d-flex">
            <v-icon class="mr-2">mdi-map</v-icon>
            <h2>Карта</h2>
          </div>
          <v-icon @click="toggleMapProviderControl">mdi-close</v-icon>
        </div>
        <v-radio-group v-model="tileProviderSelected">
          <v-radio v-for="tile in tileProviders" :key="tile.name" :label="`${tile.name}`" v-bind:value="tile.url">
          </v-radio>
        </v-radio-group>
      </l-control>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <l-control class="geozone-control elevation-4 pa-4 rounded" v-show="geoZoneControl">

        <div class="d-flex justify-space-between">
          <div class="d-flex">
            <v-icon class="mr-2">mdi-vector-square</v-icon>
            <h2>Геозоны</h2>
          </div>
          <v-icon @click="toggleGeoZoneControl">mdi-close</v-icon>
        </div>
        <div class="d-flex">
          <v-checkbox input-value="true" value></v-checkbox>
          <v-toolbar class="elevation-0">
            <v-text-field placeholder="Быстрый поиск" hide-details append-icon="mdi-magnify" single-line
              v-model="searchGeoZone"></v-text-field>
          </v-toolbar>
          <v-icon @click="searchGeoZone = ''">mdi-delete</v-icon>
        </div>
        <v-list-item-group v-model="settings" multiple active-class="" class="pb-10" style="position: relative">
          <v-list-item v-for="geoZone in filteredGeoZones" class="geozone-item pa-0" :key="geoZone.id">
            <template v-slot:default="{ active }">
              <v-list-item-action class="mr-3">
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>
              <v-icon class="mr-3">mdi-record-circle-outline</v-icon>
              <v-list-item-content>
                <v-list-item-title>{{ geoZone.name }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
        <v-btn class="absolute-import-button" fab dark small color="white">
          <v-icon class="color-black" @click="displayImportGeoZoneWindow = true">
            mdi-swap-vertical
          </v-icon>
        </v-btn>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click="triggerCircle()" class="absolute-add-geo-button" fab dark large color="primary"
              v-bind="attrs" v-on="on" @mouseenter="triggerHover()" @mouseleave="removeHover()">
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <span>Новая геозона (круг)</span>
        </v-tooltip>
      </l-control>
    </v-slide-y-transition>
    <!-- places panel start -->
    <v-slide-y-transition>
      <l-control class="geozone-control elevation-4 pa-4 rounded" v-show="placesControl">

        <div class="d-flex justify-space-between">
          <div class="d-flex">
            <v-icon class="mr-2">mdi-map-marker-check</v-icon>
            <h2>Места</h2>
          </div>
          <v-icon @click="togglePlacesControl">mdi-close</v-icon>
        </div>
        <div class="d-flex">
          <v-checkbox input-value="true" value></v-checkbox>
          <v-toolbar class="elevation-0 input-fixer">
            <v-text-field placeholder="Быстрый поиск" hide-details append-icon="mdi-magnify" single-line></v-text-field>
          </v-toolbar>
        </div>
        <v-list-item-group v-model="settings" multiple active-class="" class="pb-15">
          <v-list-item class="geozone-item pa-0">
            <template v-slot:default="{ active }">
              <v-list-item-action class="mr-3">
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>
              <v-icon class="mr-3">mdi-record-circle-outline</v-icon>
              <v-list-item-content>
                <v-list-item-title>Гостиный двор</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
        <v-btn class="absolute-import-button" fab dark small color="white">
          <v-icon class="color-black" @click="displayImportGeoZoneWindow = true">
            mdi-swap-vertical
          </v-icon>
        </v-btn>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click="triggerNewPlace()" class="absolute-add-geo-button" fab dark large color="primary"
              v-bind="attrs" v-on="on" @mouseenter="triggerHover()" @mouseleave="removeHover()">
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <span>Новое место</span>
        </v-tooltip>
      </l-control>
    </v-slide-y-transition>
    <!-- places panel end -->
    <!--New place panel start -->
    <v-slide-y-transition>
      <l-control class="geozone-control elevation-4 pa-4 rounded" v-if="openNewPlace">
        <div class="d-flex align-center">
          <v-icon @click="openNewPlace = false" class="mr-3">mdi-close</v-icon>
          <h2>Новое место</h2>
        </div>
        <div class="d-flex align-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <div class="history-widget-color-picker mr-3" :style="{ 'background-color': colorCircleGeoZone }" dark
                v-on="on">
              </div>
            </template>
            <v-color-picker value="#7417BE" v-model="colorCircleGeoZone" hide-canvas hide-inputs show-swatches
              class="mx-auto">
            </v-color-picker>
          </v-menu>
          <v-text-field v-model="title" label="Название"></v-text-field>
        </div>
        <div class="d-flex">
          <v-icon class="mr-3">mdi-map</v-icon>
          <v-text-field v-model="title" label="Местоположение"></v-text-field>
        </div>
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-record-circle-outline</v-icon>
          <v-combobox></v-combobox>
          <v-slider class="slider-geo-panel" min="0"></v-slider>
        </div>
        <div class="d-flex">
          <v-icon class="mr-3">mdi-format-align-justify</v-icon>
          <v-text-field v-model="title" label="Описание"></v-text-field>
        </div>
        <div class="d-flex">
          <v-combobox v-model="selectGeoTags" :items="geoZoneTags" label="Выберите теги" multiple chips></v-combobox>
        </div>

        <div class="d-flex align-center justify-end">
          <v-btn plain @click.stop="toggleDialog=true">Отмена</v-btn>
          <v-btn plain class="ml-2" @click="saveNewGeozone">Сохранить</v-btn>
        </div>
      </l-control>
    </v-slide-y-transition>
    <!--New place panel end -->

    <!--New circle geozone panel start -->
    <v-slide-y-transition>
      <l-control class="geozone-control elevation-4 pa-4 rounded" v-if="openNewGeoZoneCircle">
        <div class="d-flex align-center">
          <v-icon @click="saveNewGeozone" class="mr-3">mdi-close</v-icon>
          <h2>Новая геозона</h2>
        </div>
        <div class="d-flex align-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <div class="history-widget-color-picker mr-3" :style="{ 'background-color': colorCircleGeoZone }" dark
                v-on="on">
              </div>
            </template>
            <!-- real colorCircleGeoZone -->
            <v-color-picker value="#7417BE" v-model="colorCircleGeoZone" hide-canvas hide-inputs show-swatches
              class="mx-auto">
            </v-color-picker>
          </v-menu>
          <v-text-field v-model="geoTitle" label="Название геозоны"></v-text-field>
        </div>
        <div class="d-flex">
          <v-icon class="mr-3">mdi-map</v-icon>
          <v-text-field v-model="title" label="Местоположение"></v-text-field>
        </div>
        <div class="d-flex">
          <v-combobox v-model="selectGeoTags" :items="geoZoneTags" label="Выберите теги" multiple chips></v-combobox>
        </div>
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-record-circle-outline</v-icon>
          <v-combobox @change="setNewGeoCircleRadius" :items="comboBoxRadiusItems" v-model="newGeoCircleRadius">
          </v-combobox>
          <v-slider @change="setNewGeoCircleRadius" class="slider-geo-panel" v-model="newGeoCircleRadius" min="0"
            max="2000000" thumb-label="always"></v-slider>
        </div>
        <div class="d-flex align-center justify-end">
          <v-btn plain @click.stop="toggleDialog=true">Отмена</v-btn>
          <v-btn plain class="ml-2" @click="saveNewGeozone">Сохранить</v-btn>
        </div>
      </l-control>
    </v-slide-y-transition>
    <!--New circle geozone panel end -->
    <!--New voluntary geozone panel start -->
    <v-slide-y-transition>
      <l-control class="geozone-control elevation-4 pa-4 rounded" v-if="openNewGeoVoluntuary">
        <div class="d-flex align-center">
          <v-icon @click="openNewGeoVoluntuary = false" class="mr-3">mdi-close</v-icon>
          <h2>Новая геозона</h2>
        </div>
        <div class="d-flex align-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <div class="history-widget-color-picker mr-3" :style="{ 'background-color': colorVoluntuaryGeoZone }" dark
                v-on="on">
              </div>
            </template>
            <v-color-picker value="#7417BE" v-model="colorVoluntuaryGeoZone" hide-canvas hide-inputs show-swatches
              class="mx-auto">
            </v-color-picker>
          </v-menu>
          <v-text-field v-model="geoTitle" label="Название геозоны"></v-text-field>
        </div>
        <div class="d-flex">
          <v-icon class="mr-3">mdi-map</v-icon>
          <v-text-field v-model="title" label="Местоположение"></v-text-field>
        </div>
        <div class="d-flex">
          <v-combobox v-model="selectGeoTags" :items="geoZoneTags" label="Выберите теги" multiple chips></v-combobox>
        </div>
        <div class="d-flex align-center justify-end">
          <v-btn plain @click.stop="toggleDialog=true">Отмена</v-btn>
          <v-btn plain class="ml-2" @click="saveNewGeozone">Сохранить</v-btn>
        </div>
      </l-control>
    </v-slide-y-transition>
    <!--New voluntary geozone panel end -->
    <!--New road geozone panel start -->
    <v-slide-y-transition>
      <l-control class="geozone-control elevation-4 pa-4 rounded" v-if="openNewGeoRoad">
        <div class="d-flex align-center">
          <v-icon @click="openNewGeoRoad = false" class="mr-3">mdi-close</v-icon>
          <h2>Новая геозона</h2>
        </div>
        <div class="d-flex align-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <div class="history-widget-color-picker mr-3" :style="{ 'background-color': colorRoadGeoZone }" dark
                v-on="on">
              </div>
            </template>
            <v-color-picker value="#7417BE" v-model="colorRoadGeoZone" hide-canvas hide-inputs show-swatches
              class="mx-auto">
            </v-color-picker>
          </v-menu>
          <v-text-field v-model="geoTitle" label="Название геозоны"></v-text-field>
        </div>
        <div class="d-flex">
          <v-icon class="mr-3">mdi-map</v-icon>
          <v-text-field v-model="title" label="Местоположение"></v-text-field>
        </div>
        <div class="d-flex">
          <v-combobox v-model="selectGeoTags" :items="geoZoneTags" label="Выберите теги" multiple chips></v-combobox>
        </div>
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-record-circle-outline</v-icon>
          <v-combobox v-model="lineOptions.styles[1].weight"></v-combobox>
          <v-slider v-model="lineOptions.styles[1].weight" class="slider-geo-panel" min="0"></v-slider>
        </div>

        <div class="d-flex align-center" v-if="waypoints.length >= 1">
          <v-icon class="mr-3">mdi-map</v-icon>
          <v-text-field v-model="waypoints[0].lat" label="Начало маршрута">
          </v-text-field>
          <span>,</span>
          <v-text-field v-model="waypoints[0].lng"></v-text-field>
        </div>
        <div class="d-flex align-center" v-if="waypoints.length == 2">
          <v-icon class="mr-3">mdi-map</v-icon>
          <v-text-field v-model="waypoints[1].lat" label="Конец маршрута">
          </v-text-field>
          <span>,</span>
          <v-text-field v-model="waypoints[1].lng"></v-text-field>
        </div>

        <v-checkbox v-model="freeGeoMode" label="Свободный режим" value="false"></v-checkbox>
        <div class="d-flex align-center justify-end">
          <v-btn plain @click.stop="toggleDialog=true">Отмена</v-btn>
          <v-btn plain class="ml-2" @click="saveNewGeozone">Сохранить</v-btn>
        </div>
      </l-control>
    </v-slide-y-transition>
    <!--New road geozone panel end -->
    <!--search bar panel start -->
    <v-slide-y-transition>
      <l-control class="geozone-control elevation-4 pa-4 rounded" v-if="openSearchBar">
        <div class="d-flex justify-space-between">
          <div class="d-flex">
            <v-icon class="mr-2">mdi-vector-square</v-icon>
            <h2>Поиск</h2>
          </div>
          <v-icon @click="toggleSearchBar">mdi-close</v-icon>
        </div>
        <div class="d-flex align-center">
          <v-text-field placeholder="Быстрый поиск" hide-details single-line></v-text-field>
        </div>
        <div class="search-tool-results">
          Начните печатать адрес или название места
        </div>
      </l-control>
    </v-slide-y-transition>
    <!--search bar panel end -->

    <l-routing-machine :lineOptions="lineOptions" :waypoints="waypoints" />
    <!--geo test -->
    <l-geo-json v-for="geoJson in geoJsons" :key="geoJson.id" :geojson="geoJson"></l-geo-json>
    <!--geo test -->
    <CancelGeoWindow v-model="toggleDialog" />
    <ImportGeoZoneWindow v-model="displayImportGeoZoneWindow" />

  </l-map>
</template>

<script>
  import LRoutingMachine from '@/components/NewTaskPage/LRoutingMachine';
  import MapInfoControl from "@/components/NewTaskPage/MapInfoControl";
  import CancelGeoWindow from '@/components/NewTaskPage/CancelGeoWindow';
  import ImportGeoZoneWindow from '@/components/NewTaskPage/ImportGeoZoneWindow';


  // import VDatePicker from "@/components/VDatePicker";
  import {
    OpenStreetMapProvider
  } from 'leaflet-geosearch';
  // import VGeosearch from 'vue2-leaflet-geosearch';
  //import IconCar from "@/components/IconCar";
  import {
    latLng,
    L
  } from 'leaflet';
  import {
    LMap,
    LTileLayer,
    LControl,
    LFeatureGroup,
    LMarker,
    LIcon,
    LControlZoom,
    LPopup,
    LGeoJson,
  } from 'vue2-leaflet';
  import HttpClient from "@/api";
  import {
    MonitoringService
  } from "@/services/monitoring";
  import IconCourse from "@/components/icons/IconCourse";

  //import LMovingMarker from 'vue2-leaflet-movingmarker'
  //import {MonitoringService} from "@/services/monitoring";
  //import 'leaflet-sidebar/src/L.Control.Sidebar.css'
  import '@geoman-io/leaflet-geoman-free';
  import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'


  export default {
    name: "Monitoring",
    components: {
      // VGeosearch,
      IconCourse,
      LMap,
      LTileLayer,
      LFeatureGroup,
      LMarker,
      LPopup,
      LControl,
      LIcon,
      LRoutingMachine,
      LGeoJson,
      CancelGeoWindow,
      ImportGeoZoneWindow,
      // VDatePicker,
      // OnlineTrackers,
      // InfoWidget,
      MapInfoControl,
      LControlZoom
      // IconCar
    },
    mounted() {
      setTimeout(() => {
          this.$nextTick(() => {
            console.log(this.cars)
            this.clusterOptions = {
              disableClusteringAtZoom: 11
            }
          });
        }, 5000),
        this.$root.$on("toggleEditGeo", (toggleEditGeo) => {
          this.toggleEditGeo = toggleEditGeo
          if (toggleEditGeo == 'cancel') {
            this.saveNewGeozone;
            this.openNewGeoVoluntuary = false;
            this.openNewGeoRoad = false;
            this.openNewPlace = false;
            this.map.pm.disableDraw();
          }
        });
    },
    computed: {
      filteredGeoZones() {
        function compare(a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }

        let geoZones = this.geoZones.filter(geoZone => {
          return (
            geoZone.name
            .toLowerCase()
            .indexOf(this.searchGeoZone.toLowerCase()) != -1
          );
        });

        geoZones.sort(compare);
        return geoZones;
      },
      appBarIcon() {
        return this.test ? "mdi-chevron-right" : "mdi-chevron-left"
      },
      styleCourse() {
        return {
          transform: 'rotate(' + this.course + 'deg)'
        }
      },
      listCars() {
        let filter_cars = this.cars
        if (this.selectedGroup.length > 0) {
          filter_cars = filter_cars.filter(car => this.selectedGroup.includes(car.groupId));
        }
        if (this.searchCar) {
          filter_cars = filter_cars.filter(car =>
            !!car.name && car.name.includes(this.searchCar) ||
            !!car.gosNumber && car.gosNumber.includes(this.searchCar))
        }
        return filter_cars;
      },
      filter() {
        return this.caseSensitive ?
          (item, search, textKey) => item[textKey].indexOf(search) > -1 :
          undefined
      },
      // iconCar () {
      //   console.log(this)
      //   let htmlIcon = `
      //        <img class="marker-icon__course" src=${require('../assets/img/marker_blue.svg')} style="transform: rotate(0deg)"/>
      //        <div class="marker-icon__container">
      //             <i class="mdi mdi-car marker-icon__icon" style="font-size: ${this.iconSizeText}px"></i>
      //          </div>`
      //   return  L.divIcon({
      //     html: htmlIcon,
      //     iconSize: this.iconSize,
      //     iconAnchor: this.iconAnchor,
      //   });

      //  let rot = 'rotate('+ this.course +'deg)'
      //  //let rot = 'rotate(' +  this.course + 'deg)'
      //  if (this.$refs['driverMarker']) {
      //    this.$refs['driverMarker'].mapObject.getElement().querySelector('.marker-icon__course').style.transform=rot
      //   console.log(this.$refs['driverMarker'].mapObject.getElement().querySelector('.marker-icon__course'))
      //    return this.$refs['driverMarker'].icon
      //  }

      //},
    },
    watch: {
      mapOnReady() {
        this.map.on('pm:create', ({
          shape,
          layer,
        }) => {
          if (shape == 'Circle') {
            console.log(layer)
            this.currentCircleLayer = layer
            this.setNewGeoCircleRadius()
            layer.pm.toggleEdit()
            
            layer.setStyle({
              color: this.colorCircleGeoZone
            });

            layer.on('pm:edit', e => {
              this.newGeoCircleRadius = e.layer._mRadius;
              // this.currentCircleLayer = e.layer
            });

          }

          // if (layer._latlngs) {
          //   this.successMsg(`Created ${shape} with ${layer._latlngs}`)
          // } else if (layer._latlng) {
          //   this.successMsg(`Created ${shape} with ${layer._latlng}`)
          // } else       
          if (shape == 'Marker' && this.newGeoRoadDrawing) {
            const newMarker = layer._latlng
            this.newMarkerLat = newMarker.lat;
            this.newMarkerLng = newMarker.lng;
            layer.pm.toggleEdit()
            console.log(this.newMarkerLang)
            this.waypoints.push({
              lat: this.newMarkerLat,
              lng: this.newMarkerLng
            });
          }
          if (this.waypoints.length == 2) {
            this.map.pm.disableDraw()
            this.newGeoRoadDrawing = false;

          }
          console.log(geoJSON)
          const geoJSON = layer.toGeoJSON()

        })
      },
      colorCircleGeoZone() {
        console.log(this.colorCircleGeoZone)
        // if (this.openNewGeoZoneCircle) {
        //   layer.setStyle({
        //     color: this.colorCircleGeoZone
        //   });
        // }
      },
      tgl_left_panel: function (val) {
        if (val) {
          this.$refs['monitoring_map'].mapObject.panBy([-320 / 2, 0], {
            duration: 0.5
          });
        } else {
          this.$refs['monitoring_map'].mapObject.panBy([320 / 2, 0], {
            duration: 0.5
          });
        }


      },
      // overlay(val) {
      //   val && setTimeout(() => {
      //     this.overlay = false
      //   }, 2000);
      // },
    },
    data() {
      return {
        currentCircleLayer: null,
        comboBoxRadiusItems: [50, 150, 500, 1500],
        newGeoCircleRadius: 0,
        geoTitle: '',
        openNewPlace: false,
        roadMarkerOptions: {
          snappable: true,
          snapDistance: 20,
          markerStyle: {
            opacity: 0.5,
            draggable: true,
          }
        },
        newGeoRoadDrawing: false,
        title: '',
        openSearchBar: false,
        displayImportGeoZoneWindow: false,
        toggleEditGeo: 'hidden',
        colorCircleGeoZone: '#FF0000',
        colorVoluntuaryGeoZone: '#FF0000',
        colorRoadGeoZone: '#FF0000',
        lineOptions: {
          styles: [{
              color: 'rgb(30, 150, 220)',
              opacity: 1,
              weight: 5
            }, {
              color: 'pink',
              opacity: 0.6,
              weight: 20
            },
            {
              className: 'animate'
            }
          ]
        },
        searchGeoZoneResult: '',
        geoZones: [{
            name: 'Гостиный двор',
            id: 1
          },
          {
            name: 'Другой двор',
            id: 2
          },
        ],
        searchGeoZone: '',
        mouseHoversButton: false,
        newMarkerLat: '',
        newMarkerLang: '',
        toggleDialog: false,
        selectGeoTags: [],
        geoZoneTags: [
          'Заправки',
          'Гостиницы',
          'Склады',
        ],
        openNewGeoZoneCircle: false,
        openNewGeoVoluntuary: false,
        openNewGeoRoad: false,
        hover: false,
        clusterOptions: {},
        // test geojson
        geoJsonOptions: {
          onEachFeature: function (feature, layer) {
            layer.getLatLng = function () {
              return this.getBounds().getCenter()
            }
            layer.setLatLng = function () {}
            layer._latlng = layer.getLatLng();
          }
        },
        geoJsons: [{
          "id": "1",
          "type": "Feature",
          "properties": {
            "popupContent": "This is the Auraria West Campus",
            "style": {
              weight: 2,
              color: "#999",
              opacity: 1,
              fillColor: "#B0DE5C",
              fillOpacity: 0.8
            }
          },
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [
                [
                  [-107.00432014465332, 39.74732195489861],
                  [-107.00715255737305, 39.74620006835170],
                  [-107.00921249389647, 39.74468219277038],
                  [-107.01067161560059, 39.74362625960105],
                  [-107.01195907592773, 39.74290029616054],
                  [-107.00989913940431, 39.74078835902781],
                  [-107.00758171081543, 39.74059036160317],
                  [-107.00346183776855, 39.74059036160317],
                  [-107.00097274780272, 39.74059036160317],
                  [-107.00062942504881, 39.74072235994946],
                  [-107.00020027160645, 39.74191033368865],
                  [-107.00071525573731, 39.74276830198601],
                  [-107.00097274780272, 39.74369225589818],
                  [-107.00097274780272, 39.74461619742136],
                  [-107.00123023986816, 39.74534214278395],
                  [-107.00183105468751, 39.74613407445653],
                  [-107.00432014465332, 39.74732195489861]
                ],
                [
                  [-107.00361204147337, 39.74354376414072],
                  [-107.00301122665405, 39.74278480127163],
                  [-107.00221729278564, 39.74316428375108],
                  [-107.00283956527711, 39.74390674342741],
                  [-107.00361204147337, 39.74354376414072]
                ]
              ],
              [
                [
                  [-107.00942707061768, 39.73989736613708],
                  [-107.00942707061768, 39.73910536278566],
                  [-107.00685214996338, 39.73923736397631],
                  [-107.00384807586671, 39.73910536278566],
                  [-107.00174522399902, 39.73903936209552],
                  [-107.00041484832764, 39.73910536278566],
                  [-107.00041484832764, 39.73979836621592],
                  [-107.00535011291504, 39.73986436617916],
                  [-107.00942707061768, 39.73989736613708]
                ]
              ]
            ]
          }
        }, {
          "id": "2",
          "type": "Feature",
          "properties": {
            "popupContent": "This is the Auraria West Campus",
            "style": {
              weight: 2,
              color: "#999",
              opacity: 1,
              fillColor: "#B0DE5C",
              fillOpacity: 0.8
            }
          },
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [
                [
                  [-105.00432014465332, 39.74732195489861],
                  [-105.00715255737305, 39.74620006835170],
                  [-105.00921249389647, 39.74468219277038],
                  [-105.01067161560059, 39.74362625960105],
                  [-105.01195907592773, 39.74290029616054],
                  [-105.00989913940431, 39.74078835902781],
                  [-105.00758171081543, 39.74059036160317],
                  [-105.00346183776855, 39.74059036160317],
                  [-105.00097274780272, 39.74059036160317],
                  [-105.00062942504881, 39.74072235994946],
                  [-105.00020027160645, 39.74191033368865],
                  [-105.00071525573731, 39.74276830198601],
                  [-105.00097274780272, 39.74369225589818],
                  [-105.00097274780272, 39.74461619742136],
                  [-105.00123023986816, 39.74534214278395],
                  [-105.00183105468751, 39.74613407445653],
                  [-105.00432014465332, 39.74732195489861]
                ],
                [
                  [-105.00361204147337, 39.74354376414072],
                  [-105.00301122665405, 39.74278480127163],
                  [-105.00221729278564, 39.74316428375108],
                  [-105.00283956527711, 39.74390674342741],
                  [-105.00361204147337, 39.74354376414072]
                ]
              ],
              [
                [
                  [-105.00942707061768, 39.73989736613708],
                  [-105.00942707061768, 39.73910536278566],
                  [-105.00685214996338, 39.73923736397631],
                  [-105.00384807586671, 39.73910536278566],
                  [-105.00174522399902, 39.73903936209552],
                  [-105.00041484832764, 39.73910536278566],
                  [-105.00041484832764, 39.73979836621592],
                  [-105.00535011291504, 39.73986436617916],
                  [-105.00942707061768, 39.73989736613708]
                ]
              ]
            ]
          }
        }],
        waypoints: [],
        geoZoneControl: false,
        placesControl: false,
        editableLayers: null,
        bounds: null,
        mapProviderControl: false,
        tileProviderSelected: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tileProviders: [{
            name: 'OpenStreetMap',
            visible: true,
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          },
          {
            name: 'OpenTopoMap',
            visible: false,
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          },
          {
            name: 'local',
            visible: false,
            url: 'http://osm-srv.navsy.ru/osm_tiles/{z}/{x}/{y}.png',
            attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          },
        ],
        places: [{
            coordinates: [59.623335,
              30.44210
            ],
            name: 'Название места',
          },

        ],
        geosearchOptions: {
          provider: new OpenStreetMapProvider(),
          searchLabel: 'Быстрый поиск',
          position: 'topright',

        },
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
        overlay: false,
        model: 1,
        settings: [{
            icon: 'mdi-inbox',
          },
          {
            icon: 'mdi-star',
          },
          {
            icon: 'mdi-send',
          },
          {
            icon: 'mdi-email-open',
          },
        ],

        zoom: 10,
        center: latLng(59.930967, 30.302636),
        url: process.env.VUE_APP_OSM_SERVER + '/osm/{z}/{x}/{y}.png',
        iconSizeText: 10,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        course: 0,
        icon: null,
        marker_ll: latLng(59.970960, 30.302630),
        tree: [{
          id: -1,
          name: "/",
          children: []
        }],
        layerCars: null,
        visibleAllMarker: true,
        connection: null,
        cars: [],
        catalogGroups: [],
        selectedCar: '',
        selectedGroup: [],
        open: [],
        openFilterCar: false,
        searchCar: '',
        caseSensitive: false,
        tgl_left_panel: true,
        loadingListCars: false,
        errorListCars: {
          value: false,
          text: ''
        },

      };
    },
    created() {
      this.loadCars();
      this.loadsCatalogGroup();
      //this.loadTreeCars()
      //this.icon = this.getIcon()
      //console.log(111);
    },
    destroyed() {
      this.connection.close();
    },
    methods: {
      changeColorDynamically(e) {
        console.log(e + 'test')
      },
      saveNewGeozone() {
        this.openNewGeoZoneCircle = false
      },
      freeGeoMode() {
        console.log('free geo mode')
      },
      setNewGeoCircleRadius() {
        // layer.setRadius(1000)
        // layer.pm._layer._mRadius = this.newGeoCircleRadius
        // console.log(this.newGeoCircleRadius)
        // this.newGeoCircleRadius = layer._mRadius
        // layer.setRadius(100); 
        // this.currentCircleLayer
        // this.currentCircleLayer._mRadius = this.newGeoCircleRadius
        // console.log(this.currentCircleLayer._mRadius)
        // this.currentCircleLayer.setRadius(this.newGeoCircleRadius)
      },
      toggleRouting() {
        this.map.pm.enableDraw('Marker', {
          snappable: true,
          snapDistance: 20,
        });
      },
      toggleSearchBar() {
        this.placesControl = false;
        this.geoZoneControl = false
        this.mapProviderControl = false;
        this.openSearchBar = !this.openSearchBar
      },
      triggerMarker() {
        this.openNewGeoRoad = true;
        this.newGeoRoadDrawing = true;
        this.map.pm.enableDraw('Marker', {
          snappable: true,
          snapDistance: 20,
        });
      },
      triggerCircle() {
        this.openNewGeoZoneCircle = true;
        // test
        this.placesControl = false;
        this.geoZoneControl = false
        this.mapProviderControl = false;
        this.openSearchBar = false
        // test
        this.map.pm.enableDraw('Circle', {
          snappable: true,
          snapDistance: 20,
        });
      },
      triggerNewPlace() {
        this.openNewPlace = true;
        this.map.pm.enableDraw('Circle', {
          snappable: true,
          snapDistance: 20,
        });
      },
      triggerPolygon() {
        this.openNewGeoVoluntuary = true;
        this.map.pm.enableDraw('Polygon', {
          snappable: true,
          snapDistance: 20,
        });
      },
      triggerHover() {
        this.mouseHoversButton = true;
        this.hover = true;
      },
      removeHover() {
        this.mouseHoversButton = false;
        setTimeout(() => {
          if (this.mouseHoversButton == false) {
            this.hover = false
          }
        }, 3000)
      },
      saveToGeoJSON() {
        let fg = L.featureGroup();
        console.log()
        this.map.eachLayer((layer) => {
          if (layer instanceof L.Path || layer instanceof L.Marker) {
            fg.addLayer(layer);
          }
        });
        console.log(fg.toGeoJSON());
      },
      togglePlacesControl() {
        this.mapProviderControl = false
        this.geoZoneControl = false
        this.openSearchBar = false
        this.placesControl = !this.placesControl;
      },
      boundsUpdated(bounds) {
        this.bounds = bounds;
      },
      toggleGeoZoneControl() {
        this.mapProviderControl = false
        this.placesControl = false
        this.openSearchBar = false
        this.geoZoneControl = !this.geoZoneControl
      },
      toggleMapProviderControl() {
        this.placesControl = false;
        this.geoZoneControl = false
        this.openSearchBar = false
        this.mapProviderControl = !this.mapProviderControl
      },
      // toggleMapSearch() {
      //   this.placesControl = false;
      //   this.geoZoneControl = false
      //   this.mapProviderControl = false;
      //   this.openSearchBar = !this.openSearchBar
      // },
      markerClicked(coordinates) {
        // console.log(id);
        this.map.panTo(latLng(coordinates));
      },
      test(id) {
        let car = this.cars.find(x => x.id === id);
        car.course > 360 ? car.course = 0 : car.course += 90
        //this.getIcon(car.deviceId, car.course)
        //car.ll = latLng(59.930967, 30.302636)
        //this.$refs['driverMarker'].$el
        //this.course > 360 ? this.course=0 : this.course += 90
        //this.iconSizeText = this.iconSizeText + 5
        console.log(car.course)
        //this.course = true;
        // let htmlIcon = `
        //       <img class="marker-icon__course" src=${require('../assets/img/marker_blue.svg')} style="transform: rotate(${this.course}deg)"/>
        //       <div class="marker-icon__container">
        //           <i class="mdi mdi-car marker-icon__icon" style="font-size: ${this.iconSizeText}px"></i>
        //        </div>`
        // this.icon.options.html = htmlIcon
        // this.marker_ll = latLng(this.marker_ll.lat + 0.01, this.marker_ll.lng + 0.01);
        //let rot = 'rotate(' +  this.course + 'deg)'
        // console.log(this.$refs['driverMarker'])
        // this.$refs['driverMarker'].icon = L.divIcon({
        //    html: '<img class="marker-icon__course" src=' + require('../assets/img/marker_blue.svg') +
        //     ' style="transform:'+ rot + '"/>',
        //     iconSize: this.iconSize,
        //     iconAnchor: this.iconAnchor,
        // })
        //el.style.transform = rot;
      },
      // updateCourse(icon) {
      //   console.log('ipdate icon', icon);
      // },

      getIcon(id) {
        console.log('getIcon')
        let car = this.cars.find(x => x.id === id);
        // <img class="marker-icon__course" src=${require('../assets/img/marker_blue.svg')} style="transform: rotate(${car.course}deg)"/>
        let htmlIcon = `
          <div  class="marker-icon__course" style="background: #0d47a1;transform: rotate(${car.course}deg);"></div>
          <div class="marker-icon__container">
                <i class="mdi mdi-car marker-icon__icon" style="font-size: ${this.iconSizeText}px"></i>

             </div>`
        // let elem = document.createElement('div');
        // let course_elm = document.createElement('div');
        // let container_icon = document.createElement('div');
        // let icon = document.createElement('i');
        // course_elm.classList.add('marker-icon__course');
        // course_elm.style.transform = 'rotate(' + course + 'deg)';
        // course_elm.style.background = '#0d47a1';
        // container_icon.classList.add('marker-icon__container');
        // icon.classList.add('mdi', 'mdi-car', 'marker-icon__icon');
        // icon.style.fontSize = this.iconSizeText;
        // elem.appendChild(course_elm);
        // container_icon.appendChild(icon);
        // elem.appendChild(container_icon);
        return L.divIcon({
          html: htmlIcon,
          iconSize: this.iconSize,
          iconAnchor: this.iconAnchor,
        });
        //let ref_marker = this.$refs['car-' + id]
        // if (ref_marker && ref_marker[0].mapObject.getElement()) {
        //   console.log(ref_marker[0].mapObject)
        //   ref_marker[0].mapObject.getElement().innerHTML = htmlIcon
        //   return ref_marker[0].mapObject.getIcon()
        //   // ref_marker[0].mapObject.getElement().querySelector('.marker-icon__course').style.transform=`rotate(${course}deg`
        //   // ref_marker[0].mapObject.getElement().querySelector('.mdi-car').style.fontSize=this.iconSizeText
        //   // ref_marker[0].icon.options.iconSize = this.iconSize
        //   // ref_marker[0].icon.options.iconAnchor = this.iconAnchor
        //   //  console.log('up getIcon', id)
        //   // return ref_marker[0].icon
        // }

        //<img class="marker-icon__course" src=${require('../assets/img/marker_blue.svg')} style="transform: rotate(${car.course}deg)"/>

        // console.log('getIcon', car.deviceId)

      },
      boundMarker(id) {

        let car = this.cars.find(x => x.id === id);
        // console.log(car.ll)
        this.map.setView(car.ll, 15)

      },
      showAllMarker(flag) {
        this.visibleAllMarker = flag;
        this.cars.forEach(x => x.visible_marker = flag);
      },
      showMarker(flag, id) {
        let car = this.cars.find(x => x.id === id);
        car.visible_marker = flag;
        //car.ll = latLng(car.ll.lat + 0.1, car.ll.lng)
        // let marker = L.marker([msg.latitude, msg.longitude], {block_id: block_id});
        // marker.bindPopup('Блок ' + msg.BlockNumber);
        // this.layerCars.addLayer(marker);
      },
      mapOnReady() {
        // let tokenTest = localStorage.getItem('access_token')
        // console.log('showToken' + tokenTest)
        this.connection = MonitoringService.connectionWS();
        this.connection.onmessage = (event) => {
          try {
            let msg = JSON.parse(event.data);
            // console.log(msg)
            let car = this.cars.find(x => x.deviceId === msg.BlockNumber);
            if (car && msg.latitude && msg.longitude) {
              //console.log(car.deviceId, msg.latitude, msg.longitude, this.visibleAllMarker)
              car.ll = latLng(msg.latitude, msg.longitude);
              car.visible_marker = this.visibleAllMarker;
              car.course = msg.course;
              car.speed = msg.speed;
              car.fuel_level = msg.fuel_level;
              //this.updateCourse(car);
              //this.getIcon(car.deviceId, car.course);
            }
          } catch (e) {
            console.log(e);
          }
        }
        this.connection.onclose = function (event) {
          console.log('Close', event)
        }
        this.connection.onopen = function () {
          console.log("Successfully connected")
        }
        this.connection.error = function (error) {
          console.log('Error', error)
        }
        this.map = this.$refs['monitoring_map'].mapObject
        // geoman
        // this.map.pm.addControls({
        //   position: 'topleft',
        //   // drawCircle: false
        // });
        this.map.pm.setLang('ru');
        // geojson (not complete) start
        // test color picker start
        this.map.on('pm:create', ({
          shape,
          layer,
        }) => {
          if (shape == 'Circle') {
            console.log(layer)
            this.currentCircleLayer = layer
            this.setNewGeoCircleRadius()
            layer.pm.toggleEdit()
            layer.setStyle({
              color: this.colorCircleGeoZone
            });

            layer.on('pm:edit', e => {
              this.newGeoCircleRadius = e.layer._mRadius;
              // this.currentCircleLayer = e.layer
            });

          }

          // if (layer._latlngs) {
          //   this.successMsg(`Created ${shape} with ${layer._latlngs}`)
          // } else if (layer._latlng) {
          //   this.successMsg(`Created ${shape} with ${layer._latlng}`)
          // } else       
          if (shape == 'Marker' && this.newGeoRoadDrawing) {
            const newMarker = layer._latlng
            this.newMarkerLat = newMarker.lat;
            this.newMarkerLng = newMarker.lng;
            layer.pm.toggleEdit()
            console.log(this.newMarkerLang)
            this.waypoints.push({
              lat: this.newMarkerLat,
              lng: this.newMarkerLng
            });
          }
          if (this.waypoints.length == 2) {
            this.map.pm.disableDraw()
            this.newGeoRoadDrawing = false;

          }
          console.log(geoJSON)
          const geoJSON = layer.toGeoJSON()

        })
        // test color picker end
        // geojson (not complete end)
        // geoman
        // this.map.zoomControl.setPosition('topright');
        // let controlContainer = this.map._controlContainer
        // controlContainer.insertBefore(this.$refs['sidebar-content-left'].$el, controlContainer.firstChild);

        this.map.on('zoomend', (ev) => {
          console.log('event zoom')
          if (ev.target.getZoom() > 13) {
            this.iconSizeText = 18;
            this.iconSize = [32, 32]
            this.iconAnchor = [16, 16]
          } else if (ev.target.getZoom() > 11 && ev.target.getZoom() < 14) {
            this.iconSizeText = 14;
            this.iconSize = [26, 26]
            this.iconAnchor = [13, 13]
          } else {
            this.iconSizeText = 10;
            this.iconSize = [18, 18]
            this.iconAnchor = [9, 9]
          }
          // this.cars.forEach(car => {
          //  this.getIcon(car.deviceId, car.course);
          // });
        });

        //this.layerCars = L.featureGroup()
        //this.layerCars.addTo(this.map);
        //this.layerCars = this.$refs['layerCars']

        //console.log(this.layerCars);

      },
      loadCars() {
        this.loadingListCars = true;
        return HttpClient.api.getCar()
          .then(response => {
            this.cars = response.data.data.map((car) => {
              car.ll = latLng(car.latitude, car.longitude);
              car.visible_marker = true;
              car.course = 0;
              car.speed = 0;
              car.fuel_level = 0;
              car.mileage = 0;
              return car;
            });

          })
          .catch(err => {
            console.log(err)
            this.errorListCars = {
              value: true,
              text: 'Ошибка при загрузке списка машин! ' + err
            }

          }).finally(() => {
            this.loadingListCars = false;

          })

      },
      loadsCatalogGroup() {
        HttpClient.api.catalogGroups().then(response => this.catalogGroups = response.data).catch();
      },
      loadTreeCars() {
        HttpClient.api.getTreeCars()
          .then((response) => {
            console.log(response.data)

            this.tree[0].children = response.data
            //this.tree = response.data;
            console.log(this.open)
            this.open.push(-1)
          });
      },

    },
  }
</script>

<style>

  .panel-on-map.left.visible~.leaflet-left {
    left: 360px;
  }

  .leaflet-left {
    transition: left 0.5s;
  }

  .marker-icon__container {
    padding-top: 12%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .marker-icon__icon {
    color: white;
    z-index: 1;
  }

  .marker-icon__course {
    position: absolute;
    margin-bottom: 12%;
    transition: transform 0.5s;
    transform-origin: 50% 58% 0;
    height: 100%;
    width: 100%;
    transform: rotate(0deg);
    color: blue;
  }

  .marker-icon__course.rot {
    transform: rotate(180deg);
  }

  .leaflet-div-icon {
    background: none !important;
    border: none !important;
  }


  /*.v-icon.v-icon::after {*/
  /*  background-color: currentColor;*/
  /*  border-radius: 10px;*/
  /*  content: "";*/
  /*  display: inline-block;*/
  /*  height: 40%;*/
  /*  left: 0;*/
  /*  opacity: 0;*/
  /*  pointer-events: none;*/
  /*  position: absolute;*/
  /*  top: 30%;*/
  /*  transform: scale(1.3);*/
  /*  width: 100%;*/
  /*  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1)*/
  /*}*/

  .mdi-car {}
</style>
<style scoped>
 

  .container-cars {
    position: relative;
    overflow: auto;
  }

  .filter-cars {
    position: absolute;
    left: -400px;
    transition: left 0.5s, width 0.5s;
    width: 0;
    z-index: 1003;
  }

  .filter-cars.visible {
    left: 0;
    width: 100%;
  }

  .fade-enter-active,
  .fade-leave-active {
    left: 0;
    transition: left 0.5s, width 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    left: -400px;
  }

  .expansion-panel-info-header {
    padding: 0 24px;
  }

  .tracker-list-row .v-expansion-panels {
    border-radius: 0;
  }

  .v-expansion-panel-header>*:not(.v-expansion-panel-header__icon) {
    flex: inherit;
  }

  .v-expansion-panel-header {
    display: block
  }
</style>