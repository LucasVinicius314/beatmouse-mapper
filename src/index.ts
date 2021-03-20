import * as colors from 'colors'
import * as fs from 'fs'

import { detectMode, parseAdica, readLine } from './utils/index'

import { parseBeatSaber } from './utils/fileOperations'

type Mode = 'adica' | 'beatsaber'

const mode: Mode = 'adica'

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

    const mode = detectMode(folder)

    console.log(colors.green(`Selected song: ${folder}, mode: ${mode}`))

    if (mode === 'adica') {
      await parseAdica(folder)
    } else {
      await parseBeatSaber(folder)
    }
  } catch (error) {
    console.log(colors.red('Error'), error)
    process.exit(1)
  }
}

main()
