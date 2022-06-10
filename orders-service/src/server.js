import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import expressWinston from 'express-winston'
import winston from 'winston'
import config from './config.js'

const server = () => {
	const app = express()

	app.use(cors())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())

	// Logging
	app.use(
		expressWinston.logger({
			transports: [
				new winston.transports.File({
					filename: './logs/info.logs',
					level: 'info'
				}),
				new winston.transports.File({
					filename: './logs/error.logs',
					level: 'error'
				})
			],
			format: winston.format.printf(
				info =>
					`${info.level} : winston : ${info.message} : ${info.meta.res.statusCode} : ${info.meta.responseTime}ms`
			)
		})
	)

	// Health check
	app.get('/', (_, res) => res.send('All good!'))

	app.listen(config.servicePort, () =>
		console.log(`Server running on http://${config.host}:${config.servicePort}`)
	)

	return app
}

export default server
