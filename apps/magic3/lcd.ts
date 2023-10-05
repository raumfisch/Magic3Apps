// Copy and paste from jeffmer/WatchApps
function ST7789(): any {
  const LCD_WIDTH: number = 240;
  const LCD_HEIGHT: number = 280;
  const XOFF: number = 0;
  const YOFF: number = process.env.BOARD == "ROCK" ? 24 : 20;
  const INVERSE: number = 1;
  const cmd: any = lcd_spi_unbuf.command;

  function dispinit(rst: any, fn: any): void {
    function delayms(d: number): void {
      let t: number = getTime() + d / 1000;
      while (getTime() < t) {}
    }
    if (rst) {
      digitalPulse(rst, 0, 10);
    } else {
      cmd(0x01); //ST7735_SWRESET: Software reset, 0 args, w/delay: 150 ms delay
    }
    delayms(120); // no apps to run
    cmd(0x11); //SLPOUT
    delayms(50);
    //MADCTL: Set Memory access control (directions), 1 arg: row addr/col addr, bottom to top refresh
    cmd(0x36, 0x00);
    //COLMOD: Set color mode, 1 arg, no delay: 16-bit color
    cmd(0x3a, 0x05);
    //PORCTRL: Porch control
    cmd(0xb2, [0x0b, 0x0b, 0x33, 0x00, 0x33]);
    //GCTRL: Gate control
    cmd(0xb7, 0x11);
    // VCOMS: VCOMS setting
    cmd(0xbb, 0x35);
    //LCMCTRL: CM control
    cmd(0xc0, 0x2c);
    //VDVVRHEN: VDV and VRH command enable
    cmd(0xc2, 0x01);
    // VRHS: VRH Set
    cmd(0xc3, 0x08);
    // VDVS: VDV Set
    cmd(0xc4, 0x20);
    //VCMOFSET: VCOM Offset Set .
    cmd(0xc6, 0x1f);
    //PWCTRL1: Power Control 1
    cmd(0xd0, [0xa4, 0xa1]);
    // PVGAMCTRL: Positive Voltage Gamma Control
    cmd(
      0xe0,
      [
        0xf0, 0x04, 0x0a, 0x0a, 0x08, 0x25, 0x33, 0x27, 0x3d, 0x38, 0x14, 0x14,
        0x25, 0x2a,
      ]
    );
    // NVGAMCTRL: Negative Voltage Gamma Contro
    cmd(
      0xe1,
      [
        0xf0, 0x05, 0x08, 0x07, 0x06, 0x02, 0x26, 0x32, 0x3d, 0x3a, 0x16, 0x16,
        0x26, 0x2c,
      ]
    );
    if (INVERSE) {
      //TFT_INVONN: Invert display, no args, no delay
      cmd(0x21);
    } else {
      //TFT_INVOFF: Don't invert display, no args, no delay
      cmd(0x20);
    }
    //TFT_NORON: Set Normal display on, no args, w/delay: 10 ms delay
    cmd(0x13);
    //TFT_DISPON: Set Main screen turn on, no args w/delay: 100 ms delay
    cmd(0x29);
    if (fn) fn();
  }

  function connect(options: any, callback: any): any {
    const spi: any = options.spi,
      dc: any = options.dc,
      ce: any = options.cs,
      rst: any = options.rst;
    const g: any = lcd_spi_unbuf.connect(options.spi, {
      dc: options.dc,
      cs: options.cs,
      height: LCD_HEIGHT,
      width: LCD_WIDTH,
      colstart: XOFF,
      rowstart: YOFF,
    });
    g.lcd_sleep = function () {
      cmd(0x10);
      cmd(0x28);
    };
    g.lcd_wake = function () {
      cmd(0x29);
      cmd(0x11);
    };
    dispinit(rst, () => {
      g.clear(1).setFont("6x8").drawString("Loading...", 20, 20);
    });
    return g;
  }

  //var spi = new SPI();
  SPI1.setup({ sck: D45, mosi: D44, baud: 32000000 });

  return connect({ spi: SPI1, dc: D47, cs: D3, rst: D2 });
}

wOS.brightness = function (v: number): void {
  v = v > 1 ? 1 : v < 0 ? 0 : v;
  if (v == 0 || v == 1) digitalWrite(D12, v);
  else analogWrite(D12, v, { freq: 1000 });
};
