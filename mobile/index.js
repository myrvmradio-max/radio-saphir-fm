import { registerRootComponent } from 'expo';
import TrackPlayer from './lib/trackPlayerMock';
import App from './App';
import playbackService from './service';

TrackPlayer.registerPlaybackService(() => playbackService);
registerRootComponent(App);
