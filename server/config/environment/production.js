'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://bribe:bribe@ds051980.mongolab.com:51980/bribe'
    // uri:    process.env.MONGOLAB_URI ||
    //         process.env.MONGOHQ_URL ||
    //         process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||            
    //         'mongodb://bribe:bribe@ds051980.mongolab.com:51980/bribe'
  },
	gmail: {
		account: 'bribesource@gmail.com',
		password: 'SuperPassword'
	},
	domain: 'http://pimpmystory-bribe.rhcloud.com/'
};