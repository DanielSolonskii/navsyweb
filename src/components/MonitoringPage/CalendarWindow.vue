<template>
  <v-dialog v-model="show">
    <VDatePicker />
  </v-dialog>
</template>

<script>
  import VDatePicker from '@/components/VDatePicker';
  export default {
    props: {
      value: Boolean
    },
    components: {
      VDatePicker,
    },
    mounted() {
      this.$root.$on("show-history", (data) => {
        this.closeDatePicker = data
        this.show = false
      })
    },
    computed: {
      show: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('input', value)
        }
      }
    }
  }
</script>
<style scoped>
  .v-dialog.v-dialog--active {
    height: 100%;
    width: 100%
  }
</style>