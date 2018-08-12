var util = require('../utils/util.js')
var adds = { "goods_name": "", "sell_count": 0, "in_selling": 0, "cate_id": "", "sell_type": "", "goods_stock": "", "image_url": "", "market_price": "", "group_number": "", "alone_price": "", "limit_buy": "", "goods_desc": "", "goods_sort": "0", "image_urls": [], goods_imgs: [], goods_imgs_detail: [], "goodCategorys": [], };

var goods_imgs_temp = [];
var goods_imgs_temp_detail = [];
Page({
  data: {
    img_arr: [],
    img_arr_detail:[],
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
    lastXDetail:0,
    lastYDetail:0,
    currentImg: 0,
    currentImgDetail: 0,
    swiperCurrentDetail: 0,
    tempImages: [],
    tempImagesDetail:[],
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
      { 'storageInput': "", 'price': "", 'specifications': "" },],
    isSubmitDisable: false,
    submitTimes:0
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
  swiperChangeDetail: function (e) {
    if (this.data.currentImgDetail > 0) {
      var tempImage = this.data.img_arr_detail;
      tempImage.splice(this.data.currentImgDetail, 1);
      this.setData({
        img_arr_detail: tempImage,
        currentImgDetail: 0,
      });
    }
    this.setData({
      swiperCurrentDetail: e.detail.current
    })
  },
  refresh: function () {
    util.loadding(this, 1);
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
  deleteImageDetail: function (e) {
    var tempImage = this.data.img_arr_detail;

    if (tempImage.length == (this.data.swiperCurrentDetail + 1)) {
      delete tempImage[this.data.swiperCurrentDetail];
      this.setData({
        currentImgDetail: (tempImage.length - 1)
      });
    }
    else {
      tempImage.splice(this.data.swiperCurrentDetail, 1);
    }

    this.setData({
      img_arr_detail: tempImage
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
  handletouchenddetail: function (event) {
    console.log(event);
    var text;
    let currentX = event.changedTouches[0].pageX;
    let currentY = event.changedTouches[0].pageY;
    let tx = currentX - this.data.lastXDetail;
    let ty = currentY - this.data.lastYDetail;
    console.log(tx);
    console.log(ty);
    if (ty < -100 || ty > 100) {
      this.deleteImageDetail(event);
    }
  },
  handletouchstart: function (event) {
    console.log(event);
    this.data.lastX = event.touches[0].pageX;
    this.data.lastY = event.touches[0].pageY;
  },
  handletouchstartdetail: function (event) {
    console.log(event);
    this.data.lastXDetail = event.touches[0].pageX;
    this.data.lastYDetail = event.touches[0].pageY;
  },
  goodNameInput: function (e) {
    console.log('bindGoodName，携带值为', e.detail.value)
    this.setData({
      goodName: e.detail.value
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

  getImages: function (goods_id) {
    var url = this.baseApiUrl + "?g=Api&m=Goods&a=detail&goods_id=" + goods_id;
    var self = this;

    util.ajax({
      url: url,
      success: function (data) {
        if (data.result == 'ok') {
          var temp = data.gallery;
          var img_arr = [];
          var img_arr_detail = [];
          
          // self.setData({
          //   temp: data.gallery
          // });

          for (var i = 0; i < temp.length; i++) {
            img_arr[i] = temp[i].img_url;
          }

          temp = data.galleryDetail;
          for (var i = 0; i < temp.length; i++) {
            img_arr_detail[i] = temp[i].img_url;
          }
          self.setData({
            img_arr: img_arr,
            img_arr_detail: img_arr_detail
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
      // this.setData({ img_arr_detail: options.imagesDetail})
    }
    // 页面初始化 options为页面跳转所带来的参数
  },

  storageInput: function (e) {
    console.log('storageInput携带值为', e.detail.value)
    this.setData({
      storageData: e.detail.value
    });
  },
  sendImages: function()
  {
    var urls = this.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + this.token;
    this.data.tempImages = [];

    var count = 0;
    var countDetail = 0;
    for (var i = 0; i < this.data.img_arr.length; i++) {
      if (this.data.img_arr[i].indexOf("Uploads") == -1) {
        this.data.tempImages.push(this.data.img_arr[i]);
      }
      else {
        count++;
      }
    }

    for (var i = 0; i < this.data.img_arr_detail.length; i++) {
      if (this.data.img_arr_detail[i].indexOf("Uploads") == -1) {
        this.data.tempImagesDetail.push(this.data.img_arr_detail[i]);
      }
      else {
        countDetail++;
      }
    }
    if (count == this.data.img_arr.length && countDetail == this.data.img_arr_detail.length) {
      urls = this.baseApiUrl + "?g=Api&m=Weuser&a=upload3&token=" + this.token;
      adds.goods_imgs = JSON.stringify(this.data.img_arr);
      adds.goods_imgs_detail = JSON.stringify(this.data.img_arr_detail);
      var that = this;
      wx.request({
        url: urls,
        method: 'POST',
        data: adds,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res) {
            wx.showToast({
              title: '已提交发布！',
              duration: 3000
            });
          }
          console.log(res);
          wx.navigateBack();
        },
        fail: function (res) {
          console.log(res);
          that.data.isSubmitDisable = true;
        }
      });
    }
    else {
      this.upload(0, this.data.tempImages.length + this.data.tempImagesDetail.length, urls);
    }
  },

  upload: function (index, uploadCount, urls) {
    var that = this;
    var filePath;
    if (this.data.tempImages.length > index)
    {
      filePath = that.data.tempImages[index];
    }
    else
    {
      filePath = that.data.tempImagesDetail[this.data.tempImagesDetail.length - (uploadCount - index)];
    }
      wx.uploadFile({
        url: urls,//'http://127.0.0.1/weipin-admin/',
        filePath: filePath,
        name: 'file',
        header: { "Content-Type": "application/json" },
        formData: adds,
        success: function (res) {
          if (res.data != "") {
            var data = JSON.parse(res.data);
            if (that.data.tempImages.length > index) {
              goods_imgs_temp[index] = data["url"];
            }
            else {
              goods_imgs_temp_detail[index - that.data.tempImages.length] = data["url"];
            }

          }
          console.log(res)

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
              adds.goods_imgs_detail = JSON.stringify(goods_imgs_temp_detail);
              wx.uploadFile({
                url: urls,
                filePath: that.data.img_arr[0],
                name: 'file',
                header: { "Content-Type": "application/json" },
                formData: adds,
                success: function (res) {
                  if (res) {
                    if (that.data.submitTimes == 0) {
                      wx.showToast({
                        title: '已提交发布！',
                        duration: 3000
                      });
                      wx.navigateBack();
                    }
                  }

                  console.log(res)

                },
                fail: function (res) {
                  console.log(res);
                  that.data.isSubmitDisable = true;
                }

              });
            }
            else {
              urls = that.baseApiUrl + "?g=Api&m=Weuser&a=upload3&token=" + that.token;
              for (var i = 0; i < that.data.img_arr.length; i++) {
                if (that.data.img_arr[i].indexOf("Uploads") != -1) {
                  goods_imgs_temp.push(that.data.img_arr[i]);
                }
              }

              for (var i = 0; i < that.data.img_arr_detail.length; i++) {
                if (that.data.img_arr_detail[i].indexOf("Uploads") != -1) {
                  goods_imgs_temp_detail.push(that.data.img_arr_detail[i]);
                }
              }
              adds.goods_imgs = JSON.stringify(goods_imgs_temp);
              adds.goods_imgs_detail = JSON.stringify(goods_imgs_temp_detail);

              wx.request({
                url: urls,
                method: 'POST',
                data: adds,
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json'
                },
                success: function (res) {
                  if (res) {
                    wx.showToast({
                      title: '已提交发布！',
                      duration: 3000
                    });
                  }
                  console.log(res);
                  wx.navigateBack();
                },
                fail: function (res) {
                  console.log(res);
                  that.data.isSubmitDisable = true;
                }
              });
            }


            adds.goods_imgs = [];
            goods_imgs_temp = [];
            goods_imgs_temp_detail = [];
          }
          console.log(res);
        }
      });

    this.setData({
      formdata: ''
    })
  },
  formSubmit: function (e) {
    if (this.data.isSubmitDisable == true)
    {
      wx.showToast({
        title: '已提交,请稍等！',
        duration: 3000
      });
    }

    if (e.detail.value.goodName == "" || this.data.goodCategorys[0].storageInput == "" || this.data.goodCategorys[0].price == "" || this.data.goodCategorys[0].specification == "" || this.data.img_arr.length == 0 || this.data.img_arr_detail.length == 0) {
      wx.showToast({
        title: '请填写信息',
        duration: 3000
      });
      return;
    }

    this.setData({ isSubmitDisable: true });
    adds.goods_name = e.detail.value.goodName;
    adds.goods_stock = this.data.goodCategorys[0].storageInput;
    adds.market_price = this.data.goodCategorys[0].price;
    adds.goods_desc = e.detail.value.goodsDesc;
    adds.goods_id = this.data.goods_id;
    adds.goodCategorys = JSON.stringify(this.data.goodCategorys);

    this.sendImages(adds);
    // this.sendImagesDetail(adds);
  },
  upimg: function () {
    var that = this;
      wx.chooseImage({
        sizeType: ['compressed'],
        success: function (res) {
          for (var index = 0; index < res.tempFiles.length; index++)
          {
            if (res.tempFiles[index].size >= 2000000)
            {
              wx.showToast({
                title: '上传图片不能大于2M!: 第' + (index + 1) + '张',  //标题
                icon: 'none',       //图标 none不使用图标，详情看官方文档
                duration:3000,
              });
              return ;
            }
          }
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
        }
      });
  },
    upimgdetail: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      success: function (res) {
        for (var index = 0; index < res.tempFiles.length; index++) {
          if (res.tempFiles[index].size >= 2000000) {
            wx.showToast({
              title: '上传图片不能大于2M!: 第' + (index + 1) + '张',  //标题
              icon: 'none',       //图标 none不使用图标，详情看官方文档
              duration: 3000,
            });
            return;
          }
        }
        that.setData({
          img_arr_detail: that.data.img_arr_detail.concat(res.tempFilePaths)
        })
      }
    });

  }
});