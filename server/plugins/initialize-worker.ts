import { initializeWorker } from '../utils/jobs'

export default defineNitroPlugin(async () => {
  await initializeWorker()
})
