/* ★キャラの立ち絵を傾け、タップで裏面をめくる（2026-09-01）。
   ★面は3つ： 表(立ち絵) → 裏1(素性) → 裏2(スキル) → 表。
     裏面は `カード裏面生成.py` の pages() で24体ぶん生成したもの（<ID>-b1/-b2.webp）。
   ★箔は表だけに重ねる。裏は情報カードなので、重ねると文字が読めなくなる（実際に確認）。
   ⚠表を「枠の無い立ち絵」のままにすると箔の枠線が宙に浮く。カード表面生成.py で
     24体すべてカード化したので合うようになった（2026-09-01）。
   ⚠90度で面を差し替える。180度まで回すと中身が鏡像になる。 */
(function () {
    var faces = [].slice.call(document.querySelectorAll('.unit-face.has-img'));
    if (!faces.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ★層の値はゲームの確定値。カード説明ページと同一。サイト用に誇張しない */
    var LAYERS = {
        uc:    { power: 0.50, width: 0.22,  core: 0 },
        r:     { power: 0.45, width: 0.22,  core: 0 },
        gold:  { power: 0.45, width: 0.22,  core: 0 },
        base:  { power: 0.55, width: 0.35,  core: 0 },
        flake: { power: 0.29, width: 0.53,  core: 0 },
        shine: { power: 1.00, width: 0.16,  core: 1 },
        glint: { power: 0.85, width: 0.045, core: 0 }
    };
    var ANGLE = 62;
    var USE = { sr: ['gold','base','flake','shine','glint'], r: ['r'], uc: ['uc'], c: [] };

    function maskFor(width, center, core) {
        var w = Math.max(2, width * 100), c = center * 100;
        var stops = [
            'transparent ' + (c - w) + '%',
            'rgba(0,0,0,0.35) ' + (c - w * 0.45) + '%',
            'rgba(0,0,0,1) ' + c + '%',
            'rgba(0,0,0,0.35) ' + (c + w * 0.45) + '%',
            'transparent ' + (c + w) + '%'
        ];
        if (core) stops.splice(3, 0, 'rgba(0,0,0,0.9) ' + (c + w * 0.12) + '%');
        return 'linear-gradient(' + ANGLE + 'deg, ' + stops.join(', ') + ')';
    }

    function rarityOf(face) {
        var unit = face.closest ? face.closest('.unit') : null;
        if (!unit) return 'c';
        var tag = unit.querySelector('.unit-tag[class*="rar-"]');
        if (!tag) return 'c';
        var m = tag.className.match(/rar-(sr|r|uc|c)/);
        return m ? m[1] : 'c';
    }

    var cards = [];
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        var img = face.querySelector('img');
        if (!img) continue;
        var src = img.getAttribute('src') || '';
        var m = src.match(/([A-Z]+-[A-Z]+-\d+)\.webp$/);
        if (!m) continue;
        var id = m[1], dir = src.slice(0, src.length - (id + '.webp').length);
        face.classList.add('tiltable');
        face.setAttribute('role', 'button');
        face.setAttribute('tabindex', '0');
        face.setAttribute('aria-label', (img.alt || '') + ' のカード。押すと裏面');
        var use = USE[rarityOf(face)] || [];
        var foils = [];
        for (var k = 0; k < use.length; k++) {
            var fi2 = document.createElement('img');
            fi2.className = 'unit-foil';
            fi2.setAttribute('data-foil', use[k]);
            fi2.setAttribute('aria-hidden', 'true');
            fi2.alt = '';
            fi2.src = 'foil-' + use[k] + '.webp';
            face.appendChild(fi2);
            foils.push(fi2);
        }
        cards.push({
            el: face, img: img, foils: foils,
            faces: [src, dir + id + '-b1.webp', dir + id + '-b2.webp'],
            alt0: img.alt || '',
            fi: 0, flipDeg: 0, flipping: false,
            tx: 0, ty: 0, cx: 0, cy: 0, hold: 0, rest: 0,
            dx: 0, dy: 0, moved: 0
        });
    }
    if (!cards.length) return;

    function flip(c) {
        if (c.flipping) return;
        c.flipping = true;
        var t0 = performance.now(), DUR = 190, half = false;
        (function step(now) {
            var e = Math.min(1, (now - t0) / DUR);
            if (!half) {
                c.flipDeg = 90 * e;
                if (e >= 1) {
                    half = true; t0 = now; c.flipDeg = -90;
                    c.fi = (c.fi + 1) % c.faces.length;
                    c.img.src = c.faces[c.fi];
                    c.img.alt = c.fi === 0 ? c.alt0 : (c.alt0 + ' の裏面' + c.fi);
                    /* ★箔は表だけ。裏は情報カードなので重ねると文字が読めない */
                    for (var k = 0; k < c.foils.length; k++) {
                        c.foils[k].style.display = c.fi === 0 ? '' : 'none';
                    }
                }
                requestAnimationFrame(step);
                return;
            }
            c.flipDeg = -90 * (1 - e);
            if (e >= 1) { c.flipDeg = 0; c.flipping = false; return; }
            requestAnimationFrame(step);
        })(t0);
    }

    function pick(c, e) {
        var r = c.el.getBoundingClientRect();
        c.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
        c.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
        c.el.classList.add('is-live');
    }

    for (var n = 0; n < cards.length; n++) {
        (function (c) {
            c.el.addEventListener('pointerdown', function (e) {
                try { c.el.setPointerCapture(e.pointerId); } catch (err) {}
                if (!reduce) pick(c, e);
                c.hold = 1; c.dx = e.clientX; c.dy = e.clientY; c.moved = 0;
            });
            c.el.addEventListener('pointermove', function (e) {
                if (!reduce && (e.pointerType === 'mouse' || c.hold)) pick(c, e);
                /* ★指を動かしたなら「傾けた」とみなし、めくらない */
                if (c.hold && Math.abs(e.clientX - c.dx) + Math.abs(e.clientY - c.dy) > 10) c.moved = 1;
            });
            c.el.addEventListener('pointerup', function () {
                c.hold = 0; c.rest = 40;
                if (!c.moved) flip(c);
            });
            c.el.addEventListener('pointercancel', function () { c.hold = 0; c.rest = 40; });
            c.el.addEventListener('pointerleave', function (e) {
                if (e.pointerType === 'mouse') { c.tx = 0; c.ty = 0; c.el.classList.remove('is-live'); }
            });
            /* ★キーボードでもめくれるようにする */
            c.el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(c); }
            });
        })(cards[n]);
    }

    (function loop() {
        for (var i = 0; i < cards.length; i++) {
            var c = cards[i], deg = 16;
            if (c.rest > 0) {
                c.rest--;
                if (c.rest === 0) { c.tx = 0; c.ty = 0; c.el.classList.remove('is-live'); }
            }
            c.cx += (c.tx - c.cx) * 0.16;
            c.cy += (c.ty - c.cy) * 0.16;
            c.el.style.transform = 'perspective(900px) rotateX(' + (-c.cy * deg) +
                'deg) rotateY(' + (c.cx * deg + c.flipDeg) + 'deg)';

            if (c.fi === 0 && c.foils.length) {
                var center = 0.5 + (c.cx * 0.75) - (c.cy * 0.55);
                var lean = Math.min(1, Math.sqrt(c.cx * c.cx + c.cy * c.cy));
                for (var k = 0; k < c.foils.length; k++) {
                    var el = c.foils[k], L = LAYERS[el.getAttribute('data-foil')];
                    if (!L) continue;
                    var m2 = maskFor(L.width, center, L.core);
                    el.style.webkitMaskImage = m2;
                    el.style.maskImage = m2;
                    el.style.opacity = (L.power * (0.55 + 0.45 * lean)).toFixed(3);
                }
            }
        }
        requestAnimationFrame(loop);
    })();
})();
