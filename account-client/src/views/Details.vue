<template>
  <h1 class="text-4xl font-bol text-center">{{ currentUser }}</h1>
</template>

<script>
import { defineComponent } from 'vue';
import { useAuth } from '../store/auth';

export default defineComponent({
  name: 'Details',
  setup() {
    const { currentUser } = useAuth();

    return {
      currentUser,
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