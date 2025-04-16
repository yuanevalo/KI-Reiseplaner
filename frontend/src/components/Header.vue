<template>
  <header>
    <nav>
      <div class="logo">KI-Reiseplaner</div>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/planner">Reiseplaner</router-link>
        <router-link to="/surprise">Überraschungsreisen</router-link>
        <router-link to="/luxury">Luxusreisen</router-link>
        <router-link to="/compare">Vergleichsportal</router-link>
      </div>
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
  z-index: 10;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.nav-links a.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
}
</style>
