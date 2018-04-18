var util = require('../utils/util.js')
var adds = { "goods_name": "", "sell_count":0, "in_selling":0, "cate_id": "", "sell_type": "", "goods_stock": "", "image_url": "", "market_price": "", "group_number": "", "alone_price": "", "limit_buy": "", "goods_desc": "", "goods_sort": "0", "image_urls": [], goods_imgs:[] };
var goods_imgs_temp = [];
Page({
  data: {
    img_arr: [],
    formdata: '',
    array: ["服饰", "母婴", "美食", "男装", "家居", "电器", "家纺", "水果", "手机", "运动"],
    arrayBuy: ["不限", "仅团购", "仅单买"],
    index: 0,
    indexBuy: 0,
    storageData:0,
    goodName:0,
    storageInput:0,
    price:0,
    tuanPrice:0,
    tuanNumber:0,
    onePrice:0,
    goodsDesc:0,
    edit:"",
    goods_id:0,
    sell_count:0,
    in_selling:0,
  },
  goodNameInput: function(e)
  {
    console.log('bindGoodName，携带值为', e.detail.value)  
    this.setData({  
      goodName: e.detail.value  
    }) 
  },
  bindTuantimes: function(e)
  {
    console.log('bindTuantimes', e.detail.value)  
    this.setData({  
      tuantimes: e.detail.value  
    }) 
  },
  bindGoodsDesc: function(e)
  {
    console.log('bindGoodsDesc', e.detail.value)  
    this.setData({  
      goodsDesc: e.detail.value  
    }) 
  },
  bindStorageInput: function(e)
  {
    console.log('bindStorageInput', e.detail.value)  
    this.setData({  
      storageInput: e.detail.value  
    }) 
  },
  bindPrice: function(e)
  {
    console.log('bindPrice', e.detail.value)  
    this.setData({  
      price: e.detail.value  
    }) 
  },
  bindTuanPrice: function(e)
  {
    console.log('bindTuanPrice，携带值为', e.detail.value)  
    this.setData({  
      tuanPrice: e.detail.value  
    }) 
  },
  bindTuanNumber: function(e)
  {
    console.log('bindTuanNumber', e.detail.value)  
    this.setData({  
      tuanNumber: e.detail.value  
    }) 
  },
  bindOnePrice: function(e)
  {
    console.log('bindOnePrice', e.detail.value)  
    this.setData({  
      onePrice: e.detail.value  
    }) 
  },
  onLoad: function (options) {
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl');
    this.setData({edit:options.edit});
    this.setData({ goodName: options.goodName });
    this.setData({ storageNumber: options.storageInput });
    this.setData({ price: options.price });
    this.setData({ goodsDesc: options.goodsDesc });
    this.setData({ goods_id:options.goods_id});
    // 页面初始化 options为页面跳转所带来的参数
  },
  bindPickerChange: function(e) {  
    console.log('picker发送选择改变，携带值为', e.detail.value)  
    this.setData({  
      index: e.detail.value  
    })  
  }, 
  bindPickerChangeBuy: function(e) {  
    console.log('picker发送选择改变，携带值为', e.detail.value)  
    this.setData({  
      indexBuy: e.detail.value  
    })  
  }, 
  storageInput: function(e)
  {
    console.log('storageInput携带值为', e.detail.value) 
    this.setData({
      storageData: e.detail.value
    });
  },
  formSubmit: function (e) {
    var id = e.target.id;
    //adds = e.detail.value;
    // adds.program_id = app.jtappid
    // adds.openid = app._openid
    //adds.zx_info_id = this.data.zx_info_id;
    // adds.goods_name = this.data.goodName;
    adds.goods_name = e.detail.value.goodName;
    adds.cate_id = "36";
    adds.sell_type = "0";
    adds.goods_stock = e.detail.value.storageInput;
    adds.image_url = "http://xubuju";

    // JSON.stringify(adds.image_urls);

    adds.market_price = e.detail.value.price;
    adds.in_selling = 0;
    adds.group_price = this.data.tuanPrice;
    adds.group_number = this.data.tuanNumber;
    adds.alone_price = this.data.onePrice;
    adds.limit_buy = 0;
    adds.sell_count = 0;
    adds.goods_desc = e.detail.value.goodsDesc;  
    adds.goods_sort = "0";
    adds.dosubmit = "";
    // adds.goods_imgs = null;
    var urls = this.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + this.token;
    this.upload(0, this.data.img_arr.length, urls);
    
  },

  upload: function (index, uploadCount, urls) {
    var that = this;

      wx.uploadFile({
        url: urls,//'http://127.0.0.1/weipin-admin/',
        filePath: that.data.img_arr[index],
        name: 'file',
        header: { "Content-Type": "application/json" },
        formData: adds,
        success: function (res) {

          if (res.data != "")
          {
            var data = JSON.parse(res.data);
            
            goods_imgs_temp[index] = data["url"];            
          }

          console.log(res)
          // var good_img = {goods_imgs:data["url"]};
          // adds.goods_imgs.push(data["url"]);
          // JSON.stingify(adds.image_urls);
          // adds.goods_imgs[index] = data["url"];
          
         
          if (res) {
            wx.showToast({
              title: '已提交发布！',
              duration: 3000
            });
          }
        },
        fail: function(res)
        {
          console.log(res);
        },
        complete: function(res)
        {
          index++;
          if (index < uploadCount)
          {
            var urls = that.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + that.token;
            that.upload(index, uploadCount, urls);
          }
          else if (index == uploadCount)
          {
            var urls
            if (that.data.edit == "false")
            {
              urls = that.baseApiUrl + "?g=Api&m=Weuser&a=upload2&token=" + that.token;
            }
            else
            {
              adds.goods_id = that.data.goods_id;
              urls = that.baseApiUrl + "?g=Api&m=Weuser&a=upload3&token=" + that.token;
            }
            
            adds.goods_imgs = JSON.stringify(goods_imgs_temp);
            // adds.goods_imgs.push({"goods_imgs":adds.goods_imgs[0]});
            // adds.goods_imgs.push({"goods_imgs":adds.goods_imgs[1]});
            
            var goods = [];
            // that.upload(index - 1, uploadCount, urls);
                wx.uploadFile({
                  url: urls,//'http://127.0.0.1/weipin-admin/',
                  filePath: that.data.img_arr[0],
                  name: 'file',
                  header: { "Content-Type": "application/json" },
                  formData: adds,
                  success: function (res) {
                
                    console.log(res)
/*
                    var data = JSON.parse(res.data);
                    var url = that.baseApiUrl + "?g=Api&m=Weuser&a=addGood&goods_id=" + data['goods_id'] + "&token=" + that.token;

                    util.ajax({
                        "url" :  url,
                        // "method" :　"POST",
                        "data": {
                          "offset": 0,
                          "size": 20
                        },
                        "success" : function(data) {
                            if(data['result'] == "ok") {
                
                            }
                            
                        }
                      });
*/

                    wx.navigateBack();
                  },

                });

                adds.goods_imgs = [];
                goods_imgs_temp = [];
          }
          console.log(res);
        }
      });
    
    this.setData({
      formdata: ''
    })
  },
  upimg: function () {
    var that = this;
    if (this.data.img_arr.length < 3) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        success: function (res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多上传三张图片',
        icon: 'loading',
        duration: 3000
      });
    }

  }
});