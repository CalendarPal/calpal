<template>
  <div class="text-4xl font-bol text-center my-2">App Component</div>
  <div class="flex justify-around my-4">
    <router-link to="/">Home/Details</router-link>
    <router-link to="/authenticate">Auth</router-link>
    <router-link to="/notaroute">Invalid</router-link>
  </div>
  <router-view></router-view>
</template>

<script>
import { defineComponent } from 'vue';
import { provideAuth } from './store/auth';

export default defineComponent({
  name: 'App',
  setup() {
    provideAuth();
  },
});
</script>