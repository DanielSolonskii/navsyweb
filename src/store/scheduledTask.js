const scheduledTask = {
    
state: {
    scheduledTasks: []
  },
  
  mutations: {
    ADD_SCHEDULED_TASK(state, payload) {
      state.scheduledTasks.push(payload);
    }
  },
  
  actions: {
    addScheduledTask(context, scheduledTask) {
      context.commit("ADD_SCHEDULED_TASK", scheduledTask);
    },
  },
  
  getters: {
    getScheduledTasks(state) {
      return state.scheduledTasks;
    }
  },
}
export default scheduledTask