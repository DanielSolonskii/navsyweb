const layout = {
  state: {
    menu: {
      subSystemsMenu: [{
        icon: 'mdi-cellphone-arrow-down',
        text: 'НАВСИ.ДУС',
        to: '/start-page',
      }
      , {
        icon: 'mdi-cellphone-arrow-down',
        text: 'НАВСИ.МОН',
        to: '/'
      }, {
        icon: 'mdi-cellphone-arrow-down',
        text: 'НАВСИ.МЕД',
        to: '/'
      }, {
        icon: 'mdi-cellphone-arrow-down',
        text: 'НАВСИ.ЖКС',
        to: '/navsy-gks'
      }, 
      {
        icon: 'mdi-cellphone-arrow-down',
        text: 'НАВСИ.АДМИН',
        to: '/navsy-gks'
      }, 
      {
        icon: 'mdi-cellphone-arrow-down',
        text: 'НАВСИ.БИЛЛ',
        to: '/navsy-gks'
      },
     ],
      mainMenu: [{
          icon: 'mdi-web',
          text: 'Мониторинг',
          to: '/monitoring'
        },
        {
          icon: 'mdi-chart-box',
          text: 'Отчёты',
          to: '/report',
          subLinks: [{
            text: 'Расписание',
            to: '/timetable',
          }, ]
        },
        {
          icon: 'mdi-map-marker-check',
          text: 'Управление сотрудниками',
          to: '/tasks',
          subLinks: [{
              text: 'Задания',
            },
            {
              text: 'Регулярные задания',
              to: '/schedules',
            },
            {
              text: 'Формы',
              to: '/staff-forms',
            },
            {
              text: 'Места',
              to: '/staff-places',
            },
            {
              text: 'Сотрудники',
              to: '/employees',
            },
            {
              text: 'Отделы',
              to: '/departments/',
            },
            {
              text: 'Диспетчер',
              to: '/dispatcher',
            },
            {
              text: 'Расширенная аналитика',
              to: '/analytics',
            },
          ]
        },
        {
          icon: 'mdi-car',
          text: 'Управление транспортом',
          to: '/vehicles/',
          subLinks: [{
              text: 'Водители',
              to: '/drivers',
            },
            {
              text: 'Журнал водителя',
              to: '/drivers-log',
            },
            {
              text: 'Качество вождения',
              to: '/ecodriving',
            },
            {
              text: 'Техобслуживание',
              to: '/service-tasks',
            },
          ]
        },
        {
          icon: 'mdi-puzzle',
          text: 'Приложения',
          to: '/report',
          subLinks: [{
            text: 'BI-Аналитика',
            to: '/bi-analytics',
          }, ]
        },
      ],
      profileMenu: [{
          title: 'Доступ',
          to: '/access',
          icon: 'mdi-lock-open-variant-outline'
        },
        {
          title: 'Аккаунт',
          to: '/account',
          icon: 'mdi-account'
        },
        {
          title: 'Баланс',
          to: '/balance',
          icon: 'mdi-currency-rub'
        },
        // {
        //   title: 'Настраиваемые поля',
      
        // },
        {
          title: 'Журнал действий',
          to: '/journal',
          icon: 'mdi-calendar-text-outline'
        },
        // {
        //   title: 'Плагины'
        // },
        {
          title: 'Теги',
          to: '/tags',
          icon: 'mdi-tag'
        },
      ],
      linksBottom: [{
          icon: 'mdi-cellphone-arrow-down',
          text: 'Активация устройства',
          to: '/'
        },
        {
          icon: 'mdi-message-text',
          text: 'Сообщения',
          to: '/messages'
        },
        {
          icon: 'mdi-bell',
          text: 'Контроль событий',
          to: '/event-control'
        },
        {
          icon: 'mdi-cog',
          text: 'Управление устройствами',
          to: '/configuration'
        },
        {
          icon: 'mdi-help-circle',
          text: 'Помощь',
          to: '/'
        },
      ],
    },
  },
  mutations: {},
  getters: {
    getMenu: state => state.menu
  },
}

export default layout