var util = require('../utils/util.js')
var adds = { "goods_name": "", "sell_count": 0, "in_selling": 0, "cate_id": "", "sell_type": "", "goods_stock": "", "image_url": "", "market_price": "", "group_number": "", "alone_price": "", "limit_buy": "", "goods_desc": "", "goods_sort": "0", "image_urls": [], goods_imgs: [], "goodCategorys":[] };

var goods_imgs_temp = [];
Page({
  data: {
    img_arr: [],
    formdata: '',
    array: ["服饰", "母婴", "美食", "男装", "家居", "电器", "家纺", "水果", "手机", "运动"],
    arrayBuy: ["不限", "仅团购", "仅单买"],
    index: 0,
    indexBuy: 0,
    storageData: 0,
    goodName: 0,
    specifications:0,
    storageInput: 0,
    price: 0,
    tuanPrice: 0,
    tuanNumber: 0,
    onePrice: 0,
    goodsDesc: 0,
    edit: "",
    goods_id: 0,
    sell_count: 0,
    in_selling: 0,
    images: [],
    gallery: [],
    lastX: 0,
    lastY: 0,
    currentImg: 0,
    swiperCurrent: 0,
    tempImages: [],
    goodCategorys: [
      { 'storageInput': "", 'price': "", 'specifications': "" },
      { 'storageInput': "", 'price': "", 'specifications': "" },
      { 'storageInput': "", 'price': "", 'specifications': "" },
      { 'storageInput': "", 'price': "", 'specifications': "" },
      { 'storageInput': "", 'price': "", 'specifications': "" },
      { 'storageInput': "", 'price': "", 'specifications': "" },
      { 'storageInput': "", 'price': "", 'specifications': "" },
      { 'storageInput': "", 'price': "", 'specifications': "" },
      { 'storageInput': "", 'price': "", 'specifications': "" },
      { 'storageInput': "", 'price': "", 'specifications': "" },]
     },
  
  swiperChange: function (e) {
    if (this.data.currentImg > 0) {
      var tempImage = this.data.img_arr;
      tempImage.splice(this.data.currentImg, 1);
      this.setData({
        img_arr: tempImage,
        currentImg: 0,
      });
    }
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  refresh: function () {
    util.loadding(this, 1);
    //this.addressList();
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
  },
  deleteImage: function (e) {
    var tempImage = this.data.img_arr;

    if (tempImage.length == (this.data.swiperCurrent + 1)) {
      delete tempImage[this.data.swiperCurrent];
      this.setData({
        currentImg: (tempImage.length - 1)
      });
    }
    else {
      tempImage.splice(this.data.swiperCurrent, 1);
    }


    this.setData({
      img_arr: tempImage
    });

    wx.startPullDownRefresh();
  },
  handletouchend: function (event) {
    console.log(event);
    var text;
    let currentX = event.changedTouches[0].pageX;
    let currentY = event.changedTouches[0].pageY;
    let tx = currentX - this.data.lastX;
    let ty = currentY - this.data.lastY;
    console.log(tx);
    console.log(ty);
    if (ty < -100 || ty > 100) {
      this.deleteImage(event);
    }


  },
  handletouchstart: function (event) {
    console.log(event);
    this.data.lastX = event.touches[0].pageX;
    this.data.lastY = event.touches[0].pageY;
  },
  goodNameInput: function (e) {
    console.log('bindGoodName，携带值为', e.detail.value)
    this.setData({
      goodName: e.detail.value
    })
  },
  bindTuantimes: function (e) {
    console.log('bindTuantimes', e.detail.value)
    this.setData({
      tuantimes: e.detail.value
    })
  },
  bindGoodsDesc: function (e) {
    console.log('bindGoodsDesc', e.detail.value)
    this.setData({
      goodsDesc: e.detail.value
    })
  },
  bindSpecificationsInput: function(e)
  {
    var index = parseInt(e.currentTarget.offsetLeft / 375);
    this.data.goodCategorys[index].specifications = e.detail.value;
    console.log('specifications', this.data.goodCategorys[index].specifications);
    console.log('index', index);
  },
  bindStorageInput: function (e) {
    this.data.strageInput = e.detail.value;
    var index = parseInt(e.currentTarget.offsetLeft / 375);
    this.data.goodCategorys[index].storageInput = e.detail.value;
    console.log('bindStorageInput', this.data.goodCategorys[index].storageInput);
    console.log('index', index);

  },
  bindPrice: function (e) {
    var index = parseInt(e.currentTarget.offsetLeft / 375);
    this.data.goodCategorys[index].price = e.detail.value;
    console.log('bindPrice', this.data.goodCategorys[index].price) 
    console.log('index', index);
    this.setData({
      price: e.detail.value
    })
  },
  bindTuanPrice: function (e) {
    console.log('bindTuanPrice，携带值为', e.detail.value)
    this.setData({
      tuanPrice: e.detail.value
    })
  },
  bindTuanNumber: function (e) {
    console.log('bindTuanNumber', e.detail.value)
    this.setData({
      tuanNumber: e.detail.value
    })
  },
  bindOnePrice: function (e) {
    console.log('bindOnePrice', e.detail.value)
    this.setData({
      onePrice: e.detail.value
    })
  },
  getImages: function (goods_id) {
    var url = this.baseApiUrl + "?g=Api&m=Goods&a=detail&goods_id=" + goods_id;
    var self = this;

    util.ajax({
      url: url,
      success: function (data) {
        if (data.result == 'ok') {
          var temp = data.gallery;
          var img_arr = [];
          self.setData({
            temp: data.gallery
          });

          for (var i = 0; i < temp.length; i++) {
            img_arr[i] = temp[i].img_url;
          }
          self.setData({
            img_arr: img_arr
          });
        }
      }
    });

  },
  onLoad: function (options) {
    
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl');
    this.setData({ edit: options.edit });
    // this.images = JSON.parse(options.images);
    this.setData({ goodName: options.goodName });
    // this.setData({ storageNumber: options.storageInput });
    // this.setData({ price: options.price });
    this.setData({ goodsDesc: options.goodsDesc });
    this.setData({ goods_id: options.goods_id });

    if (this.data.edit == 'true') {
      this.getImages(this.data.goods_id);
      this.setData({ goodCategorys: JSON.parse(options.goodCategorys) });
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChangeBuy: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexBuy: e.detail.value
    })
  },
  storageInput: function (e) {
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
    adds.goods_stock = this.data.goodCategorys[0].storageInput;
    adds.image_url = "http://xubuju";
    
    // JSON.stringify(adds.image_urls);

    adds.market_price = this.data.goodCategorys[0].price;
    adds.in_selling = 0;
    adds.group_price = this.data.tuanPrice;
    adds.group_number = this.data.tuanNumber;
    adds.alone_price = this.data.onePrice;
    adds.limit_buy = 0;
    adds.sell_count = 0;
    adds.goods_desc = e.detail.value.goodsDesc;
    adds.goods_sort = "0";
    adds.dosubmit = "";
    adds.goods_id = this.data.goods_id;
    adds.goodCategorys = JSON.stringify(this.data.goodCategorys);
    // adds.goods_imgs = null;
    var urls = this.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + this.token;

    this.data.tempImages = [];

    var count = 0;
    for (var i = 0; i < this.data.img_arr.length; i++) {
      if (this.data.img_arr[i].indexOf("Uploads") == -1) {
        this.data.tempImages.push(this.data.img_arr[i]);
      }
      else
      {
        count++;
      }
    }
    if (count == this.data.img_arr.length)
    {
      urls = this.baseApiUrl + "?g=Api&m=Weuser&a=upload3&token=" + this.token;
      adds.goods_imgs = JSON.stringify(this.data.img_arr);
      wx.request({
        url: urls,
        method: 'POST',
        data: adds,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log(res);
          wx.navigateBack();
        }
      });
    }
    else
    {
      this.upload(0, this.data.tempImages.length, urls);
    }
  },

  upload: function (index, uploadCount, urls) {
    var that = this;
    wx.uploadFile({
      url: urls,//'http://127.0.0.1/weipin-admin/',
      filePath: that.data.tempImages[index],
      name: 'file',
      header: { "Content-Type": "application/json" },
      formData: adds,
      success: function (res) {
        if (res.data != "") {
          var data = JSON.parse(res.data);
          goods_imgs_temp[index] = data["url"];
        }
        console.log(res)
        if (res) {
          wx.showToast({
            title: '已提交发布！',
            duration: 3000
          });
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        index++;
        if (index < uploadCount) {
          var urls = that.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + that.token;
          that.upload(index, uploadCount, urls);
        }
        else if (index == uploadCount) {
          var urls;
          if (that.data.edit == "false") {
            urls = that.baseApiUrl + "?g=Api&m=Weuser&a=upload2&token=" + that.token;
            adds.goods_imgs = JSON.stringify(goods_imgs_temp);

            wx.uploadFile({
              url: urls,
              filePath: that.data.img_arr[0],
              name: 'file',
              header: { "Content-Type": "application/json" },
              formData: adds,
              success: function (res) {

                console.log(res)
                wx.navigateBack();
              },
              fail: function (res) {
                console.log(res);
              },

            });
          }
          else {
            urls = that.baseApiUrl + "?g=Api&m=Weuser&a=upload3&token=" + that.token;
            for (var i = 0; i < that.data.img_arr.length; i++) {
              if (that.data.img_arr[i].indexOf("Uploads") != -1) {
                goods_imgs_temp.push(that.data.img_arr[i]);
              }
            }
            adds.goods_imgs = JSON.stringify(goods_imgs_temp);
            wx.request({
              url: urls,
              method: 'POST',
              data: adds,
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              success: function (res) {
                console.log(res);
                wx.navigateBack();
              }
          });
          }


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