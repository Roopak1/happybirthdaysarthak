// Simple numeric password mechanism
// Adjust this PIN to whatever you like
const CORRECT_PIN = "1234"; // example birthday code

const input = document.getElementById("pin-input");
const keypad = document.querySelector(".keypad");
const submitBtn = document.getElementById("submit");
const msg = document.getElementById("message");
const lock = document.getElementById("lock");
const protectedSection = document.getElementById("protected");
const themeToggle = document.getElementById("theme-toggle");
const speechBox = document.getElementById("speech");
const speechText = document.getElementById("speech-text");
const audio = document.getElementById("bg-audio");
const audioToggle = document.getElementById("audio-toggle");
const timelineToggle = document.getElementById("timeline-toggle");
const timelineRewind = document.getElementById("timeline-rewind");
const timelineForward = document.getElementById("timeline-forward");
// Fireworks overlay elements
const fireworksOverlay = document.getElementById("fireworks-overlay");
const fireworksFrame = document.getElementById("fireworks-frame");
// Track if fireworks have already been opened via trigger
let fireworksOpened = false;
// Overlay speech and audio toggle
const overlaySpeechText = document.getElementById('fireworks-speech-text');
const overlayAudioToggle = document.getElementById('fireworks-audio-toggle');
let useOverlaySpeech = false;

// Preload the fireworks iframe early to avoid loading box
if (fireworksFrame) {
	fireworksFrame.addEventListener('load', () => {
		customizeFireworksIframe();
		// Don't enable sound yet - wait for trigger
	}, { once: true });
}

// Enable/disable forward button (set to true to show it, false to hide it)
const ENABLE_FORWARD_BUTTON = true;

// Emoji rain function
function createEmojiRain(options = {}) {
    // Default settings with combined configuration options
    const settings = {
        // Emoji size range
        minSize: 25,
        maxSize: 60,
        
        // Text size range
        minTextSize: 20,
        maxTextSize: 40,
        
        baseSpeed: 6,
        speedFactor: 1,
        frequency: 450,
        behindContent: true,
        ...options
    };
    
    const emojis = [ 
        'BABE', '🎂', '💍', 'KING', '🎉', 'DARLING', '🎊', '💖', '🍰', 'JOY',
        '💋', 'SWEET', '🥳', '💘', '💝', '🥰', '✨', '❤️', '💎', '💞', 
        'BAE', '🎉', '💋', '💋', '🍬', '💋', '💞', 'CUTE', '💖',
        '✨', '💗', '💓', 'BABY', 'LOVE', '🎂', '🍬', 'BBG',
        '🧁', '😍', '💎', '💍', '🥰', '💝', '🥳', 'MY LOVE', 'LOVELY', 'HONEY',
        '💗', '😍', '💓', '🎊', '🍰', '🧁', '❤️', 'DEAR', '🎁', '💘', '🎁'
    ];

    let emojiContainer = document.querySelector('.emoji-rain');
    if (!emojiContainer) {
        emojiContainer = document.createElement('div');
        emojiContainer.className = 'emoji-rain';
        document.body.appendChild(emojiContainer);

        // Add styling for the container and text-based items
        const style = document.createElement('style');
        style.innerHTML = `
            .emoji-rain {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: ${settings.behindContent ? '-1' : '100'};
                overflow: hidden;
            }
            .emoji-rain span {
                position: absolute;
                user-select: none;
            }
            .emoji-rain .text-emoji {
                color: #7bd389;
                font-weight: 700;
            }
        `;
        document.head.appendChild(style);
    }

    // Create interval for continuous emoji creation
    const intervalId = setInterval(() => {
        const item = emojis[Math.floor(Math.random() * emojis.length)];
        const element = document.createElement('span');

        // Check if item is text, then apply text-emoji class and size
        let size;
        if (/[a-zA-Z]/.test(item)) {
            element.classList.add('text-emoji');
            size = Math.random() * (settings.maxTextSize - settings.minTextSize) + settings.minTextSize;

        } else {
            size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
        }

        element.style.fontSize = `${size}px`;
        element.textContent = item;
        emojiContainer.appendChild(element);

        // Apply falling animation
        const startX = Math.random() * window.innerWidth;
        const rotation = Math.random() * 15;
        const durationVariation = gsap.utils.random(0.8, 1.2);
        const duration = settings.baseSpeed * settings.speedFactor * durationVariation;

        gsap.fromTo(
            element,
            {
                x: startX,
                y: -50,
                rotation: rotation,
                opacity: gsap.utils.random(0.7, 1),
            },
            {
                y: window.innerHeight + 100,
                x: startX + gsap.utils.random(-50, 50),
                rotation: rotation + gsap.utils.random(-20, 15),
                duration: duration,
                ease: "power1.out",
                onComplete: () => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }
            }
        );
    }, settings.frequency);

    return {
        stop: () => clearInterval(intervalId)
    };
}

