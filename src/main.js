// Imports
const fs = require('fs')
const alertExtractor = require('./src/alert-extractor')
const owasp10 = require('./src/owasp-top10')
const mapControlsToAlerts = require('./src/map')
const core = require('@actions/core')
const path = require('path')

// Location of local copy of the OWASP Top 10 data 
const owaspData = 'data/Top10/2021/docs/'
const indexFile = 'index.md'

// Constants
const controlsFile = 'controls.json'
const alertsFile = 'alerts.json'
const mappingFile = 'mapping.csv'

try {
  const org = process.env.ORGANISATION
  const token = process.env.GITHUB_TOKEN

  // Extract alerts from GitHub
  const alerts = await alertExtractor(org, token)
  fs.writeFileSync(alertsFile, JSON.stringify(alerts))

  // Extract controls from OWASP Top 10 data
  const controls = await owasp10(owaspData, indexFile)
  fs.writeFileSync(controlsFile, JSON.stringify(controls))

  if (!fs.existsSync(controlsFile)) {
    throw new Error(`File ${controlsFile} does not exist.`)
  }

  if (!fs.existsSync(alertsFile)) {
    throw new Error(`File ${alertsFile} does not exist.`)
  }

  // Map controls to alerts
  const mapping = await mapControlsToAlerts(
    controlsFile,
    alertsFile,
    mappingFile
  )
  fs.writeFileSync(mappingFile, mapping)

  // Set output
  const absolutePath = path.resolve(mappingFile)
  core.setOutput('mappingsFilepath', absolutePath)

} catch (error) {
  core.setFailed(error.message)
}
