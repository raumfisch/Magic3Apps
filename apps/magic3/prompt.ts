// Copy and paste from jeffmer/WatchApps

const setUI = wOS.setUI || eval(STOR.read("setui.js"));

E.showMessage = function (p: string, a: { title?: string; img?: any }) {
  if (typeof a === "string") {
    a = { title: a };
  }
  a = a || {};
  g.clear(1);
  global.WIDGETS && wOS.drawWidgets();
  g.reset().setFont("Vector", 18).setFontAlign(0, -1);
  var k = global.WIDGETS ? 24 : 0,
    l = g.getWidth(),
    d = g.getHeight() - k,
    c = g.getFontHeight(),
    h = g.wrapString(a.title, l - 2),
    m = g.wrapString(p || "", l - 2);
  d = k + (d + (h.length - m.length) * c) / 2;
  if (a.img) {
    var n = g.imageMetrics(a.img);
    g.drawImage(a.img, (l - n.width) / 2, d - n.height / 2);
    d += 4 + n.height / 2;
  }
  g.drawString(m.join("\n"), l / 2, d);
  a.title &&
    g
      .setColor(g.theme.fgH)
      .setBgColor(g.theme.bgH)
      .clearRect(0, k, l - 1, k + 4 + h.length * c)
      .drawString(h.join("\n"), l / 2, k + 2);
  wOS.setLCDPower(1);
};

E.showPrompt = function (
  p: string,
  a: { title?: string; img?: any; buttons?: { [key: string]: boolean } }
) {
  a = a || {};
  a.buttons = a.buttons || { Yes: true, No: false };
  var k = Object.keys(a.buttons),
    l = [];
  g.clear(1);
  global.WIDGETS && wOS.drawWidgets();
  if (!p) return wOS.setUI(), Promise.resolve();
  (function () {
    g.reset().setFont("Vector", 18).setFontAlign(0, -1);
    var d = global.WIDGETS ? 24 : 0,
      c = g.getWidth(),
      h = g.getHeight() - d,
      m = g.getFontHeight(),
      n = g.wrapString(a.title, c - 2),
      t = g.wrapString(p || "", c - 2),
      b = d + (h + (n.length - t.length) * m) / 2 - 24;
    if (a.img) {
      var u = g.imageMetrics(a.img);
      g.drawImage(a.img, (c - u.width) / 2, b - u.height / 2);
      b += 4 + u.height / 2;
    }
    n &&
      g
        .setColor(g.theme.fgH)
        .setBgColor(g.theme.bgH)
        .clearRect(0, d, c - 1, d + 4 + n.length * m)
        .drawString(n.join("\n"), c / 2, d + 2);
    g.setColor(g.theme.fg)
      .setBgColor(g.theme.bg)
      .drawString(t.join("\n"), c / 2, b);
    b += t.length * m + 32;
    b = b > d + h - 24 ? d + h - 24 : b;
    var r = 0;
    g.setFontAlign(0, 0);
    k.forEach(function (q) {
      return (r += 24 + g.stringWidth(q));
    });
    r > c &&
      ((g.setFont("6x8"), (r = 0)),
      k.forEach(function (q) {
        return (r += 24 + g.stringWidth(q));
      }));
    var e = (c - r) / 2;
    k.forEach(function (q, w) {
      var v = g.stringWidth(q);
      e += (24 + v) / 2;
      var f = 6 + v / 2;
      l.push({ x1: e - f, x2: e + f, y1: b - 24, y2: b + 24 });
      f = [
        e - f,
        b - 16,
        e + f,
        b - 16,
        e + f + 4,
        b - 12,
        e + f + 4,
        b + 12,
        e + f,
        b + 16,
        e - f,
        b + 16,
        e - f - 4,
        b + 12,
        e - f - 4,
        b - 12,
        e - f,
        b - 16,
      ];
      g.setColor(g.theme.bg2)
        .fillPoly(f)
        .setColor(g.theme.fg2)
        .drawPoly(f)
        .drawString(q, e, b + 1);
      e += (24 + v) / 2;
    });
    wOS.setLCDPower(1);
  })();
  return new Promise(function (d) {
    wOS.setUI("touch", function (c) {
      l.forEach(function (h, m) {
        c.x >= h.x1 &&
          c.x <= h.x2 &&
          c.y >= h.y1 &&
          c.y <= h.y2 &&
          (E.showPrompt(), d(a.buttons[k[m]]));
      });
    });
  });
};

E.showAlert = function (p: string, a: string) {
  return E.showPrompt(p, { title: a, buttons: { Ok: 1 } });
};
