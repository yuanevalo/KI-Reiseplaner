<template>
  <div>
    <h1>Reisevergleichsportal</h1>
    <div>
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
