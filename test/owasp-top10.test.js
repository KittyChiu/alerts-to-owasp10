const { constants } = require('buffer')
const {
  extractControlsCweIds,
  extractControls,
  extractCweIds
} = require('../src/owasp-top10')
const fs = require('fs').promises // Import the promises version of fs

describe('extractControlsCweIds', () => {
  it('should correctly combine CWE IDs', () => {
    // Exercise
    const extractControlsCweIdsResult = extractControlsCweIds(
      '../test/sample_data/Top10/2021/docs/',
      'index.md'
    )

    // Write the result to a file
    fs.writeFile(
      './owasp10.json',
      JSON.stringify(extractControlsCweIdsResult, null, 2)
    )

    // Verify
    expect(extractControlsCweIdsResult).toMatchSnapshot()
  })
})

test('extracts data from ../test/sample_data/2021-index.md', () => {
  const extractControlsResult = extractControls(
    '../test/sample_data/2021-index.md'
  )

  // Replace with your expected result
  const extractControlsExpectedResult = [
    'A01_2021-Broken_Access_Control.md',
    'A02_2021-Cryptographic_Failures.md',
    'A03_2021-Injection.md',
    'A04_2021-Insecure_Design.md',
    'A05_2021-Security_Misconfiguration.md',
    'A06_2021-Vulnerable_and_Outdated_Components.md',
    'A07_2021-Identification_and_Authentication_Failures.md',
    'A08_2021-Software_and_Data_Integrity_Failures.md',
    'A09_2021-Security_Logging_and_Monitoring_Failures.md',
    'A10_2021-Server-Side_Request_Forgery_(SSRF).md'
  ]

  expect(extractControlsResult).toEqual(extractControlsExpectedResult)
})

test('extracts data from ../test/sample_data/control01.md', () => {
  const extractCweIdsResult = extractCweIds('../test/sample_data/control01.md')

  // Replace with your expected result
  const extractCweIdsExpectedResult = {
    'A01:2021 – Broken Access Control': [
      'CWE-22',
      'CWE-23',
      'CWE-35',
      'CWE-59',
      'CWE-200',
      'CWE-201',
      'CWE-219',
      'CWE-264',
      'CWE-275',
      'CWE-276',
      'CWE-284',
      'CWE-285',
      'CWE-352',
      'CWE-359',
      'CWE-377',
      'CWE-402',
      'CWE-425',
      'CWE-441',
      'CWE-497',
      'CWE-538',
      'CWE-540',
      'CWE-548',
      'CWE-552',
      'CWE-566',
      'CWE-601',
      'CWE-639',
      'CWE-651',
      'CWE-668',
      'CWE-706',
      'CWE-862',
      'CWE-863',
      'CWE-913',
      'CWE-922',
      'CWE-1275'
    ]
  }

  expect(extractCweIdsResult).toEqual(extractCweIdsExpectedResult)
})
