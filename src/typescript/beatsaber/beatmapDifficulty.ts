export type BeatmapDifficulty = {
  _version: string
  _BPMChanges: []
  _events: Event[]
  _notes: Note[]
  _obstacles: Obstacle[]
  _bookmarks: Bookmark[]
}

export type Event = {
  _time: number
  _type: number
  _value: number
}

export type Note = {
  _time: number
  _lineIndex: number
  _lineLayer: number
  _type: number
  _cutDirection: number
}

export type Obstacle = {
  _time: number
  _lineIndex: number
  _type: number
  _duration: number
  _width: number
}

export type Bookmark = {
  _time: number
  _name: string
}
