<template>
    <div class="container">
      <button
        v-if="state.matches('idle')"
        @click="contactFormService.send('OPEN_FORM')"
        class="btn-primary"
      >
        Send us a message
      </button>
  
      <form
        v-if="['openedForm', 'submitting'].some(state.matches)"
        @submit.prevent="contactFormService.send('SUBMIT')"
      >
        <div class="mb-4">
          <label for="full-name">Full name</label>
          <input
            @input="
              (e) =>
                contactFormService.send({
                  type: 'ENTER_NAME',
                  value: e.target.value,
                })
            "
            :value="state.context.name"
            class="field"
            id="full-name"
            type="text"
            placeholder="Your full name"
          />
        </div>
        <div class="mb-4">
          <label for="email">E-mail</label>
          <input
            @input="
              (e) =>
                contactFormService.send({
                  type: 'ENTER_EMAIL',
                  value: e.target.value,
                })
            "
            :value="state.context.email"
            class="field"
            id="email"
            type="text"
            placeholder="Your e-mail address"
          />
        </div>
        <div class="mb-4">
          <label for="message">Message</label>
          <textarea
            @input="
              (e) =>
                contactFormService.send({
                  type: 'ENTER_MESSAGE',
                  value: e.target.value,
                })
            "
            :value="state.context.message"
            name="message"
            id="message"
            rows="5"
            placeholder="Type in your message"
            class="field"
          >
          </textarea>
        </div>
        <div class="flex justify-end">
          <button
            @click="contactFormService.send('CANCEL')"
            class="btn-secondary"
            type="button"
          >
            Cancel
          </button>
          <button class="btn-primary">
            {{ state.matches("submitting") ? "Submitting" : "Submit" }}
          </button>
        </div>
      </form>
  
      <div v-if="state.matches('confirmingCancellation')">
        <div class="mb-4">
          Are you sure you want to cancel? Your form will be cleared.
        </div>
  
        <div class="flex justify-end">
          <button @click="contactFormService.send('NO')" class="btn-secondary">
            No, go back.
          </button>
          <button @click="contactFormService.send('YES')" class="btn-primary">
            Yes, cancel.
          </button>
        </div>
      </div>
  
      <div v-if="state.matches('showingSuccessMessage')" class="text-green">
        <div class="mb-4">Hey! Thanks for your message!</div>
        <div class="flex justify-end">
          <button
            @click="contactFormService.send('NEW_MESSAGE')"
            class="btn-primary"
          >
            Send another message
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { contactFormMachine } from "../machines/contactFormMachine.js";
  import { interpret } from "xstate";
  
  export default {
    data: () => {
      return {
        contactFormService: interpret(contactFormMachine),
        state: contactFormMachine.initialState,
      };
    },
    created() {
      this.contactFormService
        .onTransition((state) => {
          this.state = state;
          console.log(state);
        })
        .start();
    },
    destroyed() {
      this.contactFormService.stop();
    },
    methods: {},
  };
  </script>
  
  <style>
  .container {
    width: 350px;
    margin: 20px auto;
  }
  
  .btn-primary {
    background: #9f7aea;
    color: #fff;
    padding: 8px 16px;
    border-radius: 4px;
  }
  
  .btn-primary:hover {
    background: #6b46c1;
  }
  
  .btn-secondary {
    flex-shrink: 0;
    border-color: transparent;
    border: 4px;
    color: #4a5568;
    padding: 8px;
    margin-right: 4px;
  }
  
  label {
    display: block;
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .field {
    background: #edf2f7;
    color: #4a5568;
    appearance: none;
    border: 2px solid #edf2f7;
    border-radius: 4px;
    width: 100%;
    padding: 8px;
    line-height: 1.1;
    outline: none;
  }
  
  .field:focus {
    background: white;
    border-color: #6b46c1;
  }
  </style>