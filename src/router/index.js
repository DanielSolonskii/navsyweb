import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Home from '../views/Home'
import Login from "@/views/Login";

import TasksPage from "@/views/staff/TasksPage";
import StaffForms from "@/views/staff/StaffForms";
import ScheduledTasks from "@/views/staff/ScheduledTasks";
import Employee from "@/views/staff/Employee";
import Places from "@/views/staff/Places";
import Departments from "@/views/staff/Departments";

import VehiclesPage from "@/views/vehicles/VehiclesPage";
import Drivers from "@/views/vehicles/Drivers";
import DriversLog from "@/views/vehicles/DriversLog";
import ServiceTasks from "@/views/vehicles/ServiceTasks";
import Ecodriving from "@/views/vehicles/Ecodriving";

import CreateNewScheduledTask from "@/views/create/CreateNewScheduledTask";
import CreateNewTask from "@/views/create/CreateNewTask";
import Analytics from "@/views/Analytics";
import BIAnalytics from "@/views/BIAnalytics";
import TimeTable from "@/views/TimeTable";
import DispatcherPlug from "@/views/DispatcherPlug";

import EventControl from "@/views/EventControl";
import MonitoringPage from "@/views/MonitoringPage";
import ConfigurationDevices from "@/views/ConfigurationDevices";
import ReportPage from "@/views/ReportPage";
import GeozonePage from "@/views/GeozonePage";
import GaragePage from "@/views/GaragePage";
import StartPage from "@/views/StartPage";


import Access from "@/views/profileMenuPages/Access";
import Account from "@/views/profileMenuPages/Account";
import Balance from "@/views/profileMenuPages/Balance";
import Journal from "@/views/profileMenuPages/Journal";
import Tags from "@/views/profileMenuPages/Tags";

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import VCalendar from 'v-calendar';
import draggable from "vuedraggable";
import VModal from 'vue-js-modal';
import underscore from 'vue-underscore';
import Chat from 'vue-beautiful-chat'

Vue.use(VCalendar, {
    componentPrefix: 'vc',
});
Vue.use(ElementUI, {
    locale
})
Vue.use(draggable)

Vue.use(Chat)
Vue.use(Router);
Vue.use(VModal);
Vue.use(underscore);

let router = new Router({
    routes: [
        {
            path: '/bi-analytics',
            name: 'BIAnalytics',
            component: BIAnalytics,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/event-control',
            name: 'EventControl',
            component: EventControl,
            meta: {
                requiresAuth: true,
                heading: 'Контроль событий'
            }

        },
        {
            path: '/ecodriving',
            name: 'Ecodriving',
            component: Ecodriving,
            meta: {
                requiresAuth: true,
                heading: 'Диспетчер'
            }

        },
        {
            path: '/dispatcher',
            name: 'DispatcherPlug',
            component: DispatcherPlug,
            meta: {
                requiresAuth: true,
                heading: 'Диспетчер'
            }

        },
        {
            path: '/account',
            name: 'Account',
            component: Account,
            meta: {
                requiresAuth: true,
                heading: 'Аккаунт'
            }

        },
        {
            path: '/access',
            name: 'Access',
            component: Access,
            meta: {
                requiresAuth: true,
                heading: 'Доступ'
            }

        }, {
            path: '/balance',
            name: 'Balance',
            component: Balance,
            meta: {
                requiresAuth: true,
                heading: 'Баланс'
            }

        }, {
            path: '/journal',
            name: 'Journal',
            component: Journal,
            meta: {
                requiresAuth: true,
                heading: 'Журнал событий'
            }

        }, {
            path: '/tags',
            name: 'Tags',
            component: Tags,
            meta: {
                requiresAuth: true,
                heading: 'Теги'
            }

        },
        {
            path: '/service-tasks',
            name: 'ServiceTasks',
            component: ServiceTasks,
            meta: {
                requiresAuth: true,
                heading: 'Серивисные работы'
            }

        },
        {
            path: '/timetable',
            name: 'TimeTable',
            component: TimeTable,
            meta: {
                requiresAuth: true,
                heading: 'Расписание'
            }

        },
        {
            path: '/analytics',
            name: 'Analytics',
            component: Analytics,
            meta: {
                requiresAuth: true,
                heading: 'Аналитика'
            }

        },

        {
            path: '/departments',
            name: 'Departments',
            component: Departments,
            meta: {
                requiresAuth: true,
                heading: 'Отделы'
            }

        },
        {
            path: '/drivers-log',
            name: 'DriversLog',
            component: DriversLog,
            meta: {
                requiresAuth: true,
                heading: 'Журналд водителя'
            }

        },
        {
            path: '/drivers',
            name: 'Drivers',
            component: Drivers,
            meta: {
                requiresAuth: true,
                heading: 'Водители'
            }

        },
        {
            path: '/employees',
            name: 'Employee',
            component: Employee,
            meta: {
                requiresAuth: true,
                heading: 'Сотрудники'
            }
        },
        {
            path: '/start-page',
            name: 'StartPage',
            component: StartPage,
            meta: {
                requiresAuth: true,
                heading: 'Стартовая страница'
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
        },
        {
            path: '/staff-forms',
            name: 'StaffForms',
            component: StaffForms,
            meta: {
                requiresAuth: true,
                heading: 'Формы'
            }
        },
        {
            path: '/staff-places',
            name: 'Places',
            component: Places,
            meta: {
                requiresAuth: true,
                heading: 'Места'
            }
        },
        {
            path: '/monitoring',
            name: 'Monitoring',
            component: MonitoringPage,
            meta: {
                requiresAuth: true,
                heading: 'Мониторинг'
            }
        },
        {
            path: '/report',
            name: 'report',
            component: ReportPage,
            meta: {
                requiresAuth: true,
                heading: 'Отчёты'
            }
        },
        {
            path: '/vehicles',
            name: 'Vehicles',
            component: VehiclesPage,
            meta: {
                requiresAuth: true,
                heading: 'Транспортные средства'
            }
        },
        {
            path: '/schedules',
            name: 'Schedules',
            component: ScheduledTasks,
            meta: {
                requiresAuth: true,
                heading: 'Регулярные задания'
            }
        },
        {
            path: '/tasks',
            name: 'tasks',
            component: TasksPage,
            meta: {
                requiresAuth: true,
                heading: 'Управление сотрудниками'
            }
        },
        {
            path: '/geozone',
            name: 'Geozone',
            component: GeozonePage,
            meta: {
                requiresAuth: true,
                heading: 'Редактор геозон'
            }
        },
        {
            path: '/garage-page',
            name: 'Garage Page',
            component: GaragePage,
            meta: {
                requiresAuth: true,
                heading: 'none'
            }
        },
        {
            path: '/configuration',
            name: 'ConfigurationDevices',
            component: ConfigurationDevices,
            meta: {
                requiresAuth: true,
                heading: 'none'
            }
        },
        {
            path: '/create-new-scheduled-task',
            name: 'CreateNewScheduledTask',
            component: CreateNewScheduledTask,
            meta: {
                requiresAuth: true,
                heading: 'new task'
            }
        },
        {
            path: '/create-new-task',
            name: 'CreateNewTask',
            component: CreateNewTask,
            meta: {
                requiresAuth: true,
                heading: 'new task'
            }
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters['auth/isLoggedIn']) {
            next('/');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;