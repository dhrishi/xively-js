(function ( $ ){
  "use strict";

  function getParam(key) {
    var value = location.hash.match(new RegExp(key+'=([^&]*)'));
    if (value) {
      return value[1];
    } else {
      return "";
    }
  }

  var feedID = getParam('feed_id');
  xively.setKey(getParam('api_key'));


  if (feedID === "")
    alert("Incorrect URL");

  // get all feed data in one shot

  xively.feed.get (feedID, function (data) {
    // this code is executed when we get data back from Xively

    var feed = data,
        datastream,
        value,
        // function for setting up the toggle inputs
        handleToggle = function ( id_name, datastreamID, value ) {
		console.log('in handle toggle');
          // save changes
          $(".js-"+ id_name).on("change", function(){
            $(".app-state").addClass("loading").fadeIn(200);

            if ( this.checked ) {
		console.log('In if');
              xively.datastream.update(feedID, "target_state", { "current_value": 1 }, function(){
		console.log('In if1');
                $(".app-state").removeClass("loading").fadeOut(200);
              });
            }
            else {
		console.log('In else');
              xively.datastream.update(feedID, "target_state", { "current_value": 0 }, function(){
		console.log('In else1');
                $(".app-state").removeClass("loading").fadeOut(200);
              });
            }
          });

          // make it live
          console.log('making it live');
           xively.datastream.update(feedID, "target_pin", { "current_value": value }, function(){
		console.log('In my code');
              });

          xively.datastream.subscribe(feedID, "target_pin", function ( event, data ) {
	   console.log('in subscribe for target_pin');
	   console.log('current value is: ' + parseInt(data["current_value"]));
	   pin.value = parseInt(data["current_value"]);
           ui.fakeLoad();
            });
        };

    // loop through datastreams

    for (var x = 0, len = feed.datastreams.length; x < len; x++) {
      datastream = feed.datastreams[x];
      value = parseInt(datastream["current_value"]);
      // LED

      if ( datastream.id === "target_state" ) {
        //handleToggle( "lights", "target_state", value );
      }

      if (datastream.id === "target_pin") {
	pin.value = value;
        handleToggle( "pin", "target_pin", value );
      }
    }
    // SHOW UI

    $(".app-loading").fadeOut(200, function(){
     $(".app-content-inner").addClass("open");
    });
  });

  button1.onclick=function(){
	console.log('button pressed')
	console.log('value of the text box is: ' + pin.value);
	if (isNaN(pin.value) || pin.value === "") {
		alert('Security Pin should contain only numbers');
	} else {
		xively.datastream.update(feedID, "target_pin", { "current_value": pin.value }, function(){
			console.log('Finally the code is posted');
	        });
	}
  };

})( jQuery );
