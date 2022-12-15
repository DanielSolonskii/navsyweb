<template>
  <v-col style="max-width: 340px; min-width: 340px;">
    <v-card
        width="100%"
        height="320"
        class="relative transparent overflow-hidden"
        flat>
      <v-expand-transition>
        <v-card
            v-show="com_show_cover"
            height="100%"
            width="100%"
            class="cover-form my-auto pa-4"
            @click="com_show_cover = false"
            dark
        >
          <v-icon
           class="cover-form__icon"
          >
            {{icon_cover}}
          </v-icon>
          <div class="font-weight-bold px-4 mt-4" style="font-size: large;">
            {{title}}
          </div>
          <div class="px-6">
            <slot name="subtitle"></slot>
          </div>

        </v-card>
      </v-expand-transition>
      <v-card
          class="d-flex flex-column absolute-box"
      >
        <v-toolbar
            dense
            dark
            color="indigo darken-3"
            height="40px"
            max-height="40px"
        >
          <div
              style="font-size: medium; text-overflow: ellipsis; white-space: nowrap;"
              class="font-weight-bold overflow-hidden">
            {{title}}
          </div>
          <v-spacer></v-spacer>
          <v-tooltip  v-if="help" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon

                  right
                  small
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-help
              </v-icon>
            </template>
            <span>{{help}}</span>
          </v-tooltip>
          <v-icon
              v-if="copy_setting"
              right
              small
          >
            mdi-content-copy
          </v-icon>
          <v-icon
              right
              small
              @click="com_show_cover = true"
          >
            mdi-arrow-collapse
          </v-icon>
        </v-toolbar>
        <v-container
            class="pa-0"
            fluid style="height: calc(100% - 40px)"
        >
          <slot name="form"></slot>
        </v-container>
      </v-card>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "BoxFormSetting",
  props: {
    show_cover: Boolean,
    title: String,
    icon_cover: String,
    copy_setting: Boolean,
    help: String,
  },
  computed: {
    com_show_cover: {
      get() {

        return this.show_cover;
      },
      set(value) {
        this.$emit('change-show-cover', value)
        return value;
      }
    }
  }

}
</script>

<style scoped>
::v-deep .v-text-field .v-input__control .v-input__slot .v-text-field__slot input{
  font-size: 13px;
}
::v-deep .v-input__slot .v-select__slot{
  font-size: 13px;
}
::v-deep .v-input__control label{
  font-size: 14px;
}
.cover-form {
  z-index: 3;
  background: #666c75;
  color: white;

}
.cover-form:hover {
  background: #283593;
}
.cover-form:hover .cover-form__icon {
  font-size: 180px;
}
.cover-form__icon {
  color: #ffffff;
  opacity: 0.4;
  position: absolute;
  font-size: 130px;
  right: -0px;
  top:-0px;
}
</style>