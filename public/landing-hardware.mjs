export function buildSquircleSamples(W, H, R, segArc = 56, segLine = 18) {
    const hw = W / 2;
    const hh = H / 2;
    const cr = Math.min(R, hw - 1, hh - 1);
    const q = 2 / 2.42;
    const raw = [];
    const pushCorner = (cx, cy, a0, a1) => {
        for (let i = 0; i <= segArc; i++) {
            const a = a0 + (a1 - a0) * (i / segArc);
            const ca = Math.cos(a);
            const sa = Math.sin(a);
            raw.push({
                x: cx + cr * Math.sign(ca) * Math.pow(Math.abs(ca), q),
                y: cy + cr * Math.sign(sa) * Math.pow(Math.abs(sa), q)
            });
        }
    };
    const pushEdge = (x0, y0, x1, y1) => {
        for (let i = 1; i < segLine; i++) {
            const t = i / segLine;
            raw.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t });
        }
    };
    pushCorner(-hw + cr, -hh + cr, Math.PI, Math.PI * 1.5);
    pushEdge(-hw + cr, -hh, hw - cr, -hh);
    pushCorner(hw - cr, -hh + cr, -Math.PI / 2, 0);
    pushEdge(hw, -hh + cr, hw, hh - cr);
    pushCorner(hw - cr, hh - cr, 0, Math.PI / 2);
    pushEdge(hw - cr, hh, -hw + cr, hh);
    pushCorner(-hw + cr, hh - cr, Math.PI / 2, Math.PI);
    pushEdge(-hw, hh - cr, -hw, -hh + cr);
    return raw;
}

export function traceProjectedPath(ctx, pts) {
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
        if (i === 0) ctx.moveTo(pts[i].px, pts[i].py);
        else ctx.lineTo(pts[i].px, pts[i].py);
    }
    ctx.closePath();
}

export function computeConvexHull(pts) {
    if (!pts || pts.length < 3) return pts || [];
    const sorted = pts.map(p => ({ px: p.px, py: p.py }))
        .sort((a, b) => (a.px !== b.px ? a.px - b.px : a.py - b.py));
    const cross = (o, a, b) => (a.px - o.px) * (b.py - o.py) - (a.py - o.py) * (b.px - o.px);
    const lower = [];
    for (const p of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
        lower.push(p);
    }
    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
        const p = sorted[i];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
        upper.push(p);
    }
    lower.pop();
    upper.pop();
    return lower.concat(upper);
}

