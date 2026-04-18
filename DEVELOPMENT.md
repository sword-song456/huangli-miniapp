# 节气老黄历小程序 - 开发文档

## 项目架构

### 技术栈
- 微信小程序原生框架
- Canvas 2D绘图
- Promise异步处理
- RESTful API调用

### 目录结构
```
huangli-miniapp/
├── pages/                  # 页面目录
│   ├── index/             # 首页-黄历展示
│   │   ├── index.js       # 页面逻辑
│   │   ├── index.wxml     # 页面结构
│   │   ├── index.wxss     # 页面样式
│   │   └── index.json     # 页面配置
│   ├── card/              # 平安卡生成页
│   │   ├── card.js
│   │   ├── card.wxml
│   │   ├── card.wxss
│   │   └── card.json
│   └── calendar/          # 日历选择页（待开发）
├── utils/                 # 工具函数
│   ├── api.js            # API接口封装
│   └── calendar.js       # 农历计算工具
├── images/               # 图片资源（待添加）
├── app.js                # 小程序入口
├── app.json              # 全局配置
├── app.wxss              # 全局样式
├── project.config.json   # 项目配置
└── sitemap.json          # 索引配置
```

## 核心功能实现

### 1. 黄历数据获取

#### API接口
```javascript
// utils/api.js
function getHuangli(year, month, day) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://v.juhe.cn/calendar/day',
      data: {
        key: API_KEY,
        date: `${year}-${month}-${day}`
      },
      success: (res) => {
        // 处理返回数据
        resolve(parseHuangliData(res.data))
      }
    })
  })
}
```

#### 数据结构
```javascript
{
  lunarDate: '正月初一',      // 农历日期
  jieqi: '立春',              // 节气
  yi: ['祭祀', '祈福'],       // 宜做的事
  ji: ['动土', '破土'],       // 忌做的事
  ganzhiYear: '甲辰年',       // 干支年
  weekday: '星期五'           // 星期
}
```

### 2. 平安卡生成

#### Canvas绘图流程
```javascript
// pages/card/card.js
drawCard() {
  const ctx = wx.createCanvasContext('shareCanvas')
  
  // 1. 绘制背景渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, '#ffecd2')
  gradient.addColorStop(1, '#fcb69f')
  ctx.setFillStyle(gradient)
  ctx.fillRect(0, 0, width, height)
  
  // 2. 绘制装饰图案
  this.drawMountain(ctx)
  
  // 3. 绘制文字内容
  ctx.setFillStyle('#d4524f')
  ctx.setFontSize(80)
  ctx.fillText('今日平安', x, y)
  
  // 4. 生成图片
  ctx.draw(false, () => {
    this.saveCanvasToImage()
  })
}
```

#### 图片保存
```javascript
saveCanvasToImage() {
  wx.canvasToTempFilePath({
    canvasId: 'shareCanvas',
    success: (res) => {
      this.setData({ imageUrl: res.tempFilePath })
    }
  })
}
```

### 3. 天气数据集成

#### 位置获取
```javascript
wx.getLocation({
  type: 'wgs84',
  success: (location) => {
    // 使用经纬度获取天气
    this.getWeatherByLocation(location)
  }
})
```

#### 天气API调用
```javascript
function getWeather() {
  return new Promise((resolve) => {
    wx.request({
      url: 'https://api.seniverse.com/v3/weather/now.json',
      data: {
        location: `${lat}:${lon}`,
        key: WEATHER_KEY
      },
      success: (res) => {
        resolve({
          temperature: res.data.results[0].now.temperature,
          desc: res.data.results[0].now.text
        })
      }
    })
  })
}
```

## 性能优化

### 1. 数据缓存
```javascript
// 缓存当天数据，避免重复请求
const cacheKey = `huangli_${year}_${month}_${day}`
const cachedData = wx.getStorageSync(cacheKey)

if (cachedData) {
  return cachedData
} else {
  const data = await fetchHuangli()
  wx.setStorageSync(cacheKey, data)
  return data
}
```

### 2. 图片预加载
```javascript
// 预加载背景图片
wx.getImageInfo({
  src: '/images/background.jpg',
  success: (res) => {
    this.setData({ bgImage: res.path })
  }
})
```

### 3. 防抖处理
```javascript
// 防止用户频繁点击生成按钮
let generating = false

generateCard() {
  if (generating) return
  generating = true
  
  // 生成逻辑
  this.drawCard().then(() => {
    generating = false
  })
}
```

## 用户体验优化

### 1. 加载状态
```javascript
// 显示加载提示
wx.showLoading({ title: '加载中' })

// 数据加载完成后隐藏
wx.hideLoading()
```

### 2. 错误处理
```javascript
try {
  const data = await getHuangli()
  this.setData({ huangliData: data })
} catch (error) {
  wx.showToast({
    title: '加载失败，请重试',
    icon: 'none'
  })
  // 使用模拟数据兜底
  this.setData({ huangliData: getMockData() })
}
```

### 3. 下拉刷新
```javascript
// index.json
{
  "enablePullDownRefresh": true
}

// index.js
onPullDownRefresh() {
  this.loadTodayData().then(() => {
    wx.stopPullDownRefresh()
  })
}
```

## 扩展功能

### 1. 日历选择
```javascript
// 待开发：允许用户查看其他日期的黄历
selectDate() {
  wx.navigateTo({
    url: '/pages/calendar/calendar'
  })
}
```

### 2. 个性化设置
```javascript
// 待开发：用户可自定义平安卡样式
const themes = [
  { name: '经典红', colors: ['#d4524f', '#e67e73'] },
  { name: '清新绿', colors: ['#52c41a', '#73d13d'] },
  { name: '优雅蓝', colors: ['#1890ff', '#40a9ff'] }
]
```

### 3. 历史记录
```javascript
// 待开发：保存用户生成的平安卡历史
saveHistory(cardData) {
  const history = wx.getStorageSync('card_history') || []
  history.unshift({
    date: new Date(),
    data: cardData
  })
  wx.setStorageSync('card_history', history.slice(0, 30))
}
```

## 测试建议

### 单元测试
- API接口调用测试
- 数据解析测试
- 日期计算测试

### 集成测试
- 完整流程测试
- 异常情况测试
- 边界条件测试

### 真机测试
- iOS设备测试
- Android设备测试
- 不同屏幕尺寸适配

## 注意事项

### 1. API限制
- 注意API调用频率限制
- 做好错误处理和降级方案
- 考虑使用缓存减少调用

### 2. 隐私保护
- 获取位置需用户授权
- 说明数据使用目的
- 不收集敏感信息

### 3. 审核规范
- 不能有诱导分享
- 广告位置要合理
- 内容要健康向上

## 后续优化方向

1. **AI祝福语生成**
   - 接入ChatGPT/文心一言
   - 根据节气生成个性化祝福

2. **社交功能**
   - 好友祝福互动
   - 平安卡收藏分享

3. **知识科普**
   - 节气文化介绍
   - 民俗知识普及

4. **会员功能**
   - 去广告
   - 更多卡片模板
   - 高级定制功能
