import TrackPlayer from 'react-native-track-player';

export default async function playbackService() {
    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
    TrackPlayer.addEventListener('remote-stop', async () => {
        await TrackPlayer.stop();
        await TrackPlayer.reset();
    });
}
