import getStreamForTopic from './utils/getStreamForTopic.js'
import getConsumer from './utils/getConsumer.js'
import beerEventTypeRequest from './event_types/beerEventTypeRequest.js'
import beerEventTypeResponse from './event_types/beerEventTypeResponse.js'
import topics from './utils/topics.js'
import connectToDb from './utils/connectToDb.js'

const stream = getStreamForTopic(topics.allocate_beer)

const consumer = getConsumer()

consumer
	.on('ready', () => {
		console.log('consumer ready')
		consumer.subscribe([topics.get_beer])
		consumer.consume()
	})
	.on('data', data => {
		const obj = beerEventTypeRequest.fromBuffer(data.value)
		console.log(`received message: ${obj}`)

		// check stock
		const beer = {
			amount: obj.amount,
			orderId: obj.orderId
		}

		connectToDb(collection => collection.insertOne(beer))

		const success = stream.write(
			beerEventTypeResponse.toBuffer({
				onStock: obj.amount,
				orderId: obj.orderId
			})
		)

		console.log(`message ${success ? '' : 'not '}queued`)
	})
	.on('error', error => console.error('Error in the kafka consumer', error))
