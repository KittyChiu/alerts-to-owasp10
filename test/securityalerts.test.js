// securityalerts.test.js
const getSecurityAlerts = require('../src/securityalerts')
const fs = require('fs').promises // Import the promises version of fs
require('dotenv').config()

describe('securityalerts', () => {
  it('should extract alerts and match snapshot', async () => {
    const result = await getSecurityAlerts(
      process.env.ORGANISATION,
      process.env.GITHUB_TOKEN
    )

    // Write the result to a file
    await fs.writeFile('./alerts.json', JSON.stringify(result, null, 2))

    expect(result).toMatchSnapshot()
  })
})
