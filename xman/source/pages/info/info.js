// info.js
 const config = require('../../config.js');
 var util = require('../../utils/util.js');
Page({
  data: {
    send: false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum: '',
    phoneNumAfterConfirm: '',
    code: '',
  },
  onLoad: function (options) {
    this.baseApiUrl = util.config('baseApiUrl');
    this.token = wx.getStorageSync('token');
  },
// 手机号部分
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
        console.log('phoneNum' + this.data.phoneNum)
        this.showSendMsg()
        this.activeButton()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      this.hideSendMsg()
    }
  },

  checkPhoneNum: function (phoneNum) {
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        image: '../../images/fail.png'
      })
      return false
    }
  },

  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },

  hideSendMsg: function () {
    this.setData({
      send: false,
      disabled: true,
      buttonType: 'default'
    })
  },
  sendMsg: function () {
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=mobile&token=" + this.token;
    util.ajax({
      "url": url,
      data: {
        phoneNum: this.data.phoneNum
      },
      success: function (res) {
        if (res['result'] == "ok") {
          var xx = 21;
        }

      },
      fail: function (res) {
      },
      error: function (res) {
      }
    });
   
    this.setData({
      alreadySend: true,
      send: false
    })
    this.timer()
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

// 验证码
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    this.activeButton()
    console.log('code' + this.data.code)
  },

 // 按钮
  activeButton: function () {
    let {phoneNum, code} = this.data
    console.log(code)
    if (phoneNum && code) {
      this.setData({
        disabled: false,
        buttonType: 'primary'
      })
    } else {
      this.setData({
        disabled: true,
        buttonType: 'default'
      })
    }
  },

  onSubmit: function () {
    var that = this;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=saveMobile&token=" + this.token;
    util.ajax({
      "url": url,
      data: {
        phoneNum: this.data.phoneNum,
        code:this.data.code,
      },
      success: function (res) {
        console.log(res)
        if (parseInt(res.statusCode) === 0) {
          wx.showToast({
            title: '验证成功',
            icon: 'success'
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            phoneNum: that.data.phoneNum
          });
            
        } else if (res.statusCode == 1){
          wx.showToast({
            title: '验证超时',
            icon: 'fail'
          })
        }
        else if (res.statusCode == 2)
        {
          wx.showToast({
            title: '验证码错误',
            icon: 'fail'
          })
        }
      },
      fail: function (res) {
        console.log(res)
      },
      error: function (res) {
      }
    });
    
  }
})
