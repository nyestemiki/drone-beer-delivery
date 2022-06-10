import dotenv from 'dotenv'

dotenv.config()

const config = {
	host: process.env.HOST || 'localhost',
	port: process.env.KAFKA_PORT || 9092,
	dbUrl: `mongodb://${process.env.HOST || 'localhost'}:${process.env.DB_PORT || 27017}`,
	dbName: process.env.DB_NAME || 'beers'
}

export default config
