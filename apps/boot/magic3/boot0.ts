  // Copy and paste from jeffmer/WatchApps

  D7.set();
    
  E.kickWatchdog();
  
  function KickWd(): void {
    if (typeof BTN1 === 'undefined' || !BTN1.read()) {
      E.kickWatchdog();
    }
  }
  
  const wdint: number = setInterval(KickWd, 5000);
  
  E.enableWatchdog(20, false);
  
  E.showMessage = function(msg: string, title: string): void {}
  
  import STOR from "Storage";
  
  if (STOR.read("main.js")) {
    eval(STOR.read("main.js"));
  }
  
  if (typeof g === 'undefined') {
    // dummy g for loader
    g = Graphics.createArrayBuffer(8, 8, 1);
    g.flip = function() {}; 
  }