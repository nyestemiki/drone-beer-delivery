import getStreamForTopic from './utils/getStreamForTopic.js'
import getConsumer from './utils/getConsumer.js'
import droneEventTypeRequest from './event_types/droneEventTypeRequest.js'
import droneEventTypeResponse from './event_types/droneEventTypeResponse.js'
import connectToDb from './utils/connectToDb.js'
import topics from './utils/topics.js'

const stream = getStreamForTopic(topics.allocate_drone)

const consumer = getConsumer()

consumer
	.on('ready', () => {
		console.log('consumer ready')
		consumer.subscribe([topics.get_drone])
		consumer.consume()
	})
	.on('data', data => {
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
