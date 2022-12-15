<template>
    <main class="main-screen__content">
        <div class="v-bar-scrollable">
            <div class="dashboard">
                <div class="layout row wrap pa-2 dashboard__cards">
                    <div
                        class="flex panel-layout panel-layout__size-2 lg12 md12 sm12 hidden-xs-only caption-panel text-xs-center dashboard__card">
                        <div class="caption-panel__caption display-1 mb-0" style="color: rgb(238, 238, 238);">Наблюдайте
                            полную картину
                        </div>
                    </div>
                    <div class="flex  panel-layout__size-2 xl4 lg4 md4 sm12 xs12 summary-panel__wrapper monitor-panel dashboard__card"
                        @mouseover="monitoringPanelHovered = true" @mouseleave="monitoringPanelHovered = false">
                        <div class="v-card v-sheet theme--light elevation-2 summary-panel summary-panel__visible">
                            <div class="v-responsive" style="height: 181px;">
                                <div class="v-responsive__content">
                                    <div class="presentation">
                                        <div class="presentation-container presentation-container-monitoring"
                                            :class="{'move-monitoring-background': monitoringPanelHovered}">
                                        </div>
                                        <div v-if="!monitoringPanelHovered" class="presentation-inner"></div>
                                        <div v-if="monitoringPanelHovered" class="presentation-inner-pulse"></div>

                                    </div>
                                </div>
                            </div>
                            <div class="v-card__title v-card__title--primary">
                                <div class="summary-panel__navigation">
                                    <h3 class="summary-panel__navigation-title"><a href="#" @click="$router.push('monitoring')"
                                            class="summary-panel__link">Мониторинг</a></h3>
                                    <div class="summary-panel__description">Наблюдайте за движением на карте,
                                        просматривайте историю поездок</div>
                                    <div class="summary-panel__links-panel"><a href="" @click="$router.push('report')"
                                            class="summary-panel__link">Отчеты</a></div>
                                    <h4 class="summary-panel__summary-title">Маячки (5)</h4>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(102, 192, 17);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">4 На связи</span>
                                    </p>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(4, 156, 219);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">1 Местоположение не
                                            обновлено</span>
                                    </p>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(222, 57, 48);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">0 Оффлайн</span>
                                    </p>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(204, 204, 204);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon>
                                        <span class="summary-panel__status-caption">0 Остальные</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="flex panel-layout panel-layout__size-2 xl4 lg4 md4 sm12 xs12 summary-panel__wrapper tasks-panel dashboard__card">
                        <div class="v-card v-sheet theme--light elevation-2 summary-panel summary-panel__visible"
                            @mouseover="taskPanelHovered = true" @mouseleave="taskPanelHovered = false">
                            <div class="v-responsive" style="height: 181px;">
                                <div class="v-responsive__content">
                                    <div class="presentation">
                                        <div class="presentation-container presentation-container-tasks"
                                            :class="{'move-tasks-background': taskPanelHovered}">
                                        </div>
                                        <div class="presentation-inner"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="v-card__title v-card__title--primary">
                                <div class="summary-panel__navigation">
                                    <h3 class="summary-panel__navigation-title"><a href="#" @click="$router.push('tasks')" class="summary-panel__link">Задания</a></h3>
                                    <div class="summary-panel__description">Планируйте задания сотрудникам и
                                        контролируйте их выполнение</div>
                                    <div class="summary-panel__links-panel"><a href=""
                                            class="summary-panel__link">Добавить</a><a href=""
                                            class="summary-panel__link">Ситуация</a><a href="" @click="$router.push('tasks')"
                                            class="summary-panel__link">Сводка</a></div>
                                    <h4 class="summary-panel__summary-title">Задания (8)</h4>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(222, 57, 48);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">0 Выполнено</span>
                                    </p>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(30, 150, 220);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">0 Назначено</span>
                                    </p>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(239, 83, 80);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">8 Не выполнено</span>
                                    </p>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(204, 204, 204);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">0 Остальные</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex panel-layout panel-layout__size-2 xl4 lg4 md4 sm12 xs12 summary-panel__wrapper fleet-panel dashboard__card"
                        @mouseover="carParkPanelHovered = true" @mouseleave="carParkPanelHovered = false">
                        <div class="v-card v-sheet theme--light elevation-2 summary-panel summary-panel__visible">
                            <div class="v-responsive" style="height: 181px;">
                                <div class="v-responsive__content">
                                    <div class="presentation">
                                        <div class="presentation-container presentation-container-car-park">
                                            <div class="donut-chart"><svg viewBox="0 0 101 101">
                                                    <circle cx="50" cy="50" r="40" class="slice slice_1"></circle>
                                                    <circle cx="50" cy="50" r="40" class="slice slice_2"></circle>
                                                    <circle cx="50" cy="50" r="40" class="slice slice_3"></circle>
                                                </svg></div>
                                        </div>
                                        <div class="bar_charts">
                                            <div class="bar_item">
                                                <div class="bar bar_1">
                                                    <div class="bar_inner"></div>
                                                </div>
                                                <div class="bar bar_2" :class="{'bar_2-active': carParkPanelHovered}">
                                                    <div class="bar_inner"></div>
                                                </div>
                                                <v-icon class="bar_icon">mdi-account</v-icon>

                                            </div>
                                            <div class="bar_item">
                                                <div class="bar bar_3" :class="{'bar_3-active': carParkPanelHovered}">
                                                    <div class="bar_inner"></div>
                                                </div>
                                                <div class="bar bar_4" :class="{'bar_4-active': carParkPanelHovered}">
                                                    <div class="bar_inner"></div>
                                                </div>
                                                <v-icon class="bar_icon">mdi-account</v-icon>
                                            </div>
                                            <div class="bar_item">
                                                <div class="bar bar_5" :class="{'bar_5-active': carParkPanelHovered}">
                                                    <div class="bar_inner"></div>
                                                </div>
                                                <div class="bar bar_6" :class="{'bar_6-active': carParkPanelHovered}">
                                                    <div class="bar_inner"></div>
                                                </div>
                                                <v-icon class="bar_icon">mdi-account</v-icon>
                                            </div>
                                            <div class="bar_item">
                                                <div class="bar bar_7" :class="{'bar_7-active': carParkPanelHovered}">
                                                    <div class="bar_inner"></div>
                                                </div>
                                                <div class="bar bar_8" :class="{'bar_8-active': carParkPanelHovered}">
                                                    <div class="bar_inner"></div>
                                                </div>
                                                <v-icon class="bar_icon">mdi-account</v-icon>
                                            </div>
                                        </div>
                                        <v-icon class="presenatation-car-icon">mdi-car</v-icon>

                                    </div>
                                </div>
                            </div>
                            <div class="v-card__title v-card__title--primary">
                                <div class="summary-panel__navigation">
                                    <h3 class="summary-panel__navigation-title"><a href="#" @click="$router.push('vehicles')"
                                            class="summary-panel__link">Автопарк</a></h3>
                                    <div class="summary-panel__description">Следите за расходами, состоянием техники и
                                        качеством вождения</div>
                                    <div class="summary-panel__links-panel"><a href="" @click="$router.push('vehicles')"
                                            class="summary-panel__link">Транспорт</a><a href="" 
                                            class="summary-panel__link">ТО</a><a href=""
                                            class="summary-panel__link">Вождение</a></div>
                                    <h4 class="summary-panel__summary-title">Техобслуживание (5)</h4>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(102, 192, 17);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">0 Выполнено</span>
                                    </p>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(4, 156, 219);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">0 Запланировано</span>
                                    </p>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(222, 57, 48);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">5 Просрочено</span>
                                    </p>
                                    <p class="summary-panel__status">
                                        <v-icon style="color: rgb(204, 204, 204);"
                                            class="list-state-marker summary-panel__status-indicator">mdi-circle
                                        </v-icon><span class="summary-panel__status-caption">0 Остальные</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="flex panel-layout panel-layout__size-2 lg12 md12 sm12 xs12 mileage-panel dashboard__card">
                        <div class="v-card v-sheet theme--light elevation-2">
                            <div class="bar-chart mileage-panel__chart">
                                <div class="bar-chart__chart" style="position: relative; ">
                                    <ECharts auto-resize></ECharts>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="system-notice-stripe" style="display: none;"></div>
    </main>
