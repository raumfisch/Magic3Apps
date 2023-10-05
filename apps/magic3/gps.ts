// Copy and paste from jeffmer/WatchApps
const Bangle = {
  gpsOn: false,
  gpsgatt: null,
  gpscharistic: null,
  gpsInterval: null,
  gpsFix: null,
  setGPSPower: function (on: boolean): void {
    if (Bangle.gpsOn && on) return; //already started
    function unpack(v: DataView): any {
      var fix = v.getInt8(29);
      function ck(d: number): number | Date {
        return d == -1 ? NaN : d;
      }
      return {
        lat: ck(v.getFloat32(0)),
        lon: ck(v.getFloat32(4)),
        alt: ck(v.getFloat32(8)),
        speed: ck(v.getFloat32(12)),
        course: ck(v.getFloat32(16)),
        time: new Date(v.getFloat64(20)),
        satellites: v.getInt8(28),
        fix: fix,
        hdop: ck(v.getFloat32(30)),
      };
    }
    if (on) {
      Bangle.gpsOn = true;
      NRF.requestDevice({ timeout: 4000, filters: [{ name: "gps" }] })
        .then(function (device: any) {
          return device.gatt.connect();
        })
        .then(function (g: any) {
          Bangle.gpsgatt = g;
          return g.getPrimaryService("974e0001-1b9a-4468-a83d-7f811b3dbaff");
        })
        .then(function (service: any) {
          return service.getCharacteristic(
            "974e0002-1b9a-4468-a83d-7f811b3dbaff"
          );
        })
        .then(function (c: any) {
          Bangle.gpscharistic = c;
          Bangle.gpsInterval = setInterval(function () {
            Bangle.gpscharistic.readValue().then(function (d: DataView) {
              Bangle.gpsFix = unpack(d);
              Bangle.emit("GPS", Bangle.gpsFix);
            });
          }, 1000);
        })
        .catch(function (e: any) {
          E.showMessage("GPS: " + e, "ERROR");
        });
    } else {
      Bangle.gpsOn = false;
      if (Bangle.gpsInterval)
        Bangle.gpsInterval = clearInterval(Bangle.gpsInterval);
      if (Bangle.gpsgatt) Bangle.gpsgatt.disconnect();
      delete Bangle.gpsgatt;
      delete Bangle.gpscharistic;
    }
  },
  getGPSFix: function (): any {
    return Bangle.gpsFix;
  },
  project: E.project,
};

//Bangle.on("GPS",(d)=>{console.log(d);});
