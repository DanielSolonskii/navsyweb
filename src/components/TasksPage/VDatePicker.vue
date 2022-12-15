<template>
  <div class="box">
    <div class="date-picker-header">
      <h2 class="date-picker-header-h2">Выберите период</h2>
      <v-icon @click="closeDatePicker(true)" class="mr-3">mdi-close</v-icon>
    </div>
    <section class="picker-wrapper">
      <template>
        <div class="date-picker-shortcut-wrapper">
          <div class="date-picker-top">
            <button class="mx-btn mx-btn-text" @click="selectYesterday(emit)">
              Вчера
            </button>
            <button class="mx-btn mx-btn-text" @click="selectWeekAgo(emit)">
              Прошлая неделя
            </button>
            <button class="mx-btn mx-btn-text date-picker-top-last-btn" @click="selectCurrentWeek(emit)">
              Прошлый месяц
            </button>
          </div>
          <div class="date-picker-bottom">
            <button class="mx-btn mx-btn-text" @click="selectToday(emit)">
              Сегодня
            </button>
            <button class="mx-btn mx-btn-text" @click="selectWeek(emit)">
              Текущая неделя
            </button>
            <button class="mx-btn mx-btn-text" @click="selectLatestMonth(emit)">
              Текущий месяц
            </button>
          </div>
        </div>
      </template>
      <v-form @submit="onSubmit">
        <!--
        <div class="d-flex justify-space-between">
          <h2 class="pb-2 mr-auto">Выберите период</h2>
        </div>
        -->
        <div class="time-pickers">
          <div class="date-show">{{ this.dateStart }}</div>
          <date-picker @change="checkTimeStart" v-model="dateFilter[0]" :time-picker-options="{
        start: '00:00',
        step: '00:15',
        end: '23:59',
      }" format="HH:mm" type="time"></date-picker>
          <div class="date-show">{{ this.dateEnd }}</div>
          <date-picker v-model="dateFilter[1]" :time-picker-options="{
        start: '00:00',
        step: '00:15',
        end: '23:59',
      }" format="HH:mm" type="time"></date-picker>
        </div>
        <div class="d-flex flex-column picker-wrapper">
          <date-picker inline v-model="dateFilter" type="datetime" placeholder="Select datetime range" range
            :show-time-panel="showTimeRangePanel" @close="handleRangeClose">

            <template v-slot:footer>
              <button class="mx-btn mx-btn-text" @click="toggleTimeRangePanel">
                {{ showTimeRangePanel ? 'Выбрать дату' : 'Выбрать время' }}
              </button>
            </template>
          </date-picker>
          <div class="d-flex">
            <div style="margin-left: auto">
              <v-btn @click="this.showTimeRangePanel = false" plain type="submit" variant="primary">Выбрать</v-btn>
              <v-btn @click="cancelDateSelection" plain variant="primary">Отмена</v-btn>
            </div>
          </div>
        </div>
      </v-form>
    </section>
  </div>
</template>

