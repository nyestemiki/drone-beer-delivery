import { ObjectId } from 'mongodb'
import beerEventTypeResponse from './event_types/beerEventTypeResponse.js'
import droneEventTypeResponse from './event_types/droneEventTypeResponse.js'
import getConsumer from './utils/getConsumer.js'
import topics from './utils/topics.js'
import connectToDb from './utils/connectToDb.js'

const consume = () => {
	// Consumer for the test topic
	const consumer = getConsumer()

	consumer.connect()

	consumer
		.on('ready', async () => {
			console.log('consumer ready')
			consumer.subscribe([topics.allocate_drone, topics.allocate_beer])
			consumer.consume()
		})
		.on('data', data => {
			switch (data.topic) {
				case topics.allocate_drone:
					const droneResponse = droneEventTypeResponse.fromBuffer(data.value)
					console.log(`received message: ${droneResponse}`)
					connectToDb(
						updateItem(droneResponse.orderId, { droneId: droneResponse.droneId })
					)
					break
				case topics.allocate_beer:
					const beerResponse = beerEventTypeResponse.fromBuffer(data.value)
					console.log(`received message: ${beerResponse}`)
					connectToDb(updateItem(beerResponse.orderId, { onStock: beerResponse.onStock }))
					break
				default:
					console.log(`received message: ${data.value}`)
					break
			}
		})
		.on('error', error => console.error('Error in the kafka consumer', error))

	return consumer
}

const updateItem = (id, obj) => collection =>
	collection.updateOne({ _id: ObjectId(id) }, { $set: obj })

export default consume
