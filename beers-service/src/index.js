import getStreamForTopic from './utils/getStreamForTopic.js'
import getConsumer from './utils/getConsumer.js'
import beerEventTypeRequest from './event_types/beerEventTypeRequest.js'
import beerEventTypeResponse from './event_types/beerEventTypeResponse.js'
import topics from './utils/topics.js'
import connectToDb from './utils/connectToDb.js'
import getRandomAmount from './utils/getRandomAmount.js'

const stream = getStreamForTopic(topics.allocate_beer)

const consumer = getConsumer()

const consumeList = [topics.get_beer]

consumer
	.on('ready', () => {
		console.log(`Consuming ${consumeList.join(', ')} topic${consumeList.length > 1 ? 's' : ''}`)
		consumer.subscribe(consumeList)
		consumer.consume()
	})
	.on('data', data => {
		const obj = beerEventTypeRequest.fromBuffer(data.value)
		console.log(`→ order: ${obj.orderId}`)

		// check stock
		const beer = {
			amount: obj.amount,
			orderId: obj.orderId
		}

		connectToDb(collection => collection.insertOne(beer))

		const success = stream.write(
			beerEventTypeResponse.toBuffer({
				onStock: getRandomAmount(),
				orderId: obj.orderId
			})
		)

		console.log(
			success
				? `← order: ${beer.orderId}, amount: ${beer.amount}, onStock: ${obj.amount}`
				: 'ERROR: message not queued'
		)
	})
	.on('error', error => console.error('Error in the kafka consumer', error))
