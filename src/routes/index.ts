import { Router } from "express"
import { router as convertRouter } from "./convert"

const router = Router()

router.use(convertRouter)

export { router }
