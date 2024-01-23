// Imports
const { constants } = require('buffer')
const { Octokit } = require('@octokit/rest')

// Function to extract security alerts from GitHub
async function getSecurityAlerts(orgName, personalAccessToken) {
  // Initialize Octokit with security_events scope
  const octokit = new Octokit({ auth: personalAccessToken })

  // Make API request to get code scanning alerts under the organization
  let alerts
  try {
    alerts = await octokit.paginate('GET /orgs/{owner}/code-scanning/alerts', {
      owner: orgName,
      per_page: 100,
      state: 'open'
    })
  } catch (error) {
    console.error(error.message)
    throw error // Throw the error to stop execution
  }
  console.log(`Found ${alerts.length} alerts in ${orgName}`)

  // Extract CWE IDs from the alerts
  const result = {}
  for (const alert of alerts) {
    const cweIds = alert.rule.tags
      .filter(tag => tag.startsWith('external/cwe/'))
      .map(tag => tag.split('/')[2])

    // Check if the repository name already exists in the result object. If not, initialize it as an empty object
    if (!result[alert.repository.name]) {
      result[alert.repository.name] = {}
    }

    // Add the alert number and its corresponding CWE IDs under the repository name
    result[alert.repository.name][alert.number] = cweIds
  }

  return result
}

module.exports = getSecurityAlerts
