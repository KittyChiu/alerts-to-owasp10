const fs = require('fs')
const mapRisksToAlerts = require('../src/map') // replace './map' with the actual path to the module

describe('mapRisksToAlerts', () => {
  it('should create a CSV file with the correct data', () => {
    // Call the function with test data
    mapRisksToAlerts(
      'test/sample_data/owasp10.json',
      'test/sample_data/alerts.json',
      'mapping.csv'
    )

    // Read the created CSV file
    const csvData = fs.readFileSync('mapping.csv', 'utf8')

    // Compare the CSV data with a snapshot
    expect(csvData).toMatchSnapshot()
  })
})
