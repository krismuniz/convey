import customer from './customer'
import order from './order'
import item from './item'
import report from './report'
import admin from './admin'

import { Router } from 'express'

const router = new Router()

router.use('/customer', customer)
router.use('/order', order)
router.use('/item', item)
router.use('/report', report)
router.use('/admin', admin)

export default router
