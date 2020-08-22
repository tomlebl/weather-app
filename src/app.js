const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Set up static directory
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Tomas Lebl'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Tomas Lebl'
  })
})
app.get('/help', (req, res) => {
  res.render('help', {
    message: 'Example help message',
    title: 'Help',
    name: 'Tomas Lebl'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({ error: 'You must provide an address' })
  }
  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }
      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({ error: 'You must provide a search term' })
  }

  console.log(req.query.search)
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('error', {
    message: 'Help article not found',
    title: 'Error 404',
    name: 'Tomas Lebl'
  })
})

app.get('*', (req, res) => {
  res.render('error', {
    title: 'Error 404',
    name: 'Tomas Lebl',
    message: 'Page not found'
  })
})

app.listen(3000, () => {
  console.log('Server is up on port 3000')
})
