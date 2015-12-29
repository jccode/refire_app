(function() {
  angular.module('app', ['ionic', 'ngCookies', 'ngCordova', 'ngResource', 'gettext', 'ngStorage', 'permission', 'base64', 'ngMessages', 'angularMoment', 'ksSwiper', 'chart.js', 'ionic-datepicker']);

}).call(this);

(function() {
  var Bootstrap;

  Bootstrap = (function() {
    function Bootstrap($ionicPlatform, $http, $rootScope, auth, event) {
      var auth_header;
      $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          return StatusBar.styleDefault();
        }
      });
      auth_header = function(user) {
        return $http.defaults.headers.common['Authorization'] = 'Token ' + user.token;
      };
      auth_header(auth.user);
      $rootScope.$on(event.LOGIN, (function(_this) {
        return function(event, user) {
          return auth_header(user);
        };
      })(this));
      $rootScope.$on(event.SIGNUP, (function(_this) {
        return function(event, user) {
          return auth_header(user);
        };
      })(this));
      $rootScope.$on(event.LOGOUT, (function(_this) {
        return function(event) {
          return $http.defaults.headers.common['Authorization'] = void 0;
        };
      })(this));
    }

    return Bootstrap;

  })();

  angular.module('app').run(['$ionicPlatform', '$http', '$rootScope', 'Auth', 'event', Bootstrap]);

}).call(this);

(function() {
  angular.module('app').constant({
    'userRoles': {
      user: 'user',
      admin: 'admin'
    },
    'event': {
      LOGIN: 'login',
      LOGOUT: 'logout',
      SIGNUP: 'signup'
    },
    'storageKey': {
      PAY_STEP_SEQNO: 'pay_step_seqno',
      PAY_BUS_LINE: 'pay_bus_line',
      TICKETS: 'tickets',
      SIGNUP_USER: 'signup_user'
    }
  });

}).call(this);

(function() {
  var I18N;

  I18N = (function() {
    function I18N(gettextCatalog) {
      gettextCatalog.setCurrentLanguage('zh');
    }

    return I18N;

  })();

  angular.module('app').run(['gettextCatalog', I18N]);

}).call(this);

(function() {
  var Roles;

  Roles = (function() {
    function Roles(Permission, $rootScope, auth, roles) {
      var declare_roles;
      declare_roles = [roles.user, roles.admin];
      Permission.defineManyRoles(declare_roles, function(stateParams, roleName) {
        return auth.authorize(roleName);
      });
    }

    return Roles;

  })();

  angular.module('app').run(['Permission', '$rootScope', 'Auth', 'userRoles', Roles]);

}).call(this);

(function() {
  var Config;

  Config = (function() {
    function Config($stateProvider, $urlRouterProvider, roles) {
      $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      }).state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      }).state('app.home.energy', {
        url: '/energy',
        templateUrl: 'templates/home/energy.html'
      }).state('app.home.video', {
        url: '/video/:type',
        templateUrl: 'templates/home/video.html',
        controller: 'VideoCtrl'
      }).state('app.home.tree', {
        url: '/tree',
        templateUrl: 'templates/home/tree.html'
      }).state('app.buslocation', {
        url: '/buslocation',
        views: {
          'menuContent': {
            templateUrl: 'templates/bus_location.html',
            controller: 'BuslocationCtrl as ctrl'
          }
        }
      }).state('app.busoverview', {
        url: '/busoverview',
        views: {
          'menuContent': {
            templateUrl: 'templates/bus_overview.html'
          }
        }
      }).state('app.health', {
        url: '/health/:type',
        views: {
          'menuContent': {
            templateUrl: 'templates/health.html',
            controller: 'HealthCtrl'
          }
        }
      }).state('app.pay', {
        url: '/pay',
        views: {
          'menuContent': {
            templateUrl: 'templates/pay.html',
            controller: 'PayCtrl as ctrl'
          }
        },
        data: {
          permissions: {
            only: [roles.user]
          }
        }
      }).state('app.pay-confirm', {
        url: '/pay-confirm/:type',
        views: {
          'menuContent': {
            templateUrl: 'templates/pay-confirm.html',
            controller: 'PayConfirmCtrl as ctrl'
          }
        }
      }).state('app.tickets', {
        url: '/tickets',
        views: {
          'menuContent': {
            templateUrl: 'templates/tickets.html',
            controller: 'TicketsCtrl'
          }
        },
        data: {
          permissions: {
            only: [roles.user]
          }
        }
      }).state('app.rewards', {
        url: '/rewards',
        views: {
          'menuContent': {
            templateUrl: 'templates/rewards.html'
          }
        },
        data: {
          permissions: {
            only: [roles.user]
          }
        }
      }).state('app.statistics', {
        url: '/statistics',
        views: {
          'menuContent': {
            templateUrl: 'templates/statistics.html'
          }
        },
        data: {
          permissions: {
            only: [roles.user]
          }
        }
      }).state('app.messages', {
        url: '/messages',
        views: {
          'menuContent': {
            templateUrl: 'templates/messages.html',
            controller: 'MessageCtrl'
          }
        }
      }).state('app.setting', {
        url: '/setting',
        views: {
          'menuContent': {
            templateUrl: 'templates/setting.html'
          }
        },
        data: {
          permissions: {
            only: [roles.user]
          }
        }
      }).state('app.aboutme', {
        url: '/aboutme',
        views: {
          'menuContent': {
            templateUrl: 'templates/aboutme.html'
          }
        }
      }).state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html'
          }
        },
        data: {
          permissions: {
            only: [roles.user]
          }
        }
      }).state('app.signup', {
        url: '/signup',
        views: {
          'menuContent': {
            templateUrl: 'templates/signup.html',
            controller: 'SignupCtrl as ctrl'
          }
        }
      }).state('app.smsverify', {
        url: '/sms',
        views: {
          'menuContent': {
            templateUrl: 'templates/sms.html',
            controller: 'SmsCtrl as ctrl'
          }
        }
      }).state('app.createprofile', {
        url: '/createprofile',
        views: {
          'menuContent': {
            templateUrl: 'templates/newprofile.html',
            controller: 'NewProfileCtrl as ctrl'
          }
        }
      }).state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      }).state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      }).state('app.test', {
        url: '/test',
        views: {
          'menuContent': {
            templateUrl: 'templates/test.html',
            controller: 'TestCtrl as ctrl'
          }
        }
      }).state('app.test-native', {
        url: '/native',
        views: {
          'menuContent': {
            templateUrl: 'templates/native-test.html',
            controller: 'NativeTestCtrl as ctrl'
          }
        }
      }).state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html'
          }
        }
      });
      $urlRouterProvider.otherwise('/app/home/energy');
    }

    return Config;

  })();

  angular.module('app').config(['$stateProvider', '$urlRouterProvider', 'userRoles', Config]);

}).call(this);

