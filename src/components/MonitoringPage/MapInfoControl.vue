<template>
    <l-control>
        <online-trackers />
        <info-widget :class="{ 'move-widget-left': moveWidgetLeft }"/>
        <history-widget  :class="{ 'move-widget-left': moveWidgetLeft }" />
    </l-control>
</template>
<script>
    import {
        LControl,
    } from 'vue2-leaflet';
    import OnlineTrackers from "@/components/MonitoringPage/OnlineTrackers";
    import InfoWidget from "@/components/MonitoringPage/InfoWidget";
    import HistoryWidget from "@/components/MonitoringPage/HistoryWidget";

    export default {
        name: 'MapInfoControl',
        components: {
            InfoWidget,
            OnlineTrackers,
            LControl,
            HistoryWidget
        },
        data() {
            return {
                showHistoryHideInfo: false,
                moveWidgetLeft: false
            }
        },
        mounted() {
            this.$root.$on("hide-online-trackers", (data) => {
                this.moveWidgetLeft = !data;
                console.log(this.moveWidgetLeft)
            })
        },
    }
</script>
<style scoped>
.move-widget-left{
    left: 0 !important
}
</style>