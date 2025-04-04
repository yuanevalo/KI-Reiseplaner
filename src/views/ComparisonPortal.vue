<template>
  <div class="comparison-title">
    <h1>Reisevergleichsportal</h1>
    <div class="comparison-options">
      <button @click="chatGPT" :class="{ active: showChatGPT }">
        KI-Empfehlung ChatGPT
      </button>
      <button @click="gemini" :class="{ active: showGemini }">
        KI-Empfehlung Gemini
      </button>
    </div>
    <div v-if="showChatGPT">
      <ComparisonPortalChatGPT />
    </div>
    <div v-if="showGemini">
      <ComparisonPortalGemini />
    </div>
  </div>
</template>

<script>
import ComparisonPortalChatGPT from "@/components/ComparisonPortalChatGPT.vue";
import ComparisonPortalGemini from "@/components/ComparisonPortalGemini.vue";

export default {
  name: "ComparisonPortal",
  components: {
    ComparisonPortalChatGPT,
    ComparisonPortalGemini,
  },
  data() {
    return {
      showChatGPT: false,
      showGemini: false,
    };
  },
  methods: {
    chatGPT() {
      this.showChatGPT = true;
      this.showGemini = false;
    },
    gemini() {
      this.showGemini = true;
      this.showChatGPT = false;
    },
  },
};
</script>

<style>
.comparison-title {
  text-align: center;
}

.comparison-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.comparison-options button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