(function() {
  angular.module('app').constant({
    'settings': {
      baseurl: 'http://112.74.93.116',
      apiurl: 'http://112.74.93.116/api'
    }
  });

}).call(this);

(function() {
  var Ajax;

  Ajax = (function() {
    function Ajax($httpProvider, $resourceProvider) {
      var serialize;
      serialize = function(obj) {
        return Object.keys(obj).reduce(function(a, k) {
          a.push(k + '=' + encodeURIComponent(obj[k]));
          return a;
        }, []).join('&');
      };
      $httpProvider.defaults.withCredentials = true;
      $httpProvider.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest";
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      $httpProvider.defaults.transformRequest = [
        (function(_this) {
          return function(data) {
            if (angular.isObject(data) && String(data) !== '[Object File]') {
              return serialize(data);
            } else {
              return data;
            }
          };
        })(this)
      ];
      $resourceProvider.defaults.stripTrailingSlashes = false;
    }

    return Ajax;

  })();

  angular.module('app').config(['$httpProvider', '$resourceProvider', Ajax]);

}).call(this);

(function() {
  var AppCtrl;

  AppCtrl = (function() {
    function AppCtrl($scope, $rootScope, $state, $ionicModal, $ionicPopup, $timeout, auth, $ionicHistory, gettext, gettextCatalog, Util) {
      var self;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$ionicModal = $ionicModal;
      this.$ionicPopup = $ionicPopup;
      this.$timeout = $timeout;
      this.auth = auth;
      this.$ionicHistory = $ionicHistory;
      this.gettext = gettext;
      this.gettextCatalog = gettextCatalog;
      this.Util = Util;
      this.loginModal();
      this.permissionCheck();
      this.$scope.loginData = {};
      self = this;
      this.$scope.doLogin = (function(_this) {
        return function() {
          return _this.auth.login(_this.$scope.loginData, function(user) {
            _this.$ionicHistory.nextViewOptions({
              disableBack: true
            });
            if (_this.forward) {
              _this.$state.go(_this.forward.name);
            }
            _this.$scope.closeLogin();
            return _this.Util.toast(_this.gettextCatalog.getString('login success'));
          }, function(e) {
            return _this.Util.toast((_this.gettextCatalog.getString('login failed')) + "." + (JSON.stringify(e)));
          });
        };
      })(this);
      this.$scope.logout = (function(_this) {
        return function() {
          _this.auth.logout();
          _this.Util.toast("" + (_this.gettextCatalog.getString('logout successful')));
          _this.$ionicHistory.nextViewOptions({
            disableBack: true
          });
          return _this.$state.go('app.playlists');
        };
      })(this);
      this.$scope.signup = (function(_this) {
        return function() {
          _this.$scope.closeLogin();
          _this.$ionicHistory.nextViewOptions({
            disableBack: true
          });
          return _this.$state.go('app.signup');
        };
      })(this);
    }

    AppCtrl.prototype.loginModal = function() {
      this.$ionicModal.fromTemplateUrl('templates/login.html', {
        scope: this.$scope
      }).then((function(_this) {
        return function(modal) {
          return _this.modal = modal;
        };
      })(this));
      this.$scope.closeLogin = (function(_this) {
        return function() {
          return _this.modal.hide();
        };
      })(this);
      return this.$scope.login = (function(_this) {
        return function() {
          return _this.modal.show();
        };
      })(this);
    };

    AppCtrl.prototype.permissionCheck = function() {
      var loginRequireHandler;
      this.$scope.$on("$stateChangePermissionDenied", (function(_this) {
        return function(toState, toParams) {
          if (!_this.auth.isLoggedIn()) {
            _this.forward = toParams;
            return _this.$scope.login();
          } else {
            return _this.$ionicPopup.alert({
              title: _this.gettextCatalog.getString('Permission denied'),
              template: _this.gettextCatalog.getString('You don\'t have permission to view this page.')
            });
          }
        };
      })(this));
      loginRequireHandler = (function(_this) {
        return function(response) {
          _this.forward = null;
          return _this.$scope.login();
        };
      })(this);
      this.$scope.$on("error:403", loginRequireHandler);
      return this.$scope.$on("error:401", loginRequireHandler);
    };

    return AppCtrl;

  })();

  angular.module('app').controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicPopup', '$timeout', 'Auth', '$ionicHistory', 'gettext', 'gettextCatalog', 'Util', AppCtrl]);

}).call(this);

