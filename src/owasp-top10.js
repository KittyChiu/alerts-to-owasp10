// Import
const fs = require('fs')
const path = require('path')

/**
 * extractControlsCweIds(directory, indexFile)
 *
 * This function reads an index file from the given directory, extracts markdown file paths from the index file,
 * then reads each markdown file and extracts CWE identifiers and associated data. The data from all files is combined
 * into a single object.
 */
function extractControlsCweIds(directory, indexFile) {
  // Append directory to index file path
  const indexFilePath = path.join(directory, indexFile)

  // Extract markdown file paths
  const markdownFiles = extractControls(indexFilePath)

  // Initialize combined CWE IDs object
  const combinedData = {}

  // Iterate over markdown files
  for (const filePath of markdownFiles) {
    // Append directory to file path
    const fullFilePath = path.join(directory, filePath)

    // Extract CWE IDs
    const cweIds = extractCweIds(fullFilePath)

    // Combine CWE IDs
    for (const key in cweIds) {
      if (combinedData[key]) {
        // If the key already exists in the combinedData object, merge the values
        combinedData[key] = [...new Set([...combinedData[key], ...cweIds[key]])]
      } else {
        combinedData[key] = cweIds[key]
      }
    }
  }

  return combinedData
}

/**
 * extractControls(filePath)
 *
 * This function reads a file, finds a specific section, and extracts markdown file paths from that section.
 */
function extractControls(filePath) {
  // Read the file
  const data = fs.readFileSync(path.join(__dirname, filePath), 'utf8')

  // Find the section "List of Mapped CWEs"
  const sectionStart = data.indexOf("What's changed in the Top 10 for 2021")

  // Find the next 2nd level heading
  const sectionEnd = data.indexOf('\n##', sectionStart)

  const section = data.slice(
    sectionStart,
    sectionEnd !== -1 ? sectionEnd : undefined
  )

  const regex = /\((.*?)\.md\)/g
  const matches = [...section.matchAll(regex)]

  // Extract the file paths from the matches
  const ids = matches.map(match => `${match[1]}.md`)

  return ids
}

/**
 * extractCweIds(filePath)
 *
 * This function reads a file, finds a specific section, and extracts CWE identifiers from that section.
 */
function extractCweIds(filePath) {
  // Read the file
  const data = fs.readFileSync(path.join(__dirname, filePath), 'utf8')

  // Find the section "List of Mapped CWEs"
  const sectionStart = data.indexOf('List of Mapped CWEs')

  // Find the next 2nd level heading
  const sectionEnd = data.indexOf('\n##', sectionStart)

  const section = data.slice(
    sectionStart,
    sectionEnd !== -1 ? sectionEnd : undefined
  )

  // Use a regular expression to find all instances of "CWE-" followed by numbers
  const regex = /CWE-\d+/g
  const ids = section.match(regex)

  // Get the value from the first line after "#"
  const regexValue = /#(.*?)\n/g
  const matchValue = regexValue.exec(data)

  const json = {}

  if (matchValue) {
    const value = matchValue[1].trim()

    // Remove the image syntax
    const imageRegex = /!\[.*?\]\(.*?\)/g
    const styleBracketsRegex = /{.*?}/g
    const cleanedValue = value
      .replace(imageRegex, '')
      .replace(styleBracketsRegex, '')
      .trim()

    json[cleanedValue] = ids
  }

  return json
}

module.exports = {
  extractControlsCweIds,
  extractControls,
  extractCweIds
}
