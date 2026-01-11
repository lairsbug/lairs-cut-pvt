const state = {
    anchors: [],
    currentIndex: 0,
    isPlaying: false,
    playbackInterval: null,
    speed: 100,
    zoom: 1.6,
    blur: 6,
    targetSettings: {
        color: '#6366f1',
        isBold: true,
        isItalic: false
    }
};

const ui = {
    keyword: document.getElementById('keyword'),
    inputHtml: document.getElementById('inputHtml'),
    layer: document.getElementById('article-layer'),
    viewport: document.getElementById('viewport'),
    fontDisplay: document.getElementById('fontDisplay'),
    frameCounter: document.getElementById('frameCounter'),
    frameSlider: document.getElementById('frameSlider'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    statusDisplay: document.getElementById('statusDisplay'),
    promptBox: document.getElementById('promptBox'),
    copyBtn: document.getElementById('copyBtn'),
    
    speedSlider: document.getElementById('speedSlider'),
    speedVal: document.getElementById('speedVal'),
    zoomSlider: document.getElementById('zoomSlider'),
    zoomVal: document.getElementById('zoomVal'),
    blurSlider: document.getElementById('blurSlider'),
    blurVal: document.getElementById('blurVal'),
    styleSelect: document.getElementById('styleSelect'),
    bgColor: document.getElementById('bgColor'),
    colorHex: document.getElementById('colorHex'),
    ratioBtns: document.querySelectorAll('.ratio-btn'),

    targetColor: document.getElementById('targetColor'),
    targetBoldBtn: document.getElementById('targetBoldBtn'),
    targetItalicBtn: document.getElementById('targetItalicBtn'),
    targetStyleSelect: document.getElementById('targetStyleSelect')
};

function renderFrame(index) {
    if (!state.anchors || state.anchors.length === 0) return;
    if (index < 0) index = state.anchors.length - 1;
    if (index >= state.anchors.length) index = 0;

    state.currentIndex = index;
    const target = state.anchors[index];
    
    // NEW: Remove active class from all anchors and add it only to the current target
    state.anchors.forEach(el => el.classList.remove('active'));
    target.classList.add('active');

    const font = FONT_LIBRARY[index % FONT_LIBRARY.length];
    ui.layer.style.fontFamily = `"${font}", serif`; 
    ui.fontDisplay.innerText = font;
    
    MatchCutEngine.alignToCenter(target, ui.layer, ui.viewport, state.zoom);
    
    ui.frameCounter.innerHTML = `${String(index + 1).padStart(2, '0')} <span class="text-gray-700">/ ${String(state.anchors.length).padStart(2, '0')}</span>`;
    ui.frameSlider.value = index;
}

function togglePlay() {
    if (state.isPlaying) {
        clearInterval(state.playbackInterval);
        ui.playPauseBtn.innerHTML = `<svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
        ui.statusDisplay.innerText = "PAUSED";
    } else {
        ui.playPauseBtn.innerHTML = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        ui.statusDisplay.innerText = "PLAYING";
        state.playbackInterval = setInterval(() => renderFrame(state.currentIndex + 1), state.speed);
    }
    state.isPlaying = !state.isPlaying;
}

ui.targetColor.oninput = (e) => {
    state.targetSettings.color = e.target.value;
    document.documentElement.style.setProperty('--target-color', e.target.value);
};

ui.targetBoldBtn.onclick = () => {
    state.targetSettings.isBold = !state.targetSettings.isBold;
    document.documentElement.style.setProperty('--target-weight', state.targetSettings.isBold ? '900' : '400');
    ui.targetBoldBtn.classList.toggle('bg-indigo-600');
    ui.targetBoldBtn.classList.toggle('text-white');
};

ui.targetItalicBtn.onclick = () => {
    state.targetSettings.isItalic = !state.targetSettings.isItalic;
    document.documentElement.style.setProperty('--target-style', state.targetSettings.isItalic ? 'italic' : 'normal');
    ui.targetItalicBtn.classList.toggle('bg-indigo-600');
    ui.targetItalicBtn.classList.toggle('text-white');
};

ui.targetStyleSelect.onchange = (e) => {
    const classes = ['target-underline', 'target-brackets', 'target-highlight', 'target-none'];
    classes.forEach(c => ui.viewport.classList.remove(c));
    ui.viewport.classList.add(`target-${e.target.value}`);
};

ui.speedSlider.oninput = (e) => {
    state.speed = parseInt(e.target.value);
    ui.speedVal.innerText = `${state.speed}ms`;
    if (state.isPlaying) {
        clearInterval(state.playbackInterval);
        state.playbackInterval = setInterval(() => renderFrame(state.currentIndex + 1), state.speed);
    }
};

ui.zoomSlider.oninput = (e) => {
    state.zoom = parseFloat(e.target.value);
    ui.zoomVal.innerText = `${state.zoom.toFixed(1)}x`;
    renderFrame(state.currentIndex);
};

ui.blurSlider.oninput = (e) => {
    state.blur = parseInt(e.target.value);
    ui.blurVal.innerText = `${state.blur}px`;
    document.documentElement.style.setProperty('--focus-blur', `${state.blur}px`);
};
ui.copyBtn.onclick = () => {
    // Select the text in the prompt box
    ui.promptBox.select();
    // Copy to clipboard
    navigator.clipboard.writeText(ui.promptBox.value).then(() => {
        // Visual feedback
        const originalText = ui.copyBtn.innerText;
        ui.copyBtn.innerText = "COPIED!";
        ui.copyBtn.classList.replace('bg-indigo-600', 'bg-green-600');
        
        setTimeout(() => {
            ui.copyBtn.innerText = originalText;
            ui.copyBtn.classList.replace('bg-green-600', 'bg-indigo-600');
        }, 2000);
    });
};

ui.ratioBtns.forEach(btn => {
    btn.onclick = () => {
        ui.ratioBtns.forEach(b => b.classList.remove('bg-indigo-600/20', 'border-indigo-500/50', 'text-indigo-400'));
        btn.classList.add('bg-indigo-600/20', 'border-indigo-500/50', 'text-indigo-400');
        const ratio = btn.dataset.ratio;
        if (ratio === '1/1') { ui.viewport.style.width = '550px'; ui.viewport.style.height = '550px'; }
        else if (ratio === '16/9') { ui.viewport.style.width = '600px'; ui.viewport.style.height = '337px'; }
        else if (ratio === '9/16') { ui.viewport.style.width = '337px'; ui.viewport.style.height = '600px'; }
        renderFrame(state.currentIndex);
    };
});

ui.styleSelect.onchange = (e) => {
    const themes = ['style-cinematic', 'style-midnight', 'style-terminal', 'style-blueprint', 'style-magazine'];
    themes.forEach(t => ui.viewport.classList.remove(t));
    ui.viewport.classList.add(`style-${e.target.value}`);
};

ui.bgColor.oninput = (e) => {
    ui.layer.style.backgroundColor = e.target.value;
    ui.colorHex.innerText = e.target.value.toUpperCase();
};

document.getElementById('generateBtn').onclick = () => {
    const word = ui.keyword.value.trim();
    if(!word) return alert("Enter a keyword");
    if (state.isPlaying) togglePlay();

    const regex = new RegExp(`\\b(${word})\\b`, 'gi');
    ui.layer.innerHTML = ui.inputHtml.value.replace(regex, `<span class="anchor-target">$1</span>`);

    state.anchors = MatchCutEngine.getSampledAnchors(ui.layer, parseInt(document.getElementById('frameCount').value));
    
    if (state.anchors.length > 0) {
        ui.frameSlider.max = state.anchors.length - 1;
        renderFrame(0);
        ui.statusDisplay.innerText = "LOADED";
    } else {
        alert("Keyword not found.");
    }
};

ui.playPauseBtn.onclick = togglePlay;
document.getElementById('nextBtn').onclick = () => { if(state.isPlaying) togglePlay(); renderFrame(state.currentIndex + 1); };
document.getElementById('prevBtn').onclick = () => { if(state.isPlaying) togglePlay(); renderFrame(state.currentIndex - 1); };
ui.frameSlider.oninput = (e) => { if(state.isPlaying) togglePlay(); renderFrame(parseInt(e.target.value)); };

function updatePrompt() {
    const word = ui.keyword.value || "[WORD]";
    ui.promptBox.value = `Write a 1200-word article about ${word}. Structure with <h1>, <h2>, and <p> ONLY. ensure the "${word}" doesn't appear more than 25 times and less than 20 times. Return raw HTML.`;
}
ui.keyword.oninput = updatePrompt;
updatePrompt();

ui.targetBoldBtn.classList.add('bg-indigo-600', 'text-white');