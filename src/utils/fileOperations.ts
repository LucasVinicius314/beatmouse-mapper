import * as fs from 'fs'

import {
  BeatmapDifficulty,
  DifficultyBeatmap,
  Info,
  Note,
} from '../typescript/beatsaber'
import { CueObect, Desc } from '../typescript/adica'

type Mode = 'adica' | 'beatsaber'

type DetectMode = (folder: string) => Mode

const detectMode: DetectMode = (folder: string) => {
  const exists = fs.existsSync(`songs/input/${folder}/song.desc`)
  return exists ? 'adica' : 'beatsaber'
}

const mkdirSync = (folder: string) => {
  try {
    fs.mkdirSync(`songs/output/${folder}`)
  } catch {}
}

const parseAdica = async (folder: string) => {
  mkdirSync(folder)

  const desc: Desc = JSON.parse(
    fs.readFileSync(`songs/input/${folder}/song.desc`, { encoding: 'utf-8' })
  )

  const cues = fs
    .readdirSync(`songs/input/${folder}/`)
    .filter((file) => {
      return file.match(/\.cues$/) !== null
    })
    .map((file) => {
      return file.replace(/\.cues$/, '')
    })

  const info: Info = {
    _beatsPerMinute: desc.tempo,
    _coverImageFilename: 'cover.jpg',
    _customData: {
      _contributors: [],
      _customEnvironment: '',
      _customEnvironmentHash: '',
    },
    _difficultyBeatmapSets: [
      {
        _beatmapCharacteristicName: 'OneSaber',
        _difficultyBeatmaps: cues.map((cue) => {
          const cueInfo: CueObect = JSON.parse(
            fs.readFileSync(`songs/input/${folder}/${cue}.cues`, {
              encoding: 'utf-8',
            })
          )

          // const notes: Note[] = cueInfo.cues.map((v) => {
          //   return({
          //     _time: v.
          //   })
          // })

          const beatmapDifficulty: BeatmapDifficulty = {
            _BPMChanges: [],
            _bookmarks: [],
            _events: [],
            _notes: [],
            _obstacles: [],
            _version: '1.0.0',
          }

          const jsonCueInfo = JSON.stringify(beatmapDifficulty)

          fs.writeFileSync(`songs/output/${folder}/${cue}.dat`, jsonCueInfo)

          const difficultyBeatmap: DifficultyBeatmap = {
            _beatmapFilename: `${cue}.dat`,
            _customData: {
              _difficultyLabel: '',
              _editorOffset: 0,
              _editorOldOffset: 0,
              _information: ['Info'],
              _requirements: [],
              _suggestions: [],
              _warnings: [],
            },
            _difficulty: 'Expert',
            _difficultyRank: 7,
            _noteJumpMovementSpeed: 14,
            _noteJumpStartBeatOffset: 0,
          }

          return difficultyBeatmap
        }),
      },
    ],
    _environmentName: '',
    _levelAuthorName: desc.author,
    _previewDuration: 20,
    _previewStartTime: desc.previewStartSeconds,
    _shuffle: 0,
    _shufflePeriod: desc.prerollSeconds,
    _songAuthorName: desc.artist,
    _songFilename: desc.moggMainSong,
    _songName: desc.title,
    _songSubName: '',
    _songTimeOffset: desc.offset,
    _version: '1.0.0',
  }

  console.log(cues)

  // console.log('desc', desc)
  // console.log('info', info)
}

const parseBeatSaber = async (folder: string) => {
  mkdirSync(folder)

  const info: Info = JSON.parse(
    fs.readFileSync(`songs/input/${folder}/info.dat`, { encoding: 'utf-8' })
  )

  const cues = fs
    .readdirSync(`songs/input/${folder}/`)
    .filter((file) => {
      return file.match(/\.cues$/) !== null
    })
    .map((file) => {
      return file.replace(/\.cues$/, '')
    })

  // const info: Info = {
  //   _beatsPerMinute: desc.tempo,
  //   _coverImageFilename: 'cover.jpg',
  //   _customData: {
  //     _contributors: [],
  //     _customEnvironment: '',
  //     _customEnvironmentHash: '',
  //   },
  //   _difficultyBeatmapSets: [
  //     {
  //       _beatmapCharacteristicName: 'OneSaber',
  //       _difficultyBeatmaps: cues.map((cue) => {
  //         const cueInfo: CueObect = JSON.parse(
  //           fs.readFileSync(`songs/input/${folder}/${cue}.cues`, {
  //             encoding: 'utf-8',
  //           })
  //         )

  //         // const notes: Note[] = cueInfo.cues.map((v) => {
  //         //   return({
  //         //     _time: v.
  //         //   })
  //         // })

  //         const beatmapDifficulty: BeatmapDifficulty = {
  //           _BPMChanges: [],
  //           _bookmarks: [],
  //           _events: [],
  //           _notes: [],
  //           _obstacles: [],
  //           _version: '1.0.0',
  //         }

  //         const jsonCueInfo = JSON.stringify(beatmapDifficulty)

  //         fs.writeFileSync(`songs/output/${folder}/${cue}.dat`, jsonCueInfo)

  //         const difficultyBeatmap: DifficultyBeatmap = {
  //           _beatmapFilename: `${cue}.dat`,
  //           _customData: {
  //             _difficultyLabel: '',
  //             _editorOffset: 0,
  //             _editorOldOffset: 0,
  //             _information: ['Info'],
  //             _requirements: [],
  //             _suggestions: [],
  //             _warnings: [],
  //           },
  //           _difficulty: 'Expert',
  //           _difficultyRank: 7,
  //           _noteJumpMovementSpeed: 14,
  //           _noteJumpStartBeatOffset: 0,
  //         }

  //         return difficultyBeatmap
  //       }),
  //     },
  //   ],
  //   _environmentName: '',
  //   _levelAuthorName: desc.author,
  //   _previewDuration: 20,
  //   _previewStartTime: desc.previewStartSeconds,
  //   _shuffle: 0,
  //   _shufflePeriod: desc.prerollSeconds,
  //   _songAuthorName: desc.artist,
  //   _songFilename: desc.moggMainSong,
  //   _songName: desc.title,
  //   _songSubName: '',
  //   _songTimeOffset: desc.offset,
  //   _version: '1.0.0',
  // }

  // console.log(cues)

  // console.log('desc', desc)
  // console.log('info', info)
}

export { detectMode, parseAdica, parseBeatSaber }
