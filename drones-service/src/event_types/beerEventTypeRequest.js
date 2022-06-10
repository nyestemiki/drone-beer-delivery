import avro from 'avsc'

const beerEventType = avro.Type.forSchema({
	type: 'record',
	fields: [
		{
			name: 'amount',
			type: 'string'
		},
		{
			name: 'orderId',
			type: 'string'
		}
	]
})

export default beerEventType
