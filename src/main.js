// Imports
const fs = require('fs')
const getSecurityAlerts = require('../src/securityalerts')
const owasp10 = require('../src/owasp10')
const mapRisksToAlerts = require('../src/map')
const core = require('@actions/core')
const path = require('path')
require('dotenv').config()

// Location of local copy of the OWASP Top 10 data
const owaspDir = '../data/Top10/2021/docs/'
const indexFile = 'index.md'

// Constants
const risksFile = 'risks.json'
const alertsFile = 'alerts.json'
const mappingFile = 'mapping.csv'

const org = process.env.ORGANISATION
const token = process.env.GITHUB_TOKEN

async function run() {
  // Main function
  try {
    // Extract alerts from GitHub
    const alerts = await getSecurityAlerts(org, token)
    await fs.writeFileSync(alertsFile, JSON.stringify(alerts))
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
    console.log(`Wrote mapping to ${mappingFile}`)
  } catch (error) {
    core.setFailed(`main.run(): ${error.message}`)
  }
}

module.exports = {
  run
}
