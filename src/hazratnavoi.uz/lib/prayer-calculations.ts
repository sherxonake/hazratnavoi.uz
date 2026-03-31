/**
 * Hanafi Prayer Times Calculator for Uzbekistan
 * Includes: Asr (Hanafi), Tahajjud, Duha, Qibla, Hijri Calendar
 */

// ============= CONSTANTS =============
const MECCA = { lat: 21.4225, lng: 39.8262 }
const NAVOIY = { lat: 40.0844, lng: 65.3792 }

// Muslim World League parameters (used in Uzbekistan)
const MWL = { fajrAngle: 18, ishaAngle: 17 }

// ============= HELPER FUNCTIONS =============
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI
}

function getJulianDate(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day =
    date.getDate() + date.getHours() / 24 + date.getMinutes() / 1440

  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

function calculateSunPosition(jd: number): {
  declination: number
  equationOfTime: number
} {
  const d = jd - 2451545.0
  const g = 357.529 + 0.98560028 * d
  const q = 280.459 + 0.98564736 * d
  const L = q + 1.915 * Math.sin(toRadians(g)) + 0.020 * Math.sin(toRadians(2 * g))
  const e = 23.439 - 0.00000036 * d

  const sinL = Math.sin(toRadians(L))
  const cosL = Math.cos(toRadians(L))
  const sinE = Math.sin(toRadians(e))
  const cosE = Math.cos(toRadians(e))

  const RA = toDegrees(Math.atan2(cosE * sinL, cosL)) / 15
  const declination = toDegrees(Math.asin(sinE * sinL))
  const equationOfTime = q / 15 - RA

  return { declination, equationOfTime }
}

function timeFromDecimal(decimalTime: number): Date {
  const hours = Math.floor(decimalTime)
  const minutes = Math.floor((decimalTime - hours) * 60)
  const seconds = Math.floor(((decimalTime - hours) * 60 - minutes) * 60)

  const date = new Date()
  date.setHours(hours % 24, minutes, seconds, 0)
  return date
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// ============= MAIN CALCULATIONS =============

/**
 * 1. Asr Time (Hanafi Method) - Shadow ratio = 2
 */
export function calculateAsrHanafi(
  latitude: number,
  longitude: number,
  timezone: number,
  date: Date
): Date {
  const jd = getJulianDate(date)
  const { declination, equationOfTime } = calculateSunPosition(jd)
  const dhuhr = 12 + timezone - longitude / 15 - equationOfTime
  const asrOffset = calculateAsrOffset(latitude, declination, 2) // Hanafi: shadow ratio = 2
  return timeFromDecimal(dhuhr + asrOffset)
}

function calculateAsrOffset(
  latitude: number,
  declination: number,
  shadowRatio: number
): number {
  const latRad = toRadians(latitude)
  const decRad = toRadians(declination)
  const noonAltitude = 90 - Math.abs(latitude - declination)
  const noonShadow = 1 / Math.tan(toRadians(noonAltitude))
  const asrShadow = shadowRatio + noonShadow
  const asrAltitude = toDegrees(Math.atan(1 / asrShadow))

  const cosHourAngle =
    (Math.sin(toRadians(asrAltitude)) -
      Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad))

  if (cosHourAngle > 1 || cosHourAngle < -1) return 0
  return toDegrees(Math.acos(cosHourAngle)) / 15
}

/**
 * 2. Qiyam (Tahajjud) Time - Last third of night
 */
export function calculateTahajjudTime(
  maghribTime: Date,
  fajrTime: Date
): { startTime: Date; optimalTime: Date; endTime: Date } {
  let nightDuration = fajrTime.getTime() - maghribTime.getTime()
  if (nightDuration < 0) nightDuration += 24 * 60 * 60 * 1000

  const thirdDuration = nightDuration / 3
  const startTime = new Date(maghribTime.getTime() + 2 * thirdDuration)
  const optimalTime = new Date(startTime.getTime() + thirdDuration / 2)
  const endTime = fajrTime

  return { startTime, optimalTime, endTime }
}

/**
 * 3. Duha (Ishraq) Time
 */
export function calculateDuhaTime(
  sunriseTime: Date,
  dhuhrTime: Date
): { start: Date; optimal: Date; end: Date } {
  const start = new Date(sunriseTime.getTime() + 20 * 60 * 1000) // 20 min after sunrise
  const end = new Date(dhuhrTime.getTime() - 15 * 60 * 1000) // 15 min before Dhuhr
  const optimal = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2)
  return { start, optimal, end }
}

/**
 * 4. Hijri Calendar Conversion (Umm al-Qura method)
 */
export class HijriCalendar {
  private static readonly EPOCH_JD = 1948439.5

  static toHijri(date: Date): { year: number; month: number; day: number } {
    const jd = getJulianDate(date)
    const daysSinceEpoch = jd - this.EPOCH_JD
    const approxYear = Math.floor((daysSinceEpoch - 0.5) / 354.367)
    let remainingDays = daysSinceEpoch - Math.floor(approxYear * 354.367)

    const monthLengths = this.getMonthLengths(approxYear + 1)

    let month = 1
    let day = 1
    for (let i = 0; i < 12; i++) {
      if (remainingDays < monthLengths[i]) {
        day = Math.floor(remainingDays) + 1
        month = i + 1
        break
      }
      remainingDays -= monthLengths[i]
    }

    return { year: approxYear + 1, month, day }
  }

