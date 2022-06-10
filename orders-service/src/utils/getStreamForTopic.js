import Kafka from 'node-rdkafka'
import config from '../config.js'

const getStreamForTopic = topic =>
	Kafka.Producer.createWriteStream(
		{
			'metadata.broker.list': `${config.host}:${config.kafkaPort}`
		},
		{},
		{
			topic
		}
	)

export default getStreamForTopic
