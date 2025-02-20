<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/planner">Reiseplaner</router-link> |
      <router-link to="/surprise">Überraschungsreisen</router-link> |
      <router-link to="/luxury">Luxuserlebnisse</router-link> |
      <router-link to="/compare">KI-Vergleich</router-link> |
      <router-link to="/offers">Reiseangebote</router-link> |
      <router-link to="/comparison">Reisevergleich</router-link>
    </nav>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>