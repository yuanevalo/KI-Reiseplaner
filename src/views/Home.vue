<template>
  <div class="home">
    <h1>Willkommen bei unserem Reiseplaner</h1>
    <div v-if="offers.length">
      <h2>Aktuelle Angebote:</h2>
      <ul>
        <li v-for="(offer, index) in offers" :key="index">
          {{ offer.title }} - {{ offer.price }}
        </li>
      </ul>
    </div>
    <div v-else>Laden der Angebote...</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      offers: [], // Hier werden die Angebote gespeichert
    };
  },
  mounted() {
    this.fetchOffers(); // Beim Laden der Komponente Angebote abrufen
  },
  methods: {
    async fetchOffers() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/scraped-offers"
        ); // Anfrage an deinen Backend-Endpunkt
        this.offers = response.data; // Die empfangenen Daten setzen
      } catch (error) {
        console.error("Error fetching offers:", error); // Fehlerbehandlung
      }
    },
  },
};
</script>

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

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  margin: 0 0.5rem;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-secondary {
  background-color: #f8f8f8;
  color: #333;
  border: 1px solid #333;
}
</style>
