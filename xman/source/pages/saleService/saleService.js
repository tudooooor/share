Page({
  data: {
    maskShow:'none',
    flag: true,
    showShare:'none',

    list01: [
      { item_id: 1 }, { item_id: 11 }, { item_id: 11 },
    ],
    list02: [

    ],
    list03: [
      { item_id: 11 }, { item_id: 11 }
    ],
    list04: [
      { item_id: 11 }, { item_id: 11 }, { item_id: 11 }
    ],

  // 展开折叠
    selectedFlag: [false, false, false, false,false, false, false, false],
    selectedF:[false, false, false, false,false, false, false, false],

  },
    // 展开折叠选择  
  changeToggle:function(e){
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]){
      this.data.selectedFlag[index] = false;
    }else{
      this.data.selectedFlag[index] = true;
    }

    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },
  change2Toggle:function(e){
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedF[index]){
      this.data.selectedF[index] = false;
    }else{
      this.data.selectedF[index] = true;
    }

    this.setData({
      selectedF: this.data.selectedF
    })
  },

 show: function () {
    this.setData({ flag: false })
  },
  hide: function () {
    this.setData({ flag: true })
  },

  maskHide:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    // {
    //   if (this.data.count[index] != 0)
    //   {
    //     this.data.goodSpecifications += ('规格:' + this.data.goodCategorys[index].specifications + ' ' + this.data.count[index] + '件') + ' ';
    //   }
    // }
    this.setData({
      maskShow:'none',
      goodSpecifications: this.data
    });

  },
  maskDisplay:function() {
    this.setData({
      maskShow: 'flex'
    });
  },

})
