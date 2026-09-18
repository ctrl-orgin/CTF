const playlist = [
   "/static/music/audio.mp3",
];

let currentTrackIndex = 0;

// تابع بارگذاری و پخش تراک فعلی
function playCurrentTrack() {
    const audio = document.getElementById('bgm-player');
    const playIcon = document.getElementById('audio-play-icon');
    const wavesIcon = document.getElementById('audio-waves');
    const btn = document.getElementById('audio-toggle-btn');

    if (!audio || playlist.length === 0) return;

    // تنظیم آدرس موزیک بر اساس ایندکس فعلی
    audio.src = playlist[currentTrackIndex];

    audio.play().then(() => {
        playIcon.classList.add('hidden');
        wavesIcon.classList.remove('hidden');
        btn.classList.add('border-cyan-400', 'text-cyan-400', 'shadow-[0_0_20px_rgba(0,210,255,0.6)]');
    }).catch((err) => {
        console.warn("پخش موزیک با خطا مواجه شد یا آدرس فایل صحیح نیست:", err);
    });
}

// تابع Toggle برای دکمه پخش / توقف
function toggleCyberAudio() {
    const audio = document.getElementById('bgm-player');
    const playIcon = document.getElementById('audio-play-icon');
    const wavesIcon = document.getElementById('audio-waves');
    const btn = document.getElementById('audio-toggle-btn');

    if (!audio || playlist.length === 0) return;

    if (audio.paused) {
        // اگر هنوز سورس ست نشده بود، آهنگ فعلی را لود و پخش کن
        if (!audio.src) {
            playCurrentTrack();
        } else {
            audio.play().then(() => {
                playIcon.classList.add('hidden');
                wavesIcon.classList.remove('hidden');
                btn.classList.add('border-cyan-400', 'text-cyan-400', 'shadow-[0_0_20px_rgba(0,210,255,0.6)]');
            }).catch((err) => console.warn(err));
        }
    } else {
        audio.pause();
        playIcon.classList.remove('hidden');
        wavesIcon.classList.add('hidden');
        btn.classList.remove('border-cyan-400', 'text-cyan-400', 'shadow-[0_0_20px_rgba(0,210,255,0.6)]');
    }
}

// ایونت ردیابی پایان موزیک و رفتن به تراک بعدی

        document.addEventListener("DOMContentLoaded", () => {
            const items = document.querySelectorAll('.timeline-item:not(.treasure-node)');
            let foundActive = false;

            // Step 1: Iterate over timeline cards to evaluate state (Solved, Active, Locked)
            items.forEach((item) => {
                const isSolved = item.getAttribute('data-solved') === 'true';
                const dot = item.querySelector('.timeline-dot');
                const card = item.querySelector('.cyber-card');
                const badge = item.querySelector('.node-status-badge');
                const form = item.querySelector('.flag-form');
                const lockedMsg = item.querySelector('.locked-msg');
                const spoiler = item.querySelector('.desc-spoiler');
                const encryptedBox = item.querySelector('.encrypted-placeholder');
                const prefix = item.querySelector('.node-prefix');

                if (isSolved) {
                    // Node is Solved
                    dot.className = 'timeline-dot solved-dot is-solved';
                    card.classList.add('solved-card');
                } else if (!foundActive) {
                    // First unsolved node becomes the ACTIVE target
                    foundActive = true;
                    dot.className = 'timeline-dot active-dot is-active';
                    card.classList.add('active');

                    if (badge) {
                        badge.innerHTML = `
                            <span class="text-cyan-400 flex items-center gap-2 animate-pulse">
                                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                TARGET ACQUIRED
                            </span>`;
                    }
                    if (prefix) prefix.className = 'node-prefix text-cyan-500 font-mono-cyber';
                } else {
                    // All subsequent unsolved nodes become LOCKED
                    dot.className = 'timeline-dot locked-dot';
                    card.classList.add('locked-card', 'locked-node');

                    if (badge) {
                        badge.innerHTML = `
                            <span class="text-gray-600 flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                LOCKED
                            </span>`;
                    }
                    if (prefix) prefix.className = 'node-prefix text-gray-600 font-mono-cyber';
                    if (spoiler) spoiler.classList.add('hidden');
                    if (encryptedBox) encryptedBox.classList.remove('hidden');
                    if (form) form.classList.add('hidden');
                    if (lockedMsg) lockedMsg.classList.remove('hidden');
                }
            });

            // Step 2: Handle Treasure Node (Mainframe Core) State
            const mainframeCard = document.getElementById('mainframe-card');
            const mainframeTitle = document.getElementById('mainframe-title');
            const mainframeStatus = document.getElementById('mainframe-status');
            const mainframeIcon = document.getElementById('mainframe-icon');
            const mainframeDot = document.getElementById('mainframe-dot');

            if (!foundActive && items.length > 0) {
                // All challenges solved! Mainframe unlocked!
                mainframeCard.className = 'relative bg-cyan-950/20 border border-green-500/80 p-8 rounded-sm shadow-[0_0_30px_rgba(0,255,136,0.2)]';
                mainframeTitle.className = 'text-2xl font-bold mb-2 text-green-400 font-mono-cyber uppercase tracking-widest';
                mainframeTitle.textContent = 'MAINFRAME_PWNED';
                mainframeStatus.className = 'text-green-300 text-xs mt-2 font-mono-cyber uppercase tracking-widest animate-pulse';
                mainframeStatus.textContent = '// CONGRATULATIONS: ALL SECURITY LAYERS BYPASSED';
                mainframeIcon.className = 'w-12 h-12 mx-auto mb-4 text-green-400';
                mainframeDot.className = 'timeline-dot solved-dot is-solved !w-4 !h-4 z-20';
            }

            // Step 3: Dynamic line calculation to draw progress line connecting nodes
            const drawPathLine = () => {
                const progressLine = document.getElementById('progress-line');
                const wrapper = document.getElementById('timeline-container');
                const dots = document.querySelectorAll('.timeline-dot');
                
                if (!progressLine || !wrapper || dots.length === 0) return;

                let targetDot = null;
                for (let i = dots.length - 1; i >= 0; i--) {
                    if (dots[i].classList.contains('is-solved') || dots[i].classList.contains('is-active')) {
                        targetDot = dots[i];
                        break;
                    }
                }

                if (targetDot) {
                    const wrapperRect = wrapper.getBoundingClientRect();
                    const targetRect = targetDot.getBoundingClientRect();
                    
                    const relativeTop = targetRect.top - wrapperRect.top;
                    const heightOffset = targetRect.height / 2;
                    
                    progressLine.style.height = `${relativeTop + heightOffset}px`;
                }
            };

            setTimeout(drawPathLine, 120);
            window.addEventListener('resize', drawPathLine);
        });