import * as colors from 'colors'
import * as fs from 'fs'

import { detectMode, readLine } from './utils/index'

import { parseBeatSaber } from './utils/fileOperations'

type BeatmapCharacteristicName = 'OneSaber' | 'Standard'

const main = async () => {
  console.log(
    colors.green('Listing of all songs in input folder (songs/input/):')
  )

  const dir = fs.readdirSync('songs/input')

  dir.forEach((d, k) => {
    console.log(`→ [${k}] ${d}`)
  })

  try {
    const res = await readLine('Select the folder index: ')
    const index = parseInt(res) || 0
    const folder = dir[index]

    if (folder === undefined) {
      throw new Error('Song not found')
    }

    const res2 = await readLine('OneSaber? (y/n) ')
    const beatmapCharacteristicName: BeatmapCharacteristicName =
      res2.toLowerCase() === 'y' ? 'OneSaber' : 'Standard'

    const mode = detectMode(folder)

    console.log(colors.green(`Mode: ${mode}`))

    if (mode === 'adica') {
      throw new Error('Adica not supported yet')
    } else {
      await parseBeatSaber(folder, beatmapCharacteristicName)
    }

    const output = [
      `Name: ${folder}`,
      `Mode: ${mode}`,
      `Characteristic name: ${beatmapCharacteristicName}`,
      `Output folder: songs/output/${folder}`,
      `Output zip: songs/output/${folder}/${folder}.zip`,
    ]

    console.log(colors.green('Conversion complete'))
    console.log(output.map((v) => `→ ${v}`).join('\n'))
    console.log(colors.green('Conversion complete.'))

    process.exit(0)
  } catch (error) {
    console.log(colors.red('Error'), error)
    process.exit(1)
  }
}

main()
