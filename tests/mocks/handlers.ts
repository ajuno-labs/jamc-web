import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock Google OAuth
  http.post('/api/auth/signin/google', () => {
    return HttpResponse.json({
      url: '/',
      ok: true
    })
  }),

  // Mock Credentials auth
  http.post('/api/auth/callback/credentials', async ({ request }) => {
    const data = await request.json()
    
    if (data.password === 'demo123') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        }
      })
    }
    
    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized'
    })
  })
]