<script>
  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/locale/ru';
  import 'vue2-datepicker/index.css';
  import moment from 'moment';

  // const {
  //   CalendarPanel,
  //   TimePanel
  // } = DatePicker;
  export default {
    components: {
      DatePicker,
      // CalendarPanel,
      // TimePanel
    },
    name: 'Range',
    data() {
      return {
        passDateStart: 0,
        passDateEnd: 0,
        value: null,
        dateStart: '',
        dateEnd: '',
        timeStart: null,
        timeEnd: null,
        showTimePanel: false,
        showTimeRangePanel: false,
        shortcuts: [{
            text: 'Вчера',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: 'Сегодня',
            onClick() {
              const date = new Date();
              date.setTime(date);
              return date;
            }
          }, {
            text: 'Последние 3 месяца',
            onClick() {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              return date;
            }
          },
        ],
        dateFilter: '',
        notBefore: moment().add(1, 'days'),
      };
    },
    computed: {
      // notAfter() {
      // console.log(moment(this.dateFilter[0]).add(14, 'days'))
      // return moment(this.dateFilter[0]).add(14, 'days');
      // return moment(String(this.dateFilter)).format('MM/DD/YYYY hh:mm')
      // }
    },
    // mounted() {
    //   console.log(moment().format('YYYY-MM-DD'));
    // this.$refs.datepicker.click()

    // },
    mounted() {
      this.$nextTick(() => {
        // this.$refs.datepicker.popupVisible = true
        // if 
        // if (this.dateFilter[0] == null) {
        //   this.dateFilter[0] = '';
        // }

        // if (this.dateFilter[1] == null) {
        //   this.dateFilter[1] = '';
        // }
        // dateFilter[1]
      })
    },
    methods: {
      closeDatePicker: function (value) {
        this.$root.$emit("closeDatePicker", value);
        // trackersListDetailed.list.tracker_id
      },
      selectDate: function (dateFilter) {
        this.$root.$emit("selectDate", dateFilter);
      },
      selectWeekAgo(emit) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        const date = [start, end];
        emit(date)
        // test
        var d = new Date();

        // set to Monday of this week
        d.setDate(d.getDate() - (d.getDay() + 6) % 7);

        // set to previous Monday
        d.setDate(d.getDate() - 7);

        // create new date of day before
        var sunday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
        console.log(sunday)
        // test
      },
      selectWeek(emit) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        const date = [start, end];
        emit(date)
      },
      selectCurrentWeek(emit) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        const date = [start, end];
        emit(date)
      },
      selectLatestMonth(emit) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        const date = [start, end];
        emit(date);
      },
      selectToday(emit) {
        const end = new Date();
        const start = new Date();
        const date = [start, end];
        emit(date);
      },
      selectYesterday(emit) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
        const date = [start, end];
        emit(date);
      },
      // selectWeekAgo(emit) {
      //   const end = new Date();
      //   const start = new Date();
      //   start.setTime(start.getTime() - 3600 * 1000 * 7);
      //   const date = [start, end];
      //   emit(date);
      // },
      checkTimeStart() {
        console.log(this.timeStart)
      },
      cancelDateSelection() {
        this.dateFilter = ''
        console.log(this.dateFilter)
        this.showTimeRangePanel = false
      },
      onSubmit(evt) {
        this.passDateStart = moment(this.dateFilter[0]).milliseconds(0)
        this.passDateEnd = moment(this.dateFilter[1]).milliseconds(0)
        this.selectDate([this.passDateStart, this.passDateEnd])
        evt.preventDefault()
        this.closeDatePicker(true)

      },
      changeDate(n) {
        console.log(['input: ', n]);
      },
      change(a) {
        console.log(['change: ', a]);
      },
      consoleTest(e) {
        console.log(e)
      },
      toggleTimePanel() {
        this.showTimePanel = !this.showTimePanel;
      },
      toggleTimeRangePanel() {
        this.showTimeRangePanel = !this.showTimeRangePanel;
      },
      handleOpenChange() {
        this.showTimePanel = false;
      },
      handleRangeClose() {
        this.showTimeRangePanel = false;
      },
      dateFormatStartMoment() {
        this.dateStart = this.dateFilter[0].format('MM.DD.YYYY');
        this.dateEnd = this.dateFilter[1].format('MM.DD.YYYY');
      }
    },
    watch: {
      dateFilter(val) {
        // console.log(moment(val[0]).format('MM/DD/YYYY'))
        this.dateStart = moment(val[0]).format('DD.MM.YYYY')
        this.dateEnd = moment(val[1]).format('DD.MM.YYYY')
      }
    }
  };
</script>
<style scoped>
  .picker-wrapper .mx-btn {
    margin-top: 10px
  }

  .picker-wrapper {
    background-color: white;
    display: flex;
    position: relative;
  }

  .time-pickers {
    display: flex;
    align-items: center;
padding-bottom: 10px;
    padding-top: 10px;
    justify-content: space-around;
  }

  .date-show {
    margin-right: 10px;
    margin-left: 10px;
  }

  .v-dialog.v-dialog--active {
    height: auto !important;
    width: 735px !important
  }

  .date-picker-shortcut-wrapper {
    text-align: left;
    display: flex;
    flex-direction: column;

    margin-right: 30px;
    margin-left: 30px;
    position: relative
  }

  .mx-input {
    max-width: 80px
  }

  .picker-wrapper .v-form {
    border-left: 1px solid rgba(0, 0, 0, 0.08);
  }

  .date-picker-top-last-btn {
    position: relative
  }

  .date-picker-top-last-btn::after {
    content: '';
    display: block;
    position: absolute;
    bottom: -22px;
    left: 10px;
    right: 0;
    width: 100%;
    border-bottom: 1px solid;
    border-bottom-color: rgba(0, 0, 0, 0.08);

  }

  .mx-range-wrapper {
    width: 521px
  }

  .date-picker-bottom {
    padding-top: 30px;
    display: flex;
    flex-direction: column;
  }

  .date-picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    border-bottom: 1px solid;
    border-bottom-color: rgba(0, 0, 0, 0.08);
  }

  .date-picker-header-h2 {
    padding: 19px 24px 17px;
    font-size: 18px
  }

  .date-picker-top {
    display: flex;
    flex-direction: column
  }

  .mx-datepicker {
    width: auto
  }

  .mx-time-header-title {
    margin-top: 0 !important
  }

  .mx-range-wrapper,
  .mx-calendar-header-label button {
    color: black
  }

  .mx-datepicker .cell.active {}

  .mx-datepicker-main {
    border: none
  }

  .mx-calendar+.mx-calendar {
    border: none
  }

  .mx-datepicker-footer {
    border: none
  }

  .mx-calendar-header {
    margin-bottom: 10px
  }

  .mx-calendar {
    padding-top: 0
  }

  /*
  .mx-datepicker-content {
    display: flex
  }

  .mx-datepicker-sidebar {
    width: 160px
  }

  .mx-datepicker-sidebar+.mx-datepicker-content {
    margin-left: 160px
  }

  */
</style>