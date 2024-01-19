// Imports
const fs = require('fs')

// Function to map controls to alerts
function mapControlsToAlerts(owasp10Path, alertsPath, csvOutputPath) {
  // Create a CSV file and write the header
  fs.writeFileSync(csvOutputPath, 'repo_name,alert_no,control,cwe_id\n')

  // Read and parse the data from owasp10Path
  const owasp10Data = JSON.parse(fs.readFileSync(owasp10Path, 'utf8'))

  // Read and parse the data from alertsPath
  const alertData = JSON.parse(fs.readFileSync(alertsPath, 'utf8'))

  // Iterate over the keys in alertData
  for (const repoName in alertData) {
    const repoData = alertData[repoName]

    // Iterate over the keys in repoData
    for (const alertKey in repoData) {
      const outputCwes = repoData[alertKey]

      // Iterate over the keys 
      for (const owasp10Key in owasp10Data) {
        let combinedCwes = owasp10Data[owasp10Key]

        // Pad each CWE in combinedCwes with leading zeros if it has less than 3 digits
        combinedCwes = combinedCwes.map(cwe => {
          const parts = cwe.split('-')
          parts[1] = parts[1].padStart(3, '0')
          return parts.join('-')
        })

        // Check if any CWE in outputCwes is in combinedCwes
        const matchingCwe = outputCwes.find(cwe =>
          combinedCwes.map(c => c.toUpperCase()).includes(cwe.toUpperCase())
        )
        if (matchingCwe) {
          // Write the data to the CSV file
          fs.appendFileSync(
            csvOutputPath,
            `${repoName},${alertKey},${owasp10Key},${matchingCwe}\n`
          )
        }
      }
    }
  }
}

module.exports = mapControlsToAlerts
