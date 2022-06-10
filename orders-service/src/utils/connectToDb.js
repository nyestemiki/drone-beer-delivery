import { MongoClient } from 'mongodb'
import config from '../config.js'

const client = new MongoClient(config.dbUrl)

const connectToDb = async callback => {
	try {
		await client.connect()

		const db = client.db(config.dbName)
		const collection = db.collection('orders_collection')

		return await callback(collection)
	} catch (error) {
		console.error(error)
	} finally {
		client.close()
	}
}

export default connectToDb