(function() {
  var BuslocationCtrl;

  BuslocationCtrl = (function() {
    function BuslocationCtrl($scope, $q, $cordovaGeolocation) {
      var height;
      this.$scope = $scope;
      this.$q = $q;
      this.$cordovaGeolocation = $cordovaGeolocation;
      height = document.getElementById("maplocation").offsetHeight;
      document.getElementById("map").style.height = height + "px";
      this.get_current_pos().then((function(_this) {
        return function(pos) {
          _this.currpos = pos;
          _this.init_map(_this.currpos);
          _this.simulate_bus_pos(pos);
          return _this.show_route();
        };
      })(this));
    }

    BuslocationCtrl.prototype.init_map = function(pos) {
      this.map = new BMap.Map("map");
      return this.map.centerAndZoom(new BMap.Point(pos.longitude, pos.latitude), 12);
    };

    BuslocationCtrl.prototype.simulate_bus_pos = function(pos) {
      this.buspos = {
        longitude: pos.longitude + Math.random() / 10,
        latitude: pos.latitude + Math.random() / 10
      };
      return this.buspos;
    };

    BuslocationCtrl.prototype.show_positions = function(positions) {
      var eicon, end, endLabel, sicon, start, startLabel;
      start = positions[0], end = positions[1];
      start.title = "Your position";
      end.title = "M474 5 mins";
      start.marker.setTitle("Your position");
      end.marker.setTitle("M474 5 mins");
      startLabel = new BMap.Label("YOUR POSITION", {
        offset: new BMap.Size(-25, -50)
      });
      endLabel = new BMap.Label("M474<br> 5 mins", {
        offset: new BMap.Size(-25, -50)
      });
      this.set_label_style(startLabel, '#339966');
      this.set_label_style(endLabel, '#0099ff');
      start.marker.setLabel(startLabel);
      end.marker.setLabel(endLabel);
      sicon = new BMap.Icon("http://api0.map.bdimg.com/images/marker_red_sprite.png", new BMap.Size(39, 25));
      start.marker.setIcon(sicon);
      eicon = new BMap.Icon("img/bus.png", {
        offset: new BMap.Size(32, 32)
      });
      return end.marker.setIcon(eicon);
    };

    BuslocationCtrl.prototype.set_label_style = function(label, bgColor) {
      return label.setStyle({
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '12px',
        background: bgColor,
        border: 'none',
        borderRadius: "8px",
        padding: '10px',
        width: '80px',
        height: '50px',
        whiteSpace: 'normal',
        textAlign: 'center'
      });
    };

    BuslocationCtrl.prototype.show_route = function() {
      var driving, p1, p2;
      p1 = new BMap.Point(this.currpos.longitude, this.currpos.latitude);
      p2 = new BMap.Point(this.buspos.longitude, this.buspos.latitude);
      driving = new BMap.DrivingRoute(this.map, {
        renderOptions: {
          map: this.map,
          autoViewport: true
        },
        policy: 0,
        onMarkersSet: this.show_positions.bind(this)
      });
      return driving.search(p1, p2);
    };

    BuslocationCtrl.prototype.get_current_pos = function() {
      var defer, fallback_pos, posOptions;
      posOptions = {
        timeout: 3000,
        enableHighAccuracy: true
      };
      fallback_pos = {
        longitude: 116.404,
        latitude: 39.915
      };
      defer = this.$q.defer();
      this.$cordovaGeolocation.getCurrentPosition(posOptions).then(function(pos) {
        return defer.resolve(pos.coords);
      }, function(err) {
        console.log('Fail to get current postion. Use fallback postion instead.');
        return defer.resolve(fallback_pos);
      });
      return defer.promise;
    };

    return BuslocationCtrl;

  })();

  angular.module('app').controller('BuslocationCtrl', ['$scope', '$q', '$cordovaGeolocation', BuslocationCtrl]);

}).call(this);

