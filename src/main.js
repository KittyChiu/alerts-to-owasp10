// Imports
const fs = require('fs')
const getSecurityAlerts = require('./securityalerts')
const owasp10 = require('./owasp10')
const mapRisksToAlerts = require('./map')
const core = require('@actions/core')
const path = require('path')

// Location of local copy of the OWASP Top 10 data
const owaspDir = '../data/Top10/2021/docs/'
const indexFile = 'index.md'

// Constants
const risksFile = 'risks.json'
const alertsFile = 'alerts.json'
const mappingFile = 'mapping.csv'

// Main function
async function run() {
  try {
    const org = process.env.ORGANISATION
    const token = process.env.GITHUB_TOKEN

    // Extract alerts from GitHub
    const alerts = await getSecurityAlerts(org, token)
    fs.writeFileSync(alertsFile, JSON.stringify(alerts))
    if (!fs.existsSync(alertsFile)) {
      throw new Error(`File ${alertsFile} does not exist.`)
    }
    console.log(`Wrote alerts to ${alertsFile}`)

    // Extract risks from OWASP Top 10 data
    const risks = owasp10.getOwasp10(owaspDir, indexFile)
    fs.writeFileSync(risksFile, JSON.stringify(risks))
    if (!fs.existsSync(risksFile)) {
      throw new Error(`File ${risksFile} does not exist.`)
    }
    console.log(`Wrote risks to ${risksFile}`)

    // Map risks to alerts
    await mapRisksToAlerts(risksFile, alertsFile, mappingFile)
    if (!fs.existsSync(mappingFile)) {
      throw new Error(`File ${mappingFile} does not exist.`)
    }
    console.log(
      `Wrote mapping to ${mappingFile} with length ${fs.readFileSync(mappingFile, 'utf8').length}`
    )

    // Set output
    const absolutePath = path.resolve(mappingFile)
    core.setOutput('mappingsFilepath', absolutePath)
    console.log(`Set output mappingsFilepath to ${absolutePath}`)
  } catch (error) {
    core.setFailed(`run(): ${error.message}`)
  }
}

module.exports = {
  run
}
