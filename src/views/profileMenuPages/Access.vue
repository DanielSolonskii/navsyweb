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
                                        <v-radio label="Типовая форма №4-с (Грузовой автомобиль)" value="radio-1">
                                        </v-radio>
                                        <v-radio label="Типовая форма №4-с (Грузовой автомобиль)" value="radio-2">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12">
                                    <v-menu :close-on-content-click="false" :nudge-right="40"
                                        transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field label="Отчётный период" prepend-icon="mdi-calendar" readonly
                                                v-bind="attrs" v-on="on">
                                            </v-text-field>
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
                                    <v-btn text small color="primary">
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
                                <v-btn text small color="primary">
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
                            <v-col>Удалить выбранный гараж <span>"{{garage.name_organization}}"</span>?</v-col>
                        </v-row>
                        <v-row>
                            <v-col class="ml-auto pa-0" style="max-width: 180px">
                                <v-btn text small @click="confirmRemoveGarage=false">
                                    Отмена
                                </v-btn>
                                <v-btn text small color="primary">
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
                    <l-map style="height: calc(100% - 50px); width:100%; position:relative"
                        ref="vehicles_map_fullscreen" :zoom="zoom" :center="center" @ready="mapFullScreenOnReady">
                        <l-tile-layer :url="url" />
                    </l-map>
                    <v-card-text class="pa-2">
                        <v-btn text class="float-right" color="primary" @click="openMapFullScreen=false">
                            Закрыть
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-overlay>
            <v-overlay absolute :value="openFormCar" class="overlay-form-content" :class="{'active': openFormCar}">
                <v-card light width="600" height="100%" rounded="0" class="d-flex flex-column pa-4">
                    <div>
                        <v-row align="center" class="ma-0">
                            <v-col cols="2">
                                <v-btn icon class="text-center" @click="openFormCar=!openFormCar">
                                    <v-icon>
                                        mdi-close
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-col>
                                <span class="text-h5 font-weight-light">Новое ТС</span>
                            </v-col>
                        </v-row>
                        <v-tabs v-model="tabsFormCar" height="40px" color="primary darken-1" class="tabs-form-car">
                            <v-tab href="#data_ts">
                                Транспорт
                            </v-tab>
                            <v-tab href="#specifications">
                                Характеристики
                            </v-tab>
                            <v-tab href="#fuel_sensor">
                                Датчик топлива
                            </v-tab>
                            <v-tab href="#insurance">
                                Страхование
                            </v-tab>
                        </v-tabs>
                        <v-divider></v-divider>
                    </div>
                    <v-row class="ma-0 overflow-y-auto" style="min-height: 0">
                        <v-form ref="form-car">
                            <v-tabs-items v-model="tabsFormCar" class="h-100">
                                <v-tab-item key="f1" value="data_ts" class="h-100">

                                    <v-row class="ma-0">
                                        <v-col cols="6">
                                            <v-select label="Маячок" dense>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" class="pa-0">
                                            <v-card-title class="pa-1">Основная информация</v-card-title>
                                        </v-col>
                                        <v-col cols="6">

                                            <v-text-field label="Название" hide-details="auto" dense></v-text-field>
                                        </v-col>
                                        <v-col cols="6">

                                            <v-text-field label="Гос Номер" hide-details="auto" dense></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="VIN" hide-details="auto" dense></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Цвет" hide-details="auto" dense></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select label="Тип автомобиля" dense>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select label="Подтип" dense>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Модель" hide-details="auto" dense></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select label="Гараж" dense>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" class="pa-0">
                                            <v-card-title class="pa-1">Дополнительная информация</v-card-title>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-select label="Теги" dense>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field label="Дополнительно" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-tab-item>
                                <v-tab-item key="f2" value="specifications" class="h-100">
                                    <v-row class="ma-0">


                                        <v-col cols="12" class="pa-0">
                                            <v-card-title class="pa-1">Размер</v-card-title>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field label="Длина" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field label="Ширина" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field label="Высота" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Грузоподъёмность" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Полная масса" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Кол-во пассажиров" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="pa-0">
                                            <v-card-title class="pa-1">Колёсная база</v-card-title>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="Всего" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="Ведущие" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Размер шин" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Число шин" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" class="pa-0">
                                            <v-card-title class="pa-1">Дополнительная информация</v-card-title>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Разрешённая скорость" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Номер шасси" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Прицеп" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Год выпуска" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Номер кузова" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-tab-item>
                                <v-tab-item key="f3" value="fuel_sensor" class="h-100">
                                    <v-row class="ma-0">
                                        <v-col cols="6">
                                            <v-select label="Тип топлива" hide-details="auto" dense>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Марка топлива" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Стоимость (за 1 л)" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Ёмкость бака" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Норма расхода на 100 км" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-tab-item>
                                <v-tab-item key="f4" value="insurance" class="h-100">
                                    <v-row class="ma-0">
                                        <v-col cols="6">
                                            <v-text-field label="Номер страхования ОСАГО" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-menu :close-on-content-click="false" :nudge-right="40"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field placeholder="Дата окончания ОСАГО"
                                                        prepend-icon="mdi-calendar" dense hide-details readonly
                                                        v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Номер страхования КАСКО" hide-details="auto" dense>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-menu :close-on-content-click="false" :nudge-right="40"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field placeholder="Дата окончания КАСКО"
                                                        prepend-icon="mdi-calendar" dense hide-details readonly
                                                        v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                    </v-row>
                                </v-tab-item>
                            </v-tabs-items>
                        </v-form>
                    </v-row>
                    <v-card-actions class="mt-auto">
                        <v-spacer></v-spacer>
                        <v-btn color="grey darken-1" text small @click="openFormCar = false">
                            Отмена
                        </v-btn>
                        <v-btn color="primary darken-1" text small @click="openFormCar = false">
                            Сохранить
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-overlay>
            <v-overlay absolute :value="openFormGarage" class="overlay-form-content">
                <v-card light max-width="420px" height="100%" rounded="0" class="d-flex flex-column pa-4">
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

                                <span class="text-h5 font-weight-light">Новый гараж</span>

                            </v-col>
                        </v-row>
                    </div>

                    <v-row class="ma-0 overflow-y-auto" style="min-height: 0">
                        <v-form ref="form-garage">
                            <v-row class="ma-0">


                                <v-col cols="12">
                                    <v-text-field label="Название организаций" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12">

                                    <v-text-field label="Фио механика" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="Фио диспетчера" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="Адрес" hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-row>
                    <v-card-actions class="mt-auto">
                        <v-spacer></v-spacer>
                        <v-btn color="grey darken-1" text small @click="openFormGarage = false">
                            Отмена
                        </v-btn>
                        <v-btn color="primary darken-1" text small @click="openFormGarage = false">
                            Сохранить
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-overlay>
            <v-row>
                <v-col class="ma-5">
                    <v-tabs v-model="tabs" class="vehicles-tabs" background-color="grey lighten-3" color="primary"
                        height="40px" light>
                        <v-tab href="#vehicles">Пользователи</v-tab>
                        <v-tab href="#garage">Роли</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tabs" class="grey lighten-3 tab-height">
                        <v-tab-item key="1" value="vehicles" class="tab-height">
                            <v-container fluid class="h-100 pa-2">
                                <v-row class="ma-0 tab-height">
                                    <v-col class="vehicles-container pa-0 h-100">
                                        <v-row justify="space-between" align="center" class="ma-0">
                                            <v-col>
                                                <div>
                                                    Добавляйте пользователей, которым требуется предоставить доступ к
                                                    сервису. Уровень доступа определяется назначенной ролью и списком
                                                    доступных маячков.
                                                </div>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6">
                                                <!-- dialog user add -->
                                                <v-dialog v-model="dialogUser" width="500">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn dark small color="primary" v-bind="attrs" v-on="on">

                                                            <v-icon>
                                                                mdi-plus
                                                            </v-icon>
                                                            <span>
                                                                Добавить пользователя
                                                            </span>
                                                        </v-btn>
                                                    </template>

                                                    <v-card>
                                                        <v-card-title class="text-h5 grey lighten-2"
                                                            style="display: flex; justify-content: space-between">
                                                            <div>Новый пользователь</div>
                                                            <v-btn @click="dialogUser = false" icon>
                                                                <v-icon>mdi-close</v-icon>
                                                            </v-btn>
                                                        </v-card-title>

                                                        <v-card-text>
                                                            <v-form ref="form" v-model="valid" lazy-validation>
                                                                <v-text-field v-model="nametag" :counter="25"
                                                                    :rules="nameRules" label="Имя" required>
                                                                </v-text-field>

                                                                <v-text-field v-model="email" :rules="emailRules"
                                                                    label="E-mail" required></v-text-field>

                                                                <v-text-field label="Пароль" v-model="password"
                                                                    :rules="passwordRules" type="password" required>
                                                                </v-text-field>
                                                                <v-text-field label="Подтвердите пароль"
                                                                    v-model="confirmPassword"
                                                                    :rules="confirmPasswordRules.concat(passwordConfirmationRule)"
                                                                    type="password" required></v-text-field>

                                                                <v-btn class="ma-2 ml-0" :disabled="!valid"
                                                                    color="success" @click="validate">
                                                                    Проверить форму
                                                                </v-btn>

                                                                <v-btn class="ma-2 ml-0" color="error" @click="reset">
                                                                    Сбросить форму
                                                                </v-btn>

                                                                <v-btn class="ma-2 ml-0" color="warning"
                                                                    @click="resetValidation">
                                                                    Cбросить валидацию
                                                                </v-btn>
                                                            </v-form>
                                                        </v-card-text>

                                                        <v-divider></v-divider>

                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn color="grey" text @click="dialogUser = false">
                                                                Отменить
                                                            </v-btn>
                                                            <v-btn color="primary" :disabled="!isComplete" @click="dialogUser = false; createNewUser()">
                                                                Сохранить
                                                            </v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                                <!-- dialog user add -->
                                                <!-- dialog user edited -->
                                                <v-dialog v-model="editUserDialog" width="500">
                                                    <v-card>
                                                        <v-card-title class="text-h5 grey lighten-2"
                                                            style="display: flex; justify-content: space-between">
                                                            <div>{{ editedUser.name }}</div>
                                                            <v-btn @click="editUserDialog = false" icon>
                                                                <v-icon>mdi-close</v-icon>
                                                            </v-btn>
                                                        </v-card-title>

                                                        <v-card-text>
                                                            <v-form ref="form" v-model="valid" lazy-validation>
                                                                <h4>Учетная запись (ID): #{{ editedUser.id }}</h4>
                                                                <h3>Выберите роль</h3>
                                                                <v-select :items="availableRoles" label="Роль">
                                                                </v-select>
                                                                <h3>Имя</h3>
                                                                <v-text-field v-model="editedUser.name" :counter="25"
                                                                    :rules="nameRules" required>
                                                                </v-text-field>
                                                                <h3>Фамилия</h3>
                                                                <v-text-field v-model="editedUser.surname" required>
                                                                </v-text-field>
                                                                <h3>Номер телефона</h3>
                                                                <v-text-field v-model="editedUser.phone" required>
                                                                </v-text-field>
                                                                <h3>Email</h3>
                                                                <v-text-field v-model="editedUser.email"
                                                                    :rules="emailRules" required>
                                                                </v-text-field>
                                                                <div
                                                                    style="display: flex; direction: row; align-items: center">
                                                                    <v-checkbox class="mt-0" v-model="editedUser.active"
                                                                        hide-details>
                                                                    </v-checkbox>
                                                                    <span
                                                                        v-if="editedUser.active == true">Активен</span>
                                                                    <span v-else>Не активен</span>
                                                                </div>
                                                            </v-form>
                                                        </v-card-text>

                                                        <v-divider></v-divider>

                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn color="grey" text @click="editUserDialog = false">
                                                                Отменить
                                                            </v-btn>
                                                            <v-btn color="primary" text @click="editUserDialog = false;updateUserData()">
                                                                Сохранить
                                                            </v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                                <!-- dialog user edited -->
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field v-model="searchCar" ref="search-car" label="Быстрый поиск"
                                                    placeholder="Быстрый поиск" dense single-line
                                                    append-icon="mdi-close" @click:append="clearSearchCar"
                                                    class="vehicles-search show">
                                                </v-text-field>

                                            </v-col>
                                        </v-row>
                                        <v-card fluid class="pa-0white" style="max-height:77vh; overflow:auto">
                                            <v-data-table :search="searchCar" dense calculate-widths :headers="tableCars.headers"
                                                :items="tableCars.data" :items-per-page="200" item-key="id" class="elevation-1 table-cars"
                                                @click:row="rowClick"  single-select :loading="loadingCars"
                                                group-by="category" hide-default-footer fixed-header height="100%">
                                                <template v-slot:item.name="{ item }">
                                                    <div>
                                                        {{ item.name }}
                                                    </div>
                                                    <div>
                                                        <a style="font-size: 10px" @click="loginAsUser(item)">Войти как
                                                            пользователь</a><span>|</span><a href="#"
                                                            @click="editUser(item)"                     
                                                            style="font-size: 10px">Редактировать</a>
                                                    </div>
                                                </template>
                                                <template v-slot:item.active="{ item }">
                                                    <v-checkbox disabled class="mt-0" v-model="item.active"
                                                        hide-details>
                                                    </v-checkbox>
                                                </template>
                                                <template v-slot:item.tags="{ item }">
                                                    <v-chip v-for="tag in item.tags" :key="tag.value" color="primary"
                                                        small dark>
                                                        {{ tag.text }}
                                                    </v-chip>
                                                </template>
                                                <template v-slot:group.header="{group, isOpen, toggle}">
                                                    <th colspan="12" class="white" @click="toggle">
                                                        <v-icon class="mr-4 mt-0 pt-0">
                                                            {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                                        </v-icon>
                                                        {{ group }}
                                                    </th>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-tab-item>
                        <v-tab-item key="2" value="garage" class="tab-height-role">
                            <v-container fluid class="h-100 pa-2">
                                <v-row>
                                    <v-col>
                                        <div>
                                            Роли определяют, какие права будут доступны пользователю.
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row justify="space-between" align="center" class="ma-0">
                                    <v-col style="max-width: 80px">
                                        <!-- dialog role add -->
                                        <v-dialog v-model="dialogRole" width="500">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn dark small color="primary" v-bind="attrs" v-on="on">
                                                    <v-icon>
                                                        mdi-plus
                                                    </v-icon>
                                                    <span>
                                                        Добавить роль
                                                    </span>
                                                </v-btn>
                                            </template>

                                            <v-card>
                                                <v-card-title class="text-h5 grey lighten-2">
                                                    Новая роль
                                                </v-card-title>
                                                <v-card-text style="height: 490px; overflow: auto">
                                                    <v-form ref="form" v-model="valid" lazy-validation>
                                                        <h3 class="pt-2">Название роли:</h3>
                                                        <h1 style="margin-top: 10px"></h1>
                                                        <v-text-field class="mt-0 pt-0" v-model="roleName" :counter="25"
                                                            :rules="roleNameRules" label="Новая роль" required>
                                                        </v-text-field>
                                                        <h3>Права роли:</h3>
                                                        <v-checkbox class="mt-1" style="margin-left: 38px"
                                                            v-model="ownerRoleOptions" label="Владельца" hide-details>
                                                        </v-checkbox>
                                                        <v-checkbox class="mt-1" style="margin-left: 38px"
                                                            v-model="mainRoleOptions" label="Основные" hide-details>
                                                        </v-checkbox>
                                                        <v-treeview v-model="selection" :items="dialogExtraRights"
                                                            selection-type="leaf" selectable return-object open-all>
                                                        </v-treeview>
                                                        <h3>Просмотр истории:</h3>
                                                        <v-row>
                                                            <v-col cols="1"
                                                                style="display: flex; align-items: center; justify-content: center;">
                                                                <span>За:</span>
                                                            </v-col>
                                                            <v-col cols="2">
                                                                <v-text-field v-model="numberValue" hide-details
                                                                    single-line type="number" />
                                                            </v-col>
                                                            <v-col>
                                                                <v-select :items="historyTimeValue" label="года">
                                                                </v-select>
                                                            </v-col>
                                                        </v-row>
                                                    </v-form>
                                                </v-card-text>

                                                <v-divider></v-divider>

                                                <v-card-actions class="role-add-actions">
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="grey" text @click="dialogRole = false">
                                                        Отменить
                                                    </v-btn>
                                                    <v-btn color="primary" text @click="dialogRole = false; saveNewRole()">
                                                        Сохранить
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                        <!-- dialog role add -->
                                    </v-col>
                                    <v-col>
                                        <div class="font-weight-medium vehicle-header">
                                            Гаражи
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-card style="height: calc(100% + 140px)" class="pa-0">
                                    <v-data-table dense calculate-widths :headers="tableGarage.headers"
                                        :items="tableGarage.data" item-key="id" class="elevation-1 table-garage"
                                        @click:row="rowClickRole" single-select :loading="loadingGarage"
                                        hide-default-footer fixed-header height="100%">
                                        <template v-slot:item.availableRights="{ item }">

                                            <span v-for="node in item.availableRights.basicRights" :key="node.id">
                                                {{ node.name }}
                                            </span>
                                            <span v-for="node in item.availableRights.ownerRights" :key="node.id">
                                                , {{ node.name }}
                                            </span>
                                            <span v-for="node in item.availableRights.dialogExtraRights" :key="node.id">
                                                , {{ node.name }}
                                                <!--
                                                <span v-for="child in node.children" :key="child.id">
                                                    , {{ child.name }}
                                                </span>
                                            -->
                                            </span>
                                            <br>
                                            <span>Просмотр истории за: {{ item.numberValue }}
                                                {{ item.historyTimeValue }}</span>
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </v-container>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
                <v-col v-if="tabs == 'vehicles'" class="pa-0 ma-8 ml-1"
                    style="max-width: 524px; background-color: #f5f5f5;">
                    <v-row justify="space-between" align="center" class="ma-0"
                        style="height: 44px; background-color: #505a64; color: white">
                        <div class="tracking-dev">
                            Доступные маячки
                        </div>
                    </v-row>
                    <v-card class="pa-0" style="height: calc(100% - 48px);">
                        <div class="overflow-y-auto pa-2">
                            <span v-if="!activeUser.name">Выберите пользователя, чтобы задать доступные для него
                                маячки</span>
                            <template v-else>
                                <span>Маячки, доступные пользователю "{{ activeUser.name }}"</span>
                                <div style="display: flex; flex-direction: row">
                                    <div>
                                        <v-list>
                                            <v-row style="margin-left: 2px">
                                                <v-col>
                                                    <v-checkbox @change="checkAll($event)" v-model="selectAll"
                                                        hide-details />
                                                </v-col>
                                                <v-col>
                                                    <v-text-field class="mb-2" style="width: 320px" v-model="search"
                                                        hide-details clearable clear-icon="mdi-close-circle-outline">
                                                    </v-text-field>
                                                </v-col>
                                            </v-row>
                                            <div class="devices-selection-tree">



                                                <v-treeview hoverable open-on-click v-model="activeUser.devices"
                                                :items="grouping_devices"  :search="search" :filter="filter" 
                                                selectable return-object open-all >
                                                    <template v-slot:label="{ item }">
                                                        <div v-if="item.color" class="group-devices__color"
                                                            :style="{'background-color': item.color}">
                                                        </div>
                                                        <span>

                                                            {{ item.name }}
                                                        </span>
                                                    </template>
                                                    <template v-slot:append="{ item, open }">
                                                        <v-icon v-if="item.color">
                                                            {{ open ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                                        </v-icon>
                                                    </template>
                                                </v-treeview>

                                            

                                            </div>
                                            
                                        </v-list>
                                    </div>
                                    <div>
                                        <v-btn icon v-on:click="showModalMarkers">
                                            <v-icon>
                                                mdi-map-marker-plus
                                            </v-icon>
                                        </v-btn>
                                        <!-- modal with markers -->
                                        <modal name="modal-with-markers" :draggable="true" height="600">
                                            <v-card>
                                                <v-card-title class="text-h5 grey lighten-2">
                                                    Выберите маячки
                                                </v-card-title>
                                                <v-card-text>
                                                    <v-list class="devices-selection-tree">

                                                        <v-treeview open-on-click v-model="allDevicesSelection"
                                                            :items="all_devices" selectable return-object open-all
                                                            class="access-page-tree">
                                                            <template v-slot:label="{ item }">
                                                                <div v-if="item.color" class="group-devices__color"
                                                                    :style="{'background-color': item.color}">
                                                                </div>
                                                                <span>
                                                                    {{ item.name }}
                                                                </span>
                                                            </template>
                                                            <template v-slot:append="{ item, open }">
                                                                <v-icon v-if="item.color">
                                                                    {{ open ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                                                </v-icon>
                                                            </template>
                                                        </v-treeview>

                                                    </v-list>
                                                </v-card-text>

                                                <v-card-actions class="mt-auto">
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="grey darken-1" text small @click="hideModalMarkers">
                                                        Отмена
                                                    </v-btn>
                                                    <v-btn color="primary darken-1" text small @click="addNewMarkers();sendMarkerstoUser()">
                                                        Добавить маячки
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </modal>
                                        <!-- modal with markers -->
                                        <v-btn icon @click="removeSelectedMarkers(); deleteMarker()">
                                            <v-icon>
                                                mdi-trash-can-outline
                                            </v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </template>
                        </div>

                    </v-card>
                </v-col>
                <v-col v-else class="pa-0 ma-8 ml-1" style="max-width: 524px; background-color: #f5f5f5;">
                    <v-row justify="space-between" align="center" class="ma-0"
                        style="height: 44px; background-color: #505a64; color: white">
                        <div class="tracking-dev">
                            Права роли
                        </div>
                    </v-row>
                    <v-card class="pa-0" style="height: calc(100% - 30px);">
                        <div class="overflow-y-auto pa-2" style="height: calc(100% - 200px); overflow-x: hidden">
                            <span v-if="!activeRole.id">Выберите роль, чтобы настроить ее привелегии</span>
                            <template v-else>
                                <h3>Права роли:</h3>
                                <v-treeview v-model="activeRole.availableRights.ownerRights" :items="ownerRights"
                                    selection-type="leaf" selectable return-object open-all>
                                </v-treeview>
                                <v-treeview v-model="activeRole.availableRights.basicRights" :items="basicRights"
                                    selection-type="leaf" selectable return-object open-all>
                                </v-treeview>
                                <v-treeview v-model="activeRole.availableRights.dialogExtraRights"
                                    :items="dialogExtraRights" selection-type="leaf" selectable return-object open-all>
                                </v-treeview>
                                <h3>Просмотр истории:</h3>
                                <v-row>
                                    <v-col cols="1"
                                        style="display: flex; align-items: center; justify-content: center;">
                                        <span>За:</span>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text-field v-model="activeRole.numberValue" hide-details single-line
                                            type="number" />
                                    </v-col>
                                    <v-col>
                                        <v-select v-model="activeRole.historyTimeValue" :items="historyTimeValue">
                                        </v-select>
                                    </v-col>
                                </v-row>

                            </template>
                        </div>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </template>

    <script>
        import httpClient from '@/api'
        // import { Carousel } from 'element-ui';
        import {
            latLng
        } from "leaflet";
        import {
            LMap,
            LTileLayer,

        } from 'vue2-leaflet';

        export default {
            name: "VehiclesPage",
            components: {
                LMap,
                LTileLayer,
            },
            computed: {
                filter() {
                    return this.caseSensitive ?
                        (item, search, textKey) => item[textKey].includes(search) :
                        undefined;
                },
                passwordConfirmationRule() {
                    return () =>
                        this.password === this.confirmPassword || "Пароль должен совпадать";
                },
                isComplete () {
                    return (
                         this.user_name != '' &&
                         this.email != '' &&
                         this.password != '' &&
                         this.confirmPassword != '' &&
                         this.password === this.confirmPassword
                        )
                },
               
            },
            methods: {
                deleteMarker(){
                    httpClient.api.deleteMarker()
                    .then(resp =>{
                        console.log(resp.data)
                    });

                    this.$alert("Данный маячок удалён.");

                },
                updateUserData(){
                    httpClient.api.updateUser(this.editedUser.id, this.editedUser.name, this.editedUser.surname, this.editedUser.phone, this.editedUser.email, this.editedUser.active)
                    .then( resp => { 
                        console.log(resp);
                    }), 
                    this.$alert("Данные пользователя обновлены.");
                    console.log(this.editedUser); 
                },
                getCarsTabless() { 
                    httpClient.api.getCarsTables()
                    .then(resp => {
                        this.tableCars.data = resp.data
                       return console.log(this.tableCars.data)
                    });
                },  
                addNewMarkers() {
                    this.activeUser.devices = JSON.parse(JSON.stringify(this.allDevicesSelection));
        
                    
                    this.grouping_devices = JSON.parse(JSON.stringify(this.all_devices));
                    this.hideModalMarkers();
                    
                },
                getRandomInt(max) {
                    return Math.floor(Math.random() * max);
                },
                createNewUser(){

                    // Запись пользователя в ДБ
                   // httpClient.api.signUp(this.nametag, this.password, this.email, ["user"], this.name)
                   // .then(resp => {
                   //     return console.log(resp);
                   // });


                   // Для теста
                    var a = {
                        id: this.getRandomInt(),
                        name: this.nametag,
                        email: this.email,
                        surname: this.nametag,
                        active: true,
                        phone: '+43343355645',
                        category: 'Пользователь',
                        devices: []
                    };
                    this.tableCars.data.push(a);
                },
                saveNewRole(){
                    this.$alert('добавлена новая роль');
                    
                    var rolenew = {
                        id: this.getRandomInt(100),
                        role_name: this.roleName,
                        availableRights: {
                            basicRights: [],
                            dialogExtraRights: [],
                            ownerRights: [],
                        },
                        users_count: '1',
                        historyTimeValue: 'года',
                    }    
                    console.log(rolenew);
                    if(this.mainRoleOptions){
                        var mainoptions = {
                            
                                    id: 14242,
                                    name: 'Основные',
                                    children: [{
                                            id: 2,
                                            name: 'Инструменты карты'
                                        },
                                        {
                                            id: 3,
                                            name: 'История поездок и событий'
                                        },
                                        {
                                            id: 4,
                                            name: 'Сервисные работы'
                                        },
                                        {
                                            id: 5,
                                            name: 'Интерактивные виджеты'
                                        },
                                        {
                                            id: 6,
                                            name: 'Привязанные данные (только просмотр)'
                                        },
                                    ],
                        }
                        rolenew.availableRights.basicRights.push(mainoptions);
                    }
                    if(this.ownerRoleOptions){
                        var owneroptions = {      
                            id: 14,
                            name: 'Владельца',
                            children: [{
                            id: 2,
                            name: 'Редактирование пользователя'
                                },
                                {
                            id: 3,
                            name: 'Управление группами маячков'
                                },
                                {
                            id: 4,
                            name: 'Удаление маячков'
                                },
                                {
                            id: 5,
                            name: 'Управление ретрансляторами'
                                },
                                {
                            id: 6,
                            name: 'Изменение тарифов'
                                },
                                {
                            id: 7,
                            name: 'Активация пользователей'
                                },
                                {
                            id: 8,
                            name: 'Плагины "Веб-локатор" и "Курьер на карте"'
                                },
                            ],
                        }
                        rolenew.availableRights.ownerRights.push(owneroptions);
                    }
                    this.tableGarage.data.push(rolenew);
                },
                sendMarkerstoUser(){
                    
                    for(var i = 0; i < this.devicesSelection.length; i++){
                        console.log(this.devicesSelection[i].name);
                    }
                    this.$alert(`Маячки добавлены к пользователю`);
                },
                removeSelectedMarkers() {
                    this.devicesSelection.forEach((device) => {
                        let emptyChildArrayIds = [];
                        this.grouping_devices.forEach(function (o) {
                            o.children = o.children.filter(s => s.id != device.id);
                            o.children.length == 0 ? emptyChildArrayIds.push(o.id) : null
                        });
                        this.grouping_devices = this.grouping_devices.filter(item => !emptyChildArrayIds
                            .includes(item.id));
                    });
                },
                loadUserChecks(item){
                    console.log(item);
                    this.devicesSelection = item.devices  
                },
                checkAll(e) {
                    if (e) {
                        this.devicesSelection = JSON.parse(JSON.stringify(this.all_devices));
                        
                    } else {
                        this.devicesSelection = []
                    }
                },
                
                showModalMarkers() {
                    this.$modal.show('modal-with-markers');
                },
                hideModalMarkers() {
                    this.$modal.hide('modal-with-markers');
                },
                editUser(item) {
                    this.editedUser = item;
                    this.editUserDialog = true;
                },
                checkGroup() {
                    console.log('select all items in group')
                },
                validate() {
                    if (this.$refs.form.validate()) {
                        this.snackbar = true;
                    }
                },
                reset() {
                    this.$refs.form.reset();
                },
                resetValidation() {
                    this.$refs.form.resetValidation();
                },
                clearSearchCar() {
                    this.searchCar = ''
                },
                mapOnReady() {
                    this.map = this.$refs['vehicles_map'].mapObject
                    this.map.zoomControl.setPosition('topright');
                },
                mapFullScreenOnReady() {
                    this.map = this.$refs['vehicles_map_fullscreen'].mapObject
                    this.map.zoomControl.setPosition('topright');
                },
                removeGarage(item) {
                    this.garage = item;
                    this.confirmRemoveGarage = true
                },

                loginAsUser(item){
                    console.log(item);
                },
                rowClick: function (item) {
                    this.activeUser = item
                },
                rowClickRole: function (item) {
                    this.activeRole = item
                    console.log(item)
                },      
                
            },
            beforeMount(){
              this.getCarsTabless();
            },
            data: () => ({
                checkedNodes: ['2','1'],
                nametag: '',
                allDevicesSelection: [],
                devicesSelection: [],
                userDevices: [{

                },
                {

                }
                ],
                selectAll: false,
                search: '',
                editUserDialog: false,
                editedUser: {},
                activeRole: {},
                activeUser: {},
                ownerRoleOptions: false,
                selection: [],
                numberValue: 1,
                mainRoleOptions: false,
                parametersReport: {
                    title: '',
                    trackers: [],
                },
                all_devices: [{
                        id: 1,
                        name: 'Автотранспорт',
                        color: '#f54040',
                        children: [{
                                id: 201,
                                name: 'Антон Газель',
                                group_name: 'Автотранспорт',
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
                                fix_rotation: true,
                                ignition_id: 1,
                                ignition: 'Напряжение бортовой сети',
                                ignition_min_v: 13.00,
                                ignition_max_v: 30.00,
                                group_work_status: 'Не назначен',
                                group_work_status_id: 1,
                                fix_parking_minutes: 1,
                                min_speed_for_fix_parking: 3,
                                fix_parking_ignition: false,
                                fix_parking_detected_motion: true,
                                sensors: [{
                                        id: 8,
                                        name: 'Уровень топлива',
                                        sensor_type_id: 1,
                                        sensor_type_name: 'Датчик топлива',
                                        pin: 1
                                    },
                                    {
                                        id: 5,
                                        name: 'Автосигнализация',
                                        sensor_type_id: 2,
                                        sensor_type_name: 'Автосигнализация',
                                        pin: 4
                                    },
                                ],
                                tags: [{
                                        id: 1,
                                        text: 'tag 1'
                                    },
                                    {
                                        id: 2,
                                        text: 'tag 2'
                                    },
                                    {
                                        id: 3,
                                        text: 'tag 3'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                            {
                                id: 202,
                                name: 'MAN Фура',
                                group_name: 'Автотранспорт',
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
                                fix_rotation: true,
                                ignition_id: 1,
                                ignition: 'Напряжение бортовой сети',
                                ignition_min_v: 13.00,
                                ignition_max_v: 30.00,
                                group_work_status: 'Не назначен',
                                group_work_status_id: 1,
                                fix_parking_minutes: 1,
                                min_speed_for_fix_parking: 3,
                                fix_parking_ignition: false,
                                fix_parking_detected_motion: true,
                                sensors: [{
                                    id: 1,
                                    name: 'Уровень топлива',
                                    sensor_type_id: 1,
                                    sensor_type_name: 'Датчик топлива',
                                    pin: 1
                                }, ],
                                tags: [{
                                        id: 1,
                                        text: 'tag 1'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                            {
                                id: 203,
                                name: 'Фургон Ford',
                                group_name: 'Автотранспорт',
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
                                fix_rotation: true,
                                ignition_id: 1,
                                ignition: 'Напряжение бортовой сети',
                                ignition_min_v: 13.00,
                                ignition_max_v: 30.00,
                                group_work_status: 'Не назначен',
                                group_work_status_id: 1,
                                fix_parking_minutes: 1,
                                min_speed_for_fix_parking: 3,
                                fix_parking_ignition: false,
                                fix_parking_detected_motion: true,
                                sensors: [{
                                        id: 1,
                                        name: 'Уровень топлива',
                                        sensor_type_id: 1,
                                        sensor_type_name: 'Датчик топлива',
                                        pin: 1
                                    },
                                    {
                                        id: 2,
                                        name: 'Автосигнализация',
                                        sensor_type_id: 2,
                                        sensor_type_name: 'Автосигнализация',
                                        pin: 2
                                    },
                                ],
                                tags: [{
                                        id: 3,
                                        text: 'tag 3'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                        ],
                    },
                    {
                        id: 2,
                        name: 'Промоутеры и мерчандайзеры',
                        color: '#4097f5',
                        children: [{
                                id: 301,
                                name: 'Мерчандайзер Валентина',
                                group_name: 'Промоутеры и мерчандайзеры',
                                group_id: 2,
                            },
                            {
                                id: 302,
                                name: 'Менеджер Сергей',
                                group_name: 'Промоутеры и мерчандайзеры',
                                group_id: 2,
                            },
                        ],
                    },
                ],
                grouping_devices: [{
                        id: 1,
                        name: 'Автотранспорт',
                        color: '#f54040',
                        children: [{
                                id: 201,
                                name: 'Антон Газель',
                                group_name: 'Автотранспорт',
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
                                fix_rotation: true,
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
                                sensors: [{
                                        id: 8,
                                        name: 'Уровень топлива',
                                        sensor_type_id: 1,
                                        sensor_type_name: 'Датчик топлива',
                                        pin: 1
                                    },
                                    {
                                        id: 5,
                                        name: 'Автосигнализация',
                                        sensor_type_id: 2,
                                        sensor_type_name: 'Автосигнализация',
                                        pin: 4
                                    },
                                ],
                                tags: [{
                                        id: 1,
                                        text: 'tag 1'
                                    },
                                    {
                                        id: 2,
                                        text: 'tag 2'
                                    },
                                    {
                                        id: 3,
                                        text: 'tag 3'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                            {
                                id: 202,
                                name: 'MAN Фура',
                                group_name: 'Автотранспорт',
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
                                fix_rotation: true,
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
                                sensors: [{
                                    id: 1,
                                    name: 'Уровень топлива',
                                    sensor_type_id: 1,
                                    sensor_type_name: 'Датчик топлива',
                                    pin: 1
                                }, ],
                                tags: [{
                                        id: 1,
                                        text: 'tag 1'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                            {
                                id: 203,
                                name: 'Фургон Ford',
                                group_name: 'Автотранспорт',
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
                                fix_rotation: true,
                                ignition_id: 1,
                                ignition: 'Напряжение бортовой сети',
                                ignition_min_v: 13.00,
                                ignition_max_v: 30.00,
                                group_work_status: 'Не назначен',
                                group_work_status_id: 1,
                                fix_parking_minutes: 1,
                                min_speed_for_fix_parking: 3,
                                fix_parking_ignition: false,
                                fix_parking_detected_motion: true,
                                sensors: [{
                                        id: 1,
                                        name: 'Уровень топлива',
                                        sensor_type_id: 1,
                                        sensor_type_name: 'Датчик топлива',
                                        pin: 1
                                    },
                                    {
                                        id: 2,
                                        name: 'Автосигнализация',
                                        sensor_type_id: 2,
                                        sensor_type_name: 'Автосигнализация',
                                        pin: 2
                                    },
                                ],
                                tags: [{
                                        id: 3,
                                        text: 'tag 3'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                        ],
                    },
                    {
                        id: 2,
                        name: 'Промоутеры и мерчандайзеры',
                        color: '#4097f5',
                        children: [{
                                id: 301,
                                name: 'Мерчандайзер Валентина',
                                group_name: 'Промоутеры и мерчандайзеры',
                                group_id: 2,
                            },
                            {
                                id: 302,
                                name: 'Менеджер Сергей',
                                group_name: 'Промоутеры и мерчандайзеры',
                                group_id: 2,
                            },
                        ],
                    },
                ],
                historyTimeValue: [
                    'дня',
                    'недели',
                    'месяца',
                    'года'
                ],
                availableRoles: [
                    'Пользователь',
                    'Админ',
                    'Диспетчер'
                ],
                ownerRights: [{
                    id: 14,
                    name: 'Владельца',
                    children: [{
                            id: 2,
                            name: 'Редактирование пользователя'
                        },
                        {
                            id: 3,
                            name: 'Управление группами маячков'
                        },
                        {
                            id: 4,
                            name: 'Удаление маячков'
                        },
                        {
                            id: 5,
                            name: 'Управление ретрансляторами'
                        },
                        {
                            id: 6,
                            name: 'Изменение тарифов'
                        },
                        {
                            id: 7,
                            name: 'Активация пользователей'
                        },
                        {
                            id: 8,
                            name: 'Плагины "Веб-локатор" и "Курьер на карте"'
                        },
                    ],
                }, ],
                basicRights: [{
                    id: 14242,
                    name: 'Основные',
                    children: [{
                            id: 2,
                            name: 'Инструменты карты'
                        },
                        {
                            id: 3,
                            name: 'История поездок и событий'
                        },
                        {
                            id: 4,
                            name: 'Сервисные работы'
                        },
                        {
                            id: 5,
                            name: 'Интерактивные виджеты'
                        },
                        {
                            id: 6,
                            name: 'Привязанные данные (только просмотр)'
                        },
                    ],
                }, ],
                dialogExtraRights: [{
                    id: 1,
                    name: 'Дополнительные',
                    children: [{
                            id: 2,
                            name: 'Платежи'
                        },
                        {
                            id: 3,
                            name: 'Активация маячков'
                        },
                        {
                            id: 4,
                            name: 'Аппаратные настройки маячков'
                        },
                        {
                            id: 5,
                            name: 'Программные настройки маячков'
                        },
                        {
                            id: 6,
                            name: 'Управление выходами маячков'
                        },
                        {
                            id: 7,
                            name: 'Правила контроля событий'
                        },
                        {
                            id: 8,
                            name: 'Отчёты'
                        },
                        {
                            id: 9,
                            name: 'Геозоны'
                        },
                        {
                            id: 10,
                            name: 'Места'
                        },
                        {
                            id: 11,
                            name: 'Задания'
                        },
                        {
                            id: 12,
                            name: 'Шаблоны форм'
                        },
                        {
                            id: 13,
                            name: 'Сотрудники'
                        },
                        {
                            id: 14,
                            name: 'Транспортные средства'
                        },
                        {
                            id: 15,
                            name: 'Теги'
                        },
                        {
                            id: 16,
                            name: 'Настраиваемые поля в местах'
                        },
                    ],
                }, ],
                valid: true,
                roleName: "",
                name: "",
                nameRules: [
                    v => !!v || "Имя обязательно",
                    v => (v && v.length <= 25) || "В имени должно быть меньше 25-ти символов"
                ],
                roleNameRules: [
                    v => !!v || "Название роли обязательно",
                    v => (v && v.length <= 25) || "В названии должно быть меньше 25-ти символов"
                ],
                email: "",
                emailRules: [
                    v => !!v || "E-mail обязателен",
                    v => /.+@.+/.test(v) || "E-mail некорректен"
                ],
                password: "",
                confirmPassword: "",
                passwordRules: [v => !!v || "Пароль обязателен"],
                confirmPasswordRules: [v => !!v || "Пароль обязателен"],
                dialogRole: false,
                dialogUser: false,
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
                groupsTable: [{
                    text: 'Не группировать',
                    value: null
                }, {
                    text: 'По типу',
                    value: 'type_vehicle'
                }, {
                    text: 'По гаражу',
                    value: 'garage'
                }],
                headerTableCars: [{
                        text: 'Имя',
                        value: 'name',
                        width: 150
                    },
                    {
                        text: 'Активен',
                        value: 'active',
                    },
                    {
                        text: 'Email',
                        value: 'email',
                    },
                    {
                        text: 'Телефон',
                        value: 'phone',
                    },
                ],
                tableCars: {
                    data: [{
                            id: 4,
                            name: 'Федор',
                            surname: 'Астафьев',
                            active: true,
                            email: 'test@email.com',
                            phone: +1234556677,
                            category: 'Владелец',
                            devices: [],
                            roles: [],    
                        },
                        {
                            id: 5,
                            name: 'Александра',
                            surname: 'Старкова',
                            active: true,
                            email: 'test2@email.com',
                            phone: +12342345247,
                            category: 'Все права, кроме прав владельца',
                            devices: [],
                            roles: []
                        },
                    ],
                    headers: [{
                            text: 'Имя',
                            value: 'name',
                        },
                        {
                            text: 'Активен',
                            value: 'active',
                        },
                        {
                            text: 'Email',
                            value: 'email',
                        },
                        {
                            text: 'Телефон',
                            value: 'phone',
                        },
                        {
                            text: 'Категория',
                            value: 'category',
                            align: 'd-none'
                        },

                    ]
                },
                tableGarage: {
                    data: [{
                            id: 1,
                            role_name: 'Владелец',
                            availableRights: {
                                basicRights: [{
                                    id: 14242,
                                    name: 'Основные',
                                    children: [{
                                            id: 2,
                                            name: 'Инструменты карты'
                                        },
                                        {
                                            id: 3,
                                            name: 'История поездок и событий'
                                        },
                                        {
                                            id: 4,
                                            name: 'Сервисные работы'
                                        },
                                        {
                                            id: 5,
                                            name: 'Интерактивные виджеты'
                                        },
                                        {
                                            id: 6,
                                            name: 'Привязанные данные (только просмотр)'
                                        },
                                    ],
                                }, ],
                                dialogExtraRights: [{
                                    id: 1,
                                    name: 'Дополнительные',
                                    children: [{
                                            id: 2,
                                            name: 'Платежи'
                                        },
                                        {
                                            id: 3,
                                            name: 'Активация маячков'
                                        },
                                        {
                                            id: 4,
                                            name: 'Аппаратные настройки маячков'
                                        },
                                        {
                                            id: 5,
                                            name: 'Программные настройки маячков'
                                        },
                                        {
                                            id: 6,
                                            name: 'Управление выходами маячков'
                                        },
                                        {
                                            id: 7,
                                            name: 'Правила контроля событий'
                                        },
                                        {
                                            id: 8,
                                            name: 'Отчёты'
                                        },
                                        {
                                            id: 9,
                                            name: 'Геозоны'
                                        },
                                        {
                                            id: 10,
                                            name: 'Места'
                                        },
                                        {
                                            id: 11,
                                            name: 'Задания'
                                        },
                                        {
                                            id: 12,
                                            name: 'Шаблоны форм'
                                        },
                                        {
                                            id: 13,
                                            name: 'Сотрудники'
                                        },
                                        {
                                            id: 14,
                                            name: 'Транспортные средства'
                                        },
                                        {
                                            id: 15,
                                            name: 'Теги'
                                        },
                                        {
                                            id: 16,
                                            name: 'Настраиваемые поля в местах'
                                        },
                                    ],
                                }, ],
                                ownerRights: [{
                                    id: 14,
                                    name: 'Владельца',
                                    children: [{
                                            id: 2,
                                            name: 'Редактирование пользователя'
                                        },
                                        {
                                            id: 3,
                                            name: 'Управление группами маячков'
                                        },
                                        {
                                            id: 4,
                                            name: 'Удаление маячков'
                                        },
                                        {
                                            id: 5,
                                            name: 'Управление ретрансляторами'
                                        },
                                        {
                                            id: 6,
                                            name: 'Изменение тарифов'
                                        },
                                        {
                                            id: 7,
                                            name: 'Активация пользователей'
                                        },
                                        {
                                            id: 8,
                                            name: 'Плагины "Веб-локатор" и "Курьер на карте"'
                                        },
                                    ],
                                }, ],
                            },
                            users_count: '1',
                            historyTimeValue: 'года',
                            numberValue: 2,
                        },
                        {
                            id: 2,
                            role_name: 'Без роли',
                            availableRights: {
                                basicRights: [{
                                    id: 14242,
                                    name: 'Основные',
                                    children: [{
                                            id: 2,
                                            name: 'Инструменты карты'
                                        },
                                        {
                                            id: 3,
                                            name: 'История поездок и событий'
                                        },
                                        {
                                            id: 4,
                                            name: 'Сервисные работы'
                                        },
                                        {
                                            id: 5,
                                            name: 'Интерактивные виджеты'
                                        },
                                        {
                                            id: 6,
                                            name: 'Привязанные данные (только просмотр)'
                                        },
                                    ],
                                }, ],
                                dialogExtraRights: [],
                                ownerRights: [],
                            },
                            users_count: '1',
                            historyTimeValue: 'дня',
                            numberValue: 2,
                        },
                        {
                            id: 3,
                            role_name: 'Все права, кроме прав владельца',
                            availableRights: {
                                ownerRights: [],
                                basicRights: [{
                                    id: 14242,
                                    name: 'Основные',
                                    children: [{
                                            id: 2,
                                            name: 'Инструменты карты'
                                        },
                                        {
                                            id: 3,
                                            name: 'История поездок и событий'
                                        },
                                        {
                                            id: 4,
                                            name: 'Сервисные работы'
                                        },
                                        {
                                            id: 5,
                                            name: 'Интерактивные виджеты'
                                        },
                                        {
                                            id: 6,
                                            name: 'Привязанные данные (только просмотр)'
                                        },
                                    ],
                                }, ],
                                dialogExtraRights: [{
                                    id: 1,
                                    name: 'Дополнительные',
                                    children: [{
                                            id: 2,
                                            name: 'Платежи'
                                        },
                                        {
                                            id: 3,
                                            name: 'Активация маячков'
                                        },
                                        {
                                            id: 4,
                                            name: 'Аппаратные настройки маячков'
                                        },
                                        {
                                            id: 5,
                                            name: 'Программные настройки маячков'
                                        },
                                        {
                                            id: 6,
                                            name: 'Управление выходами маячков'
                                        },
                                        {
                                            id: 7,
                                            name: 'Правила контроля событий'
                                        },
                                        {
                                            id: 8,
                                            name: 'Отчёты'
                                        },
                                        {
                                            id: 9,
                                            name: 'Геозоны'
                                        },
                                        {
                                            id: 10,
                                            name: 'Места'
                                        },
                                        {
                                            id: 11,
                                            name: 'Задания'
                                        },
                                        {
                                            id: 12,
                                            name: 'Шаблоны форм'
                                        },
                                        {
                                            id: 13,
                                            name: 'Сотрудники'
                                        },
                                        {
                                            id: 14,
                                            name: 'Транспортные средства'
                                        },
                                        {
                                            id: 15,
                                            name: 'Теги'
                                        },
                                        {
                                            id: 16,
                                            name: 'Настраиваемые поля в местах'
                                        },
                                    ],
                                }, ],
                            },
                            users_count: '1',
                            historyTimeValue: 'месяца',
                            numberValue: 3,
                        },
                    ],
                    headers: [{
                            text: 'Название роли',
                            value: 'role_name',
                        },
                        {
                            text: 'Доступные права',
                            value: 'availableRights',
                        },
                        {
                            text: 'Всего пользователей',
                            value: 'users_count',
                        },
                    ]
                }
            })
        }
    </script>
    <style>

    </style>

    <style scoped>
        ::v-deep .select-group .v-select__selection {
            font-size: 14px;
        }

        ::v-deep .table-garage tbody tr {
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
            position: absolute;
            right: 0;
            padding: 0 5px;
            margin-top: -18px !important;
            text-align: center;
            display: none;
        }

        ::v-deep tr.v-data-table__selected {
            background: #e2daff !important;
        }

        /*
    ::v-deep tr.v-data-table__selected .actions-column {
        display: block;
        background: #e2daff !important;
    }
    */
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

        .table-garage {
            height: 100%;
        }

        .table-cars {
            height: 100%;
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

        ::v-deep .v-slide-group__content {
            background-color: #505a64;

        }

        ::v-deep .v-tab.v-tab--active {
            background-color: white;
            color: black
        }

        ::v-deep .theme--light.v-tabs>.v-tabs-bar .v-tab:not(.v-tab--active) {
            color: white;
        }
        .pa-0white{
            overflow: auto;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            height: 100%;
        }
        .tracking-dev {
            font-size: 0.875rem;
            font-weight: 500;
            letter-spacing: 0.0892857143em;
            line-height: normal;
            text-transform: uppercase;
            padding-left: 10px
        }

        ::v-deep .v-treeview-node__root {
            min-height: 38px;
        }

        .role-add-actions {
            /* position: absolute */
        }

        .group-devices__color {
            height: 100%;
            width: 5px;
            position: absolute;
            left: 0px;
            top: 0;
        }

        ::v-deep .theme--light.v-data-table .v-row-group__header {
            background-color: #f0f0f3;
        }

        ::v-deep .theme--light.v-input--selection-controls.v-input--is-disabled:not(.v-input--indeterminate) .v-icon {
            color: #1976d2 !important;
        }

        .tab-height {
            height: 98%
        }

        ::v-deep .vm--modal {
            height: auto !important
        }

        ::v-deep .devices-selection-tree .v-treeview-node__toggle, 
        ::v-deep .devices-selection-tree .v-treeview-node__level {
            display: none
        }


        .access-page-tree {}

        .tab-height-role {
            height: calc(100% - 200px)
        }
    </style>