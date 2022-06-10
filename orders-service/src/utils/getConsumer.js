import Kafka from 'node-rdkafka'
import config from '../config.js'

const getConsumer = () =>
	new Kafka.KafkaConsumer(
		{
			'group.id': 'kafka',
			'metadata.broker.list': `${config.host}:${config.kafkaPort}`
		},
		{}
	)

export default getConsumer
