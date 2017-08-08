import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import expressValidator from 'express-validator';
import http from 'http';
import winston from 'winston';
import logger from 'morgan';
import bodyParser from 'body-parser';
import router from './routes';


dotenv.config();
// Set up the express app
const app = express();
const port = parseInt(process.env.PORT, 10) || 4000;

// Log requests to the console.
app.use(logger('dev'));
app.use(express.static(path.resolve(`${__dirname}./../public`)));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
router(app);

app.set('port', port);

app.get('/', (req, res) => res.status(200).render('index.html'));

const server = http.createServer(app);
server.listen(port);
winston.info('server is running');

export default app;

