import Kafka from 'node-rdkafka'

const getConsumer = config =>
	new Kafka.KafkaConsumer(
		{
			'group.id': 'kafka',
			'metadata.broker.list': `${config.host}:${config.port}`
		},
		{}
	)

export default getConsumer
