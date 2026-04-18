Page({
  data: {
    cardData: null,
    canvasWidth: 375,  // 调整为手机屏幕宽度的一半（rpx单位）
    canvasHeight: 667, // 调整为合适的高度
    imageUrl: ''
  },

  onLoad(options) {
    // 从全局数据获取
    const app = getApp()
    if (app.globalData.cardData) {
      this.setData({ cardData: app.globalData.cardData })
    }
  },

  onShow() {
    // 每次显示时检查数据并绘制
    const app = getApp()
    if (app.globalData.cardData) {
      this.setData({ cardData: app.globalData.cardData })

      // 使用nextTick确保页面渲染完成
      wx.nextTick(() => {
        this.drawCard()
      })
    }
  },

  drawCard() {
    wx.showLoading({ title: '生成中...' })

    const ctx = wx.createCanvasContext('shareCanvas')
    const { canvasWidth, canvasHeight } = this.data
    const { solarDate, lunarDate, jieqi, weather, yi, ji, blessing } = this.data.cardData

    try {
      // 背景渐变
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
      gradient.addColorStop(0, '#ffecd2')
      gradient.addColorStop(1, '#fcb69f')
      ctx.setFillStyle(gradient)
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // 绘制装饰性山水图案（简化版）
      this.drawMountain(ctx)

      // 标题区域
      ctx.setFillStyle('#d4524f')
      ctx.setFontSize(40)
      ctx.setTextAlign('center')
      ctx.fillText('今日平安', canvasWidth / 2, 80)

      // 日期信息
      ctx.setFillStyle('#333')
      ctx.setFontSize(32)
      ctx.fillText(lunarDate, canvasWidth / 2, 140)

      ctx.setFillStyle('#666')
      ctx.setFontSize(18)
      ctx.fillText(solarDate, canvasWidth / 2, 175)

      // 节气
      if (jieqi) {
        ctx.setFillStyle('#d4524f')
        ctx.setFontSize(20)
        ctx.fillText(`【${jieqi}】`, canvasWidth / 2, 210)
      }

      // 天气
      ctx.setFillStyle('#333')
      ctx.setFontSize(24)
      ctx.fillText(`${weather.temperature}° ${weather.desc}`, canvasWidth / 2, 260)

      // 宜忌区域
      let yPos = 310

      // 宜
      ctx.setFillStyle('#52c41a')
      ctx.setFontSize(22)
      ctx.setTextAlign('left')
      ctx.fillText('宜：', 40, yPos)

      ctx.setFillStyle('#333')
      ctx.setFontSize(18)
      const yiText = yi.slice(0, 3).join('  ')
      ctx.fillText(yiText, 80, yPos)

      yPos += 40

      // 忌
      ctx.setFillStyle('#ff4d4f')
      ctx.setFontSize(22)
      ctx.fillText('忌：', 40, yPos)

      ctx.setFillStyle('#333')
      ctx.setFontSize(18)
      const jiText = ji.slice(0, 3).join('  ')
      ctx.fillText(jiText, 80, yPos)

      // 祝福语区域
      yPos = 450
      ctx.setFillStyle('rgba(255, 255, 255, 0.9)')
      ctx.fillRect(30, yPos - 25, canvasWidth - 60, 140)

      ctx.setFillStyle('#d4524f')
      ctx.setFontSize(20)
      ctx.setTextAlign('center')
      ctx.fillText('平安祝福', canvasWidth / 2, yPos)

      // 绘制祝福语（自动换行）
      ctx.setFillStyle('#666')
      ctx.setFontSize(17)
      this.drawTextWithWrap(ctx, blessing, canvasWidth / 2, yPos + 30, canvasWidth - 100, 25)

      // 底部小字
      ctx.setFillStyle('#999')
      ctx.setFontSize(14)
      ctx.fillText('长按保存图片分享给好友', canvasWidth / 2, canvasHeight - 40)

      ctx.draw(false, () => {
        // 绘制完成后立即生成图片
        this.saveCanvasToImage()
      })
    } catch (error) {
      console.error('绘制失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      })
    }
  },

  drawMountain(ctx) {
    // 绘制简化的山水装饰
    const { canvasWidth, canvasHeight } = this.data
    ctx.setFillStyle('rgba(212, 82, 79, 0.1)')
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(100, canvasHeight - 117)
    ctx.lineTo(200, canvasHeight - 67)
    ctx.lineTo(300, canvasHeight - 142)
    ctx.lineTo(canvasWidth, canvasHeight - 92)
    ctx.lineTo(canvasWidth, canvasHeight)
    ctx.closePath()
    ctx.fill()
  },

  drawTextWithWrap(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split('')
    let line = ''
    let testLine = ''
    let currentY = y

    for (let i = 0; i < words.length; i++) {
      testLine = line + words[i]
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY)
        line = words[i]
        currentY += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, currentY)
  },

  saveCanvasToImage() {
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: (res) => {
        this.setData({
          imageUrl: res.tempFilePath
        })
        wx.hideLoading()
        wx.showToast({
          title: '生成成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('生成图片失败:', err)
        wx.hideLoading()
        wx.showToast({
          title: '生成失败，请重试',
          icon: 'none'
        })
      }
    }, this)
  },

  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imageUrl,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      },
      fail: () => {
        wx.showToast({
          title: '保存失败，请授权相册权限',
          icon: 'none'
        })
      }
    })
  },

  shareImage() {
    // 微信小程序会自动处理分享
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})
