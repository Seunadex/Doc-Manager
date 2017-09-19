import dotenv from 'dotenv';
import express from 'express';
import expressValidator from 'express-validator';
import http from 'http';
import path from 'path';
import webpack from 'webpack';
import winston from 'winston';
import colors from 'colors';
import logger from 'morgan';
import bodyParser from 'body-parser';
import webpackHotMidlleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.dev';
import router from './routes';


dotenv.config();
// Set up the express app
const app = express();
const port = parseInt(process.env.PORT, 10) || 5000;
const compiler = webpack(webpackConfig);

// Log requests to the console.
app.use(logger('dev'));
app.use(express.static(path.resolve(`${__dirname}./../client`)));
app.use(webpackMiddleware(compiler));

app.use(webpackHotMidlleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));

// Parse incoming requests data
app.use(bodyParser.json());
app.use((error, request, response, next) => {
  if (error && error.toString().indexOf('JSON') > -1) {
    return response
      .status(400).json({
        message: 'Oops! It looks like you are sending an invalid json object'
      });
  }
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
router(app);
app.set('port', port);

app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('*', (request, response) => {
  response.sendFile(path.join(__dirname, '../client/index.html'));
});

const server = http.createServer(app);
server.listen(port);
winston.info('server is running on port: '.green + port);

export default app;

