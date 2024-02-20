const fs = require('fs')
const path = require('path')
const { exec: execCb } = require('child_process')
const util = require('util')

// Convert exec and copyFile to promise-based functions
const exec = util.promisify(execCb)
const copyFile = util.promisify(fs.copyFile)

// The URL of the repository
const repoUrl = 'https://github.com/OWASP/Top10.git'

async function cloneAndCopy() {
  try {
    // Define the source and destination directories
    const sourceDir = path.join(__dirname, '../Top10')
    const destDir = path.join(__dirname, '../data/Top10')

    // If the source directory already exists, remove it
    if (fs.existsSync(sourceDir)) {
      fs.rmdirSync(sourceDir, { recursive: true })
    }

    // Clone the repository
    console.log('Cloning the OWASP Top 10 repository...')
    const { stdout, stderr } = await exec(`git clone ${repoUrl}`)

    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)

    // Create the destination directory if it doesn't exist
    fs.mkdirSync(destDir, { recursive: true })

    // Read the source directory
    const files = fs.readdirSync(sourceDir)

    // Copy each markdown file to the destination directory
    for (const file of files) {
      if (path.extname(file) === '.md') {
        await copyFile(path.join(sourceDir, file), path.join(destDir, file))
      }
    }
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}

module.exports = {
  cloneAndCopy
}
