import Kafka from 'node-rdkafka'

const getStreamForTopic = (topic, config) =>
	Kafka.Producer.createWriteStream(
		{
			'metadata.broker.list': `${config.host}:${config.port}`
		},
		{},
		{
			topic
		}
	)

export default getStreamForTopic
