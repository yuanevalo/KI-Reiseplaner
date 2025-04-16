import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/home/Home.vue";
import TravelPlanner from "@/views/TravelPlanner.vue";
import SurpriseTrips from "@/views/SurpriseTrips.vue";
import LuxuryExperiences from "@/views/LuxuryExperiences.vue";
import ComparisonPortal from "@/views/ComparisonPortal.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/planner", name: "TravelPlanner", component: TravelPlanner },
  { path: "/surprise", name: "SurpriseTrips", component: SurpriseTrips },
  { path: "/luxury", name: "LuxuryExperiences", component: LuxuryExperiences },
  {
    path: "/compare",
    name: "ComparisonPortal",
    component: ComparisonPortal,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
