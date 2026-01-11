const MatchCutEngine = {
    getSampledAnchors(container, limit) {
        const all = Array.from(container.querySelectorAll('.anchor-target'));
        if (all.length === 0) return [];
        
        const step = Math.max(1, Math.floor(all.length / limit));
        const sampled = [];
        for(let i = 0; i < limit; i++) {
            const idx = i * step;
            if (all[idx]) sampled.push(all[idx]);
        }
        return sampled;
    },

    alignToCenter(target, layer, viewport, zoom) {
        const vRect = viewport.getBoundingClientRect();
        const lRect = layer.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();

        // Calculate target center relative to the LAYER (not the viewport)
        // We divide by current scale to get the 'natural' coordinate
        const currentScale = lRect.width / layer.offsetWidth;
        const targetCenterX = (tRect.left - lRect.left + (tRect.width / 2)) / currentScale;
        const targetCenterY = (tRect.top - lRect.top + (tRect.height / 2)) / currentScale;

        const x = (vRect.width / 2) - (targetCenterX * zoom);
        const y = (vRect.height / 2) - (targetCenterY * zoom);

        layer.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    }
};