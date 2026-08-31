/* ★キャラのカード絵を傾け、レアリティに応じた箔を光らせる（2026-09-01）。
   ⚠カード説明ページ(game-card-content.html)の4枚と同じ値を使う。サイト用に誇張しない。
   ⚠裏面の画像が無いので「めくり」は無い。傾きと箔だけ。
   ⚠箔は .unit-face img と同じ object-fit: contain / center top を当てて位置を合わせる
     （カード絵と箔は同じ縦横比なので、これで完全に重なる）。 */
(function () {
    var faces = [].slice.call(document.querySelectorAll('.unit-face.has-img'));
    if (!faces.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ★層の値はゲームの確定値。カード説明ページと同一 */
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
    /* ★SR=黄金6層 / R=白銀(枠+絵) / UC=白銀(枠) / C=箔なし */
    var USE = {
        sr: ['gold', 'base', 'flake', 'shine', 'glint'],
        r:  ['r'],
        uc: ['uc'],
        c:  []
    };

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
        var m = tag.className.match(/rar-(sr|r|uc|c)\b/);
        return m ? m[1] : 'c';
    }

    var cards = [];
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        face.classList.add('tiltable');
        var use = USE[rarityOf(face)] || [];
        var foils = [];
        for (var k = 0; k < use.length; k++) {
            var img = document.createElement('img');
            img.className = 'unit-foil';
            img.setAttribute('data-foil', use[k]);
            img.setAttribute('aria-hidden', 'true');
            img.alt = '';
            img.src = 'foil-' + use[k] + '.webp';
            face.appendChild(img);
            foils.push(img);
        }
        cards.push({ el: face, foils: foils, tx: 0, ty: 0, cx: 0, cy: 0, hold: 0, rest: 0 });
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
                pick(c, e); c.hold = 1;
            });
            c.el.addEventListener('pointermove', function (e) {
                if (e.pointerType === 'mouse' || c.hold) pick(c, e);
            });
            c.el.addEventListener('pointerup', function () { c.hold = 0; c.rest = 40; });
            c.el.addEventListener('pointercancel', function () { c.hold = 0; c.rest = 40; });
            c.el.addEventListener('pointerleave', function (e) {
                if (e.pointerType === 'mouse') { c.tx = 0; c.ty = 0; c.el.classList.remove('is-live'); }
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
            c.el.style.transform =
                'perspective(900px) rotateX(' + (-c.cy * deg) + 'deg) rotateY(' + (c.cx * deg) + 'deg)';

            if (c.foils.length) {
                var center = 0.5 + (c.cx * 0.75) - (c.cy * 0.55);
                var lean = Math.min(1, Math.sqrt(c.cx * c.cx + c.cy * c.cy));
                for (var k = 0; k < c.foils.length; k++) {
                    var el = c.foils[k], L = LAYERS[el.getAttribute('data-foil')];
                    if (!L) continue;
                    var m = maskFor(L.width, center, L.core);
                    el.style.webkitMaskImage = m;
                    el.style.maskImage = m;
                    el.style.opacity = (L.power * (0.55 + 0.45 * lean)).toFixed(3);
                }
            }
        }
        requestAnimationFrame(loop);
    })();
})();