  private static getMonthLengths(year: number): number[] {
    return [
      30, // Muharram
      29, // Safar
      30, // Rabi' al-Awwal
      29, // Rabi' al-Thani
      30, // Jumada al-Awwal
      29, // Jumada al-Thani
      this.isLeapYear(year) ? 30 : 29, // Rajab
      30, // Sha'ban
      29, // Ramadan
      30, // Shawwal
      29, // Dhu al-Qi'dah
      30, // Dhu al-Hijjah
    ]
  }

  private static isLeapYear(year: number): boolean {
    return [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(year % 30)
  }

  static getMonthName(month: number, lang: 'latin' | 'cyrillic' = 'latin'): string {
    const names = {
      latin: [
        'Muharram', 'Safar', "Rabi' al-awwal", "Rabi' al-thani",
        'Jumada al-awwal', 'Jumada al-thani', 'Rajab', "Sha'ban",
        'Ramadan', 'Shawwal', "Dhu al-Qi'dah", "Dhu al-Hijjah"
      ],
      cyrillic: [
        'Муҳаррам', 'Сафар', "Рабиъ ал-аввал", "Рабиъ ас-соний",
        'Жумода ал-аввал', 'Жумода ас-соний', 'Ражаб', "Шаъбон",
        'Рамазон', 'Шаввол', "Зул-қаъда", "Зул-ҳижжа"
      ]
    }
    return names[lang][month - 1] || ''
  }
}

/**
 * 5. Qibla Direction
 */
export function calculateQibla(latitude: number, longitude: number): number {
  const latRad = toRadians(latitude)
  const lngRad = toRadians(longitude)
  const meccaLatRad = toRadians(MECCA.lat)
  const meccaLngRad = toRadians(MECCA.lng)
  const deltaLng = meccaLngRad - lngRad

  const y = Math.sin(deltaLng)
  const x =
    Math.cos(latRad) * Math.tan(meccaLatRad) -
    Math.sin(latRad) * Math.cos(deltaLng)

  let qibla = toDegrees(Math.atan2(y, x))
  return (qibla + 360) % 360
}

/**
 * Qibla from Navoiy
 */
export function calculateQiblaFromNavoiy(): number {
  return calculateQibla(NAVOIY.lat, NAVOIY.lng)
}

/**
 * 6. Complete Prayer Times for Uzbekistan (MWL + Hanafi)
 */
export function calculatePrayerTimesUzbekistan(
  latitude: number,
  longitude: number,
  date: Date
): {
  fajr: Date
  sunrise: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  isha: Date
} {
  const jd = getJulianDate(date)
  const { declination, equationOfTime } = calculateSunPosition(jd)
  const timezone = 5 // UZT

  const dhuhr = 12 + timezone - longitude / 15 - equationOfTime
  const sunriseOffset = calculateTimeAngle(latitude, declination, -0.833)
  const fajrOffset = calculateTimeAngle(latitude, declination, -MWL.fajrAngle)
  const ishaOffset = calculateTimeAngle(latitude, declination, -MWL.ishaAngle)
  const asrOffset = calculateAsrOffset(latitude, declination, 2)

  return {
    fajr: timeFromDecimal(dhuhr - fajrOffset),
    sunrise: timeFromDecimal(dhuhr - sunriseOffset),
    dhuhr: timeFromDecimal(dhuhr),
    asr: timeFromDecimal(dhuhr + asrOffset),
    maghrib: timeFromDecimal(dhuhr + sunriseOffset + 2 / 60),
    isha: timeFromDecimal(dhuhr + ishaOffset),
  }
}

function calculateTimeAngle(
  lat: number,
  dec: number,
  angle: number
): number {
  const cosH =
    (Math.sin(toRadians(angle)) -
      Math.sin(toRadians(lat)) * Math.sin(toRadians(dec))) /
    (Math.cos(toRadians(lat)) * Math.cos(toRadians(dec)))
  if (cosH > 1 || cosH < -1) return 0
  return toDegrees(Math.acos(cosH)) / 15
}

/**
 * Get prayer times for Navoiy city
 */
export function getNavoiyPrayerTimes(date: Date = new Date()) {
  const times = calculatePrayerTimesUzbekistan(NAVOIY.lat, NAVOIY.lng, date)
  const qibla = calculateQiblaFromNavoiy()
  const hijri = HijriCalendar.toHijri(date)
  const tahajjud = calculateTahajjudTime(times.maghrib, times.fajr)
  const duha = calculateDuhaTime(times.sunrise, times.dhuhr)

  return {
    ...times,
    qibla,
    hijri,
    tahajjud,
    duha,
    formatted: {
      fajr: formatTime(times.fajr),
      sunrise: formatTime(times.sunrise),
      dhuhr: formatTime(times.dhuhr),
      asr: formatTime(times.asr),
      maghrib: formatTime(times.maghrib),
      isha: formatTime(times.isha),
    },
  }
}
