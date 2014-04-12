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
          var $toggle = $(".js-"+ id_name +"-toggle");

          if ( value ) {
            // lights are on
            ui.toggle.on( $toggle, true );
          }
          else {
            // lights are off
            ui.toggle.off( $toggle, true );
          }

          // save changes
          $(".js-"+ id_name).on("change", function(){
            $(".app-state").addClass("loading").fadeIn(200);

            if ( this.checked ) {
              xively.datastream.update(feedID, "target_state", { "current_value": 1 }, function(){
                $(".app-state").removeClass("loading").fadeOut(200);
              });
            }
            else {
              xively.datastream.update(feedID, "target_state", { "current_value": 0 }, function(){
                $(".app-state").removeClass("loading").fadeOut(200);
              });
            }
          });

          // make it live
          xively.datastream.subscribe(feedID, "current_state", function ( event, data ) {
            ui.fakeLoad();

            if ( parseInt(data["current_value"]) ) {
              // lights are on
              ui.toggle.on( $toggle, true );
            }
            else {
              // lights are off
              ui.toggle.off( $toggle, true );
            }
          });
        };

    // loop through datastreams

    for (var x = 0, len = feed.datastreams.length; x < len; x++) {
      datastream = feed.datastreams[x];
      value = parseInt(datastream["current_value"]);
      // LED

      if ( datastream.id === "target_state" ) {
        handleToggle( "lights", "target_state", value );
      }
    }
    // SHOW UI

    $(".app-loading").fadeOut(200, function(){
     $(".app-content-inner").addClass("open");
    });
  });


})( jQuery );
