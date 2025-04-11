<template>
  <div>
    <div class="title">Willkommen bei unserem Reiseplaner</div>
    <div v-if="offers.length">
      <div class="subtitle">Aktuelle Angebote:</div>
      <ul class="offer-list">
        <li
          v-for="(offer, index) in offers"
          :key="index"
          class="offer-item"
          :style="{ backgroundImage: 'url(' + offer.image + ')' }"
        >
          <div class="offer-content">
            <p class="offer-title">{{ offer.title }}</p>
            <p class="offer-price">{{ offer.price }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>Laden der Angebote...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      offers: [],
      error: null,
    };
  },
  mounted() {
    this.fetchOffers(); // Beim Laden der Komponente Angebote abrufen
  },
  methods: {
    async fetchOffers() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/scraped-offers"
        ); // Anfrage an deinen Backend-Endpunkt
        this.offers = response.data; // Die empfangenen Daten setzen
      } catch (error) {
        console.error("Error fetching offers:", error); // Fehlerbehandlung
        this.error = error;
      }
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 2.5rem;
  color: #333;
  padding-top: 1rem;
  font-weight: bold;
  text-align: center;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
  text-align: center;
}

.offer-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style-type: none;
  padding: 0;
}

.offer-item {
  position: relative;
  width: 300px;
  height: 200px;
  background-size: cover;
  background-position: center;
  margin: 0;
  border-radius: 8px;
  overflow: hidden;
}

.offer-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  color: white;
  font-family: Arial, sans-serif;
  background: rgba(
    0,
    0,
    0,
    0.5
  ); /* fügt einen halbtransparenten Hintergrund hinzu */
}

.offer-title {
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  left: 10px;
}

.offer-price {
  font-size: 16px;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
}
</style>
