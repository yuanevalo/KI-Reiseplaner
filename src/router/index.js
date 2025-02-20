import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TravelPlanner from '../views/TravelPlanner.vue'
import SurpriseTrips from '../views/SurpriseTrips.vue'
import LuxuryExperiences from '../views/LuxuryExperiences.vue'
import ComparisonPortalGemini from "@/views/ComparisonPortalGemini.vue"
import TravelOffers from '../components/TravelOffers.vue'
import TravelComparison from '@/views/TravelComparison.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/planner', name: 'TravelPlanner', component: TravelPlanner },
  { path: '/surprise', name: 'SurpriseTrips', component: SurpriseTrips },
  { path: '/luxury', name: 'LuxuryExperiences', component: LuxuryExperiences },
  { path: '/compare', name: 'ComparisonPortal', component: ComparisonPortalGemini },
  {
    path: '/offers',
    name: 'Offers',
    component: TravelOffers
  },
  { path: '/comparison', name: 'TravelComparison', component: TravelComparison },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router