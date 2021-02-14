import AudioFeeder from 'audio-feeder';

function corsFetch(url, options) {
    return fetch(`https://c.l3.pm/?${encodeURIComponent(url)}`, options);
}

async function main() {
    const htmlReq = await corsFetch('https://homestuck.bandcamp.com/track/megalovania-2');
    const htmlText = await htmlReq.text();

    const domParser = new DOMParser();
    const htmlDoc = domParser.parseFromString(htmlText, 'text/html');

    const tralbum = JSON.parse(htmlDoc.querySelector('[data-tralbum]').dataset.tralbum);
    const file = tralbum.trackinfo[0].file['mp3-128'];

    const songReq = await corsFetch(file);
    const data = await songReq.arrayBuffer();

    const audioCtx = new OfflineAudioContext(2, 1, 44100);

    console.time('decoding');
    const audio = await audioCtx.decodeAudioData(data);
    console.timeEnd('decoding');

    let feeder = new AudioFeeder();

    let encoder = new Worker('worker.js');
    let started = false;

    let requested = false;

    encoder.onmessage = async (evt) => {
        const encodedBuffer = evt.data;

        if (!encodedBuffer) {
            console.log('done encoding');
            feeder.onbufferlow = () => {};
            feeder.onstarved = () => {
                console.log('done playing');
                feeder.stop();
            };
            return;
        }

        console.time('decoding');
        const encodedAudio = await audioCtx.decodeAudioData(encodedBuffer);
        console.timeEnd('decoding');

        if (!started) {
            const playButton = document.getElementById('play');
            playButton.addEventListener('click', () => {
                feeder.init(2, 44100);
                feeder.bufferThreshold = 3;
                feeder.bufferData([encodedAudio.getChannelData(0), encodedAudio.getChannelData(1)]);
                feeder.start();
                feeder.onbufferlow = function() {
                    console.log('buffer low');
                    if (requested) {
                        console.log('already requested');
                    } else {
                        console.log('requesting');
                        requested = true;
                        encoder.postMessage(null);
                    }
                };
            }, { once: true });
            playButton.disabled = false;
            started = true;
        } else if (!requested && feeder.durationBuffered < feeder.bufferThreshold) {
            console.log('feeder wants more, requesting');
            requested = true;
            encoder.postMessage(null);
        } else {
            console.log('giving feeder data');
            feeder.bufferData([encodedAudio.getChannelData(0), encodedAudio.getChannelData(1)]);
            requested = false;
        }
    };

    encoder.postMessage([audio.getChannelData(0), audio.getChannelData(1)]);
};

main();
