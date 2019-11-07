window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Cell: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "76bdd60owVH4pw5zIauqL9Z", "Cell");
    "use strict";
    var GameData = require("GameData");
    cc.Class({
      extends: cc.Component,
      properties: {
        mIndexLabel: cc.Label,
        mImg: cc.Sprite,
        mNameLabel: cc.Label,
        mScoreLabel: cc.Label,
        mOpenId: {
          default: null,
          visible: false
        },
        mDepth: {
          default: 0,
          visible: false
        },
        mBack: [ cc.SpriteFrame ],
        mNameNode: cc.Node,
        mScoreNode: cc.Node
      },
      start: function start() {},
      init: function init(index, imgURL, name, depth, score, openid) {
        var _this = this;
        var bg = this.node.getComponent(cc.Sprite);
        bg.spriteFrame = this.mBack[index % 2];
        this.mIndexLabel.string = index;
        var image = wx.createImage();
        image.onload = function() {
          var texture = new cc.Texture2D();
          texture.initWithElement(image);
          texture.handleLoadedTexture();
          _this.mImg.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = imgURL;
        if (openid === GameData.instance.openId) {
          this.mNameNode.color = cc.color(255, 215, 0, 255);
          this.mScoreNode.color = cc.color(255, 215, 0, 255);
        } else {
          this.mNameNode.color = cc.color(255, 255, 255, 255);
          this.mScoreNode.color = cc.color(255, 255, 255, 255);
        }
        this.mNameLabel.string = name;
        this.mDepth = depth;
        this.mScoreLabel.string = score;
        this.mOpenId = openid;
      }
    });
    cc._RF.pop();
  }, {
    GameData: "GameData"
  } ],
  GameData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a4088K8L65KaYRJ6k5c71R/", "GameData");
    "use strict";
    var GameData = cc.Class({
      extends: cc.Component,
      statics: {
        instance: null
      },
      properties: {
        openId: 0,
        maxScore: 0,
        maxDepth: 0,
        friendData: [],
        isDataDirty: false,
        isDisplayDirty: false
      }
    });
    GameData.instance = new GameData();
    module.exports = GameData;
    cc._RF.pop();
  }, {} ],
  List: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ec221wJw31OwJ4fJ8Ruulbq", "List");
    "use strict";
    var GameData = require("GameData");
    cc.Class({
      extends: cc.Component,
      properties: {
        mPool: {
          default: null,
          visible: false
        },
        mCell: cc.Prefab
      },
      start: function start() {
        null === this.mPool && (this.mPool = new cc.NodePool());
      },
      createRankItem: function createRankItem(index, imgURL, name, depth, score, openid) {
        var cellNode = this.mPool.get();
        cellNode || (cellNode = cc.instantiate(this.mCell));
        var cell = cellNode.getComponent("Cell");
        cell.init(index + 1, imgURL, name, depth, score, openid);
        cellNode.y = -50 - 76 * index;
        this.node.addChild(cellNode);
      },
      cleanAllCell: function cleanAllCell() {
        var children = this.node.children;
        for (var index = 0; index < children.length; index++) {
          var cell = children[index];
          this.mPool.put(cell);
        }
      },
      UpdateRankList: function UpdateRankList() {
        var self = this;
        this.cleanAllCell();
        for (var index = 0; index < GameData.instance.friendData.length; index++) {
          var data = GameData.instance.friendData[index];
          self.createRankItem(index, data.avatarUrl, data.nickname, data.KVDataList[0].value, data.KVDataList[1].value, data.openid);
        }
      },
      update: function update(dt) {
        if (GameData.instance.isDisplayDirty) {
          this.UpdateRankList();
          GameData.instance.isDisplayDirty = false;
        }
      }
    });
    cc._RF.pop();
  }, {
    GameData: "GameData"
  } ],
  wxOpenData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7ccc4NeCYpMwqlFkkXeUKA1", "wxOpenData");
    "use strict";
    var GameData = require("GameData");
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {
        var _this = this;
        wx.onMessage(function(data) {
          switch (data.message) {
           case "SetOpenId":
            GameData.instance.openId = data.openid;
            GameData.instance.isDataDirty = true;

           case "UploadGameData":
            _this.UploadGameData(data.score, data.depth);
          }
        });
      },
      UploadGameData: function UploadGameData(score, depth) {
        var maxScore = Math.max(score, GameData.instance.maxScore);
        var maxDepth = Math.max(depth, GameData.instance.maxDepth);
        if (maxScore > GameData.instance.maxScore || maxDepth > GameData.instance.maxDepth) {
          GameData.instance.maxScore = maxScore;
          GameData.instance.maxDepth = maxDepth;
          wx.setUserCloudStorage({
            KVDataList: [ {
              key: "depth",
              value: "" + GameData.instance.maxDepth
            }, {
              key: "score",
              value: "" + GameData.instance.maxScore
            } ],
            success: function success() {
              console.log("\u4e0a\u4f20\u6210\u529f!");
              GameData.instance.isDataDirty = true;
            }
          });
        }
      },
      GetUserGameData: function GetUserGameData() {
        wx.getUserCloudStorage({
          keyList: [ "depth", "score" ],
          success: function success(res) {
            console.log("\u4e0b\u8f7d\u73a9\u5bb6\u6e38\u620f\u6570\u636e\u6210\u529f!");
            if (res.KVDataList.length > 0) {
              GameData.instance.maxDepth = res.KVDataList[0].value;
              GameData.instance.maxScore = res.KVDataList[1].value;
            }
          }
        });
      },
      GetFriendGameData: function GetFriendGameData() {
        var self = this;
        wx.getFriendCloudStorage({
          keyList: [ "depth", "score" ],
          success: function success(res) {
            console.log("\u4e0b\u8f7d\u597d\u53cb\u6e38\u620f\u6570\u636e\u6210\u529f!");
            GameData.instance.friendData = res.data;
            self.SortFriendGameData();
            GameData.instance.isDisplayDirty = true;
          }
        });
      },
      SortFriendGameData: function SortFriendGameData() {
        var compareScore = function compareScore(x, y) {
          2 !== x.KVDataList.length && (x.KVDataList = [ {
            key: "depth",
            value: "0"
          }, {
            key: "score",
            value: "0"
          } ]);
          2 !== y.KVDataList.length && (y.KVDataList = [ {
            key: "depth",
            value: "0"
          }, {
            key: "score",
            value: "0"
          } ]);
          var value1 = parseInt(x.KVDataList[0].value);
          var value2 = parseInt(y.KVDataList[0].value);
          if (!value1 || !value2) return -1;
          if (value1 <= value2) return 1;
          if (value1 > value2) return -1;
        };
        GameData.instance.friendData.sort(compareScore);
      },
      update: function update(dt) {
        if (GameData.instance.isDataDirty) {
          this.GetUserGameData();
          this.GetFriendGameData();
          GameData.instance.isDataDirty = false;
        }
      }
    });
    cc._RF.pop();
  }, {
    GameData: "GameData"
  } ]
}, {}, [ "Cell", "GameData", "List", "wxOpenData" ]);
//# sourceMappingURL=project.dev.js.map
