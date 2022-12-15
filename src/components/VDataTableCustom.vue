<template>
  <v-data-table :headers="headers" :items="items" :group-by="tableGroup" :search="searchByItemName" class="elevation-1">
    <template v-for="(slot, name) in $scopedSlots" v-slot:[name]="item">
      <slot :name="name" v-bind="item"></slot>
    </template>
  </v-data-table>
</template>
<script>
  export default {
    props: ["headers", "items", "search", "tableGroup"],
    data() {
      return {
        searchByItemName: '',
        groupBySelectedGroupName: null
      }
    },
    mounted() {
      // console.log(this.props.tableGroup);
    },
    computed: {

    },
    watch: {
      tableGroup: {
        handler(val) {
          console.log(val)
          this.groupBySelectedGroupName = val
        },
        deep: true,
      },
      search: {
        handler(val) {
          this.searchByItemName = val
        },
        deep: true,
      }
    },
  };
</script>
in parent:
                                <v-data-table-custom :items="tasks" :headers="computedHeaders" :group-by="tableGroup" :search="search">
                                    <template v-slot:item.name="{ item }">
                                    <h3>{{ item.name }}</h3>
                                    </template>
                                </v-data-table-custom>

