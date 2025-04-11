<template>
  <Header />
  <main>
    <router-view></router-view>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
main {
  height: 100vh;
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}
</style>
