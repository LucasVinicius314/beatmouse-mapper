import * as AdmZip from 'adm-zip'
import * as fs from 'fs'

import { BeatmapDifficulty, Info, Note } from '../typescript/beatsaber'

import { config } from '../config'

type Mode = 'adica' | 'beatsaber'

type BeatmapCharacteristicName = 'OneSaber' | 'Standard'

type ParseOptions = {
  beatmapCharacteristicName?: BeatmapCharacteristicName
  folder: string
  removeImpossibleNotes: boolean
}

const detectMode = (folder: string) => {
  // detect if it's a beat saber map or an adica map
  const exists = fs.existsSync(`${config.inputDir}/${folder}/song.desc`)
  const mode: Mode = exists ? 'adica' : 'beatsaber'
  return mode
}

const mkdirSync = (folder: string) => {
  // create folder
  try {
    fs.mkdirSync(`${config.outputDir}/${folder}`)
  } catch {}
}

const moveContent = (folder: string) => {
  // fetch folder
  const dir = fs.readdirSync(`${config.inputDir}/${folder}`)

  // for each file
  dir.forEach((file) => {
    // copy to output
    fs.copyFileSync(
      `${config.inputDir}/${folder}/${file}`,
      `${config.outputDir}/${folder}/${file}`
    )
  })
}

const makeZip = (folder: string) => {
  const zip = new AdmZip()
  // fetch folder
  const dir = fs
    .readdirSync(`${config.outputDir}/${folder}`)
    .filter((file) => !file.match(/\.zip$/))

  // append each file to zip
  dir.forEach((file) => {
    zip.addLocalFile(`${config.outputDir}/${folder}/${file}`)
  })

  // write zip
  zip.writeZip(`${config.outputDir}/${folder}/${folder}.zip`)
}

const parseBeatSaber = async (options: ParseOptions) => {
  const beatmapCharacteristicName =
    options.beatmapCharacteristicName || 'Standard'
  const folder = options.folder
  const removeImpossibleNotes = options.removeImpossibleNotes || false

  // create output song folder
  mkdirSync(folder)

  // move to output
  moveContent(folder)

  // fetch info.dat
  const info: Info = JSON.parse(
    fs.readFileSync(`${config.inputDir}/${folder}/info.dat`, {
      encoding: 'utf-8',
    })
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
              fs.readFileSync(
                `${config.inputDir}/${folder}/${v._beatmapFilename}`,
                {
                  encoding: 'utf-8',
                }
              )
            )

            const scannedNotes: Note[] = []

            // build new difficulty
            const newDifficulty: BeatmapDifficulty = {
              ...difficulty,
              // parse notes
              _notes: difficulty._notes
                .filter((f) => {
                  const time = f._time
                  const direction = f._cutDirection
                  if (removeImpossibleNotes) {
                    if (
                      !scannedNotes.find(
                        (f2) =>
                          time === f2._time ||
                          (time - f2._time <= config.closeNotesThreshold &&
                            direction === f2._cutDirection &&
                            direction !== 8)
                      )
                    ) {
                      scannedNotes.push(f)
                      return f._time
                    }
                  } else {
                    return f._time
                  }
                })
                .map((note) => {
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
              `${config.outputDir}/${folder}/${v._beatmapFilename}`,
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
  fs.writeFileSync(`${config.outputDir}/${folder}/info.dat`, newInfoJSON)

  makeZip(folder)
}

export { detectMode, parseBeatSaber }
