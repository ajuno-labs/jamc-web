import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

const server = setupServer(...handlers)

export const startMSW = async () => {
  server.listen({ onUnhandledRequest: 'error' })
}

export const resetMSW = async () => {
  server.resetHandlers()
}

export const stopMSW = async () => {
  server.close()
} 