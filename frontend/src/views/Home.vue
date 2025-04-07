<template>
  <transition name="fade">
    <div class="home">
      <h1>Willkommen bei unserem Reiseplaner</h1>
      <div v-if="offers.length">
        <h2>Aktuelle Angebote:</h2>
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
    </div>
  </transition>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      offers: [],
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
        this.offers = this.fallbackOffers();
      }
    },
    fallbackOffers() {
      return [
        {
          title: "Berlin, Deutschland",
          price: "ab 10 €",
          image: "https://picsum.photos/200/300",
        },
        {
          title: "Berlin, Deutschland",
          price: "ab 100 €",
          image: "https://picsum.photos/200/300",
        },
        {
          title: "Berlin, Deutschland",
          price: "ab 1000 €",
          image: "https://picsum.photos/200/300",
        },
      ];
    },
  },
};
</script>

<style scoped>
.home {
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
</style>
