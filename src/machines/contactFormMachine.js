import { Machine, assign } from "xstate";

export const contactFormMachine = Machine(
  {
    id: "contactForm",
    initial: "idle",
    context: {
      name: null,
      email: null,
      message: null
    },
    states: {
      idle: {
        on: {
          OPEN_FORM: {
            target: "openedForm"
          }
        }
      },
      openedForm: {
        on: {
          ENTER_NAME: {
            actions: ["assignName"]
          },
          ENTER_EMAIL: {
            actions: ["assignEmail"]
          },
          ENTER_MESSAGE: {
            actions: ["assignMessage"]
          },
          CANCEL: {
            target: "confirmingCancellation"
          },
          SUBMIT: {
            target: "submitting"
          }
        }
      },
      submitting: {
        invoke: {
          id: "submit",
          src: "submit",
          onDone: {
            target: "showingSuccessMessage",
            actions: ["clearForm"]
          },
          onError: {
            target: "openedForm",
            actions: ["setErrors"]
          }
        }
      },
      confirmingCancellation: {
        on: {
          YES: {
            target: "idle"
          },
          NO: {
            target: "openedForm"
          }
        }
      },
      showingSuccessMessage: {
        on: {
          NEW_MESSAGE: {
            target: "openedForm"
          }
        }
      }
    }
  },
  {
    actions: {
      assignName: assign({ name: (ctx, event) => event.value }),
      assignEmail: assign({ email: (ctx, event) => event.value }),
      assignMessage: assign({ message: (ctx, event) => event.value }),
      clearForm: assign({ name: null, email: null, message: null })
    },
    services: {
      submit: () => {
        return new Promise((resolve) => {
            
          setTimeout(() => resolve("success"), 1000);
        });
      }
    }
  }
);
