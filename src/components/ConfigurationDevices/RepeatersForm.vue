<template>
<div class="d-flex flex-column" style="height: 100%">
    <v-row class="overflow-auto ma-0 pa-2" align-content="start" style="min-height: 0">
      <v-col cols="12" class="px-0 py-1 mt-2">
        <v-row class="ma-0">
          <v-btn
            small
            dark
            color="indigo darken-3"
            class="mx-auto"
          >
          Управлять ретрансляторами
        </v-btn>
        </v-row>

        <v-row class="ma-0 mt-2 overflow-auto" style="height: 150px">
          <v-list
             dense
              width="100%"
              style="border: #3f51b5 1px solid"
          >
            <v-list-item-group
              color="indigo darken-3"
            >
              <v-list-item
                v-for="(repeater, i) in retranslations"
                :key="i"
                :value="repeater.id"
              >
                <v-list-item-content>
                {{repeater.text}}
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
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
  name: "RepeaterForm",
  props: {
    selectedDevice: Object
  },
   data: () => ({
     retranslations: []
   })
}
</script>

<style scoped>

</style>