export function drawStudio3DPhone(ctx, cx, cy, sc, rotZRad, imgEl, yawDeg = 22.0, pitchDeg = -4.2) {
    const W = 274 * sc;
    const H = 588 * sc;
    const R = 39 * sc;
    const D = 34 * sc;
    const focal = 1950 * sc;
    const yaw = yawDeg * Math.PI / 180;
    const pitch = pitchDeg * Math.PI / 180;
    const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch), sinP = Math.sin(pitch);

    const proj = (x, y, z) => {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const ry = y * cosP - z1 * sinP;
        const rz = y * sinP + z1 * cosP;
        const ps = focal / (focal - rz);
        return { px: x1 * ps, py: ry * ps };
    };

    const outerSamples = buildSquircleSamples(W, H, R, 56, 18);
    const frontOuter = outerSamples.map(p => proj(p.x, p.y, D / 2));
    const backOuter = outerSamples.map(p => proj(p.x, p.y, -D / 2));
    const insetShadowOuter = outerSamples.map(p => proj(p.x * 0.94, p.y * 0.955, -D / 2));
    const outerHull = computeConvexHull([...frontOuter, ...backOuter]);

    ctx.save();
    ctx.translate(cx, cy);
    if (rotZRad) ctx.rotate(rotZRad);

    const baseMid = proj(0, H * 0.50, 0);
    ctx.save();
    const contactGrad = ctx.createRadialGradient(baseMid.px - 4 * sc, baseMid.py + 3 * sc, 3 * sc, baseMid.px - 4 * sc, baseMid.py + 3 * sc, W * 0.68);
    contactGrad.addColorStop(0, 'rgba(8, 14, 10, 0.36)');
    contactGrad.addColorStop(0.5, 'rgba(8, 14, 10, 0.14)');
    contactGrad.addColorStop(1, 'rgba(8, 14, 10, 0)');
    ctx.fillStyle = contactGrad;
    ctx.beginPath();
    ctx.ellipse(baseMid.px - 4 * sc, baseMid.py + 3 * sc, W * 0.60, 16 * sc, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.shadowColor = 'rgba(8, 14, 10, 0.24)';
    ctx.shadowBlur = 24 * sc;
    ctx.shadowOffsetX = (yawDeg >= 0 ? -9 : 9) * sc;
    ctx.shadowOffsetY = 12 * sc;
    traceProjectedPath(ctx, insetShadowOuter);
    ctx.fillStyle = 'rgba(12, 18, 14, 0.28)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    traceProjectedPath(ctx, outerHull);
    ctx.clip();
    const dir = yawDeg >= 0 ? -1 : 1;
    const railTop = proj(dir * W * 0.50, -H * 0.42, 0);
    const railBot = proj(dir * W * 0.50, H * 0.42, 0);
    const railBand = ctx.createLinearGradient(railTop.px - 6 * sc, railTop.py, railBot.px + 6 * sc, railBot.py);
    railBand.addColorStop(0, '#eef3f7');
    railBand.addColorStop(0.24, '#ffffff');
    railBand.addColorStop(0.55, '#cfd6de');
    railBand.addColorStop(1, '#98a1ab');
    ctx.fillStyle = railBand;
    ctx.fillRect(-W * 0.75, -H * 0.65, W * 1.5, H * 1.3);
    ctx.restore();

    traceProjectedPath(ctx, outerHull);
    ctx.strokeStyle = 'rgba(32, 38, 46, 0.28)';
    ctx.lineWidth = Math.max(0.8, 1.0 * sc);
    ctx.stroke();

    const draw3DKey = (yTop, yBot) => {
        const depthOut = 1.8 * sc;
        const pB1 = proj(dir * (W / 2), yTop, -D * 0.14);
        const pB2 = proj(dir * (W / 2), yBot, -D * 0.14);
        const pT1 = proj(dir * (W / 2 + depthOut), yTop + 1 * sc, D * 0.10);
        const pT2 = proj(dir * (W / 2 + depthOut), yBot - 1 * sc, D * 0.10);
        ctx.beginPath();
        ctx.moveTo(pB1.px, pB1.py);
        ctx.lineTo(pB2.px, pB2.py);
        ctx.lineTo(pT2.px, pT2.py);
        ctx.lineTo(pT1.px, pT1.py);
        ctx.closePath();
        ctx.fillStyle = '#8b949e';
        ctx.fill();
    };
    draw3DKey(-H * 0.22, -H * 0.14);
    draw3DKey(-H * 0.11, -H * 0.025);

    const rimGrad = ctx.createLinearGradient(-W * 0.48, -H * 0.45, W * 0.45, H * 0.48);
    rimGrad.addColorStop(0, '#ffffff');
    rimGrad.addColorStop(0.35, '#dbe2e8');
    rimGrad.addColorStop(0.8, '#bcc5ce');
    rimGrad.addColorStop(1, '#e6ebf0');
    traceProjectedPath(ctx, frontOuter);
    ctx.fillStyle = rimGrad;
    ctx.fill();

    const chamferInset = 2.6 * sc;
    const oledSamples = buildSquircleSamples(W - chamferInset * 2, H - chamferInset * 2, R - chamferInset, 56, 18);
    traceProjectedPath(ctx, oledSamples.map(p => proj(p.x, p.y, D / 2)));
    ctx.fillStyle = '#090b0d';
    ctx.fill();

    const frameTotal = 7.4 * sc;
    const scrW = W - frameTotal * 2;
    const scrH = H - frameTotal * 2;
    const scrR = R - frameTotal;
    const scrPoly = buildSquircleSamples(scrW, scrH, scrR, 56, 18).map(p => proj(p.x, p.y, D / 2));

    ctx.save();
    traceProjectedPath(ctx, scrPoly);
    ctx.clip();
    ctx.fillStyle = '#090b0d';
    const fTL = proj(-scrW / 2, -scrH / 2, D / 2);
    const fBR = proj(scrW / 2, scrH / 2, D / 2);
    ctx.fillRect(fTL.px - 24 * sc, fTL.py - 24 * sc, (fBR.px - fTL.px) + 48 * sc, (fBR.py - fTL.py) + 48 * sc);

    if (imgEl && imgEl.naturalWidth) {
        const SLICES = 56;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        for (let s = 0; s < SLICES; s++) {
            const u0 = s / SLICES;
            const u1 = (s + 1) / SLICES;
            const x0 = -scrW / 2 + scrW * u0;
            const x1 = -scrW / 2 + scrW * u1;
            const pTL = proj(x0, -scrH / 2, D / 2);
            const pTR = proj(x1, -scrH / 2, D / 2);
            const pBL = proj(x0, scrH / 2, D / 2);
            ctx.save();
            ctx.transform(
                (pTR.px - pTL.px) * 1.12,
                (pTR.py - pTL.py) * 1.12,
                pBL.px - pTL.px,
                pBL.py - pTL.py,
                pTL.px,
                pTL.py
            );
            const sx = u0 * imgEl.naturalWidth;
            const sw = Math.max(1, (u1 - u0) * imgEl.naturalWidth);
            ctx.drawImage(imgEl, sx, 0, sw, imgEl.naturalHeight, 0, 0, 1, 1);
            ctx.restore();
        }
    }

    const camP = proj(0, -scrH / 2 + 8.5 * sc, D / 2);
    const camR = 2.7 * sc;
    ctx.beginPath();
    ctx.ellipse(camP.px, camP.py, camR, camR * cosP, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#07080a';
    ctx.fill();

    const sheen = ctx.createLinearGradient(fTL.px, fTL.py, fBR.px * 0.72, fBR.py * 0.65);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.13)');
    sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.03)');
    sheen.addColorStop(0.55, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(fTL.px - 24 * sc, fTL.py - 24 * sc, (fBR.px - fTL.px) + 48 * sc, (fBR.py - fTL.py) + 48 * sc);

    ctx.restore();
    ctx.restore();
}