(function() {
  var HealthCtrl;

  HealthCtrl = (function() {
    function HealthCtrl($scope, $stateParams) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$scope.type = this.$stateParams.type;
      this.init_chart();
      this.$scope.onTabSelect = (function(_this) {
        return function(type) {
          return _this.$scope.type = type;
        };
      })(this);
    }

    HealthCtrl.prototype.init_chart = function() {
      var i, j, results;
      this.$scope.labels = (function() {
        results = [];
        for (j = 1; j <= 30; j++){ results.push(j); }
        return results;
      }).apply(this);
      this.$scope.series = ['Series A'];
      this.$scope.data = [
        (function() {
          var k, len, ref, results1;
          ref = this.$scope.labels;
          results1 = [];
          for (k = 0, len = ref.length; k < len; k++) {
            i = ref[k];
            results1.push(Math.round(Math.random() * 100));
          }
          return results1;
        }).call(this)
      ];
      console.log(this.$scope.labels);
      console.log(this.$scope.data);
      return this.$scope.onClick = function(points, evt) {
        return console.log(points, evt);
      };
    };

    return HealthCtrl;

  })();

  angular.module('app').controller('HealthCtrl', ['$scope', '$stateParams', HealthCtrl]);

}).call(this);

(function() {
  var HomeCtrl;

  HomeCtrl = (function() {
    function HomeCtrl($scope, $ionicSideMenuDelegate, $state) {
      this.$scope = $scope;
      this.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
      this.$state = $state;
      this.$scope.onReadySwiper = (function(_this) {
        return function(swiper) {
          window.swiper = swiper;
          return swiper.on("tap", function(swiper) {
            var idx, item, param, state, url;
            idx = swiper.clickedIndex;
            item = swiper.slides[idx];
            url = item.getAttribute("href");
            state = item.getAttribute('data-state');
            param = item.getAttribute('data-param');
            return _this.$state.go(state, param && JSON.parse(param) || {});
          });
        };
      })(this);
    }

    return HomeCtrl;

  })();

  angular.module('app').controller('HomeCtrl', ['$scope', '$ionicSideMenuDelegate', '$state', HomeCtrl]);

}).call(this);

(function() {
  var MessageCtrl;

  MessageCtrl = (function() {
    function MessageCtrl($scope, Message) {
      this.$scope = $scope;
      this.Message = Message;
      this.$scope.messages = this.Message.all();
    }

    return MessageCtrl;

  })();

  angular.module('app').controller('MessageCtrl', ['$scope', 'Message', MessageCtrl]);

}).call(this);

(function() {
  var NativeTestCtrl;

  NativeTestCtrl = (function() {
    function NativeTestCtrl($scope, settings, $ionicPopup, Util, $cordovaDevice, $cordovaToast, $cordovaLocalNotification, $cordovaImagePicker, $cordovaFileTransfer) {
      this.$scope = $scope;
      this.settings = settings;
      this.$ionicPopup = $ionicPopup;
      this.Util = Util;
      this.$cordovaDevice = $cordovaDevice;
      this.$cordovaToast = $cordovaToast;
      this.$cordovaLocalNotification = $cordovaLocalNotification;
      this.$cordovaImagePicker = $cordovaImagePicker;
      this.$cordovaFileTransfer = $cordovaFileTransfer;
      this.deviceInfo();
      this.toast();
      this.localNotification();
      this.imagePicker();
    }

    NativeTestCtrl.prototype.imagePicker = function() {
      var options;
      this.$scope.imgloaded = false;
      options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 90
      };
      this.$scope.get_pictures = (function(_this) {
        return function() {
          return _this.$cordovaImagePicker.getPictures(options).then(function(results) {
            console.log('img url:', JSON.stringify(results));
            _this.$scope.imgurl = results[0];
            return _this.$scope.imgloaded = true;
          }, function(error) {
            return this.$ionicPopup.alert(JSON.stringify(error));
          });
        };
      })(this);
      return this.$scope.upload_img = (function(_this) {
        return function() {
          var name, path, upload_options;
          path = _this.$scope.imgurl;
          name = path.substring(path.lastIndexOf('/') + 1);
          upload_options = {
            fileKey: 'file',
            fileName: name,
            params: {
              name: name
            }
          };
          return _this.$cordovaFileTransfer.upload(_this.settings.apiurl + '/upload', path, upload_options).then(function(result) {
            console.log('upload success! ', JSON.stringify(result));
            return this.Util.toast('upload success! ' + JSON.stringify(result));
          }, function(err) {
            console.log('upload failed! ', JSON.stringify(err));
            return this.Util.toast('upload failed! ' + JSON.stringify(result));
          });
        };
      })(this);
    };

    NativeTestCtrl.prototype.deviceInfo = function() {
      return this.$scope.retrieve_device = (function(_this) {
        return function() {
          return _this.$scope.device = {
            device: _this.$cordovaDevice.getDevice(),
            cordova: _this.$cordovaDevice.getCordova(),
            model: _this.$cordovaDevice.getModel(),
            platform: _this.$cordovaDevice.getPlatform(),
            uuid: _this.$cordovaDevice.getUUID(),
            version: _this.$cordovaDevice.getVersion()
          };
        };
      })(this);
    };

    NativeTestCtrl.prototype.deviceInfo_stub = function() {
      return this.$scope.device = {
        device: 'iphone',
        cordova: 'cordova 1.6',
        model: '6S-plus',
        platform: 'iOS',
        uuid: 'xxxx-yyyy-zzzz',
        version: '6.0'
      };
    };

    NativeTestCtrl.prototype.toast = function() {
      var toast;
      toast = (function(_this) {
        return function(duration, position) {
          return _this.$cordovaToast.show("Here is a message", duration, position).then(function(success) {
            return console.log("success: " + success);
          }, function(error) {
            return console.log("error: " + error);
          });
        };
      })(this);
      this.$scope.toast_sb = function() {
        return toast("short", "bottom");
      };
      this.$scope.toast_lc = function() {
        return toast("long", "center");
      };
      return this.$scope.toast_st = function() {
        return toast("short", "top");
      };
    };

    NativeTestCtrl.prototype.localNotification = function() {
      this.$scope.scheduleSingleNotification = (function(_this) {
        return function() {
          return _this.$cordovaLocalNotification.schedule({
            id: 1,
            title: 'Hello',
            text: 'Hello ionic',
            data: {
              customProperty: 'custom value'
            }
          }).then(function(result) {
            return console.log('[local notification]' + result);
          });
        };
      })(this);
      this.$scope.scheduleMultipleNotifications = (function(_this) {
        return function() {
          return _this.$cordovaLocalNotification.schedule([
            {
              id: 1,
              title: 'Title 1',
              text: 'text 1',
              data: {
                customProperty: 'custom 1 value'
              }
            }, {
              id: 2,
              title: 'Title 2',
              text: 'text 2',
              data: {
                customProperty: 'custom 2 value'
              }
            }
          ]).then(function(result) {
            return console.log('[local notification]' + result);
          });
        };
      })(this);
      this.$scope.updateSingleNotification = (function(_this) {
        return function() {
          return _this.$cordovaLocalNotification.update({
            id: 1,
            title: 'Hello - UPDATED',
            text: 'Hello ionic - UPDATED'
          }).then(function(result) {
            return console.log('[local notification]' + result);
          });
        };
      })(this);
      return this.$scope.cancelAllNotifications = (function(_this) {
        return function() {
          return _this.$cordovaLocalNotification.cancelAll().then(function(result) {
            return console.log('[local notification]' + result);
          });
        };
      })(this);
    };

    return NativeTestCtrl;

  })();

  angular.module('app').controller('NativeTestCtrl', ['$scope', 'settings', '$ionicPopup', 'Util', '$cordovaDevice', '$cordovaToast', '$cordovaLocalNotification', '$cordovaImagePicker', '$cordovaFileTransfer', NativeTestCtrl]);

}).call(this);