// Variable to store emoji rain instance
let emojiRainInstance = null;

// Speech timing defaults and per-line config
const SPEECH_DEFAULTS = {
	fadeIn: 0.6,
	hold: 0.8,
	fadeOut: 0.6,
	repeatDelay: 0.2,
	speed: 1,
	fontFamily: "Great Vibes, cursive",
	fontSize: "12px"
};

// Edit timings per line here (omit fields to fall back to SPEECH_DEFAULTS)
const SPEECH_LINES = [
	{ text: "", timings: { fadeIn: 0.5, hold: 1, fadeOut: 0.5, speed: 2 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
	{ text: "Press F11 for better experience", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
	{ text: "and get your ass up and get those earphones for even better experience", timings: { fadeIn: 0.6, hold: 3, fadeOut: 0.6, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

	{ text: "", timings: { fadeIn: 0.5, hold: 4, fadeOut: 0.5, speed: 2 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
	
	{ text: "Hello Sarthak :)", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

	{ text: "Thankyou for always staying calm", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "even though I am really rude sometimes.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "You have always been good and sweet to me,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "and you deserve everything you want in life,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "whether it is us staying strong for life", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "or staying healthy and happy.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "I hope you know how bland my life is without you,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "but you never really appreciate yourself,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "but you deserve to know", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "how special of a boyfriend and my best friend you are.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "Thankyou for being with me", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "at my lowest and highest,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "I promise to do the same with you.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "Also thankyou for the times you make me laugh", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "and make me happy.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "I might not say how much I appreciate you,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "but I truly am grateful for a person like you.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "All those times when we laughed and fought,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "I cherish every moment I have spent with you,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "and I want to spend more moments with you and you only.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "Thankyou for making time to talk,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "even if it's just for 5 minutes.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "You’ve been my calm, my comfort, and my chaos", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "in the most beautiful way.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "And after everything,", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "after all those memories and moments that made us who we are.", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

	{ text: "", timings: { fadeIn: 0.5, hold: 4, fadeOut: 0.5, speed: 2 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

    { text: "And at the end of my digital letter", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "...", timings: { fadeIn: 0.7, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "20px" },

	{ text: "", timings: { fadeIn: 0.5, hold: 4, fadeOut: 0.5, speed: 2 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

	{ text: "HAPPY BIRTHDAY SARTHAK", timings: { fadeIn: 3, hold: 10, fadeOut: 1, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "80px" },
     
	{ text: "May God keep you safe, happy", timings: { fadeIn: 2, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "and......", timings: { fadeIn: 2, hold: 5, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },
    { text: "ALWAYS MINE 😼😼😼", timings: { fadeIn: 2, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "50px" },

	{ text: "Now come back and tell me how was it", timings: { fadeIn: 2, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "30px" },
	{ text: "or you can gaze it for a while", timings: { fadeIn: 2, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "30px" },
	{ text: "click on the heart to restart if you wanna watch it again", timings: { fadeIn: 2, hold: 3, fadeOut: 0.5, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "30px" },
	
	// End marker - will show the beating heart
	{ text: "END", timings: { fadeIn: 0, hold: 0, fadeOut: 0, speed: 1 }, fontFamily: "Playfair Display, serif", fontSize: "1px" }

];

// Theme handling
const THEME_KEY = "birthday-theme";
function applyTheme(theme) {
	const root = document.documentElement; // :root
	if (theme === "dark") {
		root.setAttribute("data-theme", "dark");
	} else {
		root.setAttribute("data-theme", "light");
	}
	// icon
	if (themeToggle) themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

function initTheme() {
	// Always use light theme as default
	applyTheme("light");
}

initTheme();

// GSAP timelines
let tlIntro, tlError, tlSuccess, tlSpeech;

function initAnimations() {
	if (typeof gsap === 'undefined') return; // graceful if GSAP not loaded

	// Intro timeline
	tlIntro = gsap.timeline({ defaults: { duration: 0.35, ease: 'power2.out' } });
	gsap.set('#lock', { opacity: 0, y: 16 });
	gsap.set('#protected', { opacity: 0, y: 16 });
	gsap.set(['#message'], { opacity: 0 });
	tlIntro
		.to('#lock', { opacity: 1, y: 0 })
		.from('.pin-input', { opacity: 0, y: 10 }, '<0.05')
		.from('.keypad button', { opacity: 0, y: 8, stagger: 0.03 }, '-=0.1')
		.from('#submit', { opacity: 0, y: 8 }, '-=0.1')
		.to('#message', { opacity: 1, duration: 0.2 }, '>-0.15');

	// Error shake
	tlError = gsap.timeline({ paused: true });
	tlError
		.to(input, { x: -8, duration: 0.06, ease: 'power1.inOut', repeat: 5, yoyo: true })
		.to(input, { x: 0, duration: 0.08, ease: 'power1.out' })
		.call(() => clearAll());

	// Success transition
	tlSuccess = gsap.timeline({ paused: true });
	tlSuccess
		.to('#lock', { scale: 0.98, opacity: 0, duration: 0.25, ease: 'power1.out' })
		.add(() => {
			lock.classList.add('hidden');
			protectedSection.classList.remove('hidden');
		})
		.fromTo('#protected', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
		.add(() => {
			// attempt to play background audio (may be blocked by browser if no user gesture)
			if (typeof playAudio === 'function') playAudio();
			// Start emoji rain
			emojiRainInstance = createEmojiRain();
			startSpeech();
		});

	tlIntro.play();
}

initAnimations();

// Fireworks overlay controls
let audioWasPlayingBeforeFireworks = false;
function showFireworks() {
	if (!fireworksOverlay) return;
	fireworksOverlay.classList.remove('hidden');
	fireworksOverlay.setAttribute('aria-hidden', 'false');
	// Switch speech rendering to overlay and hide main speech during overlay
	useOverlaySpeech = true;
	if (speechBox) speechBox.classList.add('hidden');
	// Reload iframe to guarantee a fresh start
	if (fireworksFrame) {
		try { fireworksFrame.contentWindow.location.reload(); } catch (e) { /* ignore cross-origin issues (should be same-origin) */ }
		// Customize iframe UI after it loads
		fireworksFrame.addEventListener('load', () => {
			customizeFireworksIframe();
			// After load, ask iframe to enable sound as well
			enableFireworksSound();
		}, { once: true });
	}
	// Sync overlay audio toggle icon and handler
	if (overlayAudioToggle) {
		overlayAudioToggle.textContent = (audio && !audio.paused) ? '🔊' : '🔇';
		overlayAudioToggle.onclick = () => {
			if (!audio) return;
			if (audio.paused) playAudio(); else pauseAudio();
			overlayAudioToggle.textContent = audio.paused ? '🔇' : '🔊';
		};
	}
}

function hideFireworks() {
	if (!fireworksOverlay) return;
	fireworksOverlay.classList.add('hidden');
	fireworksOverlay.setAttribute('aria-hidden', 'true');
	// Switch speech rendering back to main and show main speech
	useOverlaySpeech = false;
	if (speechBox) speechBox.classList.remove('hidden');
}

// Hide Firework app UI and loading screen
function customizeFireworksIframe() {
	try {
		const doc = fireworksFrame && fireworksFrame.contentDocument;
		if (!doc) return;
		// Inject CSS to hide controls, menus, and loading screen
		const style = doc.createElement('style');
		style.textContent = `
			.controls, .menu, .help-modal, .credits, .loading-init { display: none !important; }
			.stage-container { border: none !important; }
		`;
		doc.head.appendChild(style);
	} catch (e) {
		// Ignore failures; fireworks will still run without UI tweaks
	}
}

// Ask the fireworks iframe to enable sound (resume AudioContext + set sound flag)
function enableFireworksSound() {
	try {
		if (fireworksFrame && fireworksFrame.contentWindow) {
			// Define your custom fireworks sequence here
			// Pyramid first, then let it be random
			const customSequence = [
				{ type: 'pyramid', delay: 0 }
				// After pyramid completes, normal random behavior will resume
			];
			
			fireworksFrame.contentWindow.postMessage({ 
				type: 'enable-sound',
				customSequence: customSequence
			}, '*');
		}
	} catch (e) { /* ignore */ }
}

// Start a looping speech mode that fades words in/out
let currentLineIndex = 0;
let timelinePaused = false;

function startSpeech() {
	if (!window.gsap || !speechBox || !speechText) return;
	speechBox.classList.remove('hidden');
	currentLineIndex = 0;
	if (tlSpeech) tlSpeech.kill();
	playLine();
}

const playLine = () => {
	if (timelinePaused) return; // don't start new line if paused
	
	const line = SPEECH_LINES[currentLineIndex] || { text: "" };
	const t = { ...SPEECH_DEFAULTS, ...(line.timings || {}) };
	const speed = t.speed || 1;

	if (tlSpeech) tlSpeech.kill();
	tlSpeech = gsap.timeline({
		onComplete: () => {
			if (!timelinePaused) {
				currentLineIndex++;
				// Stop looping when we reach the end
				if (currentLineIndex < SPEECH_LINES.length) {
					playLine();
				}
			}
		}
	});

	const targetEl = (useOverlaySpeech && overlaySpeechText) ? overlaySpeechText : speechText;
	const targetForColor = targetEl;

	tlSpeech
		.set(targetEl, { opacity: 0 })
		.call(() => {
			targetEl.textContent = line.text;
			// apply per-line font and size
			const ff = line.fontFamily || t.fontFamily || SPEECH_DEFAULTS.fontFamily;
			const fs = line.fontSize || t.fontSize || SPEECH_DEFAULTS.fontSize;
			targetEl.style.fontFamily = ff;
			targetEl.style.fontSize = fs;
			
			// Special animation for "HAPPY BIRTHDAY SARTHAK"
			if (line.text.includes("HAPPY BIRTHDAY")) {
				// Clear text and create individual word spans for animation
				targetEl.textContent = '';
				const words = line.text.split(' ');
				const wordSpans = [];
				
				words.forEach((word, index) => {
					const span = document.createElement('span');
					span.textContent = word;
					span.style.display = 'inline-block';
					span.style.margin = '0 10px';
					span.style.opacity = '0';
					span.style.textShadow = '0 0 10px rgba(255, 255, 255, 1)'; // Initial glow
					targetEl.appendChild(span);
					wordSpans.push(span);
				});
				
				// Animate each word with bounce and color change
				wordSpans.forEach((span, index) => {
					const delay = index * 0.3;
					
					// Bounce in animation
					gsap.fromTo(span, 
						{ 
							opacity: 0, 
							y: -50, 
							scale: 0.5,
							color: '#fff066',
							textShadow: '0 0 10px rgba(249, 236, 118, 1)'
						},
						{ 
							opacity: 1, 
							y: 0, 
							scale: 1,
							duration: 0.6,
							delay: delay,
							ease: 'bounce.out'
						}
					);
					
					// Continuous color pulse with glow
					gsap.to(span, {
						color: '#fdfdfdff',
						textShadow: '0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 1)',
						duration: 1.5,
						delay: delay + 0.6,
						repeat: -1,
						yoyo: true,
						ease: 'sine.inOut'
					});
					
					gsap.to(span, {
						y: -15,
						duration: 1.2,
						delay: delay + 0.6,
						repeat: -1,
						yoyo: true,
						ease: 'sine.inOut'
					});
					
					// Subtle scale pulse
					gsap.to(span, {
						scale: 1.1,
						duration: 1.8,
						delay: delay + 0.6,
						repeat: -1,
						yoyo: true,
						ease: 'sine.inOut'
					});
				});
			}
			
			// Check for trigger word "..." to fade background to pure black
			if (line.text.trim() === "...") {
				// Stop emoji rain
				if (emojiRainInstance) {
					emojiRainInstance.stop();
				}
				// Fade body background to pure black over the fadeIn duration
				// Remove gradient and set to solid black
				gsap.to(document.body, { 
					backgroundImage: 'none',
					backgroundColor: '#000000', 
					duration: t.fadeIn / speed, 
					ease: 'power2.out' 
				});
				// Fade text color to white
				gsap.to(targetForColor, {
					color: '#c6c6c6ff',
					duration: t.fadeIn / speed,
					ease: 'power2.out'
				});
				// Reduce background song volume to half smoothly
				if (audio) {
					const targetVol = Math.max(0, audio.volume * 0.5);
					gsap.to(audio, { volume: targetVol, duration: t.fadeIn / speed, ease: 'power2.out' });
				}
				// Open fireworks overlay after the fade-in completes (once only)
				if (!fireworksOpened) {
					const delayMs = 5000; // fixed 5 seconds after trigger
					setTimeout(() => {
						if (!fireworksOpened) {
							fireworksOpened = true;
							if (typeof showFireworks === 'function') showFireworks();
						}
					}, delayMs);
				}
			}
			
			// Check for END marker to show beating heart
			if (line.text.trim() === "END") {
				targetEl.textContent = ''; // Clear END text
				showBeatingHeart();
			}
		})
		.to(targetEl, { opacity: 1, duration: t.fadeIn / speed, ease: 'power2.out' })
		.to(targetEl, { opacity: 1, duration: t.hold / speed })
		.to(targetEl, { opacity: 0, duration: t.fadeOut / speed, ease: 'power2.in' })
		.to({}, { duration: (t.repeatDelay || 0) / speed });
};

// Beating heart at the end
function showBeatingHeart() {
	// Create heart element
	const heartContainer = document.createElement('div');
	heartContainer.id = 'beating-heart';
	heartContainer.innerHTML = '❤️';
	heartContainer.style.cssText = `
		position: fixed;
		bottom: 20px;
		right: 20px;
		font-size: 42px;
		cursor: pointer;
		z-index: 10000;
		filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.8));
		opacity: 0;
	`;
	
	document.body.appendChild(heartContainer);
	
	// Fade in the heart
	gsap.to(heartContainer, {
		opacity: 1,
		duration: 1,
		ease: 'power2.out'
	});
	
	// Beating animation
	gsap.to(heartContainer, {
		scale: 1.2,
		duration: 0.8,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut'
	});
	
	// Pulsing glow
	gsap.to(heartContainer, {
		filter: 'drop-shadow(0 0 40px rgba(255, 0, 0, 1))',
		duration: 0.8,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut'
	});
	
	// Click to restart
	heartContainer.addEventListener('click', () => {
		// Fade out and reload
		gsap.to(heartContainer, {
			scale: 1.5,
			opacity: 0,
			duration: 0.5,
			ease: 'power2.in',
			onComplete: () => {
				location.reload();
			}
		});
	});
}

// Audio controls
let audioPlaying = false;
async function playAudio() {
	if (!audio) return;
	try {
		// unmute and attempt to play
		audio.muted = false;
		audio.volume = 0.05; // set volume (0.0 to 1.0) — adjust this value to your preference
		const p = audio.play();
		if (p && p.then) {
			await p;
		}
		audioPlaying = !audio.paused;
		if (audioToggle) audioToggle.textContent = audioPlaying ? '🔊' : '🔇';
		// Don't enable fireworks sound here - it will be enabled only when overlay opens
	} catch (err) {
		// autoplay blocked — notify user to press the music button
		audioPlaying = false;
		if (audioToggle) audioToggle.textContent = '🔇';
		setError('Audio blocked — click the music button to enable sound.');
	}
}

function pauseAudio() {
	if (!audio) return;
	audio.pause();
	audioPlaying = false;
	if (audioToggle) audioToggle.textContent = '🔇';
}

	if (audioToggle) {
		// initialize icon
		audioToggle.textContent = (audio && !audio.paused) ? '🔊' : '🔇';
		audioToggle.addEventListener('click', () => {
			if (!audio) return;
			if (audio.paused) {
				playAudio();
			} else {
				pauseAudio();
			}
		});
	}
// Timeline controls
if (timelineToggle) {
	timelineToggle.textContent = '⏸️';
	timelineToggle.addEventListener('click', () => {
		if (timelinePaused) {
			// resume
			timelinePaused = false;
			if (tlSpeech) tlSpeech.resume();
			else playLine(); // if no active timeline, start playing
			timelineToggle.textContent = '⏸️';
		} else {
			// pause
			timelinePaused = true;
			if (tlSpeech) tlSpeech.pause();
			timelineToggle.textContent = '▶️';
		}
	});
}

if (timelineRewind) {
	timelineRewind.addEventListener('click', () => {
		// go back one line
		if (currentLineIndex > 0) {
			currentLineIndex--;
		} else {
			currentLineIndex = SPEECH_LINES.length - 1; // wrap to last
		}
		// kill current timeline and play previous line
		if (tlSpeech) tlSpeech.kill();
		timelinePaused = false;
		if (timelineToggle) timelineToggle.textContent = '⏸️';
		playLine();
	});
}

if (timelineForward) {
	// Show/hide forward button based on config
	if (ENABLE_FORWARD_BUTTON) {
		timelineForward.classList.remove('hidden');
	}
	
	timelineForward.addEventListener('click', () => {
		// go forward one line
		currentLineIndex = (currentLineIndex + 1) % SPEECH_LINES.length;
		// kill current timeline and play next line
		if (tlSpeech) tlSpeech.kill();
		timelinePaused = false;
		if (timelineToggle) timelineToggle.textContent = '⏸️';
		playLine();
	});
}

// Helper to update the input value with masking length
function appendDigit(d) {
	if (!/^[0-9]$/.test(d)) return;
	if ((input.value || "").length >= input.maxLength) return;
	input.value += d;
	clearMessage();
}

function backspace() {
	input.value = input.value.slice(0, -1);
}

function clearAll() {
	input.value = "";
	clearMessage();
}

function clearMessage() {
	msg.textContent = "";
	msg.classList.remove("error", "ok");
}

function setError(text) {
	msg.textContent = text;
	msg.classList.remove("ok");
	msg.classList.add("error");
}

function setOk(text) {
	msg.textContent = text;
	msg.classList.remove("error");
	msg.classList.add("ok");
}

function validate() {
	const value = input.value;
	if (!value) {
		setError("Please enter the code");
		return;
	}
	if (value === CORRECT_PIN) {
		setOk("Unlocked");
		// success animation if available
		if (tlSuccess) {
			tlSuccess.restart();
		} else {
			lock.classList.add("hidden");
			protectedSection.classList.remove("hidden");
		}
	} else {
		setError("Incorrect code");
		if (tlError) {
			tlError.restart();
		} else {
			input.classList.add("shake");
			setTimeout(() => input.classList.remove("shake"), 400);
			clearAll();
		}
	}
}

// Keypad events
keypad.addEventListener("click", (e) => {
	const btn = e.target.closest("button");
	if (!btn) return;
	// micro press animation
	if (window.gsap) gsap.fromTo(btn, { scale: 1 }, { scale: 0.96, duration: 0.06, yoyo: true, repeat: 1, ease: 'power1.inOut' });
	const key = btn.getAttribute("data-key");
	const action = btn.getAttribute("data-action");
	if (key) appendDigit(key);
	if (action === "back") backspace();
	if (action === "clear") clearAll();
});

submitBtn.addEventListener("click", validate);

// Keyboard support (optional)
document.addEventListener("keydown", (e) => {
	if (e.key >= "0" && e.key <= "9") appendDigit(e.key);
	if (e.key === "Backspace") backspace();
	if (e.key === "Enter") validate();
});

