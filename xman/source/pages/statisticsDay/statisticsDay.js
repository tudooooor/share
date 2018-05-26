var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeArray: ['日', '周', '月', '年'],
    timeAranularity: ['日', '月', '年'],
    timeAranularityIndex: 0,
    aranularity:'日',
    date: '',
    year:"",
    month:"",
    selectedYear:0,
    selectedMonth:0,
    selectedDay:0,
    day:"",
    dayArray:[],
    orders:[],
    showType:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindAranularityChange: function(e)
  {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    if (e.detail.value == '0')
    {
      this.setData({
        aranularity: '日'
      });
      this.timeAranularityIndex = 0;
    }
    else if (e.detail.value == '1') {
      this.setData({
        aranularity: '月'
      });
      this.timeAranularityIndex = 1;
    }
    else if (e.detail.value == '2') {
      this.setData({
        aranularity: '年'
      })
      this.timeAranularityIndex = 2;
    }

  },
  getNowTime: function (selectedYear, selectedMonth, selectedDay)
   {
    var year = selectedYear; 
    var month = selectedMonth; 
    var day = parseInt(selectedDay) + 1;

// 如果需要时分秒，就放开 // var h = now.getHours(); // var m = now.getMinutes(); // var s = now.getSeconds(); 
    if (day < 10) { day = '0' + day; };
    var formatDate = year + '-' + month + '-' + day;

    this.setData({ 'year': year });
    this.setData({ 'month': month });
    this.setData({ 'day': day });
    return formatDate;
  },
  bindYearChange: function(e)
  {
    console.log('picker发送选择改变，携带值为', e.detail.value);

      this.setData({
        year: e.detail.value
      });

  },
  bindMonthChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var month = e.detail.value.substring(5, 7);
    this.setData({
      month: month
    });

  },
  bindDayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    // var day = e.detail.value.getDate();
    this.setData({
      day: day
    });

  },
  getStatDataDay:function()
  {
    var that = this;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=getStatDataDay&token=" + this.token + "&year=" + this.data.year + "&month=" + this.data.month + "&day=" + this.data.day;
    util.ajax({
      "url": url,
      "data": {
        "offset": 0,
        "size": 20
      },
      error: function (res) {
      },
      "success": function (res) {
        if (res['result'] == 0) {
          // that.drawPic(res.filePath, goods_name, goods_desc);
          that.setData({ 'orders': res['orders'] });
        }
      }
    });
  },
  onLoad: function (options) {
    this.data.selectedDay = options.selectedDay;
    this.data.selectedMonth = options.selectedMonth;
    this.data.selectedYear = options.selectedYear;
    this.baseApiUrl = util.config('baseApiUrl');
    this.token = wx.getStorageSync('token');
    var time = this.getNowTime(this.data.selectedYear, this.data.selectedMonth, this.data.selectedDay);

    this.setData({ 'date': time });
    this.getStatDataDay();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})