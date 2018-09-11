Page({
  data: {
    maskShow:'none',
    maskShowa:'none',
    maskShowb:'none',
    maskShowc:'none',
    maskShowd:'none',
    maskShowe:'none',
    maskShowf:'none',
    maskShowg:'none',
    maskShowh:'none',
    maskShowi:'none',
    maskShowj:'none',
    maskShowk:'none',
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
  // change2Toggle:function(e){
  //   var index = e.currentTarget.dataset.index;
  //   if (this.data.selectedF[index]){
  //     this.data.selectedF[index] = false;
  //   }else{
  //     this.data.selectedF[index] = true;
  //   }

  //   this.setData({
  //     selectedF: this.data.selectedF
  //   })
  // },

 show: function () {
    this.setData({ flag: false })
  },
  hide: function () {
    this.setData({ flag: true })
  },

  maskHide:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShow:'none',
      goodSpecifications: this.data
    });
  },
    maskHidea:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowa:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplay:function() {
    this.setData({
      maskShow: 'flex'
    });
  },
   maskDisplaya:function() {
    this.setData({
      maskShowa: 'flex'
    });
  },

      maskHideb:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowb:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayb:function() {
    this.setData({
      maskShowb: 'flex'
    });
  },

      maskHidec:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowc:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayc:function() {
    this.setData({
      maskShowc: 'flex'
    });
  },

      maskHided:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowd:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayd:function() {
    this.setData({
      maskShowd: 'flex'
    });
  },

      maskHidee:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowe:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplaye:function() {
    this.setData({
      maskShowe: 'flex'
    });
  },

      maskHidef:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowf:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayf:function() {
    this.setData({
      maskShowf: 'flex'
    });
  },

      maskHidej:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowj:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayj:function() {
    this.setData({
      maskShowj: 'flex'
    });
  },

      maskHidek:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowk:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayk:function() {
    this.setData({
      maskShowk: 'flex'
    });
  },

      maskHideg:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowg:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayg:function() {
    this.setData({
      maskShowg: 'flex'
    });
  },

      maskHideh:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowh:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayh:function() {
    this.setData({
      maskShowh: 'flex'
    });
  },

      maskHidei:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowi:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayi:function() {
    this.setData({
      maskShowi: 'flex'
    });
  },

      maskHidel:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    this.setData({
      maskShowl:'none',
      goodSpecifications: this.data
    });
  },
  maskDisplayl:function() {
    this.setData({
      maskShowl: 'flex'
    });
  },

})
