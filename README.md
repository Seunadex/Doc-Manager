[![Coverage Status](https://coveralls.io/repos/github/Seunadex/Doc-Manager/badge.svg?branch=chore%2F150196624%2Ffeedback-implementation)](https://coveralls.io/github/Seunadex/Doc-Manager?branch=chore%2F150196624%2Ffeedback-implementation)
[![Code Climate](https://codeclimate.com/github/Seunadex/Doc-Manager/badges/gpa.svg)](https://codeclimate.com/github/Seunadex/Doc-Manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/Seunadex/Doc-Manager.svg?branch=staging)](https://travis-ci.org/Seunadex/Doc-Manager)

## Document Manager.
A document management system (API endpoints) that allows users to create and manage documents and also comes with API endpoint for creating and managing users.

### Features
* Users can signup.
* Users can Login.
* Users can update their profile.
* Users can view their profile.
* Users can create documents.
* Users can update and search for documents.
* Users can delete their personal documents.

### API Documentation
* View full API documentation **[here](https://doc-man-staging.herokuapp.com/#introduction)**
#### Below are the API endpoints and their functions
EndPoint                        |   Functionality
------------------------------  |------------------------
POST /api/v1/users/login         |   Logs a user in.
POST /api/v1/users/              |   Creates a new user.
GET /api/v1/users/               |   Find matching instances of user.
GET /api/v1/users-docs/          |   Find matching instances of users and documents
GET /api/v1/users/<id>           |   Find user.
PUT /api/v1/users/<id>           |   Update user attributes.
DELETE /api/v1/users/<id>        |   Delete user.
POST /api/v1/documents/          |   Creates a new document instance.
GET /api/v1/documents/           |   Find matching instances of document.
GET /api/v1/documents/<id>       |   Find document.
PUT /api/v1/documents/<id>       |   Update document attributes.
DELETE /api/v1/documents/<id>    |   Delete document.
GET /api/v1/users/<id>/documents |   Find all documents belonging to the user.
GET /api/v1/search/users/<searchkey>      |   Gets all users with username, fullName matching or containing the search key
GET /api/v1/search/documents/<searchkey> | Gets all documents with title or content matching or containing the search key
GET /api/v1/users/page/?limit={integer}&offset={integer} | Pagination for users.
GET /api/v1/documents/page/?limit={integer}&offset={integer} | Pagination for docs.

### Dependencies
* **[Babel-cli](https://www.npmjs.com/package/babel-cli)** - Tool for transpiling the code through the command line.
* **[Babel-plugin-istanbul](https://www.npmjs.com/package/babel-plugin-istanbul)** - A Babel plugin that instruments your code with Istanbul coverage.
* **[Babel-preset- es2015](https://www.npmjs.com/package/babel-preset-es2015)** - Provides Babel presets for es2015 plugin
* **[Babel-preset-stage-2](https://www.npmjs.com/package/babel-preset-stage-2)** - Provide Babel presets for stage-2 plugin
* **[Babel-register](https://www.npmjs.com/package/babel-register)** - Used to transpile code on the fly.
* **[Bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Use for hashing passwords
* **[Body-parser](https://www.npmjs.com/package/body-parser)** - Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the request.body property.
* **[Dotenv](https://www.npmjs.com/package/dotenv)** - It loads environment variables from a .env file
* **[Express](https://www.npmjs.com/package/express)** - Used as the web server for this application
* **[Express-validator](https://www.npmjs.com/package/express-validator)** - Used in validating user input.
* **[Gulp](https://www.npmjs.com/package/gulp)** - Toolkit that helps you automate painful or time-consuming tasks in your development workflow
* **[Gulp-babel](https://www.npmjs.com/package/gulp-babel)** - Use next generation JavaScript, today, with Babel
* **[Gulp-exit](https://www.npmjs.com/package/gulp-exit)** - `gulp-exit` ensures that the task is terminated after finishing.
* **[Gulp-inject-modules](https://www.npmjs.com/package/gulp-inject-modules)** - Loads JavaScript files on-demand from a Gulp stream into Node's module loader.
* **[Gulp-istanbul](https://www.npmjs.com/package/gulp-istanbul)** - Istanbul unit test coverage plugin for gulp.
* **[Gulp-jasmine](https://www.npmjs.com/package/gulp-jasmine)** - Basic implementation of a gulp task for jasmine
* **[Gulp-nodemon](https://www.npmjs.com/package/gulp-nodemon)** - It's gulp + nodemon + convenience, it looks almost exactly like regular nodemon, but it's made for use with gulp tasks.
* **[Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** - Generates and verify JWT token
* **[Lodash](https://www.npmjs.com/package/lodash)** - Provides utility function.
* **[Morgan](https://www.npmjs.com/package/morgan)** - HTTP request logger middleware for node.js
* **[Path](https://www.npmjs.com/package/path)** - This is an exact copy of the NodeJS ’path’ module published to the NPM registry.
* **[Pg](https://www.npmjs.com/package/pg)** - Non-blocking PostgreSQL client for node.js
* **[pg-hstore](https://www.npmjs.com/package/pg-hstore)** - Node package for serializing and deserializing JSON data to hstore format.
* **[Sequelize](https://www.npmjs.com/package/sequelize)** - Its a promise-based ORM for Node.js v4 and up. It supports the dialect PostgreSQL
* **[Winston](https://www.npmjs.com/package/winston)** - A multi-transport async logging library for node.js.

### Development dependencies
* **[Chai](https://www.npmjs.com/package/chai)** - Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.
* **[Coveralls](https://www.npmjs.com/package/coveralls)** - Coveralls.io support for node.js. Get the great coverage reporting of coveralls.io and add a cool coverage button ( like the one above ) to your README
* **[Nodemon](https://www.npmjs.com/package/nodemon)** - Nodemon will watch the files in the directory in which nodemon was started, and if any files change, it will automatically restart your node application
* **[Supertest](https://www.npmjs.com/package/supertest)** - HTTP assertions made easy via superagent.

### Installation and Setup
* Clone the repository using your favorite terminal with the command `git clone https://github.com/Seunadex/Doc-Manager.git`
* Navigate into the directory and run `$ cd Doc-Manager`
* Install all dependencies by running `$ npm install`
* Replace the variables in `.env.example` with a personalized ones.
* Remove `.example` from the filename and save.
* Start the app by running `$ npm start`.

### Tests
* All tests were written with `chai` and `supertest`.
* Test coverage generated with `gulp-istanbul`.
* To run test, navigate to the root directory and run `$ npm test`.

### FAQ
* Can I contribute?
    * Absolutely yes, check `How to contribute` below.
* What kind of Authentication is required?
    * `Token` is required by users to access all route (except signup and login) after being set as authorization in the `HTTP request header`, it is sent to the client on successful sign up and log in.
* Do I need to pay to use the API?
    * Not at all, feel free to use anytime.
* What return format does it surpport?
    The API currently support `JSON` format.

### How to contribute.
* Fork the repo.
* Open a new branch for the feature to add.
* Follow the correct style guide and folder/file naming convention by **[Airbnb](https://github.com/airbnb/javascript)** for consistency.
* Strictly adhere to the correct PR, commit messages, and branch naming convention as compiled **[here](https://github.com/andela/temari-rc/wiki/Pull-Request-Naming-and-Description-Convention)**
* Use the eslint configuration in this app.
* Create a pull request.
  * Write a short description of what the PR does.
  * Write areas of the app that is affected by the PR.
  * Provide a screenshot (if applicable).
  * Write how to manually test the feature.

### Limitations.
* The application currently uses shared database (Elephantsql) which may sometimes take more time to respond
* Only one role is currently available to all users, which is the regular user.

### License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Author

Seun Adekunle -@seunadex
