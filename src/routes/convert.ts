import * as AdmZip from 'adm-zip'
import * as path from 'path'

import { Router } from 'express'
import { config } from '../config'
import { parseBeatSaber } from '../utils/fileOperations'

type BeatmapCharacteristicName = 'OneSaber' | 'Standard'

const router = Router()

router.post('/convert', async (req, res) => {
	try {
		const file = req.files.file
		if (!file) {
			throw new Error('Missing zip file.')
		}

		const _file = Array.isArray(file) ? file[0] : file
		if (_file.mimetype !== 'application/zip') {
			throw new Error('Not a zip file.')
		}

		const beatmapCharacteristicName: BeatmapCharacteristicName = 'OneSaber'
		const folder = _file.name.replace(/\.zip$/, '')
		const removeImpossibleNotes = true

		const zip = new AdmZip(_file.tempFilePath)

		zip.extractAllTo(`${config.inputDir}/${folder}`, true)

		await parseBeatSaber({
			beatmapCharacteristicName: beatmapCharacteristicName,
			folder: folder,
			removeImpossibleNotes: removeImpossibleNotes,
		})

		res.sendFile(`${folder}/${_file.name}`, {
			root: path.join(__dirname, `../../${config.outputDir}`),
		})
	} catch (error) {
		console.log(error)
		res.status(400).json({
			message: error,
		})
	}
})

export { router }
