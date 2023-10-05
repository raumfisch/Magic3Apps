// Copy and paste from jeffmer/WatchApps

import { EventEmitter } from "events";

const ACCELPIN: string = process.env.BOARD == "P8" ? "D8" : "D16";
const CALIBDATA: {
  offset: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
} = STOR.readJSON("accel.json", 1) || {
  offset: { x: 0, y: 0, z: 0 },
  scale: { x: 1000, y: 1000, z: 1000 },
};

interface Support {
  conv: (lo: number, hi: number) => number;
  calib: (value: number, offset: number, scale: number) => number;
}

const support: Support = (() => {
  const bin: string = atob("QBpQQ0/0enOQ+/PwcEcA6wEhwfMOAAH0AEFBGhAgkfvw8HBH");
  return {
    conv: E.nativeCall(15, "int(int,int)", bin),
    calib: E.nativeCall(1, "int(int,int,int)", bin),
  };
})();

const ACCEL = {
  writeByte: (a: number, d: number): void => {
    wOSI2C.writeTo(0x18, a, d);
  },
  readBytes: (a: number, n: number): number[] => {
    wOSI2C.writeTo(0x18, a);
    return wOSI2C.readFrom(0x18, n);
  },
  activity: 0,
  init: (): number => {
    const id: number = ACCEL.readBytes(0x0f, 1)[0];
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
        const v: number = ACCEL.read0();
        if (ACCEL.activity < 300) {
          ACCEL.activity = 330;
          if (!ACCEL.stinterval) ACCEL.stepStart();
        }
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
  read0: (): number => {
    return ACCEL.readBytes(0x01, 1)[0];
  },
  read: (): { x: number; y: number; z: number } => {
    "ram";
    const a: number[] = ACCEL.readBytes(0xa8, 6);
    const f: (lo: number, hi: number) => number = support.conv;
    return { x: f(a[0], a[1]), y: f(a[2], a[3]), z: f(a[4], a[5]) };
  },
  stepStart: (): void => {
    ACCEL.stinterval = setInterval(() => {
      const a: { x: number; y: number; z: number } = ACCEL.read();
      const sts: number = E.stepCount(a.x, a.y, a.z);
      //if(sts>0) console.log("steps "+sts,a);
      --ACCEL.activity;
      if (ACCEL.activity <= 0)
        ACCEL.stinterval = clearInterval(ACCEL.stinterval);
    }, 80);
  },
};

const emitter = new EventEmitter();
Object.setPrototypeOf(ACCEL, emitter);

export default ACCEL;
