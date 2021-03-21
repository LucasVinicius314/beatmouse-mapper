import { Config } from './typescript/index'

const config: Config = {
  inputDir: 'songs/input',
  outputDir: 'songs/output',
  closeSimilarNotesThreshold: 1,
  closeNotesThreshold: 0.05,
}

export { config }