(function() {
  var NewProfileCtrl;

  NewProfileCtrl = (function() {
    function NewProfileCtrl($scope, $state) {
      this.$scope = $scope;
      this.$state = $state;
      console.log('new profile ctrl');
    }

    return NewProfileCtrl;

  })();

  angular.module('app').controller('NewProfileCtrl', ['$scope', '$state', NewProfileCtrl]);

}).call(this);

(function() {
  var PayConfirmCtrl;

  PayConfirmCtrl = (function() {
    function PayConfirmCtrl($scope, $state, $stateParams, $localStorage, $sessionStorage, storageKey, $ionicHistory) {
      var type;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$localStorage = $localStorage;
      this.$sessionStorage = $sessionStorage;
      this.storageKey = storageKey;
      this.$ionicHistory = $ionicHistory;
      type = this.$stateParams.type;
      this.pay_method_logo = type === "1" ? 'img/wechat.png' : 'img/alipay.png';
      this.step = this.$sessionStorage[this.storageKey.PAY_STEP_SEQNO] + 1;
      this.tickets = this.$localStorage[this.storageKey.TICKETS] || [];
    }

    PayConfirmCtrl.prototype.pay = function() {
      this.tickets.push({
        line: this.$sessionStorage[this.storageKey.PAY_BUS_LINE],
        timestamp: moment().format('YYYY-MM-DD HH:mm')
      });
      this.$localStorage[this.storageKey.TICKETS] = this.tickets;
      this.$ionicHistory.nextViewOptions({
        disableBack: true
      });
      return this.$state.go('app.tickets');
    };

    PayConfirmCtrl.prototype.cancel = function() {
      return history.back();
    };

    return PayConfirmCtrl;

  })();

  angular.module('app').controller('PayConfirmCtrl', ['$scope', '$state', '$stateParams', '$localStorage', '$sessionStorage', 'storageKey', '$ionicHistory', PayConfirmCtrl]);

}).call(this);

(function() {
  var PayCtrl;

  PayCtrl = (function() {
    function PayCtrl($scope, $state, $localStorage, $sessionStorage, storageKey) {
      var defaultVal;
      this.$scope = $scope;
      this.$state = $state;
      this.$localStorage = $localStorage;
      this.$sessionStorage = $sessionStorage;
      this.storageKey = storageKey;
      this.$scope.ibeacon_detected = false;
      this.$scope.step = this.$scope.ibeacon_detected ? 1 : 2;
      this.busline = 'M474';
      defaultVal = {};
      defaultVal[this.storageKey.PAY_BUS_LINE] = this.busline;
      this.storage = this.$sessionStorage.$default(defaultVal);
      this.storage[this.storageKey.PAY_STEP_SEQNO] = this.$scope.step;
      this.$scope.pay_confirm = (function(_this) {
        return function(state) {
          _this.storage[_this.storageKey.PAY_BUS_LINE] = _this.busline;
          return _this.$state.go('app.pay-confirm', {
            type: state
          });
        };
      })(this);
    }

    return PayCtrl;

  })();

  angular.module('app').controller('PayCtrl', ['$scope', '$state', '$localStorage', '$sessionStorage', 'storageKey', PayCtrl]);

}).call(this);

