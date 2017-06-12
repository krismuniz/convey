import { Router } from 'express'
import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import db from '../database/database'

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST_URI + '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    const user = await db.one(`
      insert into customer
        (google_id, first_name, last_name, email, avatar_url, last_login)
      values
        ($[id], $[first_name], $[last_name], $[email], $[avatar_url], $[last_login])
      on conflict (google_id) do
      update set
        first_name = coalesce(customer.first_name, $[first_name]),
        last_name = coalesce(customer.last_name, $[last_name]),
        email = coalesce(customer.email, $[email]),
        avatar_url = coalesce($[avatar_url], customer.avatar_url),
        last_login = $[last_login]
      where customer.google_id = $[id]
      returning *
    `, {
      id: profile.id,
      first_name: profile.name.givenName,
      last_name: profile.name.familyName,
      email: profile.emails[0].value,
      avatar_url: profile.photos[0].value.replace('?sz=50', '?sz=128'),
      last_login: new Date()
    }).catch((e) => console.error(e))

    done(null, user)
  })
)

const router = new Router()

const googlePassportAuthenticate = passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
})

const googlePassportCallback = passport.authenticate('google', {
  failureRedirect: '/login'
})

router.get('/google', googlePassportAuthenticate)

router.get('/google/callback', googlePassportCallback, (req, res) => {
  res.redirect('/')
})

export default router
