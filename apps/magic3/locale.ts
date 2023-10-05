// Copy and paste from jeffmer/WatchApps
export interface Translation {
  name: string;
  currencySym: string;
  translate: (str: string) => string;
  date: (d: Date, short: boolean) => string;
  time: (d: Date, short: boolean) => string;
  dow: (d: Date, short: boolean) => string;
  month: (d: Date, short: boolean) => string;
  number: (n: number) => string;
  currency: (n: number) => string;
  distance: (m: number) => string;
  speed: (s: number) => string;
  temp: (t: number) => string;
  meridian: (d: Date) => string;
}

export const translation: Translation = {
  name: "en_GB",
  currencySym: "£",
  translate: (str: string) => str,
  date: (d: Date, short: boolean) => {
    if (short) {
      return (
        ("0" + d.getDate()).substr(-2) +
        "/" +
        ("0" + (d.getMonth() + 1)).substr(-2) +
        "/" +
        d.getFullYear()
      );
    } else {
      return d.toString().substr(4, 11);
    }
  },
  time: (d: Date, short: boolean) => {
    var h = d.getHours(),
      m = d.getMinutes();
    if (short) {
      return (" " + h).substr(-2) + ":" + ("0" + m).substr(-2);
    } else {
      var r = "am";
      if (h == 0) {
        h = 12;
      } else if (h >= 12) {
        if (h > 12) h -= 12;
        r = "pm";
      }
      return (
        (" " + h).substr(-2) +
        ":" +
        ("0" + m).substr(-2) +
        "." +
        ("0" + d.getSeconds()).substr(-2) +
        " " +
        r
      );
    }
  },
  dow: (d: Date, short: boolean) => {
    if (short) {
      return d.toString().substr(0, 3);
    } else {
      return [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][d.getDay()];
    }
  },
  month: (d: Date, short: boolean) => {
    if (short) {
      return d.toString().substr(4, 3);
    } else {
      return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][d.getMonth()];
    }
  },
  number: (n: number) => n.toString(),
  currency: (n: number) => "£" + n.toFixed(2),
  distance: (m: number) => {
    if (m < 1000) {
      return Math.round(m) + "m";
    } else {
      return Math.round(m / 160.934) / 10 + "mi";
    }
  },
  speed: (s: number) => Math.round(s / 1.60934) + "mph",
  temp: (t: number) => Math.round(t) + "'C",
  meridian: (d: Date) => (d.getHours() <= 12 ? "am" : "pm"),
};
