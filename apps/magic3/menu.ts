// Copy and paste from jeffmer/WatchApps
import {
  LCDPower,
  getWidth,
  getHeight,
  clear,
  reset,
  setFont,
  setFontAlign,
  drawString,
  drawLine,
  setColor,
  fillRect,
  drawImage,
  fillPoly,
  flip,
} from "wOS";

interface MenuItem {
  value: number | boolean;
  format?: (value: number | boolean) => string;
  onchange?: (value: number | boolean) => void;
  step?: number;
  min?: number;
  max?: number;
}

interface MenuOptions {
  [key: string]: MenuItem;
}

interface MenuConfig {
  fontHeight?: number;
  x?: number;
  x2?: number;
  y?: number;
  y2?: number;
  selected?: number;
  title?: string;
}

interface Menu {
  lastIdx: number;
  draw: (b?: number) => void;
  select: (b?: number) => void;
  move: (b?: number) => void;
}

const E = {
  showMenu: function (p: MenuOptions): Menu {
    clear(1);
    LCDPower(1);
    if (p) {
      const r = getWidth() - 9;
      const f = Object.keys(p);
      const a = p[""];
      if (a) {
        f.splice(f.indexOf(""), 1);
      }
      if (!(a instanceof Object)) {
        a = {};
      }
      a.fontHeight = 16;
      a.x = 2;
      a.x2 = r - 4;
      a.y = 24;
      a.y2 = 220;
      if (a.selected === undefined) {
        a.selected = 0;
      }
      if (!a.fontHeight) {
        a.fontHeight = 6;
      }
      const t = 0 | a.x;
      const q = a.x2 || getWidth() - 1;
      const n = 0 | a.y;
      const v = a.y2 || getHeight() - 1;
      if (a.title) {
        n += a.fontHeight + 2;
      }
      const d: Menu = {
        lastIdx: 0,
        draw: function (b?: number, c?: number) {
          const k = 0 | Math.min((v - n) / a.fontHeight, f.length);
          const e = clip(a.selected - (k >> 1), 0, f.length - k);
          if (e != d.lastIdx) {
            b = undefined;
          }
          d.lastIdx = e;
          let h = n;
          reset().setFont("6x8", 2).setFontAlign(0, -1, 0);
          if (b === undefined && a.title) {
            drawString(a.title, (t + q) / 2, n - a.fontHeight - 2);
            drawLine(t, n - 2, q, n - 2);
          }
          if (b !== undefined) {
            if (e < b) {
              h += a.fontHeight * (b - e);
              e = b;
            }
            if (e + k > c) {
              k = 1 + c - b;
            }
          }
          for (; k--; ) {
            const l = f[e];
            const u = p[l];
            const m = e == a.selected && !d.selectEdit;
            setColor(m ? theme.bgH : theme.bg);
            fillRect(t, h, q, h + a.fontHeight - 1);
            setColor(m ? theme.fgH : theme.fg);
            setFontAlign(-1, -1);
            drawString(l, t, h);
            if (typeof u === "object") {
              const l = q;
              const m = u.value;
              if (u.format) {
                m = u.format(m);
              }
              if (d.selectEdit && e == a.selected) {
                l -= 25;
                setColor(theme.bgH).fillRect(
                  l - (stringWidth(m) + 4),
                  h,
                  q,
                  h + a.fontHeight - 1
                );
                setColor(theme.fgH).drawImage(
                  "\f\u0005\u0081\x00 \u0007\x00\u00f9\u00f0\u000e\x00@",
                  l,
                  h + (a.fontHeight - 10) / 2,
                  { scale: 2 }
                );
              }
              setFontAlign(1, -1);
              drawString(m, l - 2, h);
            }
            setColor(theme.fg);
            h += a.fontHeight;
            e++;
          }
          setFontAlign(-1, -1);
          const k = e < f.length;
          drawImage("\b\b\u0001\u00108|\u00fe\u0010\u0010\u0010\u0010", r, 40);
          drawImage("\b\b\u0001\u0010\u0010\u0010\u0010\u00fe|8\u0010", r, 194);
          drawImage("\b\b\u0001\x00\b\f\u000e\u00ff\u000e\f\b", r, 116);
          setColor(k ? theme.fg : theme.bg).fillPoly([
            104, 220, 136, 220, 120, 228,
          ]);
          flip();
        },
        select: function (b?: number) {
          const c = p[f[a.selected]];
          if (typeof c === "function") {
            c(d);
          } else if (typeof c === "object") {
            if (typeof c.value === "number") {
              d.selectEdit = d.selectEdit ? undefined : c;
            } else if (typeof c.value === "boolean") {
              c.value = !c.value;
            }
            if (c.onchange) {
              c.onchange(c.value);
            }
            d.draw();
          }
        },
        move: function (b?: number) {
          if (d.selectEdit) {
            const c = d.selectEdit;
            c.value -= (b || 1) * (c.step || 1);
            if (c.min !== undefined && c.value < c.min) {
              c.value = c.min;
            }
            if (c.max !== undefined && c.value > c.max) {
              c.value = c.max;
            }
            if (c.onchange) {
              c.onchange(c.value);
            }
            d.draw(a.selected, a.selected);
          } else {
            const c = a.selected;
            a.selected = (b + a.selected) % f.length;
            if (a.selected < 0) {
              a.selected += f.length;
            }
            d.draw(Math.min(c, a.selected), Math.max(c, a.selected));
          }
        },
      };
      d.draw();
      wOS.setUI("updown", function (b?: number) {
        b ? d.move(b) : d.select();
      });
      return d;
    }
    wOS.setUI();
  },
};
