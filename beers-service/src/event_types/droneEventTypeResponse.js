import avro from 'avsc'

const droneEventType = avro.Type.forSchema({
	type: 'record',
	fields: [
		{
			name: 'droneId',
			type: 'string'
		},
		{
			name: 'orderId',
			type: 'string'
		}
	]
})

export default droneEventType
