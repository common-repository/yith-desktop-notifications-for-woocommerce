/**
 * notify.js
 *
 * @author Your Inspiration Themes
 * @package YITH Desktop Notifications for WooCommerce
 * @version 1.0.0
 */

jQuery(document).ready( function($) {
    
    var looping_sound = yith_wcdn.looping_sound;

    if ( typeof Notification !== "undefined" ) {
        Notification.requestPermission().then(function (result) {
            if (result === 'denied') {
                console.log('Permission wasn\'t granted. Allow a retry.');
                return;
            }
            if (result === 'default') {
                console.log('The permission request was dismissed.');
                return;
            }
            // Do something with the granted permission.
            var post_data = {
                action: 'yith_wcdn_display_notifications'
            };
            setInterval(function () {
                $.ajax({
                    type: "POST",
                    data: post_data,
                    url: yith_wcdn.ajaxurl,
                    success: function (response) {
                        if (response != 0) {
                            for (x = 0; x < response.length; x++) {

                                var theTitle = response[x].title;
                                var options = {
                                    body: response[x].description,
                                    icon: response[x].icon,
                                    sound: response[x].sound,
                                }
                                var n = new Notification(theTitle, options);
                                n.custom_options = {
                                    url: response[x].url,
                                }
                                n.onclick = function (event) {
                                    console.log('Chick on notification');
                                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                                    window.open(n.custom_options.url, '_blank');
                                };


                                //add audio notify because, this property is not currently supported in any browser.
                                if ('yes' == looping_sound) {
                                    $("<audio controls loop class='yith_wcdn_audio'></audio>").attr({
                                        'src': response[x].sound,
                                        'autoplay': 'autoplay'
                                    }).appendTo("body");
                                } else {
                                    $("<audio class='yith_wcdn_audio'></audio>").attr({
                                        'src': response[x].sound,
                                        'autoplay': 'autoplay'
                                    }).appendTo("body");
                                }


                                //set time to notify is show
                                var time_notify = parseInt(response[x].time_notification);
                                if (time_notify > 0) {
                                    time_notify = time_notify * 1000;
                                    setTimeout(n.close.bind(n), time_notify);
                                }

                                n.onclose = function (event) {
                                    event.preventDefault();
                                    $('.yith_wcdn_audio').remove();
                                };

                            }
                        }

                    },
                    complete: function () {
                    }
                });

            }, yith_wcdn.time_check);
        });
    }
});
