import hsmusicData from './src/hsmusic.json';
import fsCallbacks from 'fs';

const fs = fsCallbacks.promises;

const tracks = hsmusicData.flatMap(x => x.tracks);
const allUrls = tracks.flatMap(x => x.urls);
const bandcampUrls = allUrls.filter(x => x.startsWith('https://homestuck.bandcamp.com/track/'));

await fs.writeFile('src/urls.json', JSON.stringify(bandcampUrls));
