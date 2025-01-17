// Copy and paste from jeffmer/WatchApps
wOS.drawWidgets = function() {
  var w=g.getWidth(), h=g.getHeight();
  var pos = {
    tl:{x:30, y:0, r:0, c:0}, // if r==1, we're right->left
    tr:{x:w-30, y:0, r:1, c:0},
    bl:{x:30, y:h-24, r:0, c:0},
    br:{x:w-30, y:h-24, r:1, c:0}
  };
  if (global.WIDGETS) {
    for (var wd of WIDGETS) {
      var p = pos[wd.area];
      if (!p) return;
      wd.x = p.x - p.r*wd.width;
      wd.y = p.y;
      p.x += wd.width*(1-2*p.r);
      p.c++;
    }
    g.reset();
    if (pos.tl.c || pos.tr.c) g.clearRect(0,0,w-1,23);
    if (pos.bl.c || pos.br.c) g.clearRect(0,h-24,w-1,h-1);
    for (wd of WIDGETS) wd.draw(wd);
  }
};

wOS.loadWidgets = function() {
  global.WIDGETS={};
  require("Storage").list(/\.wid\.js$/).forEach(widget=>eval(require("Storage").read(widget)));
};
