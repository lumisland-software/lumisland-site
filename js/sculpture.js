/* Original parametric sculpture. No WebGL, dependencies or tracking. */
(() => {
  const host = document.querySelector('.sculpture');
  const canvas = host?.querySelector('canvas');
  const context = canvas?.getContext('2d');
  if (!context) return;
  const toggle = host.querySelector('.motion-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  let visible = true;
  let frame = 0;
  let last = 0;
  let angle = .25;
  let width = 0;
  let height = 0;
  const TAU = Math.PI * 2;
  const rings = 160;
  const sides = 32;
  const mesh = [];
  const center = (u) => [(1.36 + .39 * Math.cos(3 * u)) * Math.cos(2 * u), (1.36 + .39 * Math.cos(3 * u)) * Math.sin(2 * u), .62 * Math.sin(3 * u)];
  const normalize = (v) => { const l = Math.hypot(...v); return v.map(n => n / l); };
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  for (let i = 0; i <= rings; i++) {
    const u = i / rings * TAU;
    const c = center(u);
    const next = center(u + .001);
    const tangent = normalize(next.map((n, j) => n - c[j]));
    const normal = normalize(cross(tangent, [0, 0, 1]));
    const binormal = cross(tangent, normal);
    const row = [];
    for (let j = 0; j <= sides; j++) {
      const v = j / sides * TAU;
      row.push(c.map((n, k) => n + .25 * (Math.cos(v) * normal[k] + Math.sin(v) * binormal[k])));
    }
    mesh.push(row);
  }
  function rotate(p) {
    const a = angle;
    const x = p[0] * Math.cos(a) - p[2] * Math.sin(a);
    const z = p[0] * Math.sin(a) + p[2] * Math.cos(a);
    const tilt = .83;
    return [x, p[1] * Math.cos(tilt) - z * Math.sin(tilt), p[1] * Math.sin(tilt) + z * Math.cos(tilt)];
  }
  function draw() {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width, height) * .215;
    const points = mesh.map(row => row.map(rotate));
    const faces = [];
    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < sides; j++) {
        const p = [points[i][j], points[i+1][j], points[i+1][j+1], points[i][j+1]];
        faces.push({ p, z: p.reduce((s,n) => s + n[2], 0) / 4 });
      }
    }
    faces.sort((a,b) => a.z - b.z);
    const shadow = context.createRadialGradient(width*.5,height*.84,0,width*.5,height*.84,width*.32);
    shadow.addColorStop(0,'rgba(35,66,142,.11)'); shadow.addColorStop(1,'rgba(35,66,142,0)');
    context.save(); context.translate(0,height*.68); context.scale(1,.2); context.fillStyle=shadow;
    context.fillRect(0,0,width,height); context.restore();
    for (const {p} of faces) {
      const n = normalize(cross(p[1].map((v,k) => v-p[0][k]),p[3].map((v,k) => v-p[0][k])));
      const light = Math.max(0, n[0]*.38+n[1]*.58-n[2]*.72);
      const shine = Math.pow(Math.max(0,n[0]*.12+n[1]*.28-n[2]*.94),16);
      const r = Math.min(235, 29+light*35+shine*165);
      const g = Math.min(245, 64+light*58+shine*155);
      const b = Math.min(255, 154+light*72+shine*75);
      context.beginPath();
      p.forEach((v,k) => {
        const perspective = 5.5/(5.5-v[2]);
        const x = width*.5 + v[0]*scale*perspective;
        const y = height*.47 + v[1]*scale*perspective;
        if (!k) context.moveTo(x,y); else context.lineTo(x,y);
      });
      context.closePath();
      context.fillStyle = `rgb(${r},${g},${b})`;
      context.fill();
      context.strokeStyle = `rgba(${r+15},${g+15},${b+10},.65)`;
      context.lineWidth=.6; context.stroke();
    }
  }
  function loop(time) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (time-last > 40) { angle += .004; draw(); last=time; }
    frame=requestAnimationFrame(loop);
  }
  function sync() {
    cancelAnimationFrame(frame); frame=0;
    toggle.hidden=false;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent=paused ? '▷ Retomar animação' : 'Ⅱ Pausar animação';
    if (!paused && visible && !document.hidden) frame=requestAnimationFrame(loop);
  }
  function resize() {
    const rect=host.getBoundingClientRect(); width=rect.width; height=rect.height;
    const ratio=Math.min(devicePixelRatio || 1, 1.75);
    canvas.width=Math.round(width*ratio); canvas.height=Math.round(height*ratio);
    context.setTransform(ratio,0,0,ratio,0,0); draw();
    host.classList.add('is-rendered');
  }
  toggle.addEventListener('click',()=>{ paused=!paused; sync(); });
  preference.addEventListener('change',()=>{ paused=preference.matches; sync(); draw(); });
  document.addEventListener('visibilitychange',sync);
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([entry])=>{ visible=entry.isIntersecting; sync(); },{rootMargin:'80px'}).observe(host);
  resize(); sync();
})();
