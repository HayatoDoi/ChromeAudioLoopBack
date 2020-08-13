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
            break;
        case 'input-audio':
            clearDesktopAudio();
            //to be continue
            break;
        default:
            clearDesktopAudio();
            clearInputAudio();
            break;
    }
}

/*-----------------------------------------------------------------------------
 * AudioControl.
 *---------------------------------------------------------------------------*/
async function getDesktopAudio() {
    clearDesktopAudio();
    try {
        let mediaStream = await navigator.mediaDevices.getDisplayMedia({video:true, audio:true});
        DesktopAudio = mediaStream;
    } catch (e) {
        console.error('Unable to acquire screen capture: ' + e);
        return null;
    }
}

function clearDesktopAudio() {
    console.log(DesktopAudio);
    if (DesktopAudio !== null) {
        DesktopAudio.removeTrack();
        DesktopAudio = null;
    }
    return;
}

async function getInputAudio() {
    clearInputAudio();
}

function clearInputAudio() {
    if (InputAudio !== null) {
        // DesktopAudio.removeTrack();
        InputAudio = null;
    }
    return;
}