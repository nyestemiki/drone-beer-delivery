import config from '../config.js'
import { MongoClient } from 'mongodb'

const client = new MongoClient(config.dbUrl)

const connectToDb = async callback => {
	try {
		await client.connect()

		const db = client.db(config.dbName)
		const collection = db.collection('beers_collection')

		return await callback(collection)
	} catch (error) {
		console.error(error)
	} finally {
		client.close()
	}
}

export default connectToDb
