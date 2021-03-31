import * as AdmZip from 'adm-zip'
import * as fs from 'fs'
import * as path from 'path'

import { Router } from 'express'
import { config } from '../config'
import { parseBeatSaber } from '../utils/fileOperations'

type BeatmapCharacteristicName = 'OneSaber' | 'Standard'

const router = Router()

router.post('/convert', async (req, res) => {
	console.log(req.files)

	try {
		const file = req.files.file
		if (!file) {
			throw new Error('Missing zip file.')
		}

		const _file = Array.isArray(file) ? file[0] : file
		if (
			_file.mimetype !== 'application/zip' &&
			_file.mimetype !== 'application/x-zip-compressed'
		) {
			throw new Error('Not a zip file.')
		}

		const beatmapCharacteristicName: BeatmapCharacteristicName = 'OneSaber'
		const folder = _file.name.replace(/\.zip$/, '')
		const removeImpossibleNotes = true

		const zip = new AdmZip(_file.tempFilePath)

		try {
			fs.mkdirSync(`songs`, { recursive: true })
			fs.mkdirSync(`${config.inputDir}`, { recursive: true })
			fs.mkdirSync(`${config.outputDir}`, { recursive: true })
			fs.mkdirSync(`${config.inputDir}/${folder}`, { recursive: true })
			fs.mkdirSync(`${config.outputDir}/${folder}`, { recursive: true })
		} catch {}

		console.log('listing')
		console.log(fs.readdirSync(config.inputDir))
		console.log(fs.readdirSync(config.outputDir))

		zip.extractAllTo(`${config.inputDir}/${folder}`, true)

		await parseBeatSaber({
			beatmapCharacteristicName: beatmapCharacteristicName,
			folder: folder,
			removeImpossibleNotes: removeImpossibleNotes,
		})

		// res.sendFile(`${folder}/${_file.name}`, {
		// 	root: path.join(__dirname, `../../${config.outputDir}`),
		// })

		const out = {}

		fs.readdirSync(`${config.outputDir}/${folder}`)
			.filter((f) => f.match(/\.zip$/) === null)
			.forEach((v) => {
				console.log('reading ' + v)
				out[v] = fs.readFileSync(`${config.outputDir}/${folder}/${v}`, {
					encoding: 'utf-8',
				})
			})

		res.send(out)
	} catch (error) {
		console.log(error)
		res.status(400).json({
			message: error,
		})
	}
})

export { router }
