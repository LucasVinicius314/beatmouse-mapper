import * as colors from "colors"
import * as fs from "fs"

import {
	detectMode,
	readLine,
} from "./utils/index"

import { config } from "./config"
import { parseBeatSaber } from "./utils/fileOperations"
import { setup } from "./server"

type BeatmapCharacteristicName =
	| "OneSaber"
	| "Standard"

const main = async () => {
	console.log(
		colors.green(
			`Listing of all songs in input folder (${config.inputDir}/):`,
		),
	)

	const dir = fs.readdirSync(
		config.inputDir,
	)

	dir.forEach((d, k) => {
		console.log(`→ [${k}] ${d}`)
	})

	try {
		const res = await readLine(
			"Select the folder index: ",
		)
		const index = parseInt(res) || 0
		const folder = dir[index]

		if (folder === undefined) {
			throw new Error(
				"Song not found.",
			)
		}

		const res2 = await readLine(
			"OneSaber? (y/n) ",
		)
		const beatmapCharacteristicName: BeatmapCharacteristicName =
			res2.toLowerCase() === "y"
				? "OneSaber"
				: "Standard"

		const res3 = await readLine(
			"Remove impossible notes? (y/n) ",
		)
		const removeImpossibleNotes: boolean =
			res3.toLowerCase() === "y"

		const mode = detectMode(folder)

		console.log(
			colors.green(`Mode: ${mode}`),
		)

		if (mode === "adica") {
			throw new Error(
				"Adica not supported yet.",
			)
		} else {
			await parseBeatSaber({
				beatmapCharacteristicName: beatmapCharacteristicName,
				folder: folder,
				removeImpossibleNotes: removeImpossibleNotes,
			})
		}

		const output = [
			`Name: ${folder}`,
			`Mode: ${mode}`,
			`Characteristic name: ${beatmapCharacteristicName}`,
			`Remove impossible notes: ${removeImpossibleNotes}`,
			`Output folder: ${config.outputDir}/${folder}`,
			`Output zip: ${config.outputDir}/${folder}/${folder}.zip`,
		]

		console.log(
			output
				.map((v) => `→ ${v}`)
				.join("\n"),
		)
		console.log(
			colors.green(
				"Conversion complete.",
			),
		)

		process.exit(0)
	} catch (error) {
		console.log(
			colors.red("Error."),
			error,
		)
		process.exit(1)
	}
}

main()

setup()
