require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

//a route to handle the about us page content
app.get('/about-us', async (req, res) => {
  try{ //do i need try catch here? I'm just sending data i am not trying to access the database
      res.json({
      title: "About Us",
      description1: "Hey, I’m Fred! I’m currently a Senior at NYU, majoring in Computer Science. I’m originally from Jakarta, Indonesia. I went to high school there before moving to San Diego, then New York. I’ve been lucky enough to get some cool internships over the past several years - I worked at ServiceNow this past summer, where I built an app using machine learning to help executives make decisions (it sounds fancy, but basically it was just a chatbot pulling data from PDFs and PowerPoints), and I also did some data analytics at DBS Bank in Jakarta, where I got to play around with tons of bank data.",
      description2: "Outside of that, I’ve been part of a couple of clubs here at NYU, and also have done some work with a venture group in San Diego where I've met some really cool people. When I'm not doing stuff like this, I’m usually making hip-hop beats in my room (Detroit/Atlanta/Jersey/West Coast style beats, if you are curious), playing basketball (I do this one a lot more than I really should), or playing FIFA (with my roommates!). Oh, and every once in awhile I try to make the trip to a mountain and snowboard!",
      imageURL: "https://i1.sndcdn.com/avatars-000502829811-i39zw9-t1080x1080.jpg" 
    });
  }catch(err){
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to show data',
    })
  };
});

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
