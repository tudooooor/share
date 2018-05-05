var util = require('../utils/util.js')
var app = getApp();

Page({
  data:{
    "provinces" : [
        {
          'region_id' : 0,
          "region_name" : '请选择省'
        }
     ],     
    "citys" : [{
      'region_id' : 0,
      "region_name" : '请选择市'
    }],
    "areas" : [{
        'region_id' : 0,
        "region_name" : '请选择区'
    }],
     "regions" : false,
     "address_select" : 0,
     "provinceValue" : '',
     "cityValue" : '',
     "areaValue" : '',
     "provinceIndex" : '',
     "cityIndex" : '',
     "areaIndex" : '',
     "adTypes" : ['家庭','公司'],
     "address_name" : ['HOME','WORK'],
     "adTypeIndex" : 0,
     "areasAnimation" : {},
     "citysAnimation" : {},
     "provincesAnimation" : {},
     'provinceTop' : "0em",
     'cityTop' : "0em",
     'areaTop'  : "0em",
     'provinceVal' : "0",
     'cityVal' : "0",
     'areaVal'  : "0",
     'modalHidden' : true,
     'address' :  {
       "receive_name" : '',
       "mobile" : '',
       "wxNumber":'',
       "address" : ''
     },
     'receive_name_tip' : false,
     'mobile_tip' : false,
     'province_tip' : false,
     'city_tip' : false,
     'district_tip' : false,
     'adType_tip' : false,
     'adinfo_tip' : false,
     userImage: "",
     'phoneNum': '',
  },
  edit:function(options){
    console.log("---view1 bindtap click");
  },

  onLoad:function(options){
    if(this.options.address_id) {
      wx.setNavigationBarTitle({
        title: '编辑个人信息'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '个人信息'
      })
    }
    this.setData({ userImage: options.userImage });
    this.setData({ nickname: options.nickname});

    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl'); 
    
    this.getInfo();
  },
  getInfo : function ()
  {
    var that = this;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=getPersonInfo&token=" + this.token;
    util.ajax({
      "url": url,
      "data": {
        "offset": 0,
        "size": 20
      },
      success: function (res) {
        console.log(res)
        if (res['result'] == 0) {
          that.setData({
            phoneNum: res.phoneNum
          });
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