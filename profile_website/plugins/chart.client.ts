import { Chart, registerables } from 'chart.js'

export default defineNuxtPlugin(() => {
  Chart.register(...registerables)
  Chart.defaults.responsive = true
  Chart.defaults.maintainAspectRatio = false
})
