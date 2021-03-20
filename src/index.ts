import * as colors from 'colors'
import * as fs from 'fs'

import { Info } from './typescript/beatsaber'
import { readLine } from './utils/index'

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
    console.log(colors.green(`Selected song: ${folder}, mode: `))
  } catch {}
}

main()
