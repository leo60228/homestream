import AudioFeeder from 'audio-feeder';
import hsmusicData from './hsmusic.json';
import _ from 'lodash';

const tracks = hsmusicData.flatMap(x => x.tracks);
const allUrls = tracks.flatMap(x => x.urls);
const bandcampUrls = allUrls.filter(x => x.startsWith('https://homestuck.bandcamp.com/track/'));

function corsFetch(url, options) {
    return fetch(`https://c.l3.pm/?${encodeURIComponent(url)}`, options);
}

function getChannels(audio) {
    return _.times(2, x => audio.getChannelData(x));
}

async function main() {
    const url = _.sample(bandcampUrls);
    console.log(url);

    const htmlReq = await corsFetch(url);
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
                feeder.bufferData(getChannels(encodedAudio));
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
            feeder.bufferData(getChannels(encodedAudio));
            requested = false;
        }
    };

    encoder.postMessage(getChannels(audio));
};

main();
