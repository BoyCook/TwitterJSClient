## Description
A twitter client written in Javascript

## Usage

	var error = function (err, response, body) {
		console.log('ERROR [%s]', err);
    };
    var success = function (data) {
    	console.log('Data [%s]', data);
    };

    var twitter = new Twitter(config);
	twitter.getUserTimeline({ screen_name: 'BoyCook', count: '10'}, error, success);
	twitter.getMentionsTimeline({ count: '10'}, error, success);
	twitter.getHomeTimeline({ count: '10'}, error, success);
	twitter.getReTweetsOfMe({ count: '10'}, error, success);
	twitter.getTweet({ id: '1111111111'}, error, success);

## Config
The config is the OAuth properties for the account that the client connects with. They look like this:

	{
	    "consumerKey": "{consumerKey}",
	    "consumerSecret": "{consumerSecret}",
	    "accessToken": "{accessToken}",
	    "accessTokenSecret": "{accessTokenSecret}",
	    "callBackUrl": "{callBackUrl}"
	}


## Tests

There is a test file `TwitterITSpec.js` that does a basic integration tests of the client. 
It uses a properties file `test/spec/properties.json` to inject in the OAuth properties. 
These will need to be updated with your own details before the tests will run

## Running tests

	make test