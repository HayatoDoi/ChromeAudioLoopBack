"use strict";
/*-----------------------------------------------------------------------------
 * Define.
 *---------------------------------------------------------------------------*/
let DesktopAudio = null;
let InputAudio = null;

// const localButton = document.getElementById("select_source");
// localButton.onclick = async function SourceSelect() {
//     try {
//         let mediaStream = await navigator.mediaDevices.getDisplayMedia({video:true, audio:true});
//         const localVideo = document.querySelector("video");
//         if (localVideo.srcObject !== null) {
//             localVideo.srcObject.removeTrack();
//         }
//         localVideo.srcObject = mediaStream;
//     } catch (e) {
//         console.log('Unable to acquire screen capture: ' + e);
//     }
// }

/*-----------------------------------------------------------------------------
 * Stop.1 Choose audio.
 *---------------------------------------------------------------------------*/
const chooseAudio = document.getElementById("choose-audio");
chooseAudio.onchange = async () => {
    console.log(chooseAudio.value);
    switch (chooseAudio.value) {
        case 'desktop-audio':
            clearInputAudio();
            await getDesktopAudio();
            // document.getElementById("choose-audio-preview").srcObject = DesktopAudio;
            document.getElementById("aaaaaa").srcObject = DesktopAudio;
            // document.getElementById("aaaaaa").muted = true;
            break;
        case 'input-audio':
            clearDesktopAudio();
            await getInputAudio();
            document.getElementById("aaaaaa").srcObject = InputAudio;
            // document.getElementById("aaaaaa").muted = true;
            //to be continue
            break;
        default:
            clearDesktopAudio();
            clearInputAudio();
            break;
    }
}

/*-----------------------------------------------------------------------------
 * Stop.3 Start cast.
 *---------------------------------------------------------------------------*/
const startCast = document.getElementById("start");
startCast.onclick = () => {
    console.log("start");
    console.log(document.getElementById("aaaaaa").muted );
    document.getElementById("aaaaaa").muted = false;
}

/*-----------------------------------------------------------------------------
 * Audio Control.
 *---------------------------------------------------------------------------*/
async function getDesktopAudio() {
    clearDesktopAudio();
    try {
        let mediaStream = await navigator.mediaDevices.getDisplayMedia({video:true, audio:{echoCancellation:false}});
        DesktopAudio = mediaStream;
    } catch (e) {
        console.error('Unable to acquire screen capture: ' + e);
        return null;
    }
}

function clearDesktopAudio() {
    console.log(DesktopAudio);
    if (DesktopAudio !== null) {
        DesktopAudio.getTracks().forEach(track => track.stop());
        DesktopAudio = null;
    }
    return;
}

async function getInputAudio() {
    clearInputAudio();
    try {
        let inputAudioStream = await navigator.mediaDevices.getUserMedia({video:false, audio: true});
        InputAudio = inputAudioStream;
    } catch (e) {
        console.error('Unable to acquire audio capture: ' + e);
        return null;
    }
}

function clearInputAudio() {
    if (InputAudio !== null) {
        InputAudio.getTracks().forEach(track => track.stop());
        InputAudio = null;
    }
    return;
}