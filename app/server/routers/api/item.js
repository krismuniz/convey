import { Router } from 'express'
import db from '../../database/database'

const router = new Router()

router.get('/', (req, res) => {
  db.any(`
    select
      item.id,
      item.name,
      item.description,
      item.price,
      item.image_url,
      type.id as type_id,
      item.children_type_id,
      type.label as type,
      type.ingredient as is_ingredient
    from
      item,
      type
    where
      item.type_id = type.id
      and item.enabled = true
    order by
      item.id
    `)
    .then(data => {
      res.send(
        data.map(v => {
          return {
            id: v.id,
            name: v.name,
            description: v.description,
            price: Number(v.price),
            image_url: v.image_url,
            children_type_id: v.children_type_id,
            type: {
              id: v.type_id,
              label: v.type,
              is_ingredient: v.is_ingredient
            }
          }
        })
      )
    })
    .catch(err => {
      if (err.code === 0) {
        res.status(404).send({ message: 'Not found' })
      } else {
        console.log(err)
        res.status(400).send({ message: 'Bad request' })
      }
    })
})

export default router
