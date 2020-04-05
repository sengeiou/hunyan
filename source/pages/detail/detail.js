// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ShangjiaApi } from "../../apis/shangjia.api.js";
import { AliyunApi } from "../../apis/aliyun.api.js";
var WxParse = require('../../wxParse/wxParse');
import { ApiUtil } from "../../apis/apiutil.js";

// import { tapDayItem } from "../../components/calendar/index.js";


class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    // options.id=10;
    super.onLoad(options);
    this.Base.setMyData({
      StatusBar: getApp().globalData.StatusBar,
      CustomBar: getApp().globalData.CustomBar,
      Custom: getApp().globalData.Custom,
      tian:false,
      focus:false,
      scrollTop:0,
      daohang:'sj',
      zaiimg:false,
      rili:false,
      huadong:false
    })
  }
  onMyShow() {
    var that = this;
    var shangjiaapi = new ShangjiaApi();
    shangjiaapi.shangjiadetail({id:this.Base.options.id},(detail)=>{
      detail.chandi = ApiUtil.HtmlDecode(detail.chandi);

      WxParse.wxParse('content', 'html', detail.chandi, that, 10);
      this.Base.setMyData({ detail})
    })
    this.getyuyue();
  }
  getyuyue(){
    var date = new Date();
    console.log(date.getTime());
    var year = date.getFullYear();
    var mon = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var today = year + '/' + mon + '/' + day + ' ' + '00:00:00';
    var todayw = year + '/' + mon + '/' + day+' '+'23:59:59';
    console.log(today, 'today', todayw);
    var shangjiaapi = new ShangjiaApi();
    var arr =[];
    shangjiaapi.yuyuelist({
      // member_id:this.Base.getMyData().memberinfo.id,
    }, (yuyuelist)=>{
      for (var i = 0; i < yuyuelist.length;i++){
        yuyuelist[i].shijian = yuyuelist[i].shijian.replace(/-/g,'/');
        console.log(new Date(yuyuelist[i].shijian).getTime())
        console.log(new Date(today).getTime(), 'today');
        if (new Date(today).getTime() < new Date(yuyuelist[i].shijian).getTime() && new Date(todayw).getTime() > new Date(yuyuelist[i].shijian).getTime()){
          arr.push(yuyuelist[i]);
        }
      }
      this.Base.setMyData({ yuyuelist:arr})
    })
  }
  
  yuyue(){
    // var rili = whenSingleSelect();
    console.log(AppBase.rili,'rili');
    return
    var yuyuelist = this.Base.getMyData().yuyuelist;
    var instinfo = this.Base.getMyData().instinfo;
    var detail = this.Base.getMyData().detail;
    if (detail.sendmsg=='A'){
      var citymanager_id = detail.citymanager[0].id;
      var citymanager_phone = detail.citymanager[0].mobile;
    } else if (detail.sendmsg == 'B') {
      var i = (Math.random() * (detail.citymanager.length-1)).toFixed(0);
      var citymanager_id = detail.citymanager[i].id;
      var citymanager_phone = detail.citymanager[0].mobile;
    }else {
      this.toast('当前商品不能预约，还没选择相应的城市管理员！');
      return
    }
    var that = this;
    var name = this.Base.getMyData().name;
    if (name == undefined || name.trim() !=""  ){
      this.toast('请输入您的姓名！');
      return
    }
    var shangjiaapi = new ShangjiaApi();
    var aliyunapi = new AliyunApi();
    if (instinfo.cishu - yuyuelist.length>0){
      wx.showModal({
        title: '预约',
        content: '今天剩余预约次数为：' + (instinfo.cishu - yuyuelist.length) + '次',
        cancelText: '取消',
        confirmText: '预约',
        success: (res) => {
          console.log(res);
          if (res.confirm) {
            aliyunapi.sendsms({
              phone: citymanager_phone,
              name: name,
              shanghu: detail.name,
              memphone: that.Base.getMyData().memberinfo.mobile
            }, (sendsms)=>{
              shangjiaapi.yuyue({
                // member_id: this.Base.getMyData().memberinfo.id,
                shanjia_id: this.Base.options.id,
                citymanager_id: citymanager_id
              }, (yuyue) => {
                console.log(yuyue)
                if (yuyue.code == '0') {
                  
                  wx.showToast({
                    title: '发送成功',
                  })
                  that.getyuyue();
                  return
                } else {
                  that.toast('发送失败');
                  return
                }
                that.Base.setMyData({
                  tian: false,
                  focus:false
                })
              })
            })
           
          }
        }
      })
    }else {
      this.toast('今天的预约次数已经用完了！请明天再预约');
      return 
    }
  
  }
  quedin(){
    this.Base.setMyData({
      tian: true,
      focus:true
    })
  } 
  quxiao(){
    this.Base.setMyData({
      rili:false,
      focus:false,
      zaiimg:false
    })
  }
  nameFn(e){
    this.Base.setMyData({
      name:e.detail.value
    })
  }
  onPageScroll(e){
    console.log(e);
    if (e.scrollTop<270){
      var huadong=false;
    }else {
      var huadong=true;
    }
    this.Base.setMyData({
      scrollTop: e.scrollTop,
      huadong
    })
    
  }
  daoscroll(e){
    console.log(e)
    var cur = e.currentTarget.id;
    this.Base.setMyData({
      daohang:cur,
      huadong:true
    })
    var query = wx.createSelectorQuery().in(this);
    var that = this;
    console.log(query);
    query.select("#" + cur).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      console.log('res',res)
      for (var i = 0; i < res.length; i++) {
        if (res[i] != null) {
          if (cur == res[i].id) {
            wx.pageScrollTo({
              scrollTop: res[i].height-120,
              duration: 300,
            })
          }
        }

      }
    })
   
  }

  daoscroll1(e) {
    console.log(e)
    var cur = e.currentTarget.id;
    this.Base.setMyData({
      daohang: cur,
      huadong:true
    })
    var query = wx.createSelectorQuery().in(this);
    var that = this;
    console.log(query);
    query.select("#cddd").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      console.log('res', res)
      for (var i = 0; i < res.length; i++) {
        if (res[i] != null) {
          if ("cddd" == res[i].id) {
            wx.pageScrollTo({
              scrollTop: res[i].height-120,
              duration: 300,
            })
          }
        }

      }
    })

  }
  ziaxian(e){
    var cur = e.currentTarget.id;
    if(cur=='zx'){
      this.Base.setMyData({
        zaiimg: true
      })
    }else{
      this.Base.setMyData({
        rili: true
      })
    }
   
  }
  tapDayItem(e){
    console.log(e)
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.yuyue = content.yuyue;
body.getyuyue = content.getyuyue;
body.quedin = content.quedin;
body.quxiao = content.quxiao;
body.nameFn = content.nameFn;
body.onPageScroll = content.onPageScroll;
body.daoscroll = content.daoscroll;
body.ziaxian = content.ziaxian;
body.daoscroll1 = content.daoscroll1;
body.tapDayItem = content.tapDayItem;
Page(body)