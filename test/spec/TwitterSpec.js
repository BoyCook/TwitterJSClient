Twitter = require('../../lib/Twitter').Twitter;

describe('Twitter', function(){
    var twitter;

    beforeEach(function(){
        twitter = new Twitter();
        expect(twitter).toBeDefined();
    });

    it('should get timeline for a user', function() {
		//TODO: async assertions
		twitter.getUserTimeline()
    });
});
