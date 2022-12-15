<template>
  <v-dialog v-model="show">
    <VDatePicker />
  </v-dialog>
</template>

<script>
  import VDatePicker from '@/components/TasksPage/VDatePicker';
  export default {
    props: {
      value: Boolean
    },
    components: {
      VDatePicker,
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

  ::v-deep .v-dialog.v-dialog--active{
    /* margin: 294px */
    max-width: 760px
  }

  ::v-deep .mx-input-wrapper{
    max-width: 80px
  }
</style>