export function drawStudio3DMacBook(ctx, cx, cy, wFrame, imgEl, yawDeg = 5.5) {
    const sc = wFrame / 430;
    const W = wFrame;
    const H = W / 1.6 + 11 * sc;
    const R = 13.0 * sc;
    const D = 7.2 * sc;
    const focal = 2850 * sc;
    const yaw = yawDeg * Math.PI / 180;
    const cosY = Math.cos(yaw), sinY = Math.sin(yaw);

    const proj = (x, y, z) => {
        const rx = x * cosY + z * sinY;
        const rz = -x * sinY + z * cosY;
        const ps = focal / (focal - rz);
        return { px: rx * ps, py: y * ps };
    };

    const lidSamples = buildSquircleSamples(W, H, R, 36, 16);
    const frontLid = lidSamples.map(p => proj(p.x, p.y, D / 2));
    const backLid = lidSamples.map(p => proj(p.x, p.y, -D / 2));
    const insetLidShadow = lidSamples.map(p => proj(p.x * 0.955, p.y * 0.96, -D / 2));
    const lidHull = computeConvexHull([...frontLid, ...backLid]);

    const hingeY = H / 2 + 1.2 * sc;
    const deckDropY = hingeY + 23 * sc;
    const deckDepthZ = 68 * sc;
    const lipH = 5.6 * sc;

    const dBL = proj(-W * 0.502, hingeY, -D * 0.3);
    const dBR = proj(W * 0.502, hingeY, -D * 0.3);
    const dFL = proj(-W * 0.528, deckDropY, deckDepthZ);
    const dFR = proj(W * 0.528, deckDropY, deckDepthZ);
    const dFLBot = { px: dFL.px, py: dFL.py + lipH };
    const dFRBot = { px: dFR.px, py: dFR.py + lipH };

    ctx.save();
    ctx.translate(cx, cy - 3 * sc);

    ctx.save();
    const deckCenterX = (dFLBot.px + dFRBot.px) * 0.5;
    const deckCenterY = (dFLBot.py + dFRBot.py) * 0.5 + 3.5 * sc;
    const macGround = ctx.createRadialGradient(deckCenterX, deckCenterY, 10 * sc, deckCenterX, deckCenterY, W * 0.66);
    macGround.addColorStop(0, 'rgba(8, 14, 10, 0.36)');
    macGround.addColorStop(0.55, 'rgba(8, 14, 10, 0.14)');
    macGround.addColorStop(1, 'rgba(8, 14, 10, 0)');
    ctx.fillStyle = macGround;
    ctx.beginPath();
    ctx.ellipse(deckCenterX, deckCenterY, W * 0.60, 16 * sc, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.shadowColor = 'rgba(8, 14, 10, 0.24)';
    ctx.shadowBlur = 22 * sc;
    ctx.shadowOffsetX = -5 * sc;
    ctx.shadowOffsetY = 10 * sc;
    traceProjectedPath(ctx, insetLidShadow);
    ctx.fillStyle = 'rgba(12, 18, 14, 0.28)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    traceProjectedPath(ctx, lidHull);
    ctx.clip();
    const shellG = ctx.createLinearGradient(-W * 0.5, -H * 0.4, W * 0.5, H * 0.4);
    shellG.addColorStop(0, '#c2cbd4');
    shellG.addColorStop(0.45, '#e8edf2');
    shellG.addColorStop(1, '#98a1ac');
    ctx.fillStyle = shellG;
    ctx.fillRect(-W * 0.7, -H * 0.7, W * 1.4, H * 1.4);
    ctx.restore();

    const rimG = ctx.createLinearGradient(-W * 0.45, -H * 0.45, W * 0.45, H * 0.45);
    rimG.addColorStop(0, '#f8fafc');
    rimG.addColorStop(0.5, '#d5dce3');
    rimG.addColorStop(1, '#b6bec7');
    traceProjectedPath(ctx, frontLid);
    ctx.fillStyle = rimG;
    ctx.fill();

    const bezInset = 1.6 * sc;
    const bezSamples = buildSquircleSamples(W - bezInset * 2, H - bezInset * 2, R - bezInset, 36, 16);
    traceProjectedPath(ctx, bezSamples.map(p => proj(p.x, p.y, D / 2)));
    ctx.fillStyle = '#0e1012';
    ctx.fill();

    const scrLeft = 7.4 * sc, scrTop = 8.8 * sc, scrBot = 7.4 * sc;
    const scrW = W - scrLeft * 2;
    const scrH = H - scrTop - scrBot;
    const scrCenterY = (scrTop - scrBot) * 0.5;
    const scrSamples = buildSquircleSamples(scrW, scrH, 6.2 * sc, 28, 14)
        .map(p => proj(p.x, p.y + scrCenterY, D / 2));

    ctx.save();
    traceProjectedPath(ctx, scrSamples);
    ctx.clip();
    ctx.fillStyle = '#0e1012';
    const mTL = proj(-scrW / 2, -scrH / 2 + scrCenterY, D / 2);
    const mBR = proj(scrW / 2, scrH / 2 + scrCenterY, D / 2);
    ctx.fillRect(mTL.px - 16 * sc, mTL.py - 16 * sc, (mBR.px - mTL.px) + 32 * sc, (mBR.py - mTL.py) + 32 * sc);

    if (imgEl && imgEl.naturalWidth) {
        const SLICES = 72;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        for (let s = 0; s < SLICES; s++) {
            const u0 = s / SLICES;
            const u1 = (s + 1) / SLICES;
            const x0 = -scrW / 2 + scrW * u0;
            const x1 = -scrW / 2 + scrW * u1;
            const pTop0 = proj(x0, -scrH / 2 + scrCenterY, D / 2);
            const pTop1 = proj(x1, -scrH / 2 + scrCenterY, D / 2);
            const pBot0 = proj(x0, scrH / 2 + scrCenterY, D / 2);
            ctx.save();
            ctx.transform(
                (pTop1.px - pTop0.px) * 1.12,
                (pTop1.py - pTop0.py) * 1.12,
                pBot0.px - pTop0.px,
                pBot0.py - pTop0.py,
                pTop0.px,
                pTop0.py
            );
            const sx = u0 * imgEl.naturalWidth;
            const sw = Math.max(1, (u1 - u0) * imgEl.naturalWidth);
            ctx.drawImage(imgEl, sx, 0, sw, imgEl.naturalHeight, 0, 0, 1, 1);
            ctx.restore();
        }
    }
    ctx.restore();

    const deckGrad = ctx.createLinearGradient(0, dBL.py, 0, dFL.py);
    deckGrad.addColorStop(0, '#c6ced6');
    deckGrad.addColorStop(0.5, '#e6ebf0');
    deckGrad.addColorStop(1, '#f4f7fa');
    ctx.beginPath();
    ctx.moveTo(dBL.px, dBL.py);
    ctx.lineTo(dBR.px, dBR.py);
    ctx.lineTo(dFR.px, dFR.py);
    ctx.lineTo(dFL.px, dFL.py);
    ctx.closePath();
    ctx.fillStyle = deckGrad;
    ctx.fill();

    const kbBL = proj(-W * 0.378, hingeY + 3.4 * sc, 8.5 * sc);
    const kbBR = proj(W * 0.378, hingeY + 3.4 * sc, 8.5 * sc);
    const kbFL = proj(-W * 0.392, hingeY + 11.4 * sc, 31.5 * sc);
    const kbFR = proj(W * 0.392, hingeY + 11.4 * sc, 31.5 * sc);
    ctx.beginPath();
    ctx.moveTo(kbBL.px, kbBL.py);
    ctx.lineTo(kbBR.px, kbBR.py);
    ctx.lineTo(kbFR.px, kbFR.py);
    ctx.lineTo(kbFL.px, kbFL.py);
    ctx.closePath();
    ctx.fillStyle = '#181a1d';
    ctx.fill();

    const tpBL = proj(-W * 0.155, hingeY + 13.6 * sc, 37 * sc);
    const tpBR = proj(W * 0.155, hingeY + 13.6 * sc, 37 * sc);
    const tpFL = proj(-W * 0.162, hingeY + 20.0 * sc, 59 * sc);
    const tpFR = proj(W * 0.162, hingeY + 20.0 * sc, 59 * sc);
    ctx.beginPath();
    ctx.moveTo(tpBL.px, tpBL.py);
    ctx.lineTo(tpBR.px, tpBR.py);
    ctx.lineTo(tpFR.px, tpFR.py);
    ctx.lineTo(tpFL.px, tpFL.py);
    ctx.closePath();
    ctx.fillStyle = 'rgba(220, 226, 232, 0.40)';
    ctx.fill();

    const lipGrad = ctx.createLinearGradient(dFL.px, dFL.py, dFR.px, dFRBot.py);
    lipGrad.addColorStop(0, '#a6aeb7');
    lipGrad.addColorStop(0.5, '#dfe4ea');
    lipGrad.addColorStop(1, '#9ea6af');
    ctx.beginPath();
    ctx.moveTo(dFL.px, dFL.py);
    ctx.lineTo(dFR.px, dFR.py);
    ctx.lineTo(dFRBot.px, dFRBot.py);
    ctx.lineTo(dFLBot.px, dFLBot.py);
    ctx.closePath();
    ctx.fillStyle = lipGrad;
    ctx.fill();

    ctx.restore();
}

export function sizeCanvas(cv, cssW, cssH, dpr = 2) {
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);
    if (cv.width !== targetW || cv.height !== targetH) {
        cv.width = targetW;
        cv.height = targetH;
    }
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
}

export function waitForTextures() {
    const imgs = Array.from(document.querySelectorAll('img[id^="tex-"]'));
    return Promise.all(imgs.map(im => new Promise(resolve => {
        if (im.complete && im.naturalWidth) return resolve(im);
        im.addEventListener('load', () => resolve(im), { once: true });
        im.addEventListener('error', () => resolve(im), { once: true });
    })));
}
