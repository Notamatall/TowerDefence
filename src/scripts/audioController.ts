import myAudioResource from '@/audio/strangerThings.mp3';

const background = new Audio(myAudioResource);
document.body.appendChild(background);

const button: HTMLButtonElement = document.getElementById('game__background-audio-btn') as HTMLButtonElement;

button.addEventListener('click', () => {
	console.log('here')
	background.muted = false;
	background.play();
})
