import * as colors from "colors"
import * as readline from "readline"

type ReadLine = (
	question: string,
) => Promise<string>

const readLine: ReadLine = async (
	question: string,
) => {
	const rl = readline.createInterface(
		{
			input: process.stdin,
			output: process.stdout,
		},
	)
	return await new Promise(
		resolve => {
			rl.question(
				colors.yellow(question),
				(text: string) => {
					rl.close()
					resolve(text || "")
				},
			)
		},
	)
}

export { readLine }
