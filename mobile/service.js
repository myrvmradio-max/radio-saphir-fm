let TrackPlayer;
try {
  const RNTP = require('react-native-track-player');
  TrackPlayer = RNTP.default || RNTP;
} catch (e) {
  TrackPlayer = require('./lib/trackPlayerMock').default;
}

export default async function playbackService() {
    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
    TrackPlayer.addEventListener('remote-stop', async () => {
        await TrackPlayer.stop();
        await TrackPlayer.reset();
    });
}
