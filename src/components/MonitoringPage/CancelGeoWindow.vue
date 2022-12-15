<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card class="pa-6">
      <v-card-text>Отменить несохраненные изменения или продолжить редактирование?</v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn plain @click.stop="toggleEditGeo('cancel')">Отменить</v-btn>
        <v-btn plain class="ml-2" @click.stop="toggleEditGeo('edit')" color="primary">Редактировать</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      value: Boolean
    },
    data() {
      return {
        closeDatePicker: false,
      }
    },
    computed: {
      show: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('input', value)
        }
      },
    },
    // mounted() {
    //   this.$root.$on("closeDatePicker", (data) => {
    //     this.closeDatePicker = data
    //   })
    // },
    methods: {
      toggleEditGeo: function (toggleEdit) {
        this.$root.$emit("toggleEditGeo", toggleEdit);
        // trackersListDetailed.list.tracker_id
        // console.log('About $root.$emit', toggleEdit)
        if (toggleEdit) {
          this.show = false
        }
      }
    }
  }
</script>