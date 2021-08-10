<template>
  <div class="max-w-xl px-4 mx-auto">
    <div class="p-4 rounded-lg shadow-lg">
      <ul class="flex justify-center mx-8 mb-2">
        <li
          @click="setIsLogin(true)"
          class="mx-2 text-center transition-opacity cursor-pointer hover:opacity-75"
          :class="{ 'border-b-2 border-blue-400': isLogin }"
        >
          Login
        </li>
        <li
          @click="setIsLogin(false)"
          class="mx-2 text-center transition-opacity cursor-pointer hover:opacity-75"
          :class="{ 'border-b-2 border-blue-400': !isLogin }"
        >
          Sign Up
        </li>
      </ul>
      <LoginForm
        :isLogin="isLogin"
        :isSubmitting="isLoading"
        @submitAuth="authSubmitted"
      />
      <div v-if="error" class="my-2 text-center">
        <p class="text-red-400">{{ error.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useAuth } from '../store/auth';
import LoginForm from '../components/LoginForm.vue';
export default defineComponent({
  name: 'Auth',
  components: {
    LoginForm,
  },
  setup() {
    const isLogin = ref(true);
    const { currentUser, error, isLoading, signin, signup } = useAuth();

    const setIsLogin = (nextVal) => {
      isLogin.value = nextVal;
    };
    const authSubmitted = ({ email, password }) => {
      isLogin.value ? signin(email, password) : signup(email, password);
    };
    return {
      isLogin,
      setIsLogin,
      authSubmitted,
      currentUser,
      error,
      isLoading,
    };
  },
});
</script>