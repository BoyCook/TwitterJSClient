## Description
A twitter client written in Javascript

## Usage

    var twitter = new Twitter(config);
	twitter.getUserTimeline();
	twitter.getMentionsTimeline();
	twitter.getHomeTimeline();
	twitter.getReTweetsOfMe();
	twitter.getTweet();

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