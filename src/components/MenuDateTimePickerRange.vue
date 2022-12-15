<template>
  <v-menu
      v-model="menuDateRangeFilter"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="650px"
  >
    <template v-slot:activator="{ on, attrs }">
      <div style="font-size: small">
        Временной интервал:
      </div>
      <v-text-field
          v-on="on" v-bind="attrs"
          dense
          outlined
          hide-details
          color="indigo darken-3"
          readonly
          class="mt-1"
          :value="dateRange | formatDisplayDateTimeRange"
      >
      </v-text-field>
    </template>
    <v-card>
      <v-row class="ma-0">
        <v-col
            style="min-width: 150px;max-width: 150px"
            class="grey darken-1 pa-1"
        >
          <v-btn
              text
              dark
              width="100%"
              class="justify-start px-3"
              @click="setYesterday()"
          >
            <strong style="text-transform: none; font-size: 12px">Вчера</strong>
          </v-btn>
          <v-btn
              text
              dark
              width="100%"
              class="justify-start px-3"
              @click="setLastWeek()"
          >
            <strong style="text-transform: none; font-size: 12px">Прошлая неделя</strong>
          </v-btn>
          <v-btn
              text
              dark
              width="100%"
              class="justify-start px-3"
              @click="setLastMonth()"
          >
            <strong style="text-transform: none; font-size: 12px">Прошлый месяц</strong>
          </v-btn>
          <v-divider></v-divider>
          <v-btn
              text
              dark
              width="100%"
              class="justify-start px-3"
              @click="setToday()"
          >
            <strong style="text-transform: none; font-size: 12px">Сегодня</strong>
          </v-btn>
          <v-btn
              text
              dark
              width="100%"
              class="justify-start px-3"
              @click="setCurrentWeek()"
          >
            <strong style="text-transform: none; font-size: 12px">Текущая неделя</strong>
          </v-btn>
          <v-btn
              text
              dark
              width="100%"
              class="justify-start px-3"
              @click="setCurrentMonth()"
          >
            <strong style="text-transform: none; font-size: 12px">Текущий месяц</strong>
          </v-btn>
          <v-divider></v-divider>
        </v-col>
        <v-col>
          <v-row class="ma-0" align="center">
            <div style="font-size: 14px"><strong>Выбранный период</strong></div>
            <v-btn
                small
                icon
                class="ml-auto"
                @click="menuDateRangeFilter = false"
            >
              <v-icon
              >
                mdi-close
              </v-icon>
            </v-btn>
          </v-row>
          <v-row class="ma-0">
            <v-date-picker
                v-model="computeDateRangeFilter"
                color="indigo"
                no-title
                scrollable
                range
                show-adjacent-months
                :picker-date.sync="pickerDateRangeFrom"
            >
            </v-date-picker>
            <v-date-picker
                v-model="computeDateRangeFilter"
                color="indigo"
                no-title
                scrollable
                range
                show-adjacent-months
                :picker-date.sync="pickerDateRangeTo"
            >
            </v-date-picker>
          </v-row>
          <v-row class="ma-0">
            <v-col class="pa-0">
              <v-row class="ma-0">
                <div style="font-size: small">

                </div>
                <v-select
                    v-model="computedHoursRangeFrom"
                    class="ml-auto mr-1"
                    style="max-width: 80px"
                    color="indigo"
                    hide-details
                    dense
                    outlined
                    :items="arrayHours"
                >
                </v-select>
                <span>:</span>
                <v-select
                    v-model="computedMinutesRangeFrom"
                    class="ml-1"
                    style="max-width: 80px"
                    color="indigo"
                    hide-details
                    dense
                    outlined
                    :items="arrayMinutes"
                >
                </v-select>
              </v-row>

            </v-col>
            <v-col class="pa-0">
              <v-row class="ma-0">
                <v-select
                    v-model="computedHoursRangeTo"
                    class="ml-auto mr-1"
                    style="max-width: 80px"
                    color="indigo"
                    hide-details
                    dense
                    outlined
                    :items="arrayHours"
                >
                </v-select>
                <span>:</span>
                <v-select
                    v-model="computedMinutesRangeTo"
                    class="ml-1"
                    style="max-width: 80px"
                    color="indigo"
                    hide-details
                    dense
                    outlined
                    :items="arrayMinutes"
                >
                </v-select>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="ma-0" align="center">
            <div style="font-size: small">
              Выбрано {{countDays}} дней
            </div>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script>
import moment from "moment";

