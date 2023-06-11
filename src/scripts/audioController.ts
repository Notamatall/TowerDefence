import sciFiSrc1 from '@/audio/backgroundAudio/Sci-Fi 1.mp3';
import sciFiSrc2 from '@/audio/backgroundAudio/Sci-Fi 2.mp3';
import sciFiSrc3 from '@/audio/backgroundAudio/Sci-Fi 3.mp3';
import sciFiSrc4 from '@/audio/backgroundAudio/Sci-Fi 4.mp3';
// import sciFiSrc5 from '@/audio/backgroundAudio/Sci-Fi 5.mp3';
// import sciFiSrc6 from '@/audio/backgroundAudio/Sci-Fi 6.mp3';
// import sciFiSrc7 from '@/audio/backgroundAudio/Sci-Fi 7.mp3';
// import sciFiSrc8 from '@/audio/backgroundAudio/Sci-Fi 8.mp3';

class AudioController {
	sciFiAudio = [
		new Audio(sciFiSrc1),
		new Audio(sciFiSrc2),
		new Audio(sciFiSrc3),
		new Audio(sciFiSrc4),
		// new Audio(sciFiSrc5),
		// new Audio(sciFiSrc6),
		// new Audio(sciFiSrc7),
		// new Audio(sciFiSrc8)
	]
	currentPlayed?: HTMLAudioElement;

	loopBackground() {
		this.currentPlayed = this.sciFiAudio[Math.round(Math.random() * 3)];
		this.currentPlayed.play();
		const whenEnded = function (this: AudioController) {
			this.currentPlayed?.removeEventListener('ended', whenEnded.bind(this));
			this.loopBackground();
		}
		this.currentPlayed.addEventListener("ended", whenEnded.bind(this));
	}

	volumeHigher() {
		if (this.currentPlayed && this.currentPlayed.volume + 0.1 < 1)
			this.currentPlayed.volume = this.currentPlayed.volume + 0.1;
	}

	volumeLower() {
		if (this.currentPlayed && this.currentPlayed.volume - 0.1 >= 0)
			this.currentPlayed.volume = this.currentPlayed.volume - 0.1;
	}
}
const audioController = new AudioController();
export default audioController;