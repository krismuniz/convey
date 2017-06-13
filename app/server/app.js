import path from 'path'
import express from 'express'

// express : middleware
import hbs from 'hbs'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'

// passport
import passport from 'passport'

// express : routers
import authRouter from './routers/auth'
import apiRouter from './routers/api'

/* ------------------------------ DATABASE SETUP ----------------------------- */

import db from './database/database'
import initDB from './database/initialize'

initDB(db)

/* ------------------------------ EXPRESS SETUP ------------------------------ */

const redis = require('redis')
const connectRedis = require('connect-redis')
const RedisStore = connectRedis(session)
const redisClient = redis.createClient(process.env.REDIS_URL)

/* ------------------------------ EXPRESS SETUP ------------------------------ */

const app = express()
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

/* ---------------------------------- AUTH ---------------------------------- */

// # AUTH
app.use(
  session(
    {
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({ client: redisClient }),
      cookie: {
        maxAge: 2592000000
      }
    }
  )
)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.one(`
      select * from customer
      where customer.id = $[id]
    `, { id })
      .catch((e) => {
        done(null, false)
      })

    done(null, user)
  } catch (e) {
    done(e, false)
  }
})

app.use(passport.initialize())
app.use(passport.session())

app.disable('x-powered-by')

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Ingresar - Rambito\'s'
  })
})

// # view engine middleware setup
const viewsPath = path.resolve(__dirname, '../client/views')
const partialsPath = path.resolve(__dirname, '../client/views/partials')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// # setup public folder
const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))

app.use('/api', apiRouter)
app.use('/auth', authRouter)

const auth = (req, res, next) => {
  if (!req.user) {
    res.redirect('/login')
  } else {
    next()
  }
}

app.get('/*', auth, (req, res) => {
  res.render('index', { title: 'Órdenes - Rambito\'s' })
})

export default app
