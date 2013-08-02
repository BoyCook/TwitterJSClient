var Twitter = require('../../lib/twitter').Twitter;
var fs = require('fs');

describe('Twitter', function () {
    var twitter;
    var config;
    var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
        done();
    };

    beforeEach(function (done) {
        config = JSON.parse(fs.readFileSync('./test/spec/properties.json', encoding="ascii"));
        twitter = new Twitter(config);
        expect(twitter).toBeDefined();
        expect(twitter.oauth).toBeDefined();
        done();
    });

    it('should get request token', function (done) {
        twitter.getOAuthRequestToken(function (oauth) {
            done();
        });
    });

    it('should get timeline for a user', function (done) {
        var params = { screen_name: 'BoyCook', count: '10'};
        twitter.getUserTimeline(params, error,
            function (data) {
                expect(JSON.parse(data).length).toEqual(10);
                done();
            }
        );
    });

    it('should get home timeline', function (done) {
        var params = { count: '10'};
        twitter.getHomeTimeline(params, error,
            function (data) {
                expect(JSON.parse(data).length).toEqual(10);
                done();
            }
        );
    });

    it('should get mentions timeline', function (done) {
        var params = { count: '10'};
        twitter.getMentionsTimeline(params, error,
            function (data) {
                expect(JSON.parse(data).length).toEqual(10);
                done();
            }
        );
    });

    it('should get re tweets', function (done) {
        var params = { count: '10'};
        twitter.getReTweetsOfMe(params, error,
            function (data) {
                expect(JSON.parse(data).length).toEqual(0);
                done();
            }
        );
    });

    it('should get tweet by id', function (done) {
        var data = { id: '292964063091236860'};
        var params = { id: '292964063091236864'};
        twitter.getTweet(params, error,
            function (tweet) {
				tweet = JSON.parse(tweet);
                expect(tweet.id_str).toEqual(params.id);
//                expect(tweet.id).toEqual(data.id);
                done();
            }
        );
    });
});
