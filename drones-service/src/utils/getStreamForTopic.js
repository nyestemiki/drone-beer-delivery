import Kafka from 'node-rdkafka'
import config from '../config.js'

const getStreamForTopic = topic => {
	const stream = Kafka.Producer.createWriteStream(
		{
			'metadata.broker.list': `${config.host}:${config.port}`
		},
		{},
		{
			topic
		}
	)

	stream.on('error', error => console.error('Error in the kafka stream', error))

	return stream
}

export default getStreamForTopic
