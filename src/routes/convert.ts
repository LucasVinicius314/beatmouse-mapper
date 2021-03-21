import * as AdmZip from 'adm-zip'
import * as fs from 'fs'

import { Router } from 'express'
import { config } from '../config'

const router = Router()

router.post('/convert', (req, res) => {
	try {
		const file = req.files.file
		if (!file) {
			throw new Error('Missing zip file.')
		}

		const _file = Array.isArray(file) ? file[0] : file
		if (_file.mimetype !== 'application/zip') {
			throw new Error('Not a zip file.')
		}

		const zip = new AdmZip(_file.tempFilePath)

		zip.extractAllTo(`${config.outputDir}/${_file.name}`, true)

		res.json({
			message: 'Uploaded',
		})
	} catch (error) {
		res.status(400).json({
			message: error,
		})
	}
})

export { router }
