import getStreamForTopic from './utils/getStreamForTopic.js'
import getConsumer from './utils/getConsumer.js'
import droneEventTypeRequest from './event_types/droneEventTypeRequest.js'
import droneEventTypeResponse from './event_types/droneEventTypeResponse.js'
import connectToDb from './utils/connectToDb.js'
import topics from './utils/topics.js'
import getRandomDrone from './utils/getRandomDrone.js'

const stream = getStreamForTopic(topics.allocate_drone)

const consumer = getConsumer()

const consumeList = [topics.get_drone]

consumer
	.on('ready', () => {
		console.log(`Consuming ${consumeList.join(', ')} topic${consumeList.length > 1 ? 's' : ''}`)
		consumer.subscribe(consumeList)
		consumer.consume()
	})
	.on('data', data => {
		const obj = droneEventTypeRequest.fromBuffer(data.value)
		console.log(`→ order: ${obj.orderId}`)

		// check availability
		const drone = {
			droneId: getRandomDrone(),
			orderId: obj.orderId
		}

		connectToDb(collection => collection.insertOne(drone))

		const success = stream.write(droneEventTypeResponse.toBuffer(drone))

		console.log(
			success
				? `← order: ${drone.orderId}, drone: ${drone.droneId}`
				: 'ERROR: message not queued'
		)
	})
	.on('error', error => console.error('Error in the kafka consumer', error))
