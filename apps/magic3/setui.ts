// Copy and paste from jeffmer/WatchApps

const setUI = (c: string, b: () => void): void => {
  function d(): void {
    setTimeout(b, 10);
  }

  if (wOS.btnWatches) {
    wOS.btnWatches.forEach(clearWatch);
    delete wOS.btnWatches;
  }

  if (TC.swipeHandler) {
    TC.removeListener("swipe", TC.swipeHandler);
    delete TC.swipeHandler;
  }

  if (TC.touchHandler) {
    TC.removeListener("touch", TC.touchHandler);
    delete TC.touchHandler;
  }

  if (c) {
    if ("updown" == c) {
      wOS.btnWatches = [setWatch(d, BTN1, { repeat: 1, edge: "falling" })];
      TC.swipeHandler = (a: number) => {
        2 == a ? b(-1) : 1 == a && b(1);
      };
      TC.on("swipe", TC.swipeHandler);
    } else if ("leftright" == c) {
      wOS.btnWatches = [setWatch(d, BTN1, { repeat: 1, edge: "falling" })];
      TC.swipeHandler = (a: number) => {
        3 == a ? b(-1) : 4 == a && b(1);
      };
      TC.on("swipe", TC.swipeHandler);
    } else if ("clock" == c) {
      wOS.btnWatches = [
        setWatch(
          () => {
            wOS.awake && wOS.showLauncher();
          },
          BTN1,
          { repeat: 1, edge: "falling" }
        ),
      ];
    } else if ("clockupdown" == c) {
      wOS.btnWatches = [
        setWatch(
          () => {
            wOS.awake && wOS.showLauncher();
          },
          BTN1,
          { repeat: 1, edge: "falling" }
        ),
      ];
      TC.swipeHandler = (a: number) => {
        2 == a ? b(-1) : 1 == a && b(1);
      };
      TC.on("swipe", TC.swipeHandler);
    } else if ("clockleftright" == c) {
      wOS.btnWatches = [
        setWatch(
          () => {
            wOS.awake && wOS.showLauncher();
          },
          BTN1,
          { repeat: 1, edge: "falling" }
        ),
      ];
      TC.swipeHandler = (a: number) => {
        3 == a ? b(-1) : 4 == a && b(1);
      };
      TC.on("swipe", TC.swipeHandler);
    } else if ("touch" == c) {
      wOS.btnWatches = [
        setWatch(
          () => {
            wOS.awake && wOS.showLauncher();
          },
          BTN1,
          { repeat: 1, edge: "falling" }
        ),
      ];
      TC.touchHandler = (a: number) => {
        b(a);
      };
      TC.on("touch", TC.touchHandler);
    } else {
      throw Error("Unknown UI mode");
    }
  }
};
