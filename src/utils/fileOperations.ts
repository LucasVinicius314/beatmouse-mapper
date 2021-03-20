import * as AdmZip from 'adm-zip'
import * as fs from 'fs'

import { BeatmapDifficulty, Info } from '../typescript/beatsaber'

type Mode = 'adica' | 'beatsaber'

type BeatmapCharacteristicName = 'OneSaber' | 'Standard'

const detectMode = (folder: string) => {
  // detect if it's a beat saber map or an adica map
  const exists = fs.existsSync(`songs/input/${folder}/song.desc`)
  const mode: Mode = exists ? 'adica' : 'beatsaber'
  return mode
}

const mkdirSync = (folder: string) => {
  // create folder
  try {
    fs.mkdirSync(`songs/output/${folder}`)
  } catch {}
}

const moveContent = (folder: string) => {
  // fetch folder
  const dir = fs.readdirSync(`songs/input/${folder}`)

  // for each file
  dir.forEach((file) => {
    // copy to output
    fs.copyFileSync(
      `songs/input/${folder}/${file}`,
      `songs/output/${folder}/${file}`
    )
  })
}

const makeZip = (folder: string) => {
  const zip = new AdmZip()
  // fetch folder
  const dir = fs
    .readdirSync(`songs/output/${folder}`)
    .filter((file) => !file.match(/\.zip$/))

  // append each file to zip
  dir.forEach((file) => {
    zip.addLocalFile(`songs/output/${folder}/${file}`)
  })

  // write zip
  zip.writeZip(`songs/output/${folder}/${folder}.zip`)
}

const parseBeatSaber = async (
  folder: string,
  beatmapCharacteristicName: BeatmapCharacteristicName
) => {
  // create output song folder
  mkdirSync(folder)

  // move to output
  moveContent(folder)

  // fetch info.dat
  const info: Info = JSON.parse(
    fs.readFileSync(`songs/input/${folder}/info.dat`, { encoding: 'utf-8' })
  )

  /// build new info
  const newInfo: Info = {
    ...info,
    _difficultyBeatmapSets: [
      {
        _beatmapCharacteristicName: beatmapCharacteristicName,
        _difficultyBeatmaps: info._difficultyBeatmapSets[0]._difficultyBeatmaps.map(
          (v) => {
            // for each difficulty...

            // fetch difficulty
            const difficulty: BeatmapDifficulty = JSON.parse(
              fs.readFileSync(`songs/input/${folder}/${v._beatmapFilename}`, {
                encoding: 'utf-8',
              })
            )

            // build new difficulty
            const newDifficulty: BeatmapDifficulty = {
              ...difficulty,
              _notes: difficulty._notes.map((note) => {
                return {
                  ...note,
                  _type: 1,
                }
              }),
            }

            // build output string
            const newDifficultyJSON = JSON.stringify(newDifficulty)

            // write difficulty file
            fs.writeFileSync(
              `songs/output/${folder}/${v._beatmapFilename}`,
              newDifficultyJSON
            )

            return {
              ...v,
            }
          }
        ),
      },
    ],
  }

  // build output string
  const newInfoJSON = JSON.stringify(newInfo)

  // write info.dat file
  fs.writeFileSync(`songs/output/${folder}/info.dat`, newInfoJSON)

  makeZip(folder)
}

export { detectMode, parseBeatSaber }
