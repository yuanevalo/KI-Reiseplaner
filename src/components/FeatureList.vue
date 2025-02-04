<script setup>
import { ref } from 'vue'

const features = ref([
  { title: 'KI-Reiseplaner', description: 'Personalisierte Reisepläne, erstellt von KI basierend auf Ihren Vorlieben.' },
  { title: 'Überraschungsreisen', description: 'Begeben Sie sich auf geheimnisvolle Reisen, die auf Ihren Geschmack zugeschnitten sind.' },
  { title: 'Luxuserlebnisse', description: 'Zugang zu exklusiven, hochwertigen Reiseoptionen und Concierge-Services.' },
  { title: 'Vergleichsportal', description: 'Vergleichen Sie Flüge, Hotels und Pakete für die besten Angebote.' },
])
</script>

<template>
  <section class="features">
    <h3>Unsere Funktionen</h3>
    <ul>
      <li v-for="feature in features" :key="feature.title">
        <h4>{{ feature.title }}</h4>
        <p>{{ feature.description }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.features {
  margin: 2rem 0;
}

h3 {
  margin-bottom: 1rem;
}

ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 8px;
}

h4 {
  color: #333;
  margin-bottom: 0.5rem;
}
</style>