(function() {
  var PlaylistsCtrl;

  PlaylistsCtrl = (function() {
    function PlaylistsCtrl($scope) {
      $scope.playlists = [
        {
          title: 'Reggae',
          id: 1
        }, {
          title: 'Chill',
          id: 2
        }, {
          title: 'Dubstep',
          id: 3
        }, {
          title: 'Indie',
          id: 4
        }, {
          title: 'Rap',
          id: 5
        }, {
          title: 'Cowbell',
          id: 6
        }
      ];
    }

    return PlaylistsCtrl;

  })();

  angular.module('app').controller('PlaylistsCtrl', ['$scope', PlaylistsCtrl]);

}).call(this);

(function() {
  var PlaylistCtrl;

  PlaylistCtrl = (function() {
    function PlaylistCtrl($scope, $stateParams) {}

    return PlaylistCtrl;

  })();

  angular.module('app').controller('PlaylistCtrl', ['$scope', '$stateParams', PlaylistCtrl]);

}).call(this);

(function() {
  var SignupCtrl;

  SignupCtrl = (function() {
    function SignupCtrl($scope, $state, $sessionStorage, User, auth, storageKey) {
      this.$scope = $scope;
      this.$state = $state;
      this.$sessionStorage = $sessionStorage;
      this.User = User;
      this.auth = auth;
      this.storageKey = storageKey;
    }

    SignupCtrl.prototype.signup = function(form) {
      if (form.$valid) {
        console.log(this.user);
        return this.auth.signup(this.user, function(user) {
          console.log('signup success');
          return console.log(user);
        }, function(err) {
          console.log('signup error');
          return console.log(err);
        });
      }
    };

    SignupCtrl.prototype.verify = function(form) {
      if (form.$valid) {
        console.log(this.user);
        this.$sessionStorage[this.storageKey.SIGNUP_USER] = this.user;
        return this.$state.go('app.smsverify');
      }
    };

    return SignupCtrl;

  })();

  angular.module('app').controller('SignupCtrl', ['$scope', '$state', '$sessionStorage', 'User', 'Auth', 'storageKey', SignupCtrl]);

}).call(this);

(function() {
  var SmsCtrl;

  SmsCtrl = (function() {
    function SmsCtrl($scope, $state) {
      this.$scope = $scope;
      this.$state = $state;
      console.log('SmsCtrl');
    }

    SmsCtrl.prototype.verify = function() {
      return this.$state.go('app.createprofile');
    };

    return SmsCtrl;

  })();

  angular.module('app').controller('SmsCtrl', ['$scope', '$state', SmsCtrl]);

}).call(this);

(function() {
  var TestCtrl;

  TestCtrl = (function() {
    function TestCtrl($scope, $ionicPopover, $ionicHistory, $state, $rootScope, user, sms) {
      this.$scope = $scope;
      this.$ionicPopover = $ionicPopover;
      this.$ionicHistory = $ionicHistory;
      this.$state = $state;
      this.$rootScope = $rootScope;
      this.user = user;
      this.sms = sms;
      this.initPopover();
      this.$scope.get_users = (function(_this) {
        return function() {
          return _this.$scope.users = _this.user.all();
        };
      })(this);
      this.initSms();
    }

    TestCtrl.prototype.initSms = function() {
      this.$scope.wating_sms = false;
      return this.$scope.send_sms = (function(_this) {
        return function(phone) {
          if (!_this.$scope.wating_sms) {
            console.log(phone);
            _this.$scope.wating_sms = true;
            return _this.sms.send(phone).then(function(ret) {
              return console.log(ret);
            }, function(err) {
              console.log(err);
              return _this.$scope.wating_sms = false;
            });
          }
        };
      })(this);
    };

    TestCtrl.prototype.initPopover = function() {
      this.$scope.popover = this.$ionicPopover.fromTemplateUrl('templates/action_more.html', {
        scope: this.$scope
      }).then((function(_this) {
        return function(popover) {
          return _this.$scope.popover = popover;
        };
      })(this));
      this.$scope.openPopover = (function(_this) {
        return function($event) {
          return _this.$scope.popover.show($event);
        };
      })(this);
      this.$scope.closePopover = (function(_this) {
        return function() {
          return _this.$scope.popover.hide();
        };
      })(this);
      this.$scope.$on('$destroy', (function(_this) {
        return function() {
          return _this.$scope.popover.remove();
        };
      })(this));
      this.$scope.actionMore = (function(_this) {
        return function() {
          _this.$ionicHistory.nextViewOptions({
            disableBack: true
          });
          _this.$scope.closePopover();
          return _this.$state.go('app.setting');
        };
      })(this);
      return this.$scope.about = (function(_this) {
        return function() {
          _this.$scope.closePopover();
          return _this.$state.go('app.test-native');
        };
      })(this);
    };

    return TestCtrl;

  })();

  angular.module('app').controller('TestCtrl', ['$scope', '$ionicPopover', '$ionicHistory', '$state', '$rootScope', 'User', 'Sms', TestCtrl]);

}).call(this);

