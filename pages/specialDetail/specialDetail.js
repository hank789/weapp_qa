//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");
var albumUtil = require("../../utils/album.js");
var productUtil = require("../../utils/product.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: 1,
        list: [],
        userInfo: {},
        albumInfo: {},
        id: '',
        isMore: true,
        page: 1,
        // isShowAddOne: false,
        authUserPhone: false,
        isShowPopup: false,
        supportsList: [],
        supportData: {},
        showGood: false,
        index: 0,
        newsList: [],
        commentList: [],
        showPageMore: false,
        albumList: [],
        total: '',
        showCommentBox: false,
        inputContent: '',
        content: '',
        iconMenus: [
            {
                img: '../../images/icon2@3x.png',
                text: '生成朋友圈分享图'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        // 获取用户信息
        app.getUserInfo(function (userInfo) {
            that.setData({
                userInfo: userInfo,
                id: options.id
            });
            that.getProductList(1)
            that.getAlbumInfo()
            that.getSupportsList()
            that.getRecentNews(1)
            that.getCommentsList(1)
            that.getMoreAlbumList()
        });
        var roll = setInterval(function () {
            setRoll()
        }, 3300);

        function setRoll() {
            var list = that.data.supportsList
            var index = that.data.index
            if (list[index]) {
                that.setData({
                    supportData: list[index],
                    showGood: true,
                    index: index + 1
                })
            }
            setTimeout(() => {
                that.setData({
                    showGood: false,
                })
            }, 3200)
            if (index === list.length) {
                clearInterval(roll);
            }
        }
    },
    getAlbumInfo: function () {
        var that = this;
        albumUtil.getDetail(that.data.id, (data) => {
            that.setData({
                albumInfo: data
            })
        })
    },
    getProductList: function (page) {
        var that = this;
        albumUtil.getProductList(that.data.id, page, (res_data) => {
            var isMore = that.data.isMore;
            var nextPage = page + 1;
            if (page === 1) {
                that.data.list = res_data.data.data;
            } else {
                that.data.list = that.data.list.concat(res_data.data.data);
            }
            if (!res_data.data.next_page_url) {
                isMore = false;
            }

            that.setData({
                list: that.data.list,
                page: nextPage,
                isLoading: false,
                isMore: isMore
            });
        })
    },
    discoverDown: function (e) {
      if (!this.data.userInfo.mobile) {
        this.setData({
            authUserPhone: true,
            isShowPopup: true
        });
        return;
      }
      var that = this;
      var item = e.currentTarget.dataset.item
      var index = e.currentTarget.dataset.index
      productUtil.supportAlbumProduct(item.id, (res) => {
        var code = res.code
        var support = "list[" + index + "].can_support"
        if (code === 6120) {
          wx.showToast({
            title: '今天不能点赞了哦',
            icon: 'loading',
            duration: 1000
          })
          that.setData({
            [support]: 0
          })
          return
        }
        var up = "list[" + index + "].support_rate";
        var isShowAddOne = "list[" + index + "].isShowAddOne"
        that.setData({
          [up]: item.support_rate + 1,
          [isShowAddOne]: true
        })
        setTimeout(() => {
          that.setData({
            [isShowAddOne]: false
          })
        }, 1500)
      })
    },

    getSupportsList: function () {
        var that = this;
        albumUtil.getSupports(that.data.id, (res) => {
            that.setData({
                supportsList: res.data
            })
        })
    },
    goProductDetail (e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '../majorProduct/majorProduct?id=' + id
        });
    },
    getRecentNews: function (page) {
        var that = this
        albumUtil.getNewList(that.data.id, page, 5, (res) => {
            that.setData({
                newsList: res.data.data,
            });
        })
    },
    getCommentsList: function (page) {
        var that = this
        albumUtil.getComments(that.data.id, page, 3, (res) => {
            that.setData({
              commentList: res.data.data,
              total: res.data.total
            });
        })
    },
    getCommentList: function (page) {
        var that = this;
        albumUtil.getReviewCommentList('zzsyc', page, 3, (res) => {
            that.setData({
                commentList: res.data.data,
                total: res.data.total
            });
        })
    },
  getMoreAlbumList: function () {
    var that = this;
    albumUtil.getMoreAlbum(that.data.id, (res) => {
        that.setData({
          albumList: res.data
        });
      })
    },
    popup() {
        this.setData({
            showPageMore: true
        })
    },
    clickCancel() {
        this.setData({
            showPageMore: false
        })
    },

    clickItem(e) {
        console.log('ok')
        var that = this;
        var size = 1
        if (e.detail.key === '生成公众号文章分享图') {
            size = 2
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        });

        albumUtil.getShareImage(parseInt(that.data.id), size, (res) => {
            wx.hideLoading();
            wx.previewImage({
                current: res.data.url, // 当前显示图片的http链接
                urls: [res.data.url]
            })
            that.clickCancel()
        }, (res) => {
            that.clickCancel()
        })
    },

    onPullDownRefresh: function () {
        this.data.page = 1;
        this.getProductList(1);
        wx.stopPullDownRefresh();
    },

    onReachBottom: function () {
        if (this.data.isMore) {
            this.setData({
                isLoading: true
            });
            this.getProductList(this.data.page);
        }
    },

  seeMore: function (e) {
    wx.navigateTo({
      url: '../moreInfo/moreInfo?id=' + e.currentTarget.dataset.id + '&type=album'
    });
  },

  goDetail(e) {
    wx.navigateTo({
      url: '../specialDetail/specialDetail?id=' + e.currentTarget.dataset.id
    });
  },
  goTotalComment (e) {
    wx.navigateTo({
      url: '../totalComment/totalComment?id=' + e.currentTarget.dataset.id
    });
  },
  comment () {
    this.setData({
      showCommentBox: true
    })
  },

  bindCode(e) {
    this.setData({
      inputContent: e.detail
    })
  },

  submit() {
    var that = this
    request.httpsPostRequest('/weapp/product/commentAlbum', {
      id: this.data.albumInfo.id,
      body: this.data.inputContent,
      parent_id: '0'
    }, function (res) {
      // console.log(res);
      if (res.code === 1000) {
        that.setData({
          content: ''
        })
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 2000
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'loading',
          duration: 2000
        });
      }
    })
  },
})