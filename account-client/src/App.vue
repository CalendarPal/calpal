<template>
  <div class="flex justify-around my-4">
    <router-link to="/">Home/Details</router-link>
    <router-link to="/authenticate">Auth</router-link>
    <router-link to="/notaroute">Not a Route</router-link>
  </div>
  <router-view></router-view>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>
