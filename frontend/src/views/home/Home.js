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
