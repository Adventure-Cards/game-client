const { writeFile } = require('fs/promises')
const { GoogleSpreadsheet } = require('google-spreadsheet')

const sheetNames = [
  'creatures',
  'spells',
  'artifacts',
  'enchantments',
  'locations',
  'modifiers',
  'abilities',
  'costs',
  'effects',
]

async function loadAdditionalCardData() {
  const doc = new GoogleSpreadsheet('1ZfwQ4sVlR8x7mpz2iimLwnUFGNeUdJSGLCm-zwJVZbw')
  doc.useApiKey(process.env.GOOGLE_API_KEY)

  await doc.loadInfo()

  for (const sheetName of sheetNames) {
    const sheet = doc.sheetsByTitle[sheetName]

    const rows = await sheet.getRows()
    const headers = sheet.headerValues

    const result = rows.map((row) => {
      const res = {}

      for (const header of headers) {
        res[header] = row[header] || ''
      }

      return res
    })

    const final = `export default ${JSON.stringify(result)}`

    await writeFile(`./data/${sheetName}.js`, final)
  }
}

loadAdditionalCardData()
