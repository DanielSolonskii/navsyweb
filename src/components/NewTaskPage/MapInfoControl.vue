<template>
    <l-control>
        <div class="new-task-panel-block">
            <left-panel />
            <right-panel />
        </div>
    </l-control>
</template>
<script>
    import {
        LControl,
    } from 'vue2-leaflet';
    // import OnlineTrackers from "@/components/NewTaskPage/OnlineTrackers";
    import LeftPanel from "@/components/NewTaskPage/LeftPanel";
    import RightPanel from "@/components/NewTaskPage/RightPanel";

    export default {
        name: 'MapInfoControl',
        components: {
            LeftPanel,
            LControl,
            RightPanel
        },
    }
</script>
<style scoped>
    .new-task-panel-block {
        position: absolute;
        left: 0
    }
</style>