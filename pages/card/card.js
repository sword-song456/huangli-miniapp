Page({
  data: {
    cardData: null,
    canvasWidth: 750,
    canvasHeight: 1334,
    imageUrl: ''
  },

  onLoad(options) {
    if (options.data) {
      const cardData = JSON.parse(decodeURIComponent(options.data))
      this.setData({ cardData })

      // 延迟绘制，确保canvas已渲染
      setTimeout(() => {
        this.drawCard()
      }, 500)
    }
  },

  drawCard() {
    const ctx = wx.createCanvasContext('shareCanvas')
    const { canvasWidth, canvasHeight } = this.data
    const { solarDate, lunarDate, jieqi, weather, yi, ji, blessing } = this.data.cardData

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
    ctx.setFontSize(80)
    ctx.setTextAlign('center')
    ctx.fillText('今日平安', canvasWidth / 2, 150)

    // 日期信息
    ctx.setFillStyle('#333')
    ctx.setFontSize(60)
    ctx.fillText(lunarDate, canvasWidth / 2, 280)

    ctx.setFillStyle('#666')
    ctx.setFontSize(36)
    ctx.fillText(solarDate, canvasWidth / 2, 350)

    // 节气
    if (jieqi) {
      ctx.setFillStyle('#d4524f')
      ctx.setFontSize(40)
      ctx.fillText(`【${jieqi}】`, canvasWidth / 2, 420)
    }

    // 天气
    ctx.setFillStyle('#333')
    ctx.setFontSize(48)
    ctx.fillText(`${weather.temperature}° ${weather.desc}`, canvasWidth / 2, 520)

    // 宜忌区域
    let yPos = 620

    // 宜
    ctx.setFillStyle('#52c41a')
    ctx.setFontSize(44)
    ctx.setTextAlign('left')
    ctx.fillText('宜：', 80, yPos)

    ctx.setFillStyle('#333')
    ctx.setFontSize(36)
    const yiText = yi.slice(0, 3).join('  ')
    ctx.fillText(yiText, 160, yPos)

    yPos += 80

    // 忌
    ctx.setFillStyle('#ff4d4f')
    ctx.setFontSize(44)
    ctx.fillText('忌：', 80, yPos)

    ctx.setFillStyle('#333')
    ctx.setFontSize(36)
    const jiText = ji.slice(0, 3).join('  ')
    ctx.fillText(jiText, 160, yPos)

    // 祝福语区域
    yPos = 900
    ctx.setFillStyle('rgba(255, 255, 255, 0.9)')
    ctx.fillRect(60, yPos - 50, canvasWidth - 120, 280)

    ctx.setFillStyle('#d4524f')
    ctx.setFontSize(40)
    ctx.setTextAlign('center')
    ctx.fillText('平安祝福', canvasWidth / 2, yPos)

    // 绘制祝福语（自动换行）
    ctx.setFillStyle('#666')
    ctx.setFontSize(34)
    this.drawTextWithWrap(ctx, blessing, canvasWidth / 2, yPos + 60, canvasWidth - 200, 50)

    // 底部小字
    ctx.setFillStyle('#999')
    ctx.setFontSize(28)
    ctx.fillText('长按保存图片分享给好友', canvasWidth / 2, canvasHeight - 80)

    ctx.draw(false, () => {
      // 绘制完成后生成图片
      setTimeout(() => {
        this.saveCanvasToImage()
      }, 500)
    })
  },

  drawMountain(ctx) {
    // 绘制简化的山水装饰
    ctx.setFillStyle('rgba(212, 82, 79, 0.1)')
    ctx.beginPath()
    ctx.moveTo(0, 1334)
    ctx.lineTo(200, 1100)
    ctx.lineTo(400, 1200)
    ctx.lineTo(600, 1050)
    ctx.lineTo(750, 1150)
    ctx.lineTo(750, 1334)
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
      },
      fail: (err) => {
        console.error('生成图片失败:', err)
        wx.showToast({
          title: '生成失败',
          icon: 'none'
        })
      }
    })
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
