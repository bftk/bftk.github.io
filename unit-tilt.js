/* ★キャラの立ち絵を、指やカーソルの位置で傾ける（2026-09-01）。
   ⚠★箔は重ねない。ここの画像は「カード」ではなく**枠の無い立ち絵**で、
     箔素材はカードの枠に合わせて作られている。重ねると枠線だけが宙に浮き、
     flake のひび模様が顔にかかって「画像が壊れて見える」（2026-09-01 実際に発生）。
   ⚠裏面の画像も無いので「めくり」も無い。傾きだけ。 */
(function () {
    var faces = [].slice.call(document.querySelectorAll('.unit-face.has-img'));
    if (!faces.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cards = [];
    for (var i = 0; i < faces.length; i++) {
        faces[i].classList.add('tiltable');
        cards.push({ el: faces[i], tx: 0, ty: 0, cx: 0, cy: 0, hold: 0, rest: 0 });
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
        }
        requestAnimationFrame(loop);
    })();
})();
