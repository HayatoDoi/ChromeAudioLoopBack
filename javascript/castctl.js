"use strict";

/*-----------------------------------------------------------------------------
 * Chrome Cast
 *---------------------------------------------------------------------------*/
function initCastAPI() {
    var options = {};
    // Set the receiver application ID to your own (created in the
    // Google Cast Developer Console), or optionally
    // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    options.receiverApplicationId = '4F8B3483';

    // Auto join policy can be one of the following three:
    // ORIGIN_SCOPED - Auto connect from same appId and page origin
    // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
    // PAGE_SCOPED - No auto connect
    options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;

    cast.framework.CastContext.getInstance().setOptions(options);
}

function selectCast() {
    document.getElementById("castbutton").click();
}
let castStartBtn = document.getElementById("cast-start");
castStartBtn.onclick = () => {
    selectCast();
}