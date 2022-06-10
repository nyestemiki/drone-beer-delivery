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

	const consumeList = [topics.allocate_drone, topics.allocate_beer]

	consumer
		.on('ready', async () => {
			console.log(
				`Consuming ${consumeList.join(', ')} topic${consumeList.length > 1 ? 's' : ''}`
			)
			consumer.subscribe(consumeList)
			consumer.consume()
		})
		.on('data', data => {
			switch (data.topic) {
				case topics.allocate_drone:
					const droneResponse = droneEventTypeResponse.fromBuffer(data.value)
					console.log(
						`→ 🚁DRONE (order: ${droneResponse.orderId}, drone: ${droneResponse.droneId})`
					)
					connectToDb(
						updateItem(droneResponse.orderId, { droneId: droneResponse.droneId })
					)
					break
				case topics.allocate_beer:
					const beerResponse = beerEventTypeResponse.fromBuffer(data.value)
					console.log(
						`→ 🍻BEER (order: ${beerResponse.orderId}, onStock: ${beerResponse.onStock})`
					)
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
