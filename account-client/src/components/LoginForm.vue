<template>
  <div class="px-4">
    <h1 class="mb-2 text-xl font-semibold text-center">
      {{ isLogin ? 'Login' : 'Sign Up' }}
    </h1>
    <input
      type="text"
      placeholder="Email Address"
      @input="emailField.handleChange"
      @blur="emailField.handleBlur"
      :value="emailField.value"
      class="min-w-full px-4 mx-auto my-2 border border-gray-500 rounded-full focus:outline-none focus:ring-1 focus:border-blue-300"
    />
    <p
      class="text-center text-red-500"
      :style="{
        visibility:
          emailField.meta.touched && !emailField.meta.valid
            ? 'visible'
            : 'hidden',
      }"
    >
      {{ emailField.errorMessage || 'Field is Required' }}
    </p>
    <input
      type="password"
      placeholder="Password"
      @input="
        passwordField.handleChange($event), confirmPasswordField.validate()
      "
      @blur="passwordField.handleBlur"
      :value="passwordField.value"
      class="min-w-full px-4 mx-auto my-2 border border-gray-500 rounded-full focus:outline-none focus:ring-1 focus:border-blue-300"
    />
    <p
      class="text-center text-red-500"
      :style="{
        visibility:
          passwordField.meta.touched && !passwordField.meta.valid
            ? 'visible'
            : 'hidden',
      }"
    >
      {{ passwordField.errorMessage || 'Field is Required' }}
    </p>

    <template v-if="!isLogin">
      <input
        type="password"
        placeholder="Confirm Password"
        @input="confirmPasswordField.handleChange"
        @blur="confirmPasswordField.handleBlur"
        :value="confirmPasswordField.value"
        class="min-w-full px-4 mx-auto my-2 border border-gray-500 rounded-full focus:outline-none focus:ring-1 focus:border-blue-300"
      />
      <p
        :style="{
          visibility:
            confirmPasswordField.meta.touched &&
            !confirmPasswordField.meta.valid
              ? 'visible'
              : 'hidden',
        }"
        class="text-center text-red-500"
      >
        {{ confirmPasswordField.errorMessage || 'Field is Required' }}
      </p>
    </template>

    <div class="flex justify-center mt-4">
      <button
        class="flex items-center mx-1 btn btn-blue"
        :disabled="!formMeta.valid"
        @click="submitForm"
        type="submit"
        @submit="submitForm"
      >
        <span>{{ isLogin ? 'Login' : 'Sign Up' }}</span>
        <Loader
          v-if="isSubmitting"
          class="ml-2 text-white stroke-current animate-spin"
          :height="16"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, watch } from 'vue';
import { useField, useForm } from 'vee-validate';
import Loader from './ui/Loader.vue';
export default defineComponent({
  name: 'LoginForm',
  components: {
    Loader,
  },
  props: {
    isLogin: {
      type: Boolean,
      default: true,
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    submitAuth: null,
  },
  setup(props, { emit }) {
    const { meta: formMeta, handleSubmit } = useForm();
    const emailField = reactive(useField('email', 'email'));
    const passwordField = reactive(useField('password', 'password'));
    const confirmPasswordValidator = computed(() => {
      return !props.isLogin ? 'confirmPassword:password' : () => true;
    });
    const confirmPasswordField = reactive(
      useField('confirmPassword', confirmPasswordValidator)
    );
    watch(
      () => props.isLogin,
      () => {
        confirmPasswordField.validate();
      }
    );
    const submitForm = handleSubmit((formValues) => {
      emit('submitAuth', {
        email: formValues.email,
        password: formValues.password,
      });
    });
    return {
      emailField,
      passwordField,
      confirmPasswordField,
      submitForm,
      formMeta,
    };
  },
});
</script>