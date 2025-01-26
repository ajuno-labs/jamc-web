import { FullConfig } from '@playwright/test'
import { startMSW, stopMSW } from './msw-handler'

export default async function globalSetup(config: FullConfig) {
  await startMSW()
  
  return async () => {
    await stopMSW()
  }
} 