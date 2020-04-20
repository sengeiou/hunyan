// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  ShangjiaApi
} from "../../apis/shangjia.api.js";
import {
  AliyunApi
} from "../../apis/aliyun.api.js";
var WxParse = require('../../wxParse/wxParse');
import {
  ApiUtil
} from "../../apis/apiutil.js";

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
      tian: false,
      focus: false,
      scrollTop: 0,
      daohang: 'sj',
      zaiimg: false,
      rili: false,
      huadong: false,
      scrtop: 200,
      zhan: false,
      isshare: this.Base.options.isshare
    })
  }
  onMyShow() {
    var that = this;
    var shangjiaapi = new ShangjiaApi();
    shangjiaapi.shangjiadetail({
      id: this.Base.options.id
    }, (detail) => {
      if (detail.biaoqian_id == 1 || detail.biaoqian_id == 7 || detail.biaoqian_id==13) {
        var arr = [{
          name: '场地',
          id: 'cd'
        }, {
            name: '菜单',
            id: 'cd2'
          },]
      }else {
        var arr = [{
          name: '详情',
          id: 'cd3'
        }, {
            name: '套餐',
          id: 'cd4'
        },]
      }
      detail.chandi = ApiUtil.HtmlDecode(detail.chandi);
      detail.caidan = ApiUtil.HtmlDecode(detail.caidan);
      detail.xiangqing = ApiUtil.HtmlDecode(detail.xiangqing);
      detail.taocan2 = ApiUtil.HtmlDecode(detail.taocan2);

      WxParse.wxParse('content', 'html', detail.chandi, that, 10);
      WxParse.wxParse('content2', 'html', detail.caidan, that, 10);
      WxParse.wxParse('content3', 'html', detail.xiangqing, that, 10);
      WxParse.wxParse('content4', 'html', detail.taocan2, that, 10);
      this.Base.setMyData({
        detail, arr
      })
    })
    this.getyuyue();
  }
  getyuyue() {
    var date = new Date();
    console.log(date.getTime());
    var year = date.getFullYear();
    var mon = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var today = year + '/' + mon + '/' + day + ' ' + '00:00:00';
    var todayw = year + '/' + mon + '/' + day + ' ' + '23:59:59';
    // console.log(today, 'today', todayw);
    var shangjiaapi = new ShangjiaApi();
    var arr = [];
    shangjiaapi.yuyuelist({
      // member_id:this.Base.getMyData().memberinfo.id,
    }, (yuyuelist) => {
      for (var i = 0; i < yuyuelist.length; i++) {
        yuyuelist[i].shijian = yuyuelist[i].shijian.replace(/-/g, '/');
        if (new Date(today).getTime() < new Date(yuyuelist[i].shijian).getTime() && new Date(todayw).getTime() > new Date(yuyuelist[i].shijian).getTime()) {
          arr.push(yuyuelist[i]);
        }
      }
      this.Base.setMyData({
        yuyuelist: arr
      })
    })
  }

  yuyue() {


    var rilis = AppBase.rili;
    var riqi = rilis.year + '/' + rilis.month + '/' + rilis.day
    console.log(riqi, 'rili', riqi);
    if (rilis.year == undefined) {
      this.toast('请选择查询日期');
      return
    }
    var yuyuelist = this.Base.getMyData().yuyuelist;
    var instinfo = this.Base.getMyData().instinfo;
    var detail = this.Base.getMyData().detail;
    if (detail.sendmsg == 'A') {
      var citymanager_id = detail.citymanager[0].id;
      var citymanager_phone = detail.citymanager[0].mobile;
    } else if (detail.sendmsg == 'B') {
      var i = (Math.random() * (detail.citymanager.length - 1)).toFixed(0);
      var citymanager_id = detail.citymanager[i].id;
      var citymanager_phone = detail.citymanager[0].mobile;
    } else {
      this.toast('当前商品不能预约，还没选择相应的城市管理员！');
      return
    }
    var that = this;
    var name = this.Base.getMyData().name;
    if (name == undefined || name.trim() == "") {
      this.toast('请输入您的姓名！');
      return
    }
    var mobile = this.Base.getMyData().mobile;
    if (mobile == undefined || mobile.trim() == "") {
      this.toast('请输入您的电话！');
      return
    }
    var shangjiaapi = new ShangjiaApi();
    var aliyunApi = new AliyunApi();
    aliyunApi.sendsms({
      phone: citymanager_phone,
      name: name,
      shanghu: detail.name,
      memphone: mobile
    }, (sendsms) => {
      shangjiaapi.yuyue({
        shanjia_id: this.Base.options.id,
        citymanager_id: citymanager_id,
        yuyueshijian: riqi,
        name: name,
        mobile: mobile
      }, (yuyue) => {
        console.log(yuyue)
        if (yuyue.code == '0') {
          wx.showToast({
            title: '发布成功',
          })
          that.getyuyue();
          that.Base.setMyData({
            focus: false,
            rili: false
          })
          return
        } else {
          that.toast('发布失败');
          that.Base.setMyData({
            focus: false,
            rili: false
          })
          return
        }

      })
    })


  }
  quedin() {
    this.Base.setMyData({
      tian: true,
      focus: true
    })
  }
  quxiao() {
    this.Base.setMyData({
      rili: false,
      focus: false,
      zaiimg: false
    })
  }
  nameFn(e) {
    this.Base.setMyData({
      name: e.detail.value
    })
  }
  mobileFn(e) {
    this.Base.setMyData({
      mobile: e.detail.value
    })
  }
  onPageScroll(e) {
    console.log(e);
    // var scrtop = this.Base.getMyData().scrtop;
    if (e.scrollTop < 240) {
      var huadong = false;
    } else {
      var huadong = true;
    }
    this.Base.setMyData({
      scrollTop: e.scrollTop,
      huadong
    })

  }
  daoscroll(e) {
    console.log(e)
    var cur = e.currentTarget.id;
    this.Base.setMyData({
      daohang: cur,
      huadong: true
    })

    var CustomBar = this.Base.getMyData().CustomBar;
    var StatusBar = this.Base.getMyData().StatusBar;
    console.log("CustomBar", CustomBar);
    console.log("CustomBar StatusBar", StatusBar);
    var query = wx.createSelectorQuery().in(this);
    var that = this;
    console.log(query);
    query.select("#" + cur).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      console.log('res', res)
      for (var i = 0; i < res.length; i++) {
        if (res[i] != null) {
          if (cur == res[i].id) {
            console.log("CustomBar StatusBar", res[i].height);
            wx.pageScrollTo({
              scrollTop: res[i].height - 130,
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
      huadong: true
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
              scrollTop: res[i].height - 130,
              duration: 300,
            })
          }
        }

      }
    })

  }
  ziaxian(e) {
    var cur = e.currentTarget.id;
    if (cur == 'zx') {
      this.Base.setMyData({
        zaiimg: true
      })
    } else {
      this.Base.setMyData({
        rili: true
      })
    }

  }
  tapDayItem(e) {
    console.log(e)
  }
  onShareAppMessage() {
    console.log(this.Base.getMyData().city)
    return {
      title: '',
      desc: '',
      path: '/pages/detail/detail?id=' + this.Base.options.id + '&isshare=1'
    }
  }
  zhankai() {
    var zhan = this.Base.getMyData().zhan;
    this.Base.setMyData({
      zhan: !zhan
    })
  }
  zhidin() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
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
body.mobileFn = content.mobileFn;
body.onShareAppMessage = content.onShareAppMessage;
body.zhankai = content.zhankai;
body.zhidin = content.zhidin;
Page(body)