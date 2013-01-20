/*
 Twitter client app
 */

var OAuth = require('oauth').OAuth;
var qs = require('qs');

function Twitter() {
    this.CONSUMER_KEY = 'CONSUMER_KEY';
    this.CONSUMER_SECRET = 'CONSUMER_SECRET';
    this.ACCESS_TOKEN = 'ACCESS_TOKEN';
    this.ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET';
    this.baseUrl = 'https://api.twitter.com/1.1';
    this.oauth = new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        this.CONSUMER_KEY,
        this.CONSUMER_SECRET,
        '1.0',
        'http://craigcook.co.uk/auth/twitter/callback',
        'HMAC-SHA1'
    );
}

Twitter.prototype.getOAuthRequestToken = function (next) {
    this.oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log('ERROR: ' + error);
            next();
        }
        else {
            var oauth = {};
            oauth.token = oauth_token;
            oauth.token_secret = oauth_token_secret;
            console.log('oauth.token: ' + oauth.token);
            console.log('oauth.token_secret: ' + oauth.token_secret);
            next(oauth);
        }
    });
};

Twitter.prototype.getOAuthAccessToken = function (oauth, next) {
    this.oauth.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
        function (error, oauth_access_token, oauth_access_token_secret, results) {
            if (error) {
                console.log('ERROR: ' + error);
                next();
            } else {
                oauth.access_token = oauth_access_token;
                oauth.access_token_secret = oauth_access_token_secret;

                console.log('oauth.token: ' + oauth.token);
                console.log('oauth.token_secret: ' + oauth.token_secret);
                console.log('oauth.access_token: ' + access_token.token);
                console.log('oauth.access_token_secret: ' + oauth.access_token_secret);
                next(oauth);
            }
        }
    );
}

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

Twitter.prototype.doRequest = function (url, error, success) {
    this.oauth.get(url, this.ACCESS_TOKEN, this.ACCESS_TOKEN_SECRET, function (err, body, response) {
        console.log('URL [%s]', url);
        if (!err && response.statusCode == 200) {
            success(JSON.parse(body));
        } else {
            error(response.statusCode, body);
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
