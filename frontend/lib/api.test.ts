/**
 * Unit tests for API utility
 */

describe('API Utility', () => {
  it('should export api instance', () => {
    // Since the api module interacts directly with axios and localStorage at module level,
    // we just verify it can be imported without errors
    const { api } = require('./api')
    expect(api).toBeDefined()
    expect(api.defaults).toBeDefined()
  })

  it('should have correct baseURL configured', () => {
    const { api } = require('./api')
    expect(api.defaults.baseURL).toBe('http://localhost:5000/api')
  })
})
