import { initializeWorker } from '../utils/jobs'
import { initializeRefreshWorker } from '../utils/profileRefreshJob'

export default defineNitroPlugin(async () => {
  await initializeWorker()
  await initializeRefreshWorker()
})
