import * as cors from 'cors'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as fileUpload from 'express-fileupload'

import { config } from './config'
import { json } from 'body-parser'
import { router } from './routes'

dotenv.config()

const setup = () => {
	const app = express()

	app.use(cors())
	app.use(json())
	app.use(
		fileUpload({
			debug: true,
			useTempFiles: true,
			tempFileDir: config.tempDir,
			limits: {
				fileSize: 30 * 1024 * 1024,
			},
		}),
	)
	app.use(router)

	app.listen(process.env.PORT)
}

export { setup }
