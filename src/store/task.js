const task = {
    
    state: {
        tasks: []
      },
      
      mutations: {
        ADD_TASK(state, payload) {
          state.tasks.push(payload);
        }
      },
      
      actions: {
        addTask(context, task) {
          context.commit("ADD_TASK", task);
        },
      },
      
      getters: {
        gettasks(state) {
          return state.tasks;
        }
      },
    }
    export default task