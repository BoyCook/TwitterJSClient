/*
 Twitter client app
 */

var DEBUG = (process.env.DEBUG !== undefined);

var OAuth = require('oauth').OAuth;
var qs = require('qs');

function Twitter() {
	var configPath = "data/twitter_config";
	try {
		var config = process.env;
		
		this.consumerKey = config.twitterConsumerKey;
		this.consumerSecret = config.twitterConsumerSecret;
		this.accessToken = config.twitterAccessToken;
		this.accessTokenSecret = config.twitterAccessTokenSecret;
		this.callBackUrl = config.twitterCallBackUrl;
		this.baseUrl = 'https://api.twitter.com/1.1';
		this.oauth = new OAuth(
			'https://api.twitter.com/oauth/request_token',
			'https://api.twitter.com/oauth/access_token',
			this.consumerKey,
			this.consumerSecret,
			'1.0',
			this.callBackUrl,
			'HMAC-SHA1'
			);
	} catch (err) {
        //console.log(err)
        console.log("no 'data/twitter_config' file, continuing without...");
    }
}

Twitter.prototype.getOAuthRequestToken = function (next) {
    this.oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            if (DEBUG) console.log('ERROR: ' + error);
            next();
        }
        else {
            var oauth = {};
            oauth.token = oauth_token;
            oauth.token_secret = oauth_token_secret;
            if (DEBUG) console.log('oauth.token: ' + oauth.token);
            if (DEBUG) console.log('oauth.token_secret: ' + oauth.token_secret);
            next(oauth);
        }
    });
};

Twitter.prototype.getOAuthAccessToken = function (oauth, next) {
    this.oauth.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
        function (error, oauth_access_token, oauth_access_token_secret, results) {
            if (error) {
                if (DEBUG) console.log('ERROR: ' + error);
                next();
            } else {
                oauth.access_token = oauth_access_token;
                oauth.access_token_secret = oauth_access_token_secret;

                if (DEBUG) console.log('oauth.token: ' + oauth.token);
                if (DEBUG) console.log('oauth.token_secret: ' + oauth.token_secret);
                if (DEBUG) console.log('oauth.access_token: ' + oauth.access_token);
                if (DEBUG) console.log('oauth.access_token_secret: ' + oauth.access_token_secret);
                next(oauth);
            }
        }
    );
};

Twitter.prototype.postMedia = function (params, error, success) {
    var url = 'https://upload.twitter.com/1.1/media/upload.json';
    this.doPost(url, params, error, success);
};

Twitter.prototype.postTweet = function (params, error, success) {
    var path = '/statuses/update.json';
    var url = this.baseUrl + path;
    this.doPost(url, params, error, success);
};

Twitter.prototype.postFavoritesCreate = function (params, error, success) {
    var path = '/favorites/create.json';
    var url = this.baseUrl + path;
    this.doPost(url, params, error, success);
};

Twitter.prototype.postCreateFriendship = function (params, error, success) {
    var path = '/friendships/create.json';
    var url = this.baseUrl + path;
    this.doPost(url, params, error, success);
};

Twitter.prototype.getUserTimeline = function (params, error, success) {
    var path = '/statuses/user_timeline.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getMentionsTimeline = function (params, error, success) {
    var path = '/statuses/mentions_timeline.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getHomeTimeline = function (params, error, success) {
    var path = '/statuses/home_timeline.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getFavorites = function (params, error, success) {
    var path = '/favorites/list.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getReTweetsOfMe = function (params, error, success) {
    var path = '/statuses/retweets_of_me.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getTweet = function (params, error, success) {
    var path = '/statuses/show.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getSearch = function (params, error, success) {
    var encodedQuery = encodeURIComponent(params.q);
    delete params.q;
    var path = '/search/tweets.json?q=' + encodedQuery +'&'+ qs.stringify(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

//molina code
Twitter.prototype.getUser = function (params, error, success) {
    var path = '/users/show.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getFollowersList = function (params, error, success) {
    var path = '/followers/list.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getFollowersIds = function (params, error, success) {
    var path = '/followers/ids.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getCustomApiCall = function (url, params, error, success) {
    var path =  url + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.postCustomApiCall = function (url, params, error, success) {
    var path =  url + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doPost(url, params, error, success);
};

Twitter.prototype.doRequest = function (url, error, success) {
    // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
    // From https://github.com/ttezel/twit/blob/master/lib/oarequest.js
    url = url.replace(/\!/g, "%21")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");

    this.oauth.get(url, this.accessToken, this.accessTokenSecret, function (err, body, response) {
        if (DEBUG) console.log('URL [%s]', url);
        if (!err && response.statusCode == 200) {
            limits = {
                "x-rate-limit-limit": response.headers['x-rate-limit-limit'],
                "x-rate-limit-remaining": response.headers['x-rate-limit-remaining'],
                "x-rate-limit-reset": response.headers['x-rate-limit-reset'],
            };
            success(body, limits);
        } else {
            error(err, response, body);
        }
    });
};
Twitter.prototype.retweet = function(id, error, success){
    var url = this.baseUrl + '/statuses/retweet/'+id+'.json';
    this.doPost(url, {}, error, success);
 }
 
 Twitter.prototype.unretweet = function(id, error, success){
    var url = this.baseUrl + '/statuses/unretweet/'+id+'.json';
    this.doPost(url, {}, error, success);
 }
Twitter.prototype.doPost = function (url, post_body, error, success) {
    // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
    // From https://github.com/ttezel/twit/blob/master/lib/oarequest.js
    url = url.replace(/\!/g, "%21")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
    //(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback 
    this.oauth.post(url, this.accessToken, this.accessTokenSecret, post_body, "application/x-www-form-urlencoded", function (err, body, response) {
        if (DEBUG) console.log('URL [%s]', url);
        if (!err && response.statusCode == 200) {
            success(body);
        } else {
            error(err, response, body);
        }
    });
};

Twitter.prototype.buildQS = function (params) {
    if (params && Object.keys(params).length > 0) {
        return '?' + qs.stringify(params);
    }
    return '';
};

if (!(typeof exports === 'undefined')) {
    exports.Twitter = Twitter;
}
