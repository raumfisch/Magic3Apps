// Copy and paste from jeffmer/WatchApps

import { EventEmitter } from "events";

const ACCELPIN: string = process.env.BOARD == "P8" ? "D8" : "D16";

interface Accelerometer {
  writeByte: (a: number, d: number) => void;
  readBytes: (a: number, n: number) => number[];
  init: () => number;
  read0: () => number;
  read: () => { x: number; y: number; z: number };
  emit: (event: string) => void;
}

const ACCEL: Accelerometer & EventEmitter = {
  writeByte: (a, d) => {
    wOSI2C.writeTo(0x18, a, d);
  },
  readBytes: (a, n) => {
    wOSI2C.writeTo(0x18, a);
    return wOSI2C.readFrom(0x18, n);
  },
  init: () => {
    var id: number = ACCEL.readBytes(0x0f, 1)[0];
    ACCEL.writeByte(0x20, 0x47);
    ACCEL.writeByte(0x21, 0x00); //highpass filter disabled
    ACCEL.writeByte(0x22, 0x40); //interrupt to INT1
    ACCEL.writeByte(0x23, 0x88); //BDU,MSB at high addr, HR
    ACCEL.writeByte(0x24, 0x00); //latched interrupt off
    ACCEL.writeByte(0x32, 0x10); //threshold = 250 milli g's
    ACCEL.writeByte(0x33, 0x01); //duration = 1 * 20ms
    ACCEL.writeByte(0x30, 0x02); //XH interrupt
    pinMode(ACCELPIN, "input", false);
    setWatch(
      () => {
        var v: number = ACCEL.read0();
        if (process.env.BOARD == "P8") {
          if (v > 192) ACCEL.emit("faceup");
        } else {
          if (v > 10 && v < 192) ACCEL.emit("faceup");
        }
      },
      ACCELPIN,
      { repeat: true, edge: "rising", debounce: 50 }
    );
    return id;
  },
  read0: () => {
    return ACCEL.readBytes(0x01, 1)[0];
  },
  read: () => {
    function conv(lo: number, hi: number): number {
      var i: number = (hi << 8) + lo;
      return ((i & 0x7fff) - (i & 0x8000)) / 16;
    }
    var a: number[] = ACCEL.readBytes(0xa8, 6);
    return { x: conv(a[0], a[1]), y: conv(a[2], a[3]), z: conv(a[4], a[5]) };
  },
};

export default ACCEL;
