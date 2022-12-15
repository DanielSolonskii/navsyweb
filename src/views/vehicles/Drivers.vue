<template>
    <v-container fluid class="pa-0 d-flex flex-column h-100">
        <v-overlay absolute :value="openFormRouteTask" class="overlay-confirm-remove"
            :class="{'active': openFormRouteTask}">
            <v-card light width="400px" height="100%" rounded="0">
                <v-card-text>
                    <v-form ref="form_route_task">
                        <p class="text-h6 font-weight-normal">Путевой лист</p>
                        <v-row>
                            <v-col cols="12">
                                <div>Шаблон путевого листа</div>
                                <v-radio-group dense>
                                    <v-radio label="Типовая форма №4-с (Грузовой автомобиль)" value="radio-1"></v-radio>
                                    <v-radio label="Типовая форма №4-с (Грузовой автомобиль)" value="radio-2"></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12">
                                <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                                    offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field label="Отчётный период" prepend-icon="mdi-calendar" readonly
                                            v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field label="Серия" hide-details="auto" dense></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field label="Номер" hide-details="auto" dense></v-text-field>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-checkbox label="Заполнять данные о поездках" hide-details dense></v-checkbox>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-checkbox label="Использовать данные одометра" hide-details dense></v-checkbox>
                            </v-col>
                            <v-col style="max-width: 230px;" class="ml-auto">
                                <v-btn text small @click="openFormRouteTask=false">
                                    Отмена
                                </v-btn>
                                <v-btn text small color="indigo">
                                    <v-icon>mdi-download</v-icon>
                                    Скачать
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-overlay>
        <v-overlay absolute :value="confirmRemoveVehicle" class="overlay-confirm-remove"
            :class="{'active': confirmRemoveVehicle}">
            <v-card light width="400px" height="100px" rounded="0">
                <v-card-text>
                    <v-row>
                        <v-col>Удалить выбранное транспортное средство <span>"{{vehicle.name}}"</span>?</v-col>
                    </v-row>
                    <v-row>
                        <v-col class="ml-auto pa-1" style="max-width: 180px">
                            <v-btn text small @click="confirmRemoveVehicle=false">
                                Отмена
                            </v-btn>
                            <v-btn text small color="indigo">
                                Удалить
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-overlay>
        <v-overlay absolute :value="confirmRemoveGarage" class="overlay-confirm-remove"
            :class="{'active': confirmRemoveGarage}">
            <v-card light width="300px" height="100px" rounded="0">
                <v-card-text>
                    <v-row>
                        <v-col>Удалить запись?</v-col>
                    </v-row>
                    <v-row>
                        <v-col class="ml-auto pa-0" style="max-width: 180px">
                            <v-btn text small @click="confirmRemoveGarage=false">
                                Отмена
                            </v-btn>
                            <v-btn text small color="primary" @click="deleteItem()">
                                Удалить
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-overlay>
        <v-overlay absolute :value="openMapFullScreen" class="overlay-map-fullscreen"
            :class="{'active': openMapFullScreen}">
            <v-card light width="100%" height="100%" rounded="0">
                <l-map style="height: calc(100% - 50px); width:100%; position:relative" ref="vehicles_map_fullscreen"
                    :zoom="zoom" :center="center" @ready="mapFullScreenOnReady">
                    <l-tile-layer :url="url" />
                </l-map>
                <v-card-text class="pa-2">
                    <v-btn text class="float-right" color="indigo" @click="openMapFullScreen=false">
                        Закрыть
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-overlay>
        <v-overlay absolute :value="openFormGarage" class="overlay-form-content">
            <v-card light max-width="500px" height="100%" rounded="0" class="d-flex flex-column pa-4">
                <div>
                    <v-row align="center" class="ma-0">
                        <v-col cols="2">
                            <v-btn icon class="text-center" @click="openFormGarage=!openFormGarage">
                                <v-icon>
                                    mdi-close
                                </v-icon>
                            </v-btn>
                        </v-col>
                        <v-col>
                            <span class="text-h5 font-weight-light">Водитель</span>
                        </v-col>
                        <v-col>
                            <v-icon @click="changeProfilePicture()" class="place-profile-panel-picture">
                                {{ editedItem.pic }}</v-icon>
                        </v-col>
                        <!-- dialog change picture start-->
                        <v-dialog v-model="dialogPicture" max-width="439px">
                            <v-card class="pa-4">
                                <h2>Изображение</h2>
                                <v-divider></v-divider>
                                <h3 class="mb-2">Выберите изображение:</h3>
                                <v-icon class="mr-2" @click="selectIconEvent(icon)" v-for="icon in iconsToSelectFrom"
                                    :key="icon">{{ icon }}</v-icon>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn plain text dense @click="dialogPicture = false">
                                        Отмена
                                    </v-btn>
                                    <v-btn plain text dense @click="saveNewPicture(editedItem.id)">
                                        Сохранить
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <!-- dialog change picture end -->
                    </v-row>
                </div>

                <v-row class="ma-0 overflow-y-auto" style="min-height: 0" v-if="this.editedItem != {}">
                    <!--
                    <v-form ref="form-garage">
                        <v-row class="ma-0 pl-4 pr-2">
                            <v-col cols="10">
                                <v-row>
                                    <v-icon class="mr-3 mt-4">mdi-format-color-text</v-icon>
                                    <v-text-field hide-details="auto" v-model="editedItem.name"></v-text-field>
                                </v-row>
                            </v-col>
                            <v-col cols="10">
                                <v-row>
                                    <v-icon class="mr-3 mt-4">mdi-map-marker</v-icon>
                                    <v-text-field hide-details="auto" v-model="editedItem.address"></v-text-field>
                                    <v-icon class="ml-3 mt-4">mdi-map</v-icon>
                                </v-row>
                            </v-col>
                            <v-col cols="10" class="mt-5 pb-0">
                                <v-row align-items="center">
                                    <v-col cols="2" class="pl-0">
                                        <v-icon>mdi-record-circle-outline</v-icon>
                                    </v-col>
                                    <v-col cols="5">
                                        <v-combobox dense flat v-model="editedItem.radius" :items="radiusVariants">
                                        </v-combobox>
                                    </v-col>
                                    <v-col cols="5">
                                        <v-slider style="transform: translateY(17px)" v-model="editedItem.radius"
                                            track-color="primary" thumb-label="always"></v-slider>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="10">
                                <v-row>
                                    <v-icon class="mr-3">mdi-text-long</v-icon>
                                    <v-text-field hide-details="auto" v-model="editedItem.description"></v-text-field>
                                </v-row>
                            </v-col>
                            <v-col cols="10" class="mt-2">
                                <v-row>
                                    <v-col cols="2" class="pl-0">
                                        <v-icon class="mr-3 mt-4">mdi-pound</v-icon>
                                    </v-col>
                                    <v-col cols="10">
                                        <v-combobox v-model="editedItem.tags" :filter="filter" :hide-no-data="!search"
                                            :items="tags" :search-input.sync="search" hide-selected multiple>
                                            <template v-slot:no-data>
                                                <v-list-item>
                                                    <span class="subheading mr-2">Добавьте</span>
                                                    <v-chip color="primary">
                                                        {{ search }}
                                                    </v-chip>
                                                </v-list-item>
                                            </template>
                                            <template v-slot:selection="{ attrs, item, parent, selected }">
                                                <v-chip v-if="item === Object(item)" v-bind="attrs" color="primary"
                                                    :input-value="selected" label>
                                                    <span class="pr-2">
                                                        {{ item.text }}
                                                    </span>
                                                    <v-icon small @click="parent.selectItem(item)">
                                                        mdi-close
                                                    </v-icon>
                                                </v-chip>
                                            </template>
                                            <template v-slot:item="{ index, item }">
                                                <v-chip color="primary" dark label>
                                                    {{ item.text }}
                                                </v-chip>
                                            </template>
                                        </v-combobox>
                                    </v-col>

                                </v-row>
                            </v-col>

                        </v-row>
                    </v-form>
                    -->
                    <v-form ref="form-car">
                        <v-row class="ma-0">
                            <v-col cols="12" class="pa-0">
                                <v-card-title class="pa-1">Основная информация</v-card-title>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-format-color-text" label="Сотрудник" hide-details="auto"
                                    dense></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select prepend-icon="mdi-navigation" label="Маячок" dense>
                                </v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-select prepend-icon="mdi-accounts-multiple" label="Отдел" dense>
                                </v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-contacts" label="Табельный номер" hide-details="auto"
                                    dense></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-key" label="Эл. ключ" hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select prepend-icon="mdi-pound" label="Теги" dense>
                                </v-select>
                            </v-col>
                            <v-divider></v-divider>
                            <v-col cols="12" class="pa-0">
                                <v-card-title class="pa-1">Контактные данные</v-card-title>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-phone" label="Телефон" hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-email" label="Email" hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-divider></v-divider>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-map-marker" append-icon="mdi-map" label="Адрес офиса"
                                    hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-divider></v-divider>
                            <v-col cols="12" class="pa-0">
                                <v-card-title class="pa-1">Право на вождение</v-card-title>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-format-color-text" label="Номер вод. удостоверения"
                                    hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-format-color-text" label="Категория вод. удостоверения"
                                    hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-calendar" label="Дата окончания В/У" hide-details="auto"
                                    dense>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-row>
                <v-card-actions class="mt-auto">
                    <v-spacer></v-spacer>
                    <v-btn color="grey darken-1" text @click="openFormGarage = false">
                        Отмена
                    </v-btn>
                    <v-btn color="primary darken-1" text @click="savePlaceChanges(editedItem.id)">
                        Сохранить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-overlay>
        <!-- new driver -->
        <v-overlay absolute :value="newDriverAction" class="overlay-form-content">
            <v-card light max-width="500px" height="100%" rounded="0" class="d-flex flex-column pa-4">
                <div>
                    <v-row align="center" class="ma-0">
                        <v-col cols="2">
                            <v-btn icon class="text-center" @click="newDriverAction=!newDriverAction">
                                <v-icon>
                                    mdi-close
                                </v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="10">
                            <span class="text-h5 font-weight-light">Новый водитель</span>
                        </v-col>
                        <v-col>
                            <v-icon @click="changeProfilePicture()" class="place-profile-panel-picture">
                                {{ editedItem.pic }}</v-icon>
                        </v-col>
                        <!-- dialog change picture start-->
                        <v-dialog v-model="dialogPicture" max-width="439px">
                            <v-card class="pa-4">
                                <h2>Изображение</h2>
                                <v-divider></v-divider>
                                <h3 class="mb-2">Выберите изображение:</h3>
                                <v-icon class="mr-2" @click="selectIconEvent(icon)" v-for="icon in iconsToSelectFrom"
                                    :key="icon">{{ icon }}</v-icon>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn plain text dense @click="dialogPicture = false">
                                        Отмена
                                    </v-btn>
                                    <v-btn plain text dense @click="saveNewPicture(editedItem.id)">
                                        Сохранить
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <!-- dialog change picture end -->
                    </v-row>
                </div>

                <v-row class="ma-0 overflow-y-hidden" style="min-height: 0" v-if="this.editedItem != {}">
                    <!--
                    <v-form ref="form-garage">
                        <v-row class="ma-0 pl-4 pr-2">
                            <v-col cols="10">
                                <v-row>
                                    <v-icon class="mr-3 mt-4">mdi-format-color-text</v-icon>
                                    <v-text-field hide-details="auto" v-model="editedItem.name"></v-text-field>
                                </v-row>
                            </v-col>
                            <v-col cols="10">
                                <v-row>
                                    <v-icon class="mr-3 mt-4">mdi-map-marker</v-icon>
                                    <v-text-field hide-details="auto" v-model="editedItem.address"></v-text-field>
                                    <v-icon class="ml-3 mt-4">mdi-map</v-icon>
                                </v-row>
                            </v-col>
                            <v-col cols="10" class="mt-5 pb-0">
                                <v-row align-items="center">
                                    <v-col cols="2" class="pl-0">
                                        <v-icon>mdi-record-circle-outline</v-icon>
                                    </v-col>
                                    <v-col cols="5">
                                        <v-combobox dense flat v-model="editedItem.radius" :items="radiusVariants">
                                        </v-combobox>
                                    </v-col>
                                    <v-col cols="5">
                                        <v-slider style="transform: translateY(17px)" v-model="editedItem.radius"
                                            track-color="primary" thumb-label="always"></v-slider>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="10">
                                <v-row>
                                    <v-icon class="mr-3">mdi-text-long</v-icon>
                                    <v-text-field hide-details="auto" v-model="editedItem.description"></v-text-field>
                                </v-row>
                            </v-col>
                            <v-col cols="10" class="mt-2">
                                <v-row>
                                    <v-col cols="2" class="pl-0">
                                        <v-icon class="mr-3 mt-4">mdi-pound</v-icon>
                                    </v-col>
                                    <v-col cols="10">
                                        <v-combobox v-model="editedItem.tags" :filter="filter" :hide-no-data="!search"
                                            :items="tags" :search-input.sync="search" hide-selected multiple>
                                            <template v-slot:no-data>
                                                <v-list-item>
                                                    <span class="subheading mr-2">Добавьте</span>
                                                    <v-chip color="primary">
                                                        {{ search }}
                                                    </v-chip>
                                                </v-list-item>
                                            </template>
                                            <template v-slot:selection="{ attrs, item, parent, selected }">
                                                <v-chip v-if="item === Object(item)" v-bind="attrs" color="primary"
                                                    :input-value="selected" label>
                                                    <span class="pr-2">
                                                        {{ item.text }}
                                                    </span>
                                                    <v-icon small @click="parent.selectItem(item)">
                                                        mdi-close
                                                    </v-icon>
                                                </v-chip>
                                            </template>
                                            <template v-slot:item="{ index, item }">
                                                <v-chip color="primary" dark label>
                                                    {{ item.text }}
                                                </v-chip>
                                            </template>
                                        </v-combobox>
                                    </v-col>

                                </v-row>
                            </v-col>

                        </v-row>
                    </v-form>
                    -->
                    <v-form ref="form-car">
                        <v-row class="ma-0">
                            <v-col cols="12" class="pa-0">
                                <v-card-title class="pa-1">Основная информация</v-card-title>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-format-color-text" label="Сотрудник" hide-details="auto"
                                    dense></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select prepend-icon="mdi-navigation" label="Маячок" dense>
                                </v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-select prepend-icon="mdi-accounts-multiple" label="Отдел" dense>
                                </v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-contacts" label="Табельный номер" hide-details="auto"
                                    dense></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-key" label="Эл. ключ" hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select prepend-icon="mdi-pound" label="Теги" dense>
                                </v-select>
                            </v-col>
                            <v-divider></v-divider>
                            <v-col cols="12" class="pa-0">
                                <v-card-title class="pa-1">Контактные данные</v-card-title>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-phone" label="Телефон" hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-email" label="Email" hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-divider></v-divider>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-map-marker" append-icon="mdi-map" label="Адрес офиса"
                                    hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-divider></v-divider>
                            <v-col cols="12" class="pa-0">
                                <v-card-title class="pa-1">Право на вождение</v-card-title>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-format-color-text" label="Номер вод. удостоверения"
                                    hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-format-color-text" label="Категория вод. удостоверения"
                                    hide-details="auto" dense>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field prepend-icon="mdi-calendar" label="Дата окончания В/У" hide-details="auto"
                                    dense>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-row>
                <v-card-actions class="mt-auto">
                    <v-spacer></v-spacer>
                    <v-btn color="grey darken-1" text @click="newDriverAction = false">
                        Отмена
                    </v-btn>
                    <v-btn color="primary darken-1" text @click="savePlaceChanges(editedItem.id)">
                        Сохранить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-overlay>
        <!-- new driver -->
        <v-container fluid class="h-100 pa-2">
            <v-row class="ma-0 h-100">
                <v-col class="vehicles-container pa-0 h-100" :class="{'active': openVehicleSidebar}">
                    <v-row justify="space-between" align="center" class="ma-0">
                        <v-col style="max-width: 70px">
                            <v-speed-dial v-model="addCar" open-on-hover direction="bottom"
                                transition="slide-y-transition" class="add-car-btn">
                                <template v-slot:activator>
                                    <v-btn v-model="addCar" fab dark large color="primary"
                                        @click="newDriverAction=!newDriverAction">
                                        <v-icon>
                                            mdi-plus
                                        </v-icon>

                                    </v-btn>
                                </template>
                                <v-btn fab dark small color="white" title="Импортировать excel">
                                    <v-icon class="primary--text">mdi-file-excel</v-icon>
                                </v-btn>
                            </v-speed-dial>
                        </v-col>
                        <v-col>
                            <div class="font-weight-medium vehicle-header">
                                <h3 class="ml-3">Водители</h3>
                            </div>
                        </v-col>
                        <v-col style="max-width: 55px">
                            <v-btn icon @click="openSearchCar()">
                                <v-icon size="28">
                                    mdi-magnify
                                </v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="auto" class="px-0">

                            <v-text-field v-model="search" ref="search-car" label="Поиск" placeholder="Поиск" dense
                                single-line hide-details :append-icon="showSearchCar ? 'mdi-close' : ''"
                                @click:append="clearSearchCar" :class="{'show': showSearchCar}" class="vehicles-search">
                            </v-text-field>

                        </v-col>


                        <v-col class="wrap-tgl-sidebar" :class="{'active': openVehicleSidebar}">
                            <v-btn absolute right top icon small class="mt-5"
                                @click="openVehicleSidebar=!openVehicleSidebar">
                                <v-icon size="22" class="tgl-sidebar" :class="{'active': openVehicleSidebar}">
                                    mdi-arrow-collapse-left
                                </v-icon>

                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-card style="height: calc(100vh - 160px)" class="pa-0">
                        <v-row class="ma-0" align="center" style="min-height: 44px; height: 80px">
                            <v-col style="max-width: 150px" class="py-1">
                            </v-col>
                            <v-col class="py-1" style="max-width: 200px">
                            </v-col>
                            <v-col class="py-1"></v-col>
                            <v-col class="py-1 text-center d-flex" style="max-width: 150px">
                                <!--
                                <v-btn icon class="filter-icon-fix" @click="funcHideDefaultHeader()">
                                    <v-icon size="22">
                                        mdi-filter
                                    </v-icon>
                                </v-btn>
                                -->
                                <v-menu :close-on-content-click="false" max-height="300px" :nudge-width="200" offset-x>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on" small>
                                            <v-icon size="22">
                                                mdi-cog
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-list dense>
                                            <div class="px-4">Столбцы</div>
                                            <v-list-item-group multiple color="primary">
                                                <v-list-item v-for="item in computedHeadersCog" :key="item.value"
                                                    :value="item.value" dense>
                                                    <template>
                                                        <v-list-item-action class="ma-1">
                                                            <v-checkbox input-value="true" @click="toggleColumn(item)"
                                                                color="primary">
                                                            </v-checkbox>
                                                        </v-list-item-action>

                                                        <v-list-item-content>
                                                            <div class="text-body-2">{{item.text}}</div>
                                                        </v-list-item-content>
                                                    </template>
                                                </v-list-item>
                                            </v-list-item-group>

                                        </v-list>
                                    </v-card>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-card class="height: calc(100vh - 200px);">
                            <v-data-table v-model="selected" @click:row="rowClick" height="calc(100vh - 234px)" dense
                                :headers="headers" :items="tasks" item-key="name" class="elevation-1 table-places"
                                :search="search" hide-default-footer :hide-default-header="false" show-select>
                                <template v-slot:item.actions="{item}">
                                    <div class="actions-column">
                                        <v-btn icon @click="editPlace(item)">
                                            <v-icon class="px-1">
                                                mdi-pencil
                                            </v-icon>
                                        </v-btn>
                                        <v-btn icon @click="showDeleteDialog(item)">
                                            <v-icon class="px-1">
                                                mdi-trash-can-outline
                                            </v-icon>
                                        </v-btn>
                                    </div>

                                </template>
                                <template v-slot:item.address="{ item }">
                                    <v-list-item
                                        class="d-flex flex-column employee-task-name-cell pt-1 pb-1 text-truncate">
                                        <v-list-item-title class="address-title white-space-no-wrap">
                                            {{ item.address }}
                                        </v-list-item-title>
                                    </v-list-item>
                                </template>
                                <template v-slot:item.tags="{ item }">
                                    <v-chip v-for="tag in item.tags" :key="tag.value" color="primary">
                                        {{ tag.text }}
                                    </v-chip>
                                </template>
                                <template v-slot:item.name="{ item }">
                                    <!--
                                    <v-icon class="ml-2 mr-1">{{item.pic}}</v-icon>
                                    -->
                                    <span>{{ item.name }}</span>
                                </template>
                                <template v-slot:item.created="{ item }">
                                    <span>{{ formatTimestampToShow(item.created) }}</span>
                                </template>
                                <template v-slot:item.changed="{ item }">
                                    <span>{{ formatTimestampToShow(item.changed) }}</span>
                                </template>
                                <template v-slot:group.header="{group, toggle, isOpen}">
                                    <td class="fix-height">
                                        <v-checkbox ref="checkGroup" color="primary" @click="selectGroup(group)"
                                            @change="checkSelectGroup"></v-checkbox>
                                    </td>
                                    <td :colspan="headers.length">
                                        <div class="d-flex justify-space-between mt-0 header-group-cursor"
                                            @click="toggle">
                                            <h3>{{ formatTimestampToShow(group) }}</h3>
                                            <v-icon class="mr-4 mt-0 pt-0">
                                                {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                            </v-icon>
                                        </div>
                                    </td>
                                </template>

                            </v-data-table>
                            <!-- test 
                            <v-data-table style="height: 100%" show-select dense calculate-widths :headers="headers"
                                :items="tasks" item-key="id" class="elevation-1 table-places" @dblclick:row="editPlace"
                                @click:row="rowClick" :loading="loadingGarage" hide-default-footer fixed-header
                                v-model="selected" height="100%">
                                <template v-slot:body.prepend>
                                    <tr>
                                        <td>

                                        </td>
                                        <td>
                                            <v-text-field v-model="name" type="text" label="Название">
                                            </v-text-field>
                                        </td>
                                        <td>
                                            <v-text-field v-model="fat" type="number" label="Адрес"></v-text-field>
                                        </td>
                                        <td>
                                            <v-text-field v-model="carbs" type="number" label="Описание">
                                            </v-text-field>
                                        </td>
                                    </tr>
                                </template>
                                <template v-slot:item.actions="{item}">
                                    <div class="actions-column">
                                        <v-btn icon @click="editPlace(item)">
                                            <v-icon class="px-1">
                                                mdi-pencil
                                            </v-icon>
                                        </v-btn>
                                        <v-btn icon @click="this.dialog = true">
                                            <v-icon class="px-1">
                                                mdi-trash-can-outline
                                            </v-icon>
                                        </v-btn>
                                    </div>

                                </template>
                                <template v-slot:item.address="{ item }">
                                    <v-list-item
                                        class="d-flex flex-column employee-task-name-cell pt-1 pb-1 text-truncate">
                                        <v-list-item-title class="address-title white-space-no-wrap">
                                            {{ item.address }}
                                        </v-list-item-title>
                                    </v-list-item>
                                </template>
                                <template v-slot:item.tags="{ item }">
                                    <v-chip v-for="tag in item.tags" :key="tag.value" color="primary" class="mr-1">
                                        {{ tag.text }}
                                    </v-chip>
                                </template>
                                <template v-slot:item.name="{ item }">
                                    <v-icon class="ml-2 mr-1">{{item.pic}}</v-icon>
                                    <span>{{ item.name }}</span>
                                </template>
                                <template v-slot:item.created="{ item }">
                                    <span>{{ formatTimestampToShow(item.created) }}</span>
                                </template>
                                <template v-slot:item.changed="{ item }">
                                    <span>{{ formatTimestampToShow(item.changed) }}</span>
                                </template>
                                <template v-slot:group.header="{group, toggle, isOpen}">
                                    <td class="fix-height">
                                        <v-checkbox ref="checkGroup" color="primary" @click="selectGroup(group)"
                                            @change="checkSelectGroup"></v-checkbox>
                                    </td>
                                    <td :colspan="headers.length">
                                        <div class="d-flex justify-space-between mt-0 header-group-cursor"
                                            @click="toggle">
                                            <h3>{{ formatTimestampToShow(group) }}</h3>
                                            <v-icon class="mr-4 mt-0 pt-0">
                                                {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                            </v-icon>
                                        </div>
                                    </td>
                                </template>
                            </v-data-table>
                            -->
                            <!-- dialog -->
                            <v-dialog v-model="dialog" max-width="290">
                                <v-card class="pa-4">
                                    <v-card-text>
                                        Удалить запись?
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn plain text dense @click="dialog = false">
                                            Отмена
                                        </v-btn>
                                        <v-btn plain text dense @click="deleteItem">
                                            Удалить
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <!-- dialog -->
                        </v-card>
                    </v-card>
                </v-col>
                <v-col class="pa-0 h-100 d-none" style="max-width: 400px;" :class="{'d-block': openVehicleSidebar}">

                    <v-row justify="space-between" align="center" class="ma-0" style="height: 90px">
                        <div class="text-body-1 px-6 font-weight-medium">
                            Информация

                        </div>
                    </v-row>
                    <v-card class="pa-0 ml-4" style="height: calc(100% - 140px); width: 400px;">
                        <l-map ref="vehicles_map" style="max-height: 300px; width:100%; position:relative" :zoom="zoom"
                            :center="center" @ready="mapOnReady()">
                            <l-tile-layer :url="url" />
                            <l-control position="topleft">
                                <div class="white control-fullscreen" @click="openMapFullScreen=!openMapFullScreen">
                                    <v-icon class="indigo--text">mdi-fullscreen</v-icon>
                                </div>
                            </l-control>
                        </l-map>
                        <div class="overflow-y-auto" style="height: calc(100% - 300px)">
                            <div class="pa-4" v-if="itemToShowInformation == null">
                                <h4 class="select-task-text">Выберите задание для просмотра его
                                    параметров</h4>
                            </div>
                            <template v-else>
                                <div class="pa-4">
                                    <p>
                                        <v-icon>{{ this.itemToShowInformation.pic }}</v-icon>
                                        {{ this.itemToShowInformation.name }}
                                    </p>
                                    <h4>Название</h4>
                                    <p>{{ this.itemToShowInformation.task_name }}</p>
                                    <h4>Адрес</h4>
                                    <p>{{ this.itemToShowInformation.address_tasks }}</p>
                                    <h4>Описание</h4>
                                    <p>{{ this.itemToShowInformation.description }}</p>
                                    <h4>Периодичность</h4>
                                    <p>{{ this.itemToShowInformation.form }}</p>
                                    <h4>Форма</h4>
                                    <p>{{ this.itemToShowInformation.time }}</p>
                                    <h4>Теги</h4>
                                    <v-chip class="mr-1" v-for="tag in this.itemToShowInformation.tags" :key="tag.value"
                                        color="primary" small dark>
                                        {{ tag.text }}
                                    </v-chip>

                                    <v-row class="ma-0 pl-4 pr-2" v-if="this.selected.length === 1">
                                        <h2>Основной раздел</h2>
                                        <v-col>
                                            <v-row>
                                                <h3>Название</h3>
                                            </v-row>
                                            <v-row class="mt-6">
                                                <v-icon cols="2" class="mr-3">mdi-format-color-text</v-icon>
                                                <span cols="8">{{ this.itemToShowInformation.name }}</span>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row>
                                                <h3>Адрес</h3>
                                            </v-row>
                                            <v-row class="mt-6">
                                                <v-icon cols="2" class="mr-3">mdi-map-marker</v-icon>
                                                <span cols="8">{{ this.itemToShowInformation.address }}</span>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row>
                                                <h3>Описание</h3>
                                            </v-row>
                                            <v-row class="mt-6">
                                                <v-icon cols="2" class="mr-0">mdi-text-long</v-icon>
                                                <span cols="8">{{ this.itemToShowInformation.description }}</span>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="10">
                                            <v-row>
                                                <h3>Теги</h3>
                                            </v-row>
                                            <v-row class="mt-6">
                                                <v-chip v-for="tag in this.itemToShowInformation.tags" :key="tag"
                                                    color="primary" class="mr-1">
                                                    {{ tag.text }}
                                                </v-chip>
                                            </v-row>
                                        </v-col>

                                    </v-row>
                                </div>

                            </template>

                        </div>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
    import {
        latLng
    } from "leaflet";
    import {
        LMap,
        LTileLayer,
        LControl,
    } from 'vue2-leaflet';

    export default {
        name: "VehiclesPage",
        components: {
            LMap,
            LTileLayer,
            LControl
        },
        computed: {
            computedHeadersCog() {
                return this.headers.filter(i => !this.columnsToHideInitially.includes(i.value));
            },
            computedHeaders() {
                return this.headers.filter(i => !this.columnsToHide.includes(i.value));
            },
            // headers() {
            //     return [{
            //             text: "Название ",
            //             align: "left",
            //             sortable: false,
            //             value: "name",
            //         },
            //         {
            //             text: "Адрес",
            //             value: "address",
            //         },
            //         {
            //             text: "Описание",
            //             value: "description",
            //         },
            //         {
            //             text: "Теги",
            //             value: "tags",
            //         },
            //         {
            //             text: '',
            //             value: 'actions',
            //             sortable: false,
            //             width: 150
            //         },
            //     ];
            // }
        },
        watch: {
            openVehicleSidebar(val){
                if (val) {
                     setTimeout(() => {
                    this.$refs.vehicles_map.mapObject.invalidateSize();
                }, 100);
                }
            },
            model(val, prev) {
                if (val.length === prev.length) return

                this.model = val.map(v => {
                    if (typeof v === 'string') {
                        v = {
                            text: v,
                            color: this.colors[this.nonce - 1],
                        }

                        this.items.push(v)

                        this.nonce++
                    }

                    return v
                })
            },
        },

        methods: {
            deleteItemsHeader() {
                for (var i = 0; i < this.selected.length; i++) {
                    const index = this.tasks.indexOf(this.selected[i]);
                    this.tasks.splice(index, 1);
                }
                this.multipleItemsDialog = false;

            },
            showDeleteDialog(item) {
                this.dialog = true;
                this.deletedIndex = this.tasks.indexOf(item);
            },
            // funcHideDefaultHeader() {
            //     this.hideDefaultHeader = !this.hideDefaultHeader
            // },
            savePlaceChanges(id) {
                function selectedPlace(place) {
                    return place.id === id;
                }
                Object.assign(this.tasks.find(selectedPlace), this.editedItem);
                this.openFormGarage = false
            },
            selectIconEvent(icon) {
                this.selectedIcon = icon
            },
            saveNewPicture(id) {
                function selectedPlace(place) {
                    return place.id === id;
                }
                this.tasks.find(selectedPlace).pic = this.selectedIcon
                this.editedItem.pic = this.selectedIcon;
                this.dialogPicture = false;
            },
            changeProfilePicture() {
                this.dialogPicture = true;
            },
            deleteItem() {
                for (var i = 0; i < this.tasks.length; i++) {
                    const index = this.deletedIndex;
                    this.tasks.splice(index, 1);
                }
                this.dialog = false;
            },
            filter(item, queryText, itemText) {
                if (item.header) return false

                const hasValue = val => val != null ? val : ''

                const text = hasValue(itemText)
                const query = hasValue(queryText)

                return text.toString()
                    .toLowerCase()
                    .indexOf(query.toString().toLowerCase()) > -1
            },
            clearSearchCar() {
                this.searchCar = ''
                this.showSearchCar = false
                this.$refs["search-car"].blur();
            },
            openSearchCar() {
                this.showSearchCar = true
                this.$refs["search-car"].focus();
            },
            clearSearchGarage() {
                this.searchGarage = ''
                this.showSearchGarage = false
                this.$refs["search-garage"].blur();
            },
            openSearchGarage() {
                this.showSearchGarage = true;
                this.$refs["search-garage"].focus();
            },
            mapOnReady() {
                this.map = this.$refs['vehicles_map'].mapObject
                this.map.zoomControl.setPosition('topright');
            },
            mapFullScreenOnReady() {
                this.map = this.$refs['vehicles_map_fullscreen'].mapObject
                this.map.zoomControl.setPosition('topright');
            },
            editPlace(item) {
                this.openFormGarage = true;
                this.editedIndex = this.tasks.indexOf(item);
                this.editedItem = Object.assign({}, item);
                console.log(this.editedItem)
            },
            editVehicle(item) {
                this.vehicle = item;
                this.openFormCar = true;
            },
            removeVehicle(item) {
                this.vehicle = item;
                this.confirmRemoveVehicle = true
            },
            removeGarage(item) {
                this.garage = item;
                this.confirmRemoveGarage = true
            },
            createRouteTask() {
                this.openFormRouteTask = true
            },
            rowClick: function (item) {
                this.itemToShowInformation = item;
            },
        },
        data: () => ({
            headers: [{
                    text: 'Сотрудник',
                    value: 'name',
                    align: 'left',
                },
                {
                    text: 'Маячок',
                    value: 'tracker',
                },
                {
                    text: 'Отдел',
                    value: 'department',
                },
                {
                    text: 'Табельный номер',
                    value: 'personnel_number',
                },
                {
                    text: 'Эл. ключ',
                    value: 'key',
                },
                {
                    text: 'Теги',
                    value: 'tags',
                },

                {
                    text: 'Телефон',
                    value: 'phone_number',
                    width: '150px'
                },
                {
                    text: 'Email',
                    value: 'email',
                },
                {
                    text: 'Адрес офиса',
                    value: 'address',
                },

                {
                    text: 'Номер вод. удостоверения',
                    value: 'driver_license_number',
                },
                {
                    text: 'Категория вод. удостоверения',
                    value: 'driver_license_category',
                },
                {
                    text: 'Дата окончания В/У',
                    value: 'driver_license_expiration',
                },
                {
                    text: '',
                    value: 'actions',
                    sortable: false,

                },
            ],
            newDriverAction: false,
            multipleItemsDialog: false,
            itemToShowInformation: null,
            // hideDefaultHeader: false,
            name: "",
            address: "",
            description: "",
            selectedIcon: '',
            iconsToSelectFrom: [
                'mdi-account-circle',
                'mdi-airplane',
                'mdi-ambulance'
            ],
            dialogPicture: false,
            selected: [],
            dialog: false,
            tags: [{
                text: 'Тэг 6',
                value: 'tag_6'
            }, {
                text: 'Тэг 7',
                value: 'tag_7'
            }],
            nonce: 1,
            menu: false,
            model: [{
                text: 'Foo',
                color: 'blue',
            }, ],
            x: 0,
            search: null,
            y: 0,
            activator: null,
            attach: null,
            editing: null,
            editingIndex: -1,
            radiusVariants: [{
                    text: '50 метров',
                    value: '50'
                },
                {
                    text: '150 метров',
                    value: '150'
                },
                {
                    text: '500 метров',
                    value: '500'
                },
                {
                    text: '1500 метров',
                    value: '1500'
                }
            ],
            editedItem: {},
            editedIndex: 0,
            deletedIndex: 0,
            deletedItem: {},
            placeEditName: '',
            columnsToHideInitially: ['name', 'actions'],
            tasks: [{
                    id: 1,
                    name: 'Александр Петров',
                    tracker: 'Александр Газель',
                    department: 'Водители',
                    personnel_number: '-',
                    key: '-',
                    tags: [{
                        text: 'Тэг 1',
                        value: 'tag_1'
                    }],
                    phone_number: '+7 99999999',
                    email: 'al@mail.ru',
                    address: 'Большой просект П.С. 1',
                    driver_license_number: ' - ',
                    driver_license_category: ' - ',
                    driver_license_expiration: ' - ',
                },
                {
                    id: 1,
                    name: 'Александр Петров 2',
                    tracker: 'Александр Газель 2',
                    department: 'Водители',
                    personnel_number: '-',
                    key: '-',
                    tags: [{
                        text: 'Тэг 1',
                        value: 'tag_1'
                    }],
                    phone_number: '+7 99999999',
                    email: 'al@mail.ru',
                    address: 'Большой просект П.С. 1',
                    driver_license_number: ' - ',
                    driver_license_category: ' - ',
                    driver_license_expiration: ' - ',
                },

            ],
            // tasks: [{
            //         id: 1,
            //         name: 'Николай Лебедев',
            //         address: 'Большая Екатерининская улица, 27 строение 4, Москва, Россия, 129110 (100 метров)',
            //         description: '-',
            //         pic: 'mdi-account',
            //         radius: 100,
            //         tags: [{
            //             text: 'Тэг 1',
            //             value: 'tag_1'
            //         }, {
            //             text: 'Тэг 2',
            //             value: 'tag_2'
            //         }],
            //     },
            //     {
            //         id: 2,
            //         name: 'Александр Петров',
            //         address: 'Малая екатери',
            //         description: '-',
            //         pic: 'mdi-account',
            //         radius: 100,
            //         tags: [{
            //             text: 'Тэг 1',
            //             value: 'tag_1'
            //         }, {
            //             text: 'Тэг 2',
            //             value: 'tag_2'
            //         }],
            //     },

            // ],
            tabs: 'vehicles',
            vehicle: {
                name: ''
            },
            garage: {
                name: ''
            },
            openFormGarage: false,
            openFormCar: false,
            confirmRemoveVehicle: false,
            confirmRemoveGarage: false,
            openFormRouteTask: false,
            tabsFormCar: 'data_ts',
            searchCar: '',
            showSearchCar: false,
            searchGarage: '',
            showSearchGarage: false,
            openVehicleSidebar: false,
            openMapFullScreen: false,
            zoom: 16,
            center: latLng(59.930967, 30.302636),
            url: process.env.VUE_APP_OSM_SERVER + '/osm/{z}/{x}/{y}.png',
            addCar: false,
            loadingCars: false,
            loadingGarage: false,
            tableCarsGroup: null,
            selectedVehicle: null,
            detailCar: {
                name: 'Name 1',
                photo: 'https://picsum.photos/500/300?image=69',
                gos_number: 'o111oo 222',
                status: 'Стоит 3 часа',
                fuel_level: '2.09 л',
                mileage: '200334 км',
                insurance: '0002659248',
                driver: 'Дальнобой Дальнобоев',
                phone: '+7 (918) 999 33 21',
                photo_driver: 'https://picsum.photos/500/300?image=799',
                departament: 'Водители',
                online: true,
            },

            tableGarage: {
                data: [{
                        id: 1,
                        name_organization: 'Garage 1',
                        fio_meh: 'Тест Тестович',
                        fio_dispatch: 'Тестырян Тестырянович',
                        address: 'Main Street 12'
                    },
                    {
                        id: 2,
                        name_organization: 'Garage 2',
                        fio_meh: 'Тест Тестович',
                        fio_dispatch: 'Тестырян Тестырянович',
                        address: 'Main Street 10'
                    },
                    {
                        id: 3,
                        name_organization: 'Garage 2',
                        fio_meh: 'Тест Тестович',
                        fio_dispatch: 'Тестырян Тестырянович',
                        address: 'Main Street 22'
                    },
                ],

            }
        })
    }
</script>
<style scoped>
    ::v-deep .select-group .v-select__selection {
        font-size: 14px;
    }

    ::v-deep .table-places tbody tr {
        height: 40px;
    }


    ::v-deep .overlay-form-content .v-overlay__content {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
    }

    ::v-deep .tabs-form-car .v-tab {
        font-size: 12px;
    }

    ::v-deep .v-text-field__slot label,
    .v-select__slot label,
    .v-text-field__slot input,
    .v-input__control label {
        font-size: 13px;
    }

    ::v-deep .overlay-confirm-remove,
    ::v-deep .overlay-form-content,
    ::v-deep .overlay-map-fullscreen {
        z-index: 1003 !important;
    }

    ::v-deep .overlay-map-fullscreen .v-overlay__content {
        position: absolute;
        top: 5%;
        left: 2%;
        bottom: 5%;
        right: 2%;
    }


    .actions-column {
        background-color: white;
        width: 90px;
        right: 40px;
        text-align: center;

        display: none;

        z-index: 1000
    }

    ::v-deep tr.v-data-table__selected {
        background: #e2daff !important;
    }

    ::v-deep tr:hover .actions-column {
        display: block;
        background: #eeeeee;
    }


    .control-fullscreen {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        width: 36px;
        height: 36px;
        line-height: 36px;
        vertical-align: middle;
        text-align: center;
        border-radius: 5px;
        cursor: pointer;
    }

    .control-fullscreen:hover {
        background-color: #eeeeee !important;
    }

    .v-btn::before {
        background-color: transparent;
    }

    .detail-car__text {
        font-size: 13px !important
    }

    .detail-car__item {
        min-height: 40px;
    }

    .w-100 {
        width: 100%;
    }

    .h-100 {
        height: 100%;
    }

    .vehicles-tabs {
        border-bottom: #d4d4d4 1px solid;
    }

    .vehicles-tabs .v-tab {
        min-width: 160px;
    }

    .vehicle-header {
        font-size: 20px;
        color: #2f2f2f;
    }

    .vehicles-search {
        padding: 0;
        transition: max-width 300ms;
        max-width: 1px;
    }

    .vehicles-search.show {
        padding: 0 10px;
        max-width: 320px;
    }

    .table-places {
        height: 100%;
    }

    .table-cars {
        height: calc(100% - 44px);
    }

    .vehicles-container {
        transition: max-width 200ms;
        max-width: 100%;
    }

    .vehicles-container.active {
        max-width: calc(100% - 400px);
    }

    .wrap-tgl-sidebar {
        transition: max-width 200ms;
        max-width: 45px;
    }

    .wrap-tgl-sidebar.active {
        max-width: 0;
        padding: 0;
    }

    .tgl-sidebar {
        transform: rotate(0deg);
        transition: transform 200ms;
    }

    .tgl-sidebar.active {
        transform: rotate(-180deg);
    }

    .add-car-btn {
        z-index: 3;
    }

    .employee-task-name-cell {
        min-height: auto;
        width: 560px;
        text-overflow: ellipsis;
        max-width: 200px;

    }

    ::v-deep .v-data-table-header {
        height: 48px !important;
    }

    ::v-deep .v-data-table-header tr th span {
        font-size: 0.9rem
    }


    ::v-deep .table-places tr:hover .edit-table-section {
        display: block;

    }

    ::v-deep .table-places .edit-table-section {
        transform: translateY(10px);
        display: none;
    }

    ::v-deep .v-data-table td:last-of-type {
        position: absolute;
        right: 0;
        border-bottom: none !important;
    }


    ::v-deep .table-places tr>th:last-of-type {
        display: none;
        position: absolute;
        right: 0;
        z-index: 10;
    }

    ::v-deep .table-places tr>td:last-of-type .edit-table-section {
        position: absolute;
        right: 0;
        top: auto;
        z-index: 30;
        transform: translate(-40%, -40%);
    }

    .white-space-no-wrap {
        white-space: nowrap;
    }

    .address-title {
        align-self: start !important;
    }

    .place-profile-panel-picture {
        position: absolute;
        top: 30px;
        right: 50px;
    }

    .place-profile-panel-picture:hover {
        cursor: pointer
    }

    .filter-icon-fix {
        margin-top: -2px
    }

    .v-data-table>.v-data-table__wrapper>table {
        width: 100%;
        border-spacing: 0;
    }

    ::v-deep .theme--light.v-data-table>.v-data-table__wrapper>table>thead>tr>th {
        white-space: nowrap !important;
    }

    ::v-deep .v-data-table__wrapper {
        overflow-y: auto !important;
        height: calc(100vh - 220px);
        overflow-y: auto !important;
    }

      ::v-deep .overlay-map-fullscreen .v-overlay__content {
    position: absolute;
    top: 5%;
    left: 2%;
    bottom: 5%;
    right: 2%;
  }

</style>