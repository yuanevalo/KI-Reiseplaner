<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/planner">Reiseplaner</router-link>
      <router-link to="/surprise">Überraschungsreisen</router-link>
      <router-link to="/luxury">Luxusreisen</router-link>
      <router-link to="/compare">Vergleichsportal</router-link>
    </nav>
  </header>
</template>

<style scoped>
header {
  background-color: #333;
  padding: 1.5rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

nav {
  display: flex;
  justify-content: space-around;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
}
</style>