export default {
  name: "MenuDateTimePickerRange",
  model: {
    prop: 'dateRange',
    event: 'change-date-range'
  },
  props: {
    dateRange: Array,
  },
  computed: {
    computedHoursRangeFrom: {
      get() {
        return moment(this.dateRange[0]).format('HH')
      },
      set(val) {
        this.$emit('change-date-range', [moment(this.dateRange[0]).hours(val).toDate(), this.dateRange[1]])
        return val
      }
    },
    computedHoursRangeTo: {
      get() {
        return moment(this.dateRange[1]).format('HH')
      },
      set(val) {
        this.$emit('change-date-range', [this.dateRange[0], moment(this.dateRange[1]).hours(val).toDate()])
        return val;
      }
    },
    computedMinutesRangeFrom: {
      get() {
        return moment(this.dateRange[0]).format('mm')
      },
      set(val) {
        this.$emit('change-date-range', [moment(this.dateRange[0]).minutes(val).toDate(), this.dateRange[1]])
        return val;
      }
    },
    computedMinutesRangeTo: {
      get() {
        return moment(this.dateRange[1]).format('mm')
      },
      set(val) {
        this.$emit('change-date-range', [this.dateRange[0], moment(this.dateRange[1]).minutes(val).toDate()])
        return val;
      }
    },
    computeDateRangeFilter: {
      get() {
        return [moment(this.dateRange[0]).format('YYYY-MM-DD'),
          moment(this.dateRange[1]).format('YYYY-MM-DD')]
      },
      set([start]) {
        let from = moment(start).hours(this.computedHoursRangeFrom).minutes(this.computedMinutesRangeFrom).toDate();
        let to = moment(start).hours(this.computedHoursRangeTo).minutes(this.computedMinutesRangeTo).toDate();
        if (!this.dateRange[1] || moment(this.dateRange[0]).format('YYYY-MM-DD') !== moment(this.dateRange[1]).format('YYYY-MM-DD')) {
          this.$emit('change-date-range', [from, to]);
        } else {
          if (+this.dateRange[0] > +to) {
            this.$emit('change-date-range', [from, this.dateRange[0]]);
          } else {
            this.$emit('change-date-range', [this.dateRange[0], to]);
          }
        }

      },
    },
  },
  watch: {
    pickerDateRangeTo(val) {
      if (val === this.pickerDateRangeFrom)
        this.pickerDateRangeFrom = moment(val).add(-1, 'months').format('YYYY-MM')
    },
    pickerDateRangeFrom(val) {
      if (val === this.pickerDateRangeTo)
        this.pickerDateRangeTo = moment(val).add(1, 'months').format('YYYY-MM')
    },
    dateRange(val) {
      if (val[0] && val[1])
        this.countDays = Math.abs(moment(this.dateRange[1]).diff(this.dateRange[0], 'day')) + 1
    }
  },
  methods: {
    setLastMonth() {
      this.$emit('change-date-range', [
        moment().add(-1, 'month').startOf('month').hours(0).minutes(0).seconds(0).toDate(),
        moment().add(-1, 'month').endOf('month').hours(23).minutes(59).seconds(59).toDate()
      ])
    },
    setLastWeek() {
      this.$emit('change-date-range', [
        moment().add(-1, 'week').days(0).hours(0).minutes(0).seconds(0).toDate(),
        moment().add(-1, 'week').days(6).hours(23).minutes(59).seconds(59).toDate()
      ])
    },
    setYesterday() {
      this.$emit('change-date-range', [
        moment().add(-1, 'day').hours(0).minutes(0).seconds(0).toDate(),
        moment().add(-1, 'day').hours(23).minutes(59).seconds(59).toDate()
      ])
    },
    setToday() {
      this.$emit('change-date-range', [
        moment().hours(0).minutes(0).seconds(0).toDate(),
        moment().toDate()
      ])
    },
    setCurrentWeek() {
      this.$emit('change-date-range', [
        moment().days(0).hours(0).minutes(0).seconds(0).toDate(),
        moment().toDate()
      ])
    },
    setCurrentMonth() {
      this.$emit('change-date-range', [
        moment().date(1).hours(0).minutes(0).seconds(0).toDate(),
        moment().toDate()
      ])
    }
  },
  data: () => ({
    menuDateRangeFilter: false,
    countDays: 0,
    pickerDateRangeFrom: null,
    pickerDateRangeTo: null,
    arrayHours: Array.from({length: 24}, (v, k) => {
      return moment().hours(k).format('HH')
    }),
    arrayMinutes: Array.from({length: 60}, (v, k) => {
      return moment().minutes(k).format('mm')
    })
  })
}
</script>

<style scoped>
::v-deep .v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot {
  min-height: 28px;
  max-height: 28px;
}
::v-deep .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
  margin: 2px;
}
</style>