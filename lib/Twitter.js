/*
    Twitter client app
 */

var request = require('request');

function Twitter() {
	this.baseUrl = "https://api.twitter.com/1.1";
}

Twitter.prototype.getUserTimeline = function(user, error, success) {
    var path = "/statuses/user_timeline.json";
    request(this.baseUrl + path, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            success(body);
        } else {
            error();
        }
    })
};

Twitter.prototype.getUserMentionsTimeline = function(user, error, success) {
    var path = "/statuses/mentions_timeline.json";
    request(this.baseUrl + path, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            success(body);
        } else {
            error();
        }
    })
};

Twitter.prototype.getTweet = function(id, error, success) {
    var path = "";
};

if (!(typeof exports === "undefined")) {
    exports.Twitter = Twitter;
}
