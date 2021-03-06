'use strict';

var _ = require('lodash');
var nodemailer = require('nodemailer');
var config = require('../config/environment');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.gmail.account,
        pass: config.gmail.password
    }
});
 	
exports.sendInvitations = function(game,done) {
	var link = config.domain +'http://localhost:9000/game/' + game._id + '?participate=true';
	if(game && game.invitations.length > 0) {
		var emails = [];
		_.forEach(game.invitations,function(invitation){
			if(!invitation.sent) {
				invitation.sent = true;
				emails.push(invitation.email);
			}
		});

		//if no emails found
		if (!emails.length) return done(game);
	
		var output = '<b>Game: </b>' + game.name + '<br/>';
		//if game play date not set, don't include it in the email
		if (game.gamePlayDate) output += '<b>Date: </b>' + game.gamePlayDate  + '<br/>';
		output += '<b>Game Creator: </b>' + game.gameCreator + '<br/>';
		output += '<a href="' + link + '">Click here</a> to participate in the game!';
	
		var mailOptions = {
		    from: 'Bribe Source ✔ <bribesource@gmail.com>',
		    to: emails.join(','),
		    subject: 'Bribe Source: A new game is playing soon',
		    html: output
		};
		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }
		 	done(game);
		});
	} else {
		done();
	}
	
	
};
