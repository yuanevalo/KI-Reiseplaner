<template>
  <header>
    <nav class="navbar">
      <router-link to="/" class="logo">KI-Reiseplaner</router-link>

      <button class="burger" @click="toggleMenu">
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
      </button>

      <div class="nav-links" :class="{ open: isOpen }">
        <router-link to="/">Home</router-link>
        <router-link to="/planner">Reiseplaner</router-link>
        <router-link to="/surprise">Überraschungsreisen</router-link>
        <router-link to="/luxury">Luxusreisen</router-link>
        <router-link to="/compare">Vergleichsportal</router-link>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped>
header {
  background-color: #333;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 600;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  transition: max-height 0.3s ease;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #42b983;
}

.nav-links a.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
}

/* Mobile Navigation */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}

.burger span {
  width: 25px;
  height: 3px;
  background: white;
  transition: 0.3s;
}

.burger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.burger span.open:nth-child(2) {
  opacity: 0;
}
.burger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    background: #333;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    max-height: 0;
  }

  .nav-links.open {
    max-height: 300px;
    padding: 1rem 2rem;
  }

  .burger {
    display: flex;
  }
}
</style>
