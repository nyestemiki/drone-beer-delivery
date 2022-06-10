import beerEventTypeRequest from '../event_types/beerEventTypeRequest.js'
import droneEventTypeRequest from '../event_types/droneEventTypeRequest.js'
import getStreamForTopic from '../utils/getStreamForTopic.js'
import topics from '../utils/topics.js'
import { ObjectId } from 'mongodb'
import connectToDb from '../utils/connectToDb.js'

// Streams
const droneStream = getStreamForTopic(topics.get_drone)
droneStream.on('error', error => console.error('Error in the kafka stream (DRONES)', error))
const beerStream = getStreamForTopic(topics.get_beer)
beerStream.on('error', error => console.error('Error in the kafka stream (BEER)', error))

export const orderBeerAndDrone = ({ orderId, amount }) => {
	queueMessage(
		`🚁 DRONE (order: ${orderId})`,
		droneStream,
		droneEventTypeRequest.toBuffer({ orderId })
	)
	queueMessage(
		`🍻 BEER (order: ${orderId}, amount: ${amount})`,
		beerStream,
		beerEventTypeRequest.toBuffer({ amount, orderId })
	)
}

const queueMessage = (name, stream, message) => {
	const success = stream.write(message)
	console.log(success ? `← ${name}` : `ERROR (${name}): message not queued`)
}

export const getOrder = async orderId =>
	await connectToDb(async collection => await collection.findOne({ _id: ObjectId(orderId) }))
