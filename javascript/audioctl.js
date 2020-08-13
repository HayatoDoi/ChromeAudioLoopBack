"use strict";
/*-----------------------------------------------------------------------------
 * Define.
 *---------------------------------------------------------------------------*/
const MAX_STEP = 3;

/*-----------------------------------------------------------------------------
 * Event listener.
 *---------------------------------------------------------------------------*/
document.getElementById("video").addEventListener("loadedmetadata", () => {
    document.getElementById("video").muted = true;
});

/*-----------------------------------------------------------------------------
 * Global.
 *---------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------
 * Stop.ALL
 *---------------------------------------------------------------------------*/
/* Generate array of model step. */
let modalStep = [...Array(MAX_STEP).keys()].map(index =>
    new bootstrap.Modal(document.getElementById(`modal-step-${index+1}`, {keyboard: false}))
);

/* Register event. */
modalStep.forEach((_, index) => {
    /* Click next button. */
    if (index+1 < MAX_STEP) {
        document.getElementById(`modal-step-${index+1}-next`).onclick = () => {
            modalStep[index].hide();
            modalStep[index+1].show();
        };
    }
    /* Click back button. */
    if (index > 0) {
        document.getElementById(`modal-step-${index+1}-back`).onclick = () => {
            modalStep[index].hide();
            modalStep[index-1].show();
        };
    }
    /* Click close button. */
    document.getElementById(`modal-step-${index+1}-close`).onclick = () => {
        modalStep[index].hide();
        clearAudio();
        clearPreview(document.getElementById("modal-step-1-choose-audio"));
        document.getElementById("modal-step-1-choose-audio").options[0].selected = true;
    };
});

/*-----------------------------------------------------------------------------
 * Stop.1 Choose audio.
 *---------------------------------------------------------------------------*/
{
    const index = 0;
    document.getElementById("btn-top").onclick = () => {
        modalStep[index].show();
    }
    /* Select audio. */
    const chooseAudio = document.getElementById("modal-step-1-choose-audio");
    chooseAudio.onchange = async () => {
        let callback = () => {};
        switch (chooseAudio.value) {
            case 'desktop-audio':
                callback = () => {return navigator.mediaDevices.getDisplayMedia({video:true, audio:{echoCancellation:false}})};
                break;
            case 'input-audio':
                callback = () => {return navigator.mediaDevices.getUserMedia({video:false, audio: true})};
                break;
            default:
                clearAudio();
                clearPreview(document.getElementById("modal-step-1-choose-audio"));
                return;
        }
        const audioStream = await getAudio(callback);
        document.getElementById("video").srcObject = audioStream;
        /* Make preview. */
        makePreview(document.getElementById("choose-audio-preview"), audioStream);
    }

    /* Click cancel button. */
    document.getElementById("modal-step-1-cancel").onclick = () => {
        modalStep[index].hide();
        clearAudio();
        clearPreview(document.getElementById("modal-step-1-choose-audio"));
        document.getElementById("modal-step-1-choose-audio").options[0].selected = true;
    };
}

/*-----------------------------------------------------------------------------
 * Stop.2 Cast audio.
 *---------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------
 * Stop.3 Casting...
 *---------------------------------------------------------------------------*/
/* Click go button. */
document.getElementById("modal-step-3-go").onclick = () => {
    if (document.getElementById("video").muted === true) {
        document.getElementById("video").muted = false;
    }
}

/* Click stop button. */
document.getElementById("modal-step-3-stop").onclick = () => {
    if (document.getElementById("video").muted === false) {
        document.getElementById("video").muted = true;
    }
}
/*-----------------------------------------------------------------------------
 * Previw window.
 *---------------------------------------------------------------------------*/
function makePreview(elm, stream) {
    elm.srcObject = stream;
}

function clearPreview(elm) {
    elm.srcObject = null;
}

/*-----------------------------------------------------------------------------
 * Audio Control.
 *---------------------------------------------------------------------------*/
async function getAudio(callback) {
    clearAudio();
    try {
        const audioStream = await callback();
        return audioStream;
    } catch (e) {
        console.error('Unable to acquire screen capture: ' + e);
        return null;
    }
}

function clearAudio() {
    const videoSrc = document.getElementById("video").srcObject;
    const videoSrcClone = document.getElementById("choose-audio-preview").srcObject;

    if (videoSrc !== null) {
        videoSrc.getTracks().forEach(track => track.stop());
    }
    if (videoSrcClone !== null) {
        videoSrcClone.getTracks().forEach(track => track.stop());
    }
    return;
}
