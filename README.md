# Convey

The open-source online food ordering system written in Node.js

## Summary

#### Features

* Mobile-first online ordering service
* Password-less login for your customers (via Google or Facebook)
* Administrator dashboard and reporting functionality
* Integrated checkout system via [Stripe]() (optional)
* Integrated SMS alerts via [Twilio]() (optional)
* FAQs section for customers
* Localizable (currently English and Spanish supported)
* Full-fledged REST api to integrate with custom clients

#### Basic requirements

* Node.js `v7.6.0` or higher
* npm `v3.0.0` or higher
* PostgreSQL `v9.6` or higher
* Redis `v3.2` or higher
* Google & Facebook Login API credentials (for user authentication)

#### Requirements for optional features

* Twilio credentials (for SMS alerts)
* Stripe credentials (for integrated payments)

## Benefits of using Convey

#### Security

##### Password-less authentication

Convey does not store passwords, tokens, or secret keys. It only uses Google and Facebook Authentication APIs to verify the identity of a user and store basic profile data.

Only admins will have to use passwords to access the admin dashboard. If served via `https://` (highly recommended, required for Stripe checkout integration), your customer's data will be safe on transport, too.

##### Dependency vulnerabilities

Convey has a zero-vulnerability policy for all of its dependencies. If a dependency has a vulnerability, it will be fixed as soon as possible.

#### Privacy

Convey only collects the necessary data out of the box:

  * Google ID (for authentication purposes)
  * First name (given name)
  * Last name (family name)
  * Phone number
  * Email address
  * Home address (for deliveries)
  * Profile picture – when available

For integrated payments (via [Stripe](https://www.stripe.com)), no credit card data is collected, making Convey – and all your business through Convey – PCI-compliant.

#### Maintainability

All code is throughly tested. Each major, minor version, and patch *must* have zero failed tests and _at least_ `90%` code test coverage.

The code is `100%` documented using JSDoc and code style is strictly specific.

## Stack

Convey uses the following technologies:

* Node.js
* PostgreSQL database for persistent data storage
* Redis in-memory datastore for uses session storage
* React
* Redux

## Run Convey locally

#### I. Clone the repo

```
$ git clone <REPO_URL> convey-test
```

#### II. Install dependencies for production

```shell
$ npm install --production
```

> For development dependencies just run `npm install` without the `--production` flag

#### III. Configure

Modify `./config/config.js` ([learn more]())

Example:
```js
module.exports = {
  organization: {
    name: 'Rambito\'s Pizza',
    description: 'Pizza place'
  },
  stripe_enabled: true
}
```

#### IV. Build

After dependencies are installed, build the application:
```shell
$ npm run build
```

#### V. Start server

After the application is built, start serving your application:
```shell
$ npm start
```

> Note: before executing `npm start`, make sure your Redis datastore and PostgreSQL database are running.

## About

`Convey` was born as a school project for a Systems Development class at University of Puerto Rico – Mayagüez.

Copyright (c) 2017 - Kristian Muñiz, Kevin Jimenez, Doel Santos
