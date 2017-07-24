import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import router from './routes';

// Set up the express app
const app = express();
router(app);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(200).json({
  message: 'Welcome to Document Management System'
}
));

module.exports = app;
