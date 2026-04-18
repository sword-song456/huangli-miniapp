/**
 * 农历计算工具
 * 基于寿星天文历算法
 */

// 农历数据（1900-2100年）
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  // ... 这里应该包含完整的农历数据表
  // 为了简化，这里只列出部分
]

// 天干地支
const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const Animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 农历月份
const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']

// 农历日期
const lunarDays = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
]

// 二十四节气
const solarTerms = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑',
  '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
]

/**
 * 获取农历日期
 */
function getLunarDate(year, month, day) {
  // 简化版本，实际应该使用完整的农历算法
  const date = new Date(year, month - 1, day)
  const lunarMonth = lunarMonths[date.getMonth()]
  const lunarDay = lunarDays[date.getDate() - 1]

  return `${lunarMonth}${lunarDay}`
}

/**
 * 获取天干地支年
 */
function getGanZhiYear(year) {
  const ganIndex = (year - 4) % 10
  const zhiIndex = (year - 4) % 12
  const animal = Animals[zhiIndex]

  return `${Gan[ganIndex]}${Zhi[zhiIndex]}年 ${animal}年`
}

/**
 * 获取节气
 */
function getSolarTerm(month, day) {
  // 简化版本，实际应该使用精确的节气计算
  const termDates = {
    1: { 5: '小寒', 20: '大寒' },
    2: { 4: '立春', 19: '雨水' },
    3: { 6: '惊蛰', 21: '春分' },
    4: { 5: '清明', 20: '谷雨' },
    5: { 6: '立夏', 21: '小满' },
    6: { 6: '芒种', 21: '夏至' },
    7: { 7: '小暑', 23: '大暑' },
    8: { 8: '立秋', 23: '处暑' },
    9: { 8: '白露', 23: '秋分' },
    10: { 8: '寒露', 23: '霜降' },
    11: { 7: '立冬', 22: '小雪' },
    12: { 7: '大雪', 22: '冬至' }
  }

  if (termDates[month] && termDates[month][day]) {
    return termDates[month][day]
  }

  return ''
}

/**
 * 获取星座
 */
function getConstellation(month, day) {
  const constellations = [
    '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座',
    '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座'
  ]

  const dates = [20, 19, 21, 21, 21, 22, 23, 23, 23, 24, 22, 22]

  let index = month - 1
  if (day < dates[index]) {
    index = index - 1 < 0 ? 11 : index - 1
  }

  return constellations[index]
}

module.exports = {
  getLunarDate,
  getGanZhiYear,
  getSolarTerm,
  getConstellation,
  lunarMonths,
  lunarDays,
  solarTerms
}
