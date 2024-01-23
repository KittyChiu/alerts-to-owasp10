// Imports
const fs = require('fs')

// Function to map risks to alerts
function mapRisksToAlerts(owasp10Path, alertsPath, csvOutputPath) {
  // Create a CSV file and write the header
  fs.writeFileSync(csvOutputPath, 'repo_name,alert_no,risk,cwe_id\n')

  // Read and parse the data from owasp10Path
  const owasp10Data = JSON.parse(fs.readFileSync(owasp10Path, 'utf8'))

  // Read and parse the data from alertsPath
  const alertData = JSON.parse(fs.readFileSync(alertsPath, 'utf8'))

  // Iterate over the keys in alertData
  for (const repoName in alertData) {
    const repoData = alertData[repoName]
    console.log(
      `Mapping ${repoName} repo with ${Object.keys(repoData).length} alerts`
    )

    // Iterate over the keys in repoData
    for (const anAlert in repoData) {
      const outputCwes = repoData[anAlert]

      // Iterate over the keys
      for (const aRisk in owasp10Data) {
        let combinedCwes = owasp10Data[aRisk]

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
            `${repoName},${anAlert},${aRisk},${matchingCwe}\n`
          )
        }
      }
    }
  }
}

module.exports = mapRisksToAlerts
