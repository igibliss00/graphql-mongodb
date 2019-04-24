const eventsResolver = require('./events');
const bookingResolver = require('./booking');
const authResolver = require('./auth');

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver
};

module.exports = rootResolver;