(function() {
  var TicketsCtrl;

  TicketsCtrl = (function() {
    function TicketsCtrl($scope, $localStorage, storageKey) {
      this.$scope = $scope;
      this.$localStorage = $localStorage;
      this.storageKey = storageKey;
      this.$scope.tickets = this.$localStorage[this.storageKey.TICKETS];
    }

    return TicketsCtrl;

  })();

  angular.module('app').controller('TicketsCtrl', ['$scope', '$localStorage', 'storageKey', TicketsCtrl]);

}).call(this);

(function() {
  var VideoCtrl;

  VideoCtrl = (function() {
    function VideoCtrl($scope, $state, $stateParams) {
      var id;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      id = this.$stateParams.type;
      this.$scope.video_src = this.get_video_src(id);
    }

    VideoCtrl.prototype.get_video_src = function(id) {
      return "http://192.168.1.104/video/" + id + ".mp4";
    };

    return VideoCtrl;

  })();

  angular.module('app').controller('VideoCtrl', ['$scope', '$state', '$stateParams', VideoCtrl]);

}).call(this);

(function() {
  var TrustedFilter;

  TrustedFilter = (function() {
    function TrustedFilter($sce) {
      return function(url) {
        return $sce.trustAsResourceUrl(url);
      };
    }

    return TrustedFilter;

  })();

  angular.module('app').filter('trusted', ['$sce', TrustedFilter]);

}).call(this);

(function() {
  var Config, CsrfInterceptor,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CsrfInterceptor = (function() {
    function CsrfInterceptor($cookies) {
      var allowMethods, cookieName, headerName;
      headerName = 'X-CSRFToken';
      cookieName = 'csrftoken';
      allowMethods = ['GET'];
      return {
        'request': function(request) {
          var ref;
          if (ref = request.method, indexOf.call(allowMethods, ref) < 0) {
            request.headers[headerName] = $cookies.get(cookieName);
          }
          return request;
        }
      };
    }

    return CsrfInterceptor;

  })();

  Config = (function() {
    function Config($httpProvider) {
      $httpProvider.interceptors.push(['$cookies', CsrfInterceptor]);
    }

    return Config;

  })();

  angular.module('app').config(['$httpProvider', Config]);

}).call(this);

(function() {
  var Config, Interceptor;

  Interceptor = (function() {
    function Interceptor($log, $rootScope, $q) {
      return {
        response: function(response) {
          $rootScope.$broadcast("success:" + response.status, response);
          return response;
        },
        responseError: function(response) {
          $rootScope.$broadcast("error:" + response.status, response);
          return $q.reject(response);
        }
      };
    }

    return Interceptor;

  })();

  Config = (function() {
    function Config($httpProvider) {
      $httpProvider.interceptors.push(['$log', '$rootScope', '$q', Interceptor]);
    }

    return Config;

  })();

  angular.module('app').config(['$httpProvider', Config]);

}).call(this);

(function() {
  var Auth,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Auth = (function() {
    function Auth($http, $rootScope, $localStorage, $base64, settings, event) {
      var $storage, anon_user, get_current_user, l, role_prefix, self, set_current_user;
      self = this;
      anon_user = {
        username: '',
        groups: [],
        token: ''
      };
      $storage = $localStorage.$default({
        user: anon_user
      });
      get_current_user = function() {
        if (!$rootScope.user) {
          $rootScope.user = $storage.user;
        }
        return $rootScope.user;
      };
      set_current_user = function(user) {
        $storage.user = user;
        $rootScope.user = user;
        self.user = user;
        return user;
      };
      role_prefix = 'ROLE_';
      l = role_prefix.length;
      this.user = get_current_user();
      this.authorize = (function(_this) {
        return function(role) {
          console.log(_this.user.groups);
          return indexOf.call(_this.user.groups, role) >= 0;
        };
      })(this);
      this.isLoggedIn = (function(_this) {
        return function(user) {
          user = user || _this.user;
          return user.username !== '';
        };
      })(this);
      this.login = (function(_this) {
        return function(user, success, error) {
          return $http.post(settings.baseurl + '/api-token-auth/', {
            username: user.username,
            password: user.password
          }, {
            headers: {
              Authorization: void 0
            }
          }).success(function(ret) {
            user.token = ret.token;
            return $http.get(settings.baseurl + '/userprofile/curruser/', {
              headers: {
                Authorization: 'Token ' + ret.token
              }
            }).success(function(user) {
              var persist_user;
              persist_user = {
                id: user.id,
                username: user.username,
                phone: user.phone,
                groups: user.groups,
                token: ret.token
              };
              set_current_user(persist_user);
              success(persist_user);
              return $rootScope.$broadcast(event.LOGIN, persist_user);
            }).error(error);
          }).error(error);
        };
      })(this);
      this.signup = (function(_this) {
        return function(user, success, error) {
          return $http.post(settings.baseurl + '/userprofile/signup/', user).success(function(user) {
            var persist_user;
            persist_user = {
              id: user.id,
              username: user.username,
              phone: user.username,
              groups: user.groups,
              token: user.token
            };
            set_current_user(persist_user);
            success(persist_user);
            return $rootScope.$broadcast(event.SIGNUP, persist_user);
          }).error(error);
        };
      })(this);
      this.logout = (function(_this) {
        return function() {
          set_current_user(anon_user);
          return $rootScope.$broadcast(event.LOGOUT);
        };
      })(this);
      return this;
    }

    return Auth;

  })();

  angular.module('app').factory('Auth', ['$http', '$rootScope', '$localStorage', '$base64', 'settings', 'event', Auth]);

}).call(this);

