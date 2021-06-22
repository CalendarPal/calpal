<template>
  <div class="text-4xl font-bold text-center my-12">CSS Works!</div>
  <div class="text-xl text-center" v-if="errorCode">
    Error code: {{ errorCode }}
  </div>
  <div class="text-center" v-if="errorMessage">{{ errorMessage }}</div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Details',
  setup() {
    const errorCode = ref(null);
    const errorMessage = ref(null);

    onMounted(async () => {
      try {
        await axios.get('/api/account/me');
        errorCode.value = null;
        errorMessage.value = null;
      } catch (error) {
        if (error.response) {
          errorCode.value = error.response.status;
          errorMessage.value = error.response.data.error.message;
        } else {
          errorCode.value = 500;
          errorMessage.value = 'Unknown request errors';
        }
      }
    });
    return {
      errorCode,
      errorMessage,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>