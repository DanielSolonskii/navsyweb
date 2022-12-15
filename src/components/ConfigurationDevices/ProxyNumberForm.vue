<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="px-0 py-1">
        <v-row class="ma-0">
          <v-btn
              x-small
              fab
              dark
              color="indigo darken-2"
              class="ml-auto"
              @click="selectedDevice.proxy_numbers.push('')"
          >
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="12"
          class="pa-0"
          v-for="(number, index) in selectedDevice.proxy_numbers"
          :key="index"
      >
        <v-row class="ma-0">
          <v-col class="py-1">
            <v-text-field
                dense
                outlined
                hide-details
                :value="number"
            >
            </v-text-field>
          </v-col>
          <v-col style="max-width: 32px" class="px-0 py-1" align-self="center">
            <v-btn
                x-small
                fab
                dark
                class="mx-auto"
                color="indigo darken-2"
                @click="selectedDevice.proxy_numbers.splice(index, 1)"
            >
              <v-icon>
                mdi-minus
              </v-icon>
            </v-btn>
          </v-col>
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
  name: "ProxyNumberForm",
  props: {
    selectedDevice: Object
  },
}
</script>

<style scoped>

</style>