</template>
<script>
    import ECharts from '@/components/ECharts'

    export default {
        name: "StartPage",
        components: {
            ECharts
        },
        data() {
            return {
                taskPanelHovered: false,
                monitoringPanelHovered: false,
                carParkPanelHovered: false
            }
        },
             beforeCreate: function() {
         document.body.className = 'start-page';
     }
    }
</script>
<style scoped>
    .summary-panel__status {
        line-height: 1.5;
    }

    .summary-panel__status-indicator {
        font-size: 12px !important;
        margin-bottom: 2px;
        margin-right: 8px;
    }

    .dashboard {
        background-image: url('~@/assets/img/day.jpg');
        background-size: cover;
        background-position: center center;
        
    }

    .dashboard__cards {
        min-height: 100vh;
        max-width: 1080px;
        margin: auto;

    }

    .summary-panel__description {
        white-space: pre-wrap;
        word-break: keep-all;
        /*this stops the word breaking*/
    }

    .layout.wrap {
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .layout.row {
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
    }

    .summary-panel {
        opacity: 0.9;
        margin: 16px;
        max-height: 528px
    }

    .application {
        line-height: 1.5;
    }

    .summary-panel .v-card__title {
        font-size: 14px !important;
        overflow-x: hidden;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .summary-panel__link {
        margin-right: 16px;
        color: #626262;
        line-height: 1.5
    }

    .summary-panel__navigation a {
        color: #626262 !important;
    }

    .text-xs-center {
        text-align: center !important;
    }

    .mileage-panel {
        opacity: 0.9;
        -webkit-transition: opacity 0.3s ease;
        transition: opacity 0.3s ease;
        margin: 16px;
    }

    .monitor-panel .presentation .presentation-container {
        -webkit-transition: opacity 0.2s ease;
        transition: opacity 0.2s ease;
        opacity: 0.5;
        background-size: cover;
        position: absolute;
        width: 800px;
        height: 800px;
        bottom: -58px;
        left: -84px;
    }

    .monitor-panel .presentation .presentation-inner,
    .monitor-panel .presentation .presentation-inner-pulse,
    .monitor-panel .presentation .presentation-inner:after {
        width: 25px;
        height: 25px;
        content: '';
        border-radius: 100%;
        position: absolute;
    }

    .monitor-panel .presentation .presentation-inner {
        background-color: rgba(30, 150, 220, 0.7);
        top: calc(50% - 13px);
        left: calc(50% - 13px);
    }

    .monitor-panel .presentation .presentation-inner-pulse {
        background-color: rgba(30, 150, 220, 0.7);
        top: calc(50% - 13px);
        left: calc(50% - 13px);
    }

    .monitor-panel .presentation .presentation-inner-pulse:before {
        content: "";
        position: relative;
        display: block;
        width: 300%;
        height: 300%;
        box-sizing: border-box;
        margin-left: -100%;
        margin-top: -100%;
        border-radius: 45px;
        background-color: #01a4e9;
        -webkit-animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    @keyframes pulse-ring {
        0% {
            transform: scale(0.33);
        }

        80%,
        100% {
            opacity: 0;
        }
    }

    .presentation-container-monitoring {
        background-image: url('~@/assets/img/monitoring.png');

    }

    .presentation-container-tasks {
        background-image: url('~@/assets/img/tasks.png');

    }

    .move-tasks-background {
        animation: moveTasksBackground 200s linear infinite;
    }

    .tasks-panel .presentation .presentation-container {
        -webkit-transform: translateX(0);
        transform: translateX(0);
        -webkit-transition: -webkit-transform 1s ease;
        transition: -webkit-transform 1s ease;
        transition: transform 1s ease;
        transition: transform 1s ease, -webkit-transform 1s ease;
        background-size: cover;
        width: 1000px;
        height: 203px;
    }

    .tasks-panel .presentation .presentation-inner {
        position: absolute;
        left: 179px;
        height: 181px;
        width: 2px;
        top: 0;
        background-color: #f0453d;
    }

    .presenatation-car-icon {
        position: absolute;
        top: -110px;
        left: 75px;
        font-size: 43px;
    }

    .fleet-panel .presentation {
        opacity: 0.5;
        background-color: #f0f0f0;
        width: 100%;
    }

    .move-monitoring-background {
        animation: moveMonitoringBackground 10s linear infinite;
    }

    @keyframes moveMonitoringBackground {
        0% {
            transform: translatex(0px) translatey(0px)
        }

        25% {
            transform: translatex(-100px) translatey(30px);
        }

        75% {
            transform: translatex(-80px) translatey(130px);
        }

        100% {
            transform: translatex(-100px) translatey(30px);
        }

    }


    @keyframes moveTasksBackground {
        from {
            background-position: 0 0;
        }

        to {
            background-position: -10000px 0;
        }
    }

    .presentation-container-car-park {
        display: contents;
    }

    .fleet-panel .presentation .donut-chart {
        padding: 27px 25px;
        position: relative;
    }

    .fleet-panel .presentation .donut-chart,
    .fleet-panel .presentation .bar_item {
        display: inline-block;
        vertical-align: top;
    }

    .fleet-panel .presentation .donut-chart svg {
        width: 125px;
        height: 125px;
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
    }

    .fleet-panel .presentation .donut-chart .slice_1 {
        stroke: #db4c3b;
        stroke-dasharray: 251.2;
        stroke-dashoffset: 210;
        -webkit-transform: rotate(-59deg);
        transform: rotate(-59deg);
    }

    .fleet-panel .presentation .donut-chart .slice {
        stroke-width: 20;
        fill: transparent;
        -webkit-transform-origin: 50px 50px;
        transform-origin: 50px 50px;
    }

    .fleet-panel .presentation .donut-chart circle {
        -webkit-transition: stroke-dashoffset 0.3s ease;
        transition: stroke-dashoffset 0.3s ease;
    }

    .fleet-panel .presentation .donut-chart .slice_2 {
        stroke-dasharray: 251.2;
        stroke: #1e96dc;
        -webkit-transform: rotate(-140deg);
        transform: rotate(-140deg);
        stroke-dashoffset: 194.6;
    }

    .fleet-panel .presentation .donut-chart .slice {
        stroke-width: 20;
        fill: transparent;
        -webkit-transform-origin: 50px 50px;
        transform-origin: 50px 50px;
    }

    .fleet-panel .presentation .donut-chart circle {
        -webkit-transition: stroke-dashoffset 0.3s ease;
        transition: stroke-dashoffset 0.3s ease;
    }

    .fleet-panel .presentation .donut-chart .slice_3 {
        stroke-dasharray: 251.2;
        stroke-dashoffset: 97.5;
        stroke: #86c236;
    }

    .fleet-panel .presentation .donut-chart .slice {
        stroke-width: 20;
        fill: transparent;
        -webkit-transform-origin: 50px 50px;
        transform-origin: 50px 50px;
    }


    .fleet-panel .presentation .bar_charts {
        width: 140px;
        height: 150px;
        padding-top: 30px;
    }

    .fleet-panel .presentation .bar_charts,
    .fleet-panel .presentation .donut-chart,
    .fleet-panel .presentation .bar_item {
        display: inline-block;
        vertical-align: top;
    }

    .fleet-panel .presentation .bar_item {
        margin: 0px 20px 0 -4px;
        height: 125px;
        position: relative;
        width: 16px;
    }

    .fleet-panel .presentation .bar_charts .bar_1 {
        height: 104px;
    }

    .fleet-panel .presentation .bar_charts .bar {
        position: absolute;
        bottom: 25px;
        width: 8px;
        height: 100px;
        -webkit-transition: height 0.3s linear;
        transition: height 0.3s linear;
    }

    .fleet-panel .presentation .bar_charts .bar:nth-child(odd) .bar_inner {
        background-color: #86c236;
    }

    .fleet-panel .presentation .bar_charts .bar:nth-child(even) {
        left: 8px;
    }

    .fleet-panel .presentation .bar_charts .bar_2 {
        height: 83px;
    }

    .fleet-panel .presentation .bar_charts .bar {
        position: absolute;
        bottom: 25px;
        width: 8px;
        height: 100px;
        -webkit-transition: height 0.3s linear;
        transition: height 0.3s linear;
    }

    .fleet-panel .presentation .bar_charts .bar:nth-child(even) .bar_inner {
        background-color: #1e96dc;
    }

    .fleet-panel .presentation .bar_charts .bar_inner {
        height: inherit;
        position: absolute;
        bottom: 0;
        width: 8px;
    }

    .fleet-panel .presentation .bar_charts .bar_inner {
        height: inherit;
        position: absolute;
        bottom: 0;
        width: 8px;
    }

    .fleet-panel .presentation .bar_icon {
        font-size: 20px;
        width: 16px;
        position: absolute;
        bottom: 0;
        left: -2px;
    }

    .fleet-panel .presentation .bar_icon {
        color: #acabab;
    }

    .fleet-panel .presentation .bar_charts .bar_2 {
        height: 83px;
    }

    .fleet-panel .presentation .bar_charts .bar_2-active {
        animation: bar-2-active 10s linear infinite;
    }

    @keyframes bar-2-active {
        0% {
            height: 83px;
        }

        100% {
            height: 13px;
        }
    }

    .fleet-panel .presentation .bar_charts .bar_3 {
        height: 52px;
    }

    .fleet-panel .presentation .bar_charts .bar_3-active {
        animation: bar-3-active 10s linear infinite;
    }


    @keyframes bar-3-active {
        0% {
            height: 52px;
        }

        100% {
            height: 100px;
        }
    }

    .fleet-panel .presentation .bar_charts .bar_4 {
        height: 69px;
    }

    .fleet-panel .presentation .bar_charts .bar_4-active {
        animation: bar-4-active 10s linear infinite;
    }


    @keyframes bar-4-active {
        0% {
            height: 69px;
        }

        100% {
            height: 20px;
        }
    }

    .fleet-panel .presentation .bar_charts .bar_5 {
        height: 83px;
    }

    .fleet-panel .presentation .bar_charts .bar_5-active {
        animation: bar-5-active 10s linear infinite;
    }


    @keyframes bar-5-active {
        0% {
            height: 83px;
        }

        100% {
            height: 0px;
        }
    }


    .fleet-panel .presentation .bar_charts .bar_6 {
        height: 8px;
    }

    .fleet-panel .presentation .bar_charts .bar_6-active {
        animation: bar-6-active 10s linear infinite;
    }


    @keyframes bar-6-active {
        0% {
            height: 8px;
        }

        100% {
            height: 20px;
        }
    }


    .fleet-panel .presentation .bar_charts .bar_7 {
        height: 31px;
    }



    .fleet-panel .presentation .bar_charts .bar_7-active {
        animation: bar-7-active 10s linear infinite;
    }


    @keyframes bar-7-active {
        0% {
            height: 31px;
        }

        100% {
            height: 80px;
        }
    }


    .fleet-panel .presentation .bar_charts .bar_8 {
        height: 22px;
    }


    .fleet-panel .presentation .bar_charts .bar_8-active {
        animation: bar-8-active 10s linear infinite;
    }


    .summary-panel__navigation-title {
        font-size: 24px;
            font-weight: bold;
    margin: 6px 0;
    line-height: 1.5
    }


    .summary-panel__summary-title {
        font-size: 18px;
        font-weight: bold;
        margin: 16px 0 16px 0;
        color: #626262;
        line-height: 12px;
    }

    .summary-panel__links-panel {
        margin-top: 8px;
    }

    .summary-panel .v-card__title {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 0;
        padding-bottom: 0;
    }

.summary-panel__description{
    line-height: 1.5
}
.v-bar-scrollable{
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    visibility: hidden;
}
.v-bar-scrollable:focus, .v-bar-scrollable:hover, .v-bar-scrollable > * {
    visibility: visible;
}
.application--wrap {
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    min-height: 100vh;
    max-width: 100%;
    position: relative;
}
.main-screen__content{
        height: 100%;
    overflow-x: auto;
    position: relative;
    min-width: 0;
    z-index: 1;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-negative: 1;
    flex-shrink: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
}


    @keyframes bar-8-active {
        0% {
            height: 22px;
        }

        100% {
            height: 100px;
        }
    }
</style>