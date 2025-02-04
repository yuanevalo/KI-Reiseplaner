<script setup>
import FeatureList from '../components/FeatureList.vue'
</script>

<template>
  <div class="home">
    <h1>KI-gestützter Reiseplaner</h1>
    <h2>Luxus und Abenteuer neu erleben</h2>

    <section class="intro">
      <p>
        Willkommen in der Zukunft der Reiseplanung. Unsere KI-gestützte Plattform
        verbindet personalisierte Empfehlungen, Überraschungsreisen und exklusive
        Dienstleistungen, um unvergessliche Reisen zu schaffen, die genau auf Sie
        zugeschnitten sind.
      </p>
    </section>

    <FeatureList />

    <section class="cta">
      <router-link to="/planner" class="btn-primary">Starten Sie Ihre Reiseplanung</router-link>
      <router-link to="/luxury" class="btn-secondary">Entdecken Sie Luxusoptionen</router-link>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #333;
}

h2 {
  font-size: 1.5rem;
  color: #666;
}

.intro {
  margin: 2rem 0;
}

.cta {
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  margin: 0 0.5rem;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary {
  background-color: #f8f8f8;
  color: #333;
  border: 1px solid #333;
}
</style>