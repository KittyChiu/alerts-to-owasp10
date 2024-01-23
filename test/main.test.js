const fs = require('fs')
const main = require('../src/main')

jest.mock('../src/securityalerts', () => jest.fn())
jest.mock('../src/owasp10', () => jest.fn())
jest.mock('../src/map', () => jest.fn())

describe('main.js tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks()
  })

  test('main function should write to files and set output', async () => {
    const alertsFile = './alerts.json'
    const risksFile = './owasp10.json'
    const mappingFile = './mapping.csv'

    await main.run()

    expect(() => fs.readFileSync(alertsFile)).not.toThrow()
    expect(() => fs.readFileSync(risksFile)).not.toThrow()
    expect(() => fs.readFileSync(mappingFile)).not.toThrow()
  })
})
