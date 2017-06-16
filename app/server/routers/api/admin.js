import { Router } from 'express'
import db from '../../database/database'

const router = new Router()

const hasUser = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(401).send({ message: 'Not authorized' })
  }
}

router.post('/request', hasUser, (req, res) => {
  if (req.body.token === process.env.ADMIN_KEY) {
    db.one(`
      update customer
      set
        is_admin = true
      where id = $[id]
      returning *
    `, { id: req.user.id })
      .catch(e => {
        res.status(500).send({ message: 'An error occured' })
      })
      .then((customer) => {
        req.logout()
        res.redirect('/login?admin_request=true')
      })
  } else {
    res.status(401).render('error', {
      title: 'Acceso no autorizado!',
      message: 'Su código de acceso provisional no es válido.'
    })
  }
})

export default router
