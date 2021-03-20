export type Info = {
  _version: string
  _songName: string
  _songSubName: string
  _songAuthorName: string
  _levelAuthorName: string
  _beatsPerMinute: number
  _songTimeOffset: number
  _shuffle: number
  _shufflePeriod: number
  _previewStartTime: number
  _previewDuration: number
  _songFilename: string
  _coverImageFilename: string
  _environmentName: string
  _customData: {
    _contributors: []
    _customEnvironment: string
    _customEnvironmentHash: string
  }
  _difficultyBeatmapSets: DifficultyBeatmapSet[]
}

export type DifficultyBeatmapSet = {
  _beatmapCharacteristicName: string
  _difficultyBeatmaps: DifficultyBeatmap[]
}

export type DifficultyBeatmap = {
  _difficulty: string
  _difficultyRank: number
  _beatmapFilename: string
  _noteJumpMovementSpeed: number
  _noteJumpStartBeatOffset: number
  _customData: {
    _difficultyLabel: string
    _editorOffset: number
    _editorOldOffset: number
    _warnings: []
    _information: string[]
    _suggestions: []
    _requirements: []
  }
}
