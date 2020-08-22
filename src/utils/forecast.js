const request = require('request')

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=057f6ffdfc6dc2bdafd80e776a9a7949&query=${latitude},${longitude}`

  request({ url, json: true }, (error, response) => {
    const { error: respError, current } = response.body
    if (error) {
      callback('Unable to connect weather service')
    } else if (respError) {
      callback('Unable to find location. Try different coordinates')
    } else {
      const { weather_descriptions, temperature, feelslike } = current
      callback(
        undefined,
        `${weather_descriptions[0]}. It's currently ${temperature} degrees but it feels like ${feelslike} degrees`
      )
    }
  })
}

module.exports = forecast
