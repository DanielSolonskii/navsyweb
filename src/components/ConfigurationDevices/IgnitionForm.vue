<template>
 <div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="px-0 py-1 mt-1">
        <div style="font-size: small;">
          <strong>Определять зажигание по:</strong>
        </div>
        <v-select
             v-model="selectedDevice.ignition_id"
            :items="ignition_by"
             item-value="id"
             dense
             hide-details
             item-color="indigo darken-2"

         >
         </v-select>
        </v-col>
     <div v-show="selectedDevice.ignition_id === 1">
       <v-row class="ma-0">
          <v-col cols="2" class="pa-0" align-self="center">
        <div style="font-size: small;">
         От:
        </div>
      </v-col>
        <v-col cols="4" class="px-0 py-1">
           <v-text-field
            v-model="selectedDevice.ignition_min_v"
            dense
            hide-details
            type="number"
            color="indigo darken-2"
            suffix=" В"
        >
        </v-text-field>
        </v-col>
      <v-col cols="6"></v-col>
      <v-col cols="2" class="pa-0" align-self="center">
        <div style="font-size: small;">
         До:
        </div>
      </v-col>
        <v-col cols="4" class="px-0 py-1">
           <v-text-field
            v-model="selectedDevice.ignition_max_v"
            dense
            hide-details
            type="number"
            color="indigo darken-3"
            suffix=" В"
        >
        </v-text-field>
        </v-col>
      <v-col cols="6"></v-col>

       </v-row>
             </div>



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
  name: "IgnitionForm",
  props: {
    selectedDevice: Object
  },
  data: () => ({
    ignition_by: [
      {
        id: 1, text: 'Напряжение бортовой сети'
      },
        {
        id: 2, text: 'Состояние дискретного выхода'
      },
        {
        id: 3, text: 'Движению'
      },
    ]
  })

}
</script>

<style scoped>

</style>