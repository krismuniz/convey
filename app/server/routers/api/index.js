import customer from './customer'
import order from './order'
import item from './item'
import report from './report'

import { Router } from 'express'

const router = new Router()

router.use('/customer', customer)
router.use('/order', order)
router.use('/item', item)
router.use('/report', report)

export default router
