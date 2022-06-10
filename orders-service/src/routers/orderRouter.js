import express from 'express'
import connectToDb from '../utils/connectToDb.js'
import { orderBeerAndDrone, getOrder } from '../controllers/orderController.js'
import getRandomAmount from '../utils/getRandomAmount.js'

const router = express.Router()

router.post('/', async (req, res) => {
	const { amount, kind } = req.body
	const result = await connectToDb(collection => collection.insertOne({ amount, kind }))
	const orderId = String(result?.insertedId)

	orderBeerAndDrone({ orderId, amount: getRandomAmount() + 'l' })

	res.send(`Order #${orderId} placed`)
})

router.get('/:id', async (req, res) => res.send(await getOrder(req.params.id)))

export default router
