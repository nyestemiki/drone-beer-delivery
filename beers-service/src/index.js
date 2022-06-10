import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import getStreamForTopic from './utils/getStreamForTopic.js'
import getConsumer from './utils/getConsumer.js'
import beerEventTypeRequest from './event_types/beerEventTypeRequest.js'
import beerEventTypeResponse from './event_types/beerEventTypeResponse.js'

dotenv.config()

const config = {
	host: process.env.HOST || 'localhost',
	port: process.env.KAFKA_PORT || 9092
}

const dbConfig = {
	url: `mongodb://${config.host}:${process.env.DB_PORT || 27017}`,
	dbName: process.env.DB_NAME || 'beers'
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
		const collection = db.collection('beers_collection')

		return await callback(collection)
	} catch (error) {
		console.error(error)
	} finally {
		client.close()
	}
}

// Stream for the test topic
const stream = getStreamForTopic(topics.allocate_beer, config)
stream.on('error', error => console.error('Error in the kafka stream', error))

// Consumer for the test topic
const consumer = getConsumer(config)
consumer.connect()
consumer
	.on('ready', () => {
		console.log('consumer ready')
		consumer.subscribe([topics.get_beer])
		consumer.consume()
	})
	.on('data', async data => {
		const obj = beerEventTypeRequest.fromBuffer(data.value)
		console.log(`received message: ${obj}`)

		// check stock
		const beer = {
			amount: obj.amount,
			orderId: obj.orderId
		}

		await connectToDb(collection => collection.insertOne(beer))

		const success = stream.write(
			beerEventTypeResponse.toBuffer({
				onStock: obj.amount,
				orderId: obj.orderId
			})
		)

		console.log(`message ${success ? '' : 'not '}queued`)
	})
	.on('error', error => console.error('Error in the kafka consumer', error))
