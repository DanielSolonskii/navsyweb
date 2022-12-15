<template>
  <v-col cols="8">
    <v-row justify="space-between" align="center" class="ma-0"
           style="height: 44px; background-color: #505a64; color: white">
      <div class="cols-header">
         Управление тегами
      </div>
    </v-row>
    <v-card class="pa-0" style="height: calc(100%);">

      <template>
        <div>
          <!-- Text field to input a new tag -->
          <v-text-field outlined label="Поиск" clearable hide-details v-model="search" append-icon="mdi-magnify" class="mb-6"></v-text-field>
          <v-list flat class="pt-0">
            <v-list-item>
              <v-list-item-action>
                <div class="item-actions">
                  <!--
                  <v-checkbox></v-checkbox>
                  -->
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn
                          class="ml-2 custom-btn"
                          :color="color"
                          dark
                          v-on="on"
                      >
                      </v-btn>
                    </template>
                    <v-color-picker
                        value="#7417BE"
                        v-model="color"
                        hide-canvas
                        hide-inputs
                        show-swatches
                        class="mx-auto"
                    ></v-color-picker>
                  </v-menu>
                </div>

              </v-list-item-action>
                <v-list-item-content>
                  <v-text-field outlined label="Новый тег" clearable hide-details v-model="newTagTitle" @click:append="addTag" @keyup.enter="addTag" append-icon="mdi-plus-circle" class="mb-6"></v-text-field>
                </v-list-item-content>

            </v-list-item>
            <draggable v-model="tags" ghost-class="ghost" handle=".handle">
              <transition-group type="transition" name="flip-list">
                <!-- Looping for the tags -->
                <div class="sortable" v-for="(tag, i) in filteredList" :key="tag.id">
                  <v-list-item :class="{ 'blue lighten-5': tag.done }">
                    <template v-slot:default>
                      <v-list-item-action>
                        <div class="item-actions">

                       <!-- <v-checkbox v-if="handle != true" :input-value="tag.done"></v-checkbox> -->
                        <v-icon color="primary" class="handle" v-if="handle == true">mdi-drag</v-icon>
                          <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                  class="ml-2 custom-btn"
                                  :color="tag.color"
                                  dark
                                  v-on="on"
                              >
                              </v-btn>
                            </template>
                            <v-color-picker
                                value="#7417BE"
                                v-model="tag.color"
                                hide-canvas
                                hide-inputs
                                show-swatches
                                class="mx-auto"
                            ></v-color-picker>
                          </v-menu>
                        </div>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title :class="{ 'text-decoration-line-through': tag.done }">{{ tag.title }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-content v-if="tag.dueDate" class="text-right text-uppercase">
                        <v-list-item-title class="caption">
                          <v-icon v-if="!tag.expired || tag.done" dense class="mr-1">mdi-calendar-outline</v-icon>
                          <v-icon v-else-if="!tag.done" dense class="mr-1 error--text">mdi-calendar-alert</v-icon>
                          <span :class="{ 'error--text font-weight-bold': tag.expired && !tag.done }"> {{ computedDue(tag.dueDate) }}</span>
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-menu>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn dark icon v-bind="attrs" v-on="on">
                            <v-icon color="primary lighten-1">mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>

                        <v-list>
                          <v-list-item>
                            <v-list-item-title>
                              <div role="button" @click="(tag.modal = true), (dialog = 0)">
                                <v-btn icon>
                                  <v-icon color="grey">mdi-pencil</v-icon>
                                </v-btn>
                                Редактировать
                              </div>
                            </v-list-item-title>
                          </v-list-item>

                          <v-list-item v-for="(item, i) in sideMenu" :key="i">
                            <v-list-item-title role="button" v-if="(item.title = 'Удалить')" @click.stop="handleFnCall(item.function, tag.id)">
                              <v-btn icon>
                                <v-icon color="grey">mdi-{{ item.button }}</v-icon>
                              </v-btn>
                              {{ item.title }}
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title>
                              <div role="button" @click="handle = true">
                                <v-btn icon>
                                  <v-icon color="grey">mdi-sort</v-icon>
                                </v-btn>
                                Сортировать
                              </div>
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-dialog ref="dialog" v-if="dialog === 0" v-model="tag.modal" :return-value.sync="tag.title" persistent width="310px">
                    <v-card>
                      <v-card-title>Редактировать название</v-card-title>
                      <v-text-field v-model="tag.title" @keyup.enter="$refs.dialog[i].save(tag.title), snackBar('Tэг обновлен!')" class="pa-5"></v-text-field>
                      <v-btn text color="primary" @click.stop="tag.modal = false">Отмена</v-btn>
                      <v-btn text color="primary" @click.stop="$refs.dialog[i].save(tag.title), snackBar('Tэг обновлен!')">Сохранить</v-btn>
                    </v-card>
                  </v-dialog>


                </div>
              </transition-group>
            </draggable>
          </v-list>

          <div v-if="tags.length === 0" class="my-auto text-center green--text">
            <!--
            <v-icon x-large class="green--text">mdi-check-all</v-icon>
            -->
            <h2>У вас нет сохраненных тегов</h2>
          </div>

          <v-snackbar v-model="snackbar.active">
            {{ snackbar.text }}

            <template v-slot:action="{ attrs }">
              <v-btn color="pink" text v-bind="attrs" @click="snackbar.active = false"> Закрыть</v-btn>
            </template>
          </v-snackbar>

          <div class="handle-div text-center" v-if="handle">
            <v-btn fixed bottom close color="primary" @click="handle = false"> Закончить сортировку</v-btn>
          </div>
        </div>
      </template>
    </v-card>
  </v-col>

</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "Tags",
  components: {
    draggable,
  },
  data() {
    return {
      search: '',
      color: 'pink',
      handle: false,
      newTagTitle: "",
      tags: [],
      snackbar: {
        active: false,
        text: String,
      },
      dialog: Number,
      sideMenu: [{ title: "Удалить", button: "delete", function: "deleteTag" }],
    };
  },
  mounted() {
    if (localStorage.tags) {
      this.tags = JSON.parse(localStorage.tags);
      const today = new Date(`${this.today()} GMT-0300`);
      this.tags.forEach((e) => {
        const tagDueDate = new Date(`${e.dueDate} GMT-0300`);
        return today > tagDueDate ? (e.expired = true) : (e.expired = false);
      });
    }
  },
  methods: {
    today() {
      // Gets the current date and returns "XXXX-XX-XX"
      const rawToday = new Date();
      const rawMonth = () => {
        const month = rawToday.getMonth() + 1;

        return month < 10 ? `0${month}` : month;
      };

      return `${rawToday.getFullYear()}-${rawMonth()}-${rawToday.getDate()}`;
    },
    computedDue(due) {
      // Gets the tag due date and returns "month, XX"
      return new Date(`${due} GMT-0300`).toLocaleString("en-US", { month: "short", day: "2-digit" });
    },
    handleFnCall(fnName, tagId) {
      return this[fnName](tagId);
    },
    snackBar(message) {
      this.snackbar.text = message;

      return (this.snackbar.active = true);
    },
    addTag() {
      if (this.newTagTitle === "") {
        // Checks wether tag title was typed and actives the warining snackbar if it isn't
        return this.snackBar("Введите название");
      } else {
        // Creates the new tag object...
        const idDate = Date.parse(new Date()) + (Math.floor(Math.random() * 10000000000000) + 1);
        const newTag = {
          id: idDate,
          title: this.newTagTitle,
          dueDate: null,
          expired: false,
          done: false,
          modal: false,
          color: this.color
        };
        // ... then pushes it into 'tags' array | Shows the snackbar "ADDED"
        return this.tags.push(newTag), (this.newTagTitle = ""), this.snackBar("Тэг добавлен!");
      }
    },

    deleteTag(tagID) {
      // Deletes the tag and shows the snackbar "DELETED"
      this.tags = this.tags.filter((tag) => tag.id !== tagID);

      return this.snackBar("Tэг удален!");
    },
  },
  computed: {
    filteredList() {
      return this.tags.filter(tag => {
        return tag.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  watch: {
    tags: {
      handler(addTag) {
        localStorage.tasgs = JSON.stringify(addTag);
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.item-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

::v-deep .custom-btn {
  width: 18px;
  min-width: 18px !important;
  height: 18px !important;
  padding: 0 !important;
}
</style>
