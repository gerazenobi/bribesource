'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    //uri: 'mongodb://localhost/story-dev'
    uri: 'mongodb://localhost/bribe'
    //uri: 'mongodb://bribe:bribe@ds051980.mongolab.com:51980/bribe'
  },

  seedDB: true
};
