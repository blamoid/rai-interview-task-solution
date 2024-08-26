import { defineStore } from 'pinia';

interface State {
  errorText: string | null;
  messageText: string | null;
}

export const useReportingStore = defineStore('reporting', {
  state: (): State => ({
    errorText: null,
    messageText: null,
  }),
  actions: {
    reportError(errorMessage: string) {
      setTimeout(() => {
        if (this.errorText === errorMessage) {
          this.errorText = null;
        }
      }, 10000);
      this.errorText = errorMessage;
    },
    showMessage(payload: { message: string }) {
      setTimeout(() => {
        if (this.messageText === payload.message) {
          this.messageText = null;
        }
      }, 3000);
      this.messageText = payload.message;
    },
  },
});