(function() {
  var Messages;

  Messages = (function() {
    function Messages($resource, settings) {
      this.$resource = $resource;
      this.settings = settings;
      this.url = this.settings.baseurl + "/api/news/:id";
      this.message = this.$resource(this.url, {
        id: '@id'
      });
    }

    Messages.prototype.all = function() {
      return this.message.query();
    };

    return Messages;

  })();

  angular.module('app').service('Message', ['$resource', 'settings', Messages]);

}).call(this);

(function() {
  var Sms;

  Sms = (function() {
    function Sms($http, settings) {
      this.$http = $http;
      this.settings = settings;
      this.url = this.settings.baseurl + "/sms/send/";
    }

    Sms.prototype.send = function(phone) {
      return this.$http.post(this.url, {
        'phone': phone
      });
    };

    return Sms;

  })();

  angular.module('app').service('Sms', ['$http', 'settings', Sms]);

}).call(this);

(function() {
  var User;

  User = (function() {
    function User($resource, $http, settings) {
      this.$resource = $resource;
      this.$http = $http;
      this.settings = settings;
      this.url = this.settings.baseurl + '/api/user/:id';
      this.User = this.$resource(this.url, {
        id: '@id'
      });
    }

    User.prototype.all = function() {
      return this.User.query();
    };

    User.prototype.save = function(user) {
      return this.User.save(user);
    };

    User.prototype.exist = function(username) {
      return this.$http.get(this.settings.baseurl + '/userprofile/userexist/?q=' + username);
    };

    return User;

  })();

  angular.module('app').service('User', ['$resource', '$http', 'settings', User]);

}).call(this);

(function() {
  var Util;

  Util = (function() {
    function Util($rootScope, $window, $ionicPopup, $cordovaToast) {
      this.$rootScope = $rootScope;
      this.$window = $window;
      this.$ionicPopup = $ionicPopup;
      this.$cordovaToast = $cordovaToast;
    }

    Util.prototype.toast = function(msg, fn) {
      if (this.$window.cordova) {
        return this.$cordovaToast.show(msg, 'short', 'bottom').then(function(success) {
          return fn && fn('ok');
        }, function(error) {
          return fn && fn(error);
        });
      } else {
        return this.$ionicPopup.alert({
          template: msg
        }).then(function(res) {
          return fn && fn(res);
        });
      }
    };

    return Util;

  })();

  angular.module('app').service('Util', ['$rootScope', '$window', '$ionicPopup', '$cordovaToast', Util]);

}).call(this);

(function() {
  var CompareTo;

  CompareTo = (function() {
    function CompareTo() {
      var link;
      link = function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue === scope.otherValue.$modelValue;
        };
        return scope.$watch("otherValue", function() {
          return ngModel.$validate();
        });
      };
      return {
        require: 'ngModel',
        scope: {
          otherValue: "=compareTo"
        },
        link: link
      };
    }

    return CompareTo;

  })();

  angular.module('app').directive('compareTo', CompareTo);

}).call(this);

(function() {
  var GreaterThan;

  GreaterThan = (function() {
    function GreaterThan() {
      var link;
      link = function(scope, element, attributes, ngModel) {
        ngModel.$validators.greaterThan = function(value) {
          return parseInt(value) >= parseInt(scope.greaterThanNumber);
        };
        return scope.$watch("greaterThanNumber", function() {
          return ngModel.$validate();
        });
      };
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          greaterThanNumber: '=greaterThan'
        },
        link: link
      };
    }

    return GreaterThan;

  })();

  angular.module('app').directive('greateThan', GreaterThan);

}).call(this);

(function() {
  var UserExist;

  UserExist = (function() {
    function UserExist($q, User) {
      var link;
      link = function(scope, element, attributes, ngModel) {
        return ngModel.$asyncValidators.userExist = function(value) {
          var deferred;
          deferred = $q.defer();
          User.exist(value).then(function(result) {
            if (result.data) {
              return deferred.reject();
            } else {
              return deferred.resolve();
            }
          }, function(err) {
            return deferred.reject();
          });
          return deferred.promise;
        };
      };
      return {
        restrict: 'A',
        require: 'ngModel',
        link: link
      };
    }

    return UserExist;

  })();

  angular.module('app').directive('userExist', ['$q', 'User', UserExist]);

}).call(this);
