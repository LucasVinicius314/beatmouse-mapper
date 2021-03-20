export type CueObect = {
  cues: Cue[]
  NRCueData: NRCueData
}

export type Cue = {
  tick: number
  tickLength: number
  pitch: number
  velocity: number
  gridOffset: {
    x: number
    y: number
  }
  zOffset: number
  handType: number
  behavior: number
}

export type NRCueData = {
  Version: number
  pathBuilderNoteCues: PathBuilderNoteCue[]
  pathBuilderNoteData: PathBuilderNoteData[]
}

export type PathBuilderNoteCue = {
  tick: number
  tickLength: number
  pitch: number
  velocity: number
  gridOffset: {
    x: number
    y: number
  }
  zOffset: number
  handType: number
  behavior: number
}

export type PathBuilderNoteData = {
  _behavior: number
  _velocity: number
  _handType: number
  _interval: number
  _initialAngle: number
  _angle: number
  _angleIncrement: number
  _stepDistance: number
  _stepIncrement: number
}
