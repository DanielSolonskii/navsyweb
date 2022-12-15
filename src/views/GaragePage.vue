<template>
  <v-container class="pa-0 h-100">
    <v-row class="h-100 ma-0">
      <v-col class="d-flex flex-column h-100 cars_view" :class="{'hide': selectedCar}">
        <v-row>
          <v-col>
            <v-text-field
                v-model="searchCar"
                label="Поиск машины"
                prepend-icon="mdi-magnify"
                dense
                single-line
                hide-details
                clearable
                clear-icon="mdi-close"
                style="max-width: 320px"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row
            style="min-height: 0"
            class="overflow-y-auto mb-1"
        >
          <div

              class="text-center py-2 w-100">
            <v-progress-linear
                v-if="loadingListCars"
                indeterminate
                color="primary"
            ></v-progress-linear>
          </div>
          <v-col
              v-for="item in cars"
              :key="item.id"
              cols="12"
              sm="4"
              md="6"
              lg="4"
          >
            <v-card class="fill-height rounded-br-2"
                    :class="selectedCar && selectedCar.id === item.id  ? 'amber accent-1' : ''"
                    @click="selectedCar && selectedCar.id === item.id  ? selectedCar = null :  selectedCar = item"
            >
              <v-card-text>
                {{item.name}}
              </v-card-text>
              <v-card-text>
                <div class="rounded-circle grey darken-2 d-flex justify-center"
                     style="width: 36px; height: 36px">
                  <v-icon  color="white">
                    mdi-car
                  </v-icon>
                </div>
              </v-card-text>

              <v-card-title>{{item.gosNumber}}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="d-none d-md-block car_property_view" :class="{'show': selectedCar}">
        <v-card v-if="selectedCar" class="h-100 pb-0">
          <v-col class="d-md-none" cols="2">
            <v-btn
                icon
                color="blue darken-3"
                @click="selectedCar = null"
            >
              <v-icon>
                mdi-chevron-left
              </v-icon>
            </v-btn>
          </v-col>

          <v-col>
            <div class="text-h6" >Свойства {{selectedCar.name}}</div>
          </v-col>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import HttpClient from "@/api";

export default {
  name: "GaragePage",
  methods: {
    loadCars() {
      this.loadingListCars = true;
      return HttpClient.api.getCar()
          .then(response => {
            this.cars = response.data.data;
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
  },
  created() {
    this.loadCars()
  },
  data: () => ({
    searchCar: '',
    selectedCar: null,
    cars: [],
    loadingListCars: false,
  })
}
</script>

<style scoped>
@media (max-width: 960px) {
  .cars_view.hide {
    display: none!important;
  }
  .car_property_view.show {
    display: block!important;
  }
}

</style>
