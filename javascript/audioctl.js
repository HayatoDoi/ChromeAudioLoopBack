"use strict";
/*-----------------------------------------------------------------------------
 * Define.
 *---------------------------------------------------------------------------*/
const MAX_STEP = 3;
const videoElm = document.getElementById("video");
/*-----------------------------------------------------------------------------
 * Event listener.
 *---------------------------------------------------------------------------*/
videoElm.addEventListener("loadedmetadata", () => {
    videoElm.muted = true;
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
        Preview.clear(document.getElementById("modal-step-1-choose-audio"));
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
                Preview.clear(document.getElementById("modal-step-1-choose-audio"));
                return;
        }
        const audioStream = await getAudio(callback);
        videoElm.srcObject = audioStream;
        /* Make preview. */
        Preview.make(document.getElementById("choose-audio-preview"), audioStream);
    }

    /* Click cancel button. */
    document.getElementById("modal-step-1-cancel").onclick = () => {
        modalStep[index].hide();
        clearAudio();
        Preview.clear(document.getElementById("modal-step-1-choose-audio"));
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
    if (videoElm.muted === true) {
        videoElm.muted = false;
    }
}

/* Click stop button. */
document.getElementById("modal-step-3-stop").onclick = () => {
    if (videoElm.muted === false) {
        videoElm.muted = true;
    }
}
/*-----------------------------------------------------------------------------
 * Preview window.
 *---------------------------------------------------------------------------*/
class Preview {
    static make(elm, stream) {
        elm.srcObject = stream;
    }
    static clear(elm, stream) {
        elm.srcObject = null;
    }
    static drawText(elm, txt) {
        const ctx = elm.getContext('2d');
        // const ctxHeight = elm.height;
        // const ctxWidth = elm.width;
        const fontSize = 48;
        ctx.font = `${fontSize}px serif`;
        // const textWidth = ctx.measureText(txt).width ;
        const ctxPositionX = (elm.width - ctx.measureText(txt).width) / 2;
        let ctxPositionY = fontSize;
        ctx.fillText(txt, ctxPositionX, ctxPositionY);

        const pixels = ctx.getImageData(0, 0, elm.width, elm.height);
        const data = pixels.data;
        let textHeight = 0;
        let currentRow = -1;
        [...Array(data.length)].filter(i => i % 4 === 0 && data[i+3 > 0]).map( i => {
            const row = Math.floor((i / 4) / ctx.width);
            if (row > currentRow) {
                currentRow = row;
                textHeight++;
            }
        });
        ctxPositionY = (elm.height - textHeight) / 2;
        ctx.clearRect(0, 0, elm.width, elm.height);
        ctx.fillText(txt, ctxPositionX, ctxPositionY);
    }
}

// Preview.drawText(document.getElementById("canvas-preview"), "no-image");
// function makeWaveform(audioBuffer, ctx, size) {
//     var bufferFl32 = new Float32Array(audioBuffer.length),
//     leng = bufferFl32.length
//     clearCanvas(ctx), bufferFl32.set(audioBuffer.getChannelData(0))
//     for (var idx = 0; leng > idx; idx++)
//         if (idx % size === 0) {
//         var x = offsetWidth * (idx / leng),
//             y = (1 - bufferFl32[idx]) / 2 * offsetHeight
//         0 === idx ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
//         }
//     var gradient = ctx.createLinearGradient(0, 0, 0, offsetHeight)
//     gradient.addColorStop("0", "#f44336"), gradient.addColorStop("0.5", "#4caf50"), gradient.addColorStop("1", "#2196f3"), ctx.strokeStyle = gradient, ctx.stroke()
// }

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
    const videoSrc = videoElm.srcObject;
    const videoSrcClone = document.getElementById("choose-audio-preview").srcObject;

    if (videoSrc !== null) {
        videoSrc.getTracks().forEach(track => track.stop());
    }
    if (videoSrcClone !== null) {
        videoSrcClone.getTracks().forEach(track => track.stop());
    }
    return;
}
