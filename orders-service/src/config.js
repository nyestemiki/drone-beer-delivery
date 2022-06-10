import dotenv from 'dotenv'

dotenv.config()

const config = {
	host: process.env.HOST || 'localhost',
	kafkaPort: process.env.KAFKA_PORT || 9092,
	servicePort: process.env.SERVICE_PORT || 4000,
	dbUrl: `mongodb://${process.env.HOST || 'localhost'}:${process.env.DB_PORT || 27017}`,
	dbName: process.env.DB_NAME || 'orders'
}

export default config
