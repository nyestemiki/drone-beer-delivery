import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import getStreamForTopic from './utils/getStreamForTopic.js'
import getConsumer from './utils/getConsumer.js'
import droneEventTypeRequest from './event_types/droneEventTypeRequest.js'
import droneEventTypeResponse from './event_types/droneEventTypeResponse.js'

dotenv.config()

const config = {
	host: process.env.HOST || 'localhost',
	port: process.env.KAFKA_PORT || 9092
}

const dbConfig = {
	url: `mongodb://${config.host}:${process.env.DB_PORT || 27017}`,
	dbName: process.env.DB_NAME || 'drones'
}

const topics = {
	get_drone: 'get_drone',
	get_beer: 'get_beer',
	allocate_drone: 'allocate_drone',
	allocate_beer: 'allocate_beer'
}

const client = new MongoClient(dbConfig.url)

const connectToDb = async callback => {
	try {
		await client.connect()

		const db = client.db(dbConfig.dbName)
		const collection = db.collection('drones_collection')

		return await callback(collection)
	} catch (error) {
		console.error(error)
	} finally {
		client.close()
	}
}

// Stream for the test topic
const stream = getStreamForTopic(topics.allocate_drone, config)
stream.on('error', error => console.error('Error in the kafka stream', error))

// Consumer for the test topic
const consumer = getConsumer(config)
consumer.connect()
consumer
	.on('ready', () => {
		console.log('consumer ready')
		consumer.subscribe([topics.get_drone])
		consumer.consume()
	})
	.on('data', data => {
		console.log('consuming data')
		const obj = droneEventTypeRequest.fromBuffer(data.value)
		console.log(`received message: ${obj}`)

		// check availability
		const drone = {
			droneId: '1234',
			orderId: obj.orderId
		}

		connectToDb(collection => collection.insertOne(drone))

		const success = stream.write(droneEventTypeResponse.toBuffer(drone))

		console.log(`message ${success ? '' : 'not '}queued`)
	})
	.on('error', error => console.error('Error in the kafka consumer', error))
