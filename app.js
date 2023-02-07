require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const authenticateUser = require('./middleware/authentication')

const cors = require('cors')
const xss = require('xss-clean')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')

const connectDB = require('./db/connect')

const limiter = rateLimiter({
  windowsMs: 15 * 60 * 1000,
  max: 100
})

app.set('trust proxy', 1)
app.use(limiter)
app.use(express.json())
app.use(xss())
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
  res.send('Jobs API')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)


app.use(notFound)
app.use(errorHandler)


const port = process.env.PORT || 3000
const start = async () => {
  try {
    //connect DB
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error);
  }
}
start()