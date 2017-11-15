require('dotenv').load();
var Twitter = require('twitter');
var five = require("johnny-five");
var led;
var colors = ["#FF0000","#00FF00","#0000FF","#00FFFF","#8A2BE2","#DC143C","#FF8C00","#FF1493","#1E90FF","#FFD700","#008000","#7CFC00"]
var counter = -1;

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Setup Twitter
var stream = client.stream('statuses/filter', {track: 'nexgencodecamp'});
stream.on('data', function(event) {
  console.log(event && event.text);
  blink();
});

stream.on('error', function(error) {
  throw error;
});

five.Board().on("ready", function() {
  // Initialize the RGB LED
  led = new five.Led.RGB({
    pins: {
      red: 9,
      green: 10,
      blue: 11
    }
  });

  // Add led to REPL (optional)
  this.repl.inject({
    led: led
  });

  // Initialized to OFF before first tweet arrives!
  led.on();
  led.color('#FF0000');
});

function blink(){
    led.on();
    led.color(colors[++counter]);
    led.blink(1000);
    var msg = `counter=${counter}`;
    console.log(msg);
    if(counter === 11){
        counter = 0;
    }
}
