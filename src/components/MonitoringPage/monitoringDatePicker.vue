<template>
  <!--
  <v-menu
      v-model="menuDateRangeFilter"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="650px"
  >
  -->
  <v-dialog v-model="dialog" width="800">
    <template v-slot:activator="{ on, attrs }">
      <v-btn fab color="primary" class="history-btn">
        <v-icon v-bind="attrs" v-on="on">mdi-history</v-icon>
      </v-btn>

    </template>
    <v-card>
      <div style="font-weight: bold;
    padding: 19px 24px 17px;">
        Выберите период
        <v-btn icon style="float: right; transform: translateY(-7px)">
          <v-icon @click="dialog = false">
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <!-- 
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
      -->

      <v-row class="ma-0">
        <v-col style="min-width: 150px;max-width: 150px" class=" pa-1">
          <v-btn text width="100%" class="justify-start px-3" @click="setYesterday()">
            <span style="text-transform: none; font-size: 12px; font-weight: 100">Вчера</span>
          </v-btn>
          <v-btn text width="100%" class="justify-start px-3" @click="setLastWeek()">
            <span style="text-transform: none; font-size: 12px; font-weight: 100">Прошлая неделя</span>
          </v-btn>
          <v-btn text width="100%" class="justify-start px-3" @click="setLastMonth()">
            <span style="text-transform: none; font-size: 12px; font-weight: 100">Прошлый месяц</span>
          </v-btn>
          <v-divider></v-divider>
          <v-btn text width="100%" class="justify-start px-3" @click="setToday()">
            <span style="text-transform: none; font-size: 12px; font-weight: 100">Сегодня</span>
          </v-btn>
          <v-btn text width="100%" class="justify-start px-3" @click="setCurrentWeek()">
            <span style="text-transform: none; font-size: 12px; font-weight: 100">Текущая неделя</span>
          </v-btn>
          <v-btn text width="100%" class="justify-start px-3" @click="setCurrentMonth()">
            <span style="text-transform: none; font-size: 12px; font-weight: 100">Текущий месяц</span>
          </v-btn>
          <v-divider></v-divider>
        </v-col>
        <v-col>
          <!--
          <v-row class="ma-0" align="center">

            <v-btn small icon class="ml-auto" @click="menuDateRangeFilter = false">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-row>
          -->
          <v-row class="ma-0" style="max-width: 560px">
            <v-col class="pa-0">
              <v-row class="ma-0" >
                <div style="font-size: small">

                </div>
                <v-select v-model="computedHoursRangeFrom" class="ml-auto mr-1" style="max-width: 80px" color="indigo"
                  hide-details dense outlined :items="arrayHours">
                </v-select>
                <span>:</span>
                <v-select v-model="computedMinutesRangeFrom" class="ml-1" style="max-width: 80px" color="indigo"
                  hide-details dense outlined :items="arrayMinutes">
                </v-select>
              </v-row>

            </v-col>
            <v-col class="pa-0">
              <v-row class="ma-0">
                <v-select v-model="computedHoursRangeTo" class="ml-auto mr-1" style="max-width: 80px" color="indigo"
                  hide-details dense outlined :items="arrayHours">
                </v-select>
                <span>:</span>
                <v-select v-model="computedMinutesRangeTo" class="ml-1" style="max-width: 80px" color="indigo"
                  hide-details dense outlined :items="arrayMinutes">
                </v-select>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="ma-0">
            <v-date-picker v-model="computeDateRangeFilter" color="primary" no-title scrollable range
              show-adjacent-months :picker-date.sync="pickerDateRangeFrom">
            </v-date-picker>
            <v-date-picker v-model="computeDateRangeFilter" color="primary" no-title scrollable range
              show-adjacent-months :picker-date.sync="pickerDateRangeTo">
            </v-date-picker>
          </v-row>

          <div class="ma-0 date-card-actions">
            <div style="font-size: small">
              Выбрано {{countDays}} дней
            </div>
            <div>
              <v-btn color="primary lighten-2" text @click="dialog = false">
                Выбрать
              </v-btn>
              <v-btn color="black lighten-2" text @click="dialog = false">
                Отмена
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

    </v-card>
  </v-dialog>
  <!-- 
  </v-menu>
  -->
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
            moment(this.dateRange[1]).format('YYYY-MM-DD')
          ]
        },
        set([start]) {
          let from = moment(start).hours(this.computedHoursRangeFrom).minutes(this.computedMinutesRangeFrom).toDate();
          let to = moment(start).hours(this.computedHoursRangeTo).minutes(this.computedMinutesRangeTo).toDate();
          if (!this.dateRange[1] || moment(this.dateRange[0]).format('YYYY-MM-DD') !== moment(this.dateRange[1])
            .format('YYYY-MM-DD')) {
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
      dialog: false,
      menuDateRangeFilter: false,
      countDays: 0,
      pickerDateRangeFrom: null,
      pickerDateRangeTo: null,
      arrayHours: Array.from({
        length: 24
      }, (v, k) => {
        return moment().hours(k).format('HH')
      }),
      arrayMinutes: Array.from({
        length: 60
      }, (v, k) => {
        return moment().minutes(k).format('mm')
      })
    })
  }
</script>

<style scoped>
.date-card-actions{
display: flex; align-items: center; justify-content: space-between
}
  ::v-deep .v-text-field--outlined.v-input--dense.v-text-field--outlined>.v-input__control>.v-input__slot {
    min-height: 28px;
    max-height: 28px;
  }

  ::v-deep .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
    margin: 2px;


  }

  .history-btn {
    margin-bottom: 20px;
    margin-top: 20px;
    margin-right: 16px
  }

  ::v-deep .v-btn:before {
    background-color: inherit !important;
  }

  ::v-deep .v-date-picker-table .v-btn.v-btn--active {
    color: #FFFFFF !important;
  }

  ::v-deep .v-btn--rounded {
    border-radius: 0
  }
</style>