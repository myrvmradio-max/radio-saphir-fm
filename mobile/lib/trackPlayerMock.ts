import { Audio } from 'expo-av';

export const Capability = {
  Play: 'play',
  Stop: 'stop',
};

class TrackPlayerMock {
  private sound: Audio.Sound | null = null;
  private url: string | null = null;
  private metadata: { title?: string; artist?: string } = {};
  private listeners: { [event: string]: Function[] } = {};

  async setupPlayer() {
    console.log('[TrackPlayerMock] Player setup');
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.log('[TrackPlayerMock] Error setting audio mode:', e);
    }
  }

  async updateOptions(options: any) {
    console.log('[TrackPlayerMock] Update options:', options);
  }

  registerPlaybackService(service: any) {
    console.log('[TrackPlayerMock] Register playback service');
  }

  addEventListener(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return {
      remove: () => {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
    };
  }

  async add(track: { id: string; url: string; title: string; artist: string }) {
    console.log('[TrackPlayerMock] Add track:', track);
    this.url = track.url;
    this.metadata = { title: track.title, artist: track.artist };
  }

  async play() {
    console.log('[TrackPlayerMock] Play requested');
    try {
      if (this.sound) {
        await this.sound.unloadAsync().catch(() => {});
        this.sound = null;
      }
      if (this.url) {
        const soundInstance = new Audio.Sound();
        this.sound = soundInstance;
        
        // Use downloadFirst: false which is critical for infinite live streams!
        soundInstance.loadAsync(
          { uri: this.url },
          { shouldPlay: true },
          false
        ).then(() => {
          console.log('[TrackPlayerMock] Stream loaded successfully');
        }).catch((err) => {
          console.log('[TrackPlayerMock] Stream load error:', err);
        });
      }
    } catch (e) {
      console.log('[TrackPlayerMock] Play error:', e);
    }
  }

  async stop() {
    console.log('[TrackPlayerMock] Stop requested');
    try {
      if (this.sound) {
        await this.sound.stopAsync().catch(() => {});
      }
    } catch (e) {
      console.log('[TrackPlayerMock] Stop error:', e);
    }
  }

  async reset() {
    console.log('[TrackPlayerMock] Reset requested');
    try {
      if (this.sound) {
        await this.sound.unloadAsync().catch(() => {});
        this.sound = null;
      }
      this.url = null;
    } catch (e) {
      console.log('[TrackPlayerMock] Reset error:', e);
    }
  }

  async updateNowPlayingMetadata(metadata: any) {
    console.log('[TrackPlayerMock] Update metadata:', metadata);
    this.metadata = { ...this.metadata, ...metadata };
  }
}

const trackPlayerInstance = new TrackPlayerMock();
export default trackPlayerInstance;
