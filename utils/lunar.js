/**
 * 农历计算库 - 基于寿星天文历
 * 支持1900-2100年的农历、节气、干支计算
 */

// 农历数据表 1900-2100
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520
]

// 天干
const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 生肖
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

// 宜忌数据库
const yijiData = {
  yi: [
    ['祭祀', '祈福', '求嗣', '开光', '出行', '解除'],
    ['纳采', '嫁娶', '求医', '治病', '动土', '上梁'],
    ['移徙', '入宅', '安香', '出火', '拆卸', '起基'],
    ['定磉', '安床', '栽种', '纳畜', '破土', '安葬'],
    ['立券', '交易', '纳财', '开市', '开仓', '出货财'],
    ['修造', '动土', '竖柱', '上梁', '盖屋', '合脊'],
    ['安门', '作灶', '修饰垣墙', '平治道涂', '沐浴', '整手足甲']
  ],
  ji: [
    ['动土', '破土', '安葬', '开市', '交易', '立券'],
    ['嫁娶', '移徙', '入宅', '出行', '祈福', '安床'],
    ['栽种', '上梁', '安门', '修造', '动土', '竖柱'],
    ['开光', '出火', '纳采', '订盟', '安机械', '造车器'],
    ['祭祀', '祈福', '求嗣', '斋醮', '沐浴', '酬神'],
    ['纳财', '开仓', '出货财', '启攒', '修坟', '立碑'],
    ['破屋', '坏垣', '求医', '治病', '词讼', '上官赴任']
  ]
}

/**
 * 获取农历年的闰月，0表示无闰月
 */
function leapMonth(year) {
  return lunarInfo[year - 1900] & 0xf
}

/**
 * 获取农历年闰月的天数
 */
function leapDays(year) {
  if (leapMonth(year)) {
    return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29
  }
  return 0
}

/**
 * 获取农历年的总天数
 */
function yearDays(year) {
  let sum = 348
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[year - 1900] & i) ? 1 : 0
  }
  return sum + leapDays(year)
}

/**
 * 获取农历月的天数
 */
function monthDays(year, month) {
  return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29
}

/**
 * 阳历转农历
 */
function solar2lunar(year, month, day) {
  if (year < 1900 || year > 2100) {
    return null
  }

  const baseDate = new Date(1900, 0, 31)
  const objDate = new Date(year, month - 1, day)
  let offset = (objDate - baseDate) / 86400000

  let lunarYear, lunarMonth, lunarDay
  let temp = 0

  for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
    temp = yearDays(lunarYear)
    offset -= temp
  }
  if (offset < 0) {
    offset += temp
    lunarYear--
  }

  const leap = leapMonth(lunarYear)
  let isLeap = false

  for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
    if (leap > 0 && lunarMonth === (leap + 1) && !isLeap) {
      --lunarMonth
      isLeap = true
      temp = leapDays(lunarYear)
    } else {
      temp = monthDays(lunarYear, lunarMonth)
    }

    if (isLeap && lunarMonth === (leap + 1)) {
      isLeap = false
    }

    offset -= temp
  }

  if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
    if (isLeap) {
      isLeap = false
    } else {
      isLeap = true
      --lunarMonth
    }
  }

  if (offset < 0) {
    offset += temp
    --lunarMonth
  }

  lunarDay = offset + 1

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap: isLeap
  }
}

/**
 * 获取干支年
 */
function getGanZhiYear(year) {
  const ganIndex = (year - 4) % 10
  const zhiIndex = (year - 4) % 12
  return Gan[ganIndex] + Zhi[zhiIndex]
}

/**
 * 获取生肖
 */
function getAnimal(year) {
  return Animals[(year - 4) % 12]
}

/**
 * 获取节气（简化版）
 */
function getSolarTerm(month, day) {
  const terms = {
    1: { 5: '小寒', 20: '大寒' },
    2: { 4: '立春', 19: '雨水' },
    3: { 6: '惊蛰', 21: '春分' },
    4: { 5: '清明', 20: '谷雨' },
    5: { 6: '立夏', 21: '小满' },
    6: { 6: '芒种', 22: '夏至' },
    7: { 7: '小暑', 23: '大暑' },
    8: { 8: '立秋', 23: '处暑' },
    9: { 8: '白露', 23: '秋分' },
    10: { 8: '寒露', 24: '霜降' },
    11: { 7: '立冬', 22: '小雪' },
    12: { 7: '大雪', 22: '冬至' }
  }

  if (terms[month] && terms[month][day]) {
    return terms[month][day]
  }
  return ''
}

/**
 * 获取宜忌（根据日期简单计算）
 */
function getYiJi(day) {
  const yiIndex = day % yijiData.yi.length
  const jiIndex = (day + 3) % yijiData.ji.length

  return {
    yi: yijiData.yi[yiIndex],
    ji: yijiData.ji[jiIndex]
  }
}

/**
 * 获取完整黄历信息
 */
function getHuangli(year, month, day) {
  const lunar = solar2lunar(year, month, day)

  if (!lunar) {
    return null
  }

  const ganzhiYear = getGanZhiYear(lunar.year)
  const animal = getAnimal(lunar.year)
  const solarTerm = getSolarTerm(month, day)
  const yiji = getYiJi(day)

  const lunarMonthStr = (lunar.isLeap ? '闰' : '') + lunarMonths[lunar.month - 1]
  const lunarDayStr = lunarDays[lunar.day - 1]

  return {
    lunarDate: `${lunarMonthStr}${lunarDayStr}`,
    ganzhiYear: `${ganzhiYear}年`,
    animal: `${animal}年`,
    solarTerm: solarTerm,
    yi: yiji.yi,
    ji: yiji.ji
  }
}

module.exports = {
  getHuangli,
  solar2lunar,
  getGanZhiYear,
  getAnimal,
  getSolarTerm
}
