import Kafka from 'node-rdkafka'
import config from '../config.js'

const getConsumer = () => {
	const consumer = new Kafka.KafkaConsumer(
		{
			'group.id': 'kafka',
			'metadata.broker.list': `${config.host}:${config.port}`
		},
		{}
	)

	consumer.connect()

	return consumer
}

export default getConsumer
