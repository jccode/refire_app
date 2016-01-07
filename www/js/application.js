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
      driver: 'driver',
      admin: 'admin'
    },
    'event': {
      REQUIRE_LOGIN: 'require_login',
      LOGIN: 'login',
      LOGOUT: 'logout',
      SIGNUP: 'signup',
      ENTER_BUS: 'enter_bus',
      LEAVE_BUS: 'leave_bus'
    },
    'storageKey': {
      PAY_STEP_SEQNO: 'pay_step_seqno',
      PAY_BUS_LINE: 'pay_bus_line',
      TICKETS: 'tickets',
      SIGNUP_USER: 'signup_user',
      LAST_POSITION: 'last_position',
      SETTING_REFRESH_RATE: 'setting_refresh_rate',
      BUS: 'bus',
      BEACON_LAST_TS: 'beacon_last_ts'
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
  var BeaconBootstrap, BeaconEventHandler, start;

  BeaconEventHandler = (function() {
    function BeaconEventHandler(beaconManager, beaconState) {
      this.beaconManager = beaconManager;
      this.beaconState = beaconState;
      this.notified = false;
      this.throttleRange = _.throttle((function(_this) {
        return function(result) {
          return _this.rangeRegion(result);
        };
      })(this), 5000);
    }

    BeaconEventHandler.prototype.didStartMonitoringForRegion = function(event, pluginResult) {
      console.log("[Start monitoring for region] " + event);
      return console.log("[Start monitoring for region] " + JSON.stringify(pluginResult));
    };

    BeaconEventHandler.prototype.didDetermineStateForRegion = function(event, pluginResult) {
      console.log("[Determine state for region] " + event);
      console.log("[Determine state for region] " + JSON.stringify(pluginResult));
      if (pluginResult['state'] === 'CLRegionStateInside') {
        return this.enterRegion(pluginResult.region);
      } else if (pluginResult['state'] === 'CLRegionStateOutside') {
        return this.exitRegion(pluginResult.region);
      }
    };

    BeaconEventHandler.prototype.didRangeBeaconsInRegion = function(event, pluginResult) {
      console.log(".");
      return this.throttleRange(pluginResult);
    };

    BeaconEventHandler.prototype.didEnterRegion = function(event, pluginResult) {
      console.log("[Enter region] " + event);
      console.log("[Enter region] " + JSON.stringify(pluginResult));
      return this.enterRegion(pluginResult.region);
    };

    BeaconEventHandler.prototype.didExitRegion = function(event, pluginResult) {
      console.log("[Exit region] " + event);
      console.log("[Exit region] " + JSON.stringify(pluginResult));
      return this.exitRegion(pluginResult.region);
    };

    BeaconEventHandler.prototype.enterRegion = function(region) {
      var bus;
      bus = this.beaconManager.find_bus(region.identifier, region.uuid, region.major, region.minor);
      if (bus) {
        return console.log('enter bus');
      }
    };

    BeaconEventHandler.prototype.exitRegion = function(region) {
      var bus;
      bus = this.beaconManager.find_bus(region.identifier, region.uuid, region.major, region.minor);
      if (bus) {
        return this.beaconState.leave_bus(bus);
      }
    };

    BeaconEventHandler.prototype.rangeRegion = function(result) {
      var bus, buses, close_beacons, region;
      region = result.region;
      close_beacons = _.filter(result.beacons, function(b) {
        var ref;
        return (ref = b.proximity) === 'ProximityImmediate' || ref === 'ProximityNear';
      });
      if (close_beacons && close_beacons.length > 0) {
        buses = _.map(close_beacons, (function(_this) {
          return function(b) {
            return _this.beaconManager.find_bus(b.identifier, b.uuid, b.major, b.minor);
          };
        })(this));
        buses = _.flatten(buses);
        if (buses && buses.length > 0) {
          bus = buses[0];
          if (this.beaconState.is_on_bus(bus)) {
            return this.beaconState.on_bus(bus);
          } else {
            return this.beaconState.enter_bus(bus);
          }
        }
      }
    };

    return BeaconEventHandler;

  })();

  BeaconBootstrap = (function() {
    function BeaconBootstrap($rootScope1, $cordovaBeacon1, $cordovaToast1, $cordovaLocalNotification1, gettextCatalog1, event1, Beacons1, beaconManager, beaconState) {
      this.$rootScope = $rootScope1;
      this.$cordovaBeacon = $cordovaBeacon1;
      this.$cordovaToast = $cordovaToast1;
      this.$cordovaLocalNotification = $cordovaLocalNotification1;
      this.gettextCatalog = gettextCatalog1;
      this.event = event1;
      this.Beacons = Beacons1;
      this.beaconManager = beaconManager;
      this.beaconState = beaconState;
      this.isAndroid = ionic.Platform.isAndroid();
      console.log("beacon bootstrap. isAndroid? " + this.isAndroid);
      this.check_bluetooth();
      this.beaconState.load_state();
    }

    BeaconBootstrap.prototype.check_bluetooth = function() {
      var e, error;
      try {
        this.$cordovaBeacon.isBluetoothEnabled();
      } catch (error) {
        e = error;
        console.log(e.toString());
      }
      return this.$cordovaBeacon.isBluetoothEnabled().then((function(_this) {
        return function(ret) {
          console.log("bluetooth enabled? " + ret + " ");
          if (!ret && _this.isAndroid) {
            _this.$cordovaBeacon.enableBluetooth();
          }
          _this.init_beacons();
          _this.add_beacon_event_handler();
          return _this.add_bus_event_handler();
        };
      })(this)).fail((function(_this) {
        return function(err) {
          console.log("detect bluetooth failed. " + (JSON.stringifty(err)));
          return _this.toast("detect bluetooth failed. " + (JSON.stringifty(err)));
        };
      })(this));
    };

    BeaconBootstrap.prototype.init_beacons = function() {
      this.Beacons.all().$promise.then((function(_this) {
        return function(beacons) {
          var brNotifyEntryStateOnDisplay, bs;
          console.log(JSON.stringify(beacons));
          _this.beaconManager.init_beacon_models(beacons);
          bs = _.map(beacons, function(b) {
            return {
              'identifier': b.identifier,
              'uuid': b.uuid
            };
          });
          bs = _.uniq(bs, function(b) {
            return b.identifier + b.uuid;
          });
          console.log(JSON.stringify(bs));
          brNotifyEntryStateOnDisplay = true;
          _this.beacon_regions = _.map(beacons, function(b) {
            return _this.$cordovaBeacon.createBeaconRegion(b.identifier, b.uuid, null, null, brNotifyEntryStateOnDisplay);
          });
          return _.each(_this.beacon_regions, function(r) {
            _this.$cordovaBeacon.startMonitoringForRegion(r);
            return _this.$cordovaBeacon.startRangingBeaconsInRegion(r);
          });
        };
      })(this));
      return this.beaconEventHandler = new BeaconEventHandler(this.beaconManager, this.beaconState);
    };

    BeaconBootstrap.prototype.add_beacon_event_handler = function() {
      this.$rootScope.$on("$cordovaBeacon:didStartMonitoringForRegion", this.beaconEventHandler.didStartMonitoringForRegion.bind(this.beaconEventHandler));
      this.$rootScope.$on("$cordovaBeacon:didDetermineStateForRegion", this.beaconEventHandler.didDetermineStateForRegion.bind(this.beaconEventHandler));
      this.$rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", this.beaconEventHandler.didRangeBeaconsInRegion.bind(this.beaconEventHandler));
      this.$rootScope.$on("$cordovaBeacon:didEnterRegion", this.beaconEventHandler.didEnterRegion.bind(this.beaconEventHandler));
      return this.$rootScope.$on("$cordovaBeacon:didExitRegion", this.beaconEventHandler.didExitRegion.bind(this.beaconEventHandler));
    };

    BeaconBootstrap.prototype.add_bus_event_handler = function() {
      this.$rootScope.$on(this.event.ENTER_BUS, (function(_this) {
        return function(bus) {
          return _this.$cordovaLocalNotification.schedule({
            id: 1,
            title: _this.gettextCatalog.getString('Welcome'),
            text: _this.gettextCatalog.getString('Thanks for riding with us!')
          });
        };
      })(this));
      return this.$rootScope.$on(this.event.LEAVE_BUS, (function(_this) {
        return function(bus) {
          return _this.$cordovaLocalNotification.schedule({
            id: 2,
            title: _this.gettextCatalog.getString('Goodbye'),
            text: _this.gettextCatalog.getString('Hoping to see you again!')
          });
        };
      })(this));
    };

    BeaconBootstrap.prototype.toast = function(msg) {
      return this.$cordovaToast.show(msg, "short", "bottom");
    };

    return BeaconBootstrap;

  })();

  start = function($rootScope, $ionicPlatform, $cordovaBeacon, $cordovaToast, $cordovaLocalNotification, gettextCatalog, event, Beacons, BeaconManager, BeaconState) {
    return $ionicPlatform.ready(function() {
      return new BeaconBootstrap($rootScope, $cordovaBeacon, $cordovaToast, $cordovaLocalNotification, gettextCatalog, event, Beacons, BeaconManager, BeaconState);
    });
  };

  angular.module('app').run(['$rootScope', '$ionicPlatform', '$cordovaBeacon', '$cordovaToast', '$cordovaLocalNotification', 'gettextCatalog', 'event', 'Beacons', 'BeaconManager', 'BeaconState', start]);

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
        templateUrl: 'templates/home/energy2.html',
        controller: 'EnergyFlowCtrl as ctrl'
      }).state('app.home.video', {
        url: '/video/:type',
        templateUrl: 'templates/home/video.html',
        controller: 'VideoCtrl'
      }).state('app.home.tree', {
        url: '/tree',
        templateUrl: 'templates/home/tree.html',
        controller: 'TreeCtrl as ctrl'
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
            templateUrl: 'templates/bus_overview.html',
            controller: 'BusOverviewCtrl as ctrl'
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
      }).state('app.message-detail', {
        url: '/message/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/message-detail.html',
            controller: 'MessageDetailCtrl'
          }
        }
      }).state('app.setting', {
        url: '/setting',
        views: {
          'menuContent': {
            templateUrl: 'templates/setting.html',
            controller: 'SettingCtrl as ctrl'
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
      }).state('app.energy', {
        url: '/energy',
        views: {
          'menuContent': {
            templateUrl: 'templates/home/energy2.html',
            controller: 'EnergyFlowCtrl as ctrl'
          }
        }
      });
      $urlRouterProvider.otherwise('/app/home/video/1');
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
      $resourceProvider.defaults.stripTrailingSlashes = false;
    }

    return Ajax;

  })();

  angular.module('app').config(['$httpProvider', '$resourceProvider', Ajax]);

}).call(this);

(function() {
  var BindFile;

  BindFile = (function() {
    function BindFile() {
      var link;
      link = function(scope, el, attrs, ngModel) {
        el.bind('change', function(event) {
          ngModel.$setViewValue(event.target.files[0]);
          return scope.$apply();
        });
        return scope.$watch(function() {
          return ngModel.$viewValue;
        }, function(value) {
          if (!value) {
            return el.val("");
          }
        });
      };
      return {
        require: 'ngModel',
        restrict: 'A',
        link: link
      };
    }

    return BindFile;

  })();

  angular.module('app').directive('bindFile', BindFile);

}).call(this);

(function() {
  var EfBattery;

  EfBattery = (function() {
    function EfBattery($window, $document) {
      var bw0, f0, flh0, flh_min, link, w0;
      w0 = 1044;
      bw0 = 290;
      f0 = 200;
      flh0 = 30;
      flh_min = 12;
      link = function(scope, el, attrs) {
        var main, set_width;
        console.log('ef battery');
        main = el.parent()[0];
        set_width = function() {
          var factor;
          factor = main.clientWidth / w0;
          return el.css({
            "width": bw0 * factor + "px",
            "font-size": f0 * factor + "%",
            "line-height": Math.max(flh0 * factor, flh_min) + "px"
          });
        };
        set_width();
        return angular.element($window).bind('resize', function() {
          return set_width();
        });
      };
      return {
        restrict: 'A',
        link: link
      };
    }

    return EfBattery;

  })();

  angular.module('app').directive('efbattery', ['$window', '$document', EfBattery]);

}).call(this);

(function() {
  var AppCtrl;

  AppCtrl = (function() {
    function AppCtrl($scope, $rootScope, $state, $ionicModal, $ionicPopup, $timeout, auth, $ionicHistory, gettext, gettextCatalog, event, Util) {
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
      this.event = event;
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
            console.log('login failed', JSON.stringify(e));
            return _this.Util.toast(_this.gettextCatalog.getString("Login failed. Incorrect username or password."));
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
      this.$scope.$on("error:401", loginRequireHandler);
      return this.$scope.$on(this.event.REQUIRE_LOGIN, loginRequireHandler);
    };

    return AppCtrl;

  })();

  angular.module('app').controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicPopup', '$timeout', 'Auth', '$ionicHistory', 'gettext', 'gettextCatalog', 'event', 'Util', AppCtrl]);

}).call(this);

(function() {
  var BusOverviewCtrl;

  BusOverviewCtrl = (function() {
    function BusOverviewCtrl($scope, $rootScope, $localStorage, $interval, gettextCatalog, BusData, storageKey, event) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$localStorage = $localStorage;
      this.$interval = $interval;
      this.gettextCatalog = gettextCatalog;
      this.BusData = BusData;
      this.storageKey = storageKey;
      this.event = event;
      this.bus = this.$rootScope.bus;
      if (this.bus && this.bus.bid) {
        this.demodata = false;
        this.getdata();
        this.auto_refresh();
      } else {
        this.init_demo_data();
      }
      this.init_event();
    }

    BusOverviewCtrl.prototype.init_event = function() {
      this.$scope.$on(this.event.ENTER_BUS, (function(_this) {
        return function(bus) {
          _this.bus = bus;
          return _this.getdata();
        };
      })(this));
      return this.$scope.$on("$destroy", (function(_this) {
        return function() {
          if (_this.refresh_timer) {
            return _this.$interval.cancel(_this.refresh_timer);
          }
        };
      })(this));
    };

    BusOverviewCtrl.prototype.init_demo_data = function() {
      this.demodata = true;
      this.data = {
        MileageData: {
          total: 211,
          remain: 143200
        },
        BusData: {
          latitude: 31.2000,
          longitude: 121.5000,
          speed: 120
        },
        GasData: {
          remain: 100,
          bottle_temp: 32
        },
        FuelCellData: {
          voltage: 12,
          current: 10
        },
        PowerBatteryData: {
          remain: 80,
          voltage: 12,
          current: 10,
          temp: 40
        },
        MotorData: {
          speed: 1200,
          voltage: 12,
          current: 10,
          temp: 40
        },
        EnergySavingData: {
          energy_saving_amount: 100,
          energy_saving_money: 2143,
          emission_reduction: 320
        }
      };
      return this.$scope.popup_login = (function(_this) {
        return function() {
          return _this.$rootScope.$broadcast(_this.event.REQUIRE_LOGIN, '');
        };
      })(this);
    };

    BusOverviewCtrl.prototype.getdata = function() {
      return this.BusData.busdata(this.bus.bid).then((function(_this) {
        return function(ret) {
          _this.data = ret.data;
          _this.calc_refresh_time();
          _this.set_battery("h2", _this.data.GasData.remain);
          return _this.set_battery("bat", _this.data.PowerBatteryData.remain);
        };
      })(this));
    };

    BusOverviewCtrl.prototype.auto_refresh = function() {
      this.refresh_rate = this.$localStorage[this.storageKey.SETTING_REFRESH_RATE];
      if (this.refresh_rate && this.refresh_rate > 0) {
        return this.refresh_timer = this.$interval((function(_this) {
          return function() {
            console.log('loaddata');
            return _this.getdata();
          };
        })(this), this.refresh_rate * 1000);
      }
    };

    BusOverviewCtrl.prototype.calc_refresh_time = function() {
      var _t, time;
      _t = function(s) {
        return s && moment(s).toDate() || s;
      };
      time = [_t(this.data.PowerBatteryData.timestamp), _t(this.data.GasData.timestamp), _t(this.data.FuelCellData.timestamp), _t(this.data.BusData.timestamp), _t(this.data.EnergySavingData.timestamp), _t(this.data.MileageData.timestamp), _t(this.data.MotorData.timestamp)];
      return this.refresh_time = _.max(time);
    };

    BusOverviewCtrl.prototype.set_battery = function(id, val) {
      var cs, el;
      this.reset_battery(id);
      el = document.getElementById(id);
      cs = el.children;
      if (val >= 10) {
        cs[9].className = "cell bg-red-1";
      }
      if (val >= 20) {
        cs[8].className = "cell bg-red-1";
      }
      if (val >= 30) {
        cs[7].className = "cell bg-orange-1";
      }
      if (val >= 40) {
        cs[6].className = "cell bg-orange-1";
      }
      if (val >= 50) {
        cs[5].className = "cell bg-orange-1";
      }
      if (val >= 60) {
        cs[4].className = "cell bg-green-2";
      }
      if (val >= 70) {
        cs[3].className = "cell bg-green-2";
      }
      if (val >= 80) {
        cs[2].className = "cell bg-green-2";
      }
      if (val >= 90) {
        cs[1].className = "cell bg-green-1";
      }
      if (val >= 100) {
        return cs[0].className = "cell bg-green-1";
      }
    };

    BusOverviewCtrl.prototype.reset_battery = function(id) {
      var e, el, i, len, ref, results;
      el = document.getElementById(id);
      ref = el.children;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        results.push(e.className = "cell");
      }
      return results;
    };

    BusOverviewCtrl.prototype.doRefresh = function() {
      this.getdata();
      return this.$scope.$broadcast('scroll.refreshComplete');
    };

    return BusOverviewCtrl;

  })();

  angular.module('app').controller('BusOverviewCtrl', ['$scope', '$rootScope', '$localStorage', '$interval', 'gettextCatalog', 'BusData', 'storageKey', 'event', BusOverviewCtrl]);

}).call(this);

(function() {
  var BuslocationCtrl;

  BuslocationCtrl = (function() {
    function BuslocationCtrl($scope, $q, $localStorage, $cordovaGeolocation, util, storageKey) {
      var height;
      this.$scope = $scope;
      this.$q = $q;
      this.$localStorage = $localStorage;
      this.$cordovaGeolocation = $cordovaGeolocation;
      this.util = util;
      this.storageKey = storageKey;
      height = document.getElementById("maplocation").offsetHeight - 190;
      document.getElementById("map").style.height = height + "px";
      this.init_fallback_pos();
      this.fallback_pos = this.storage[this.storageKey.LAST_POSITION];
      this.init_map(this.fallback_pos);
      this.get_current_pos().then((function(_this) {
        return function(pos) {
          _this.currpos = pos;
          _this.map.panTo(pos);
          _this.simulate_bus_pos(pos);
          return _this.show_route();
        };
      })(this), (function(_this) {
        return function(ret) {
          return console.log("get position failed.");
        };
      })(this));
    }

    BuslocationCtrl.prototype.init_fallback_pos = function() {
      var fallback;
      fallback = {};
      fallback[this.storageKey.LAST_POSITION] = {
        longitude: 116.404,
        latitude: 39.915
      };
      return this.storage = this.$localStorage.$default(fallback);
    };

    BuslocationCtrl.prototype.init_map = function(pos) {
      this.map = new BMap.Map("map");
      return this.map.centerAndZoom(new BMap.Point(pos.longitude, pos.latitude), 12);
    };

    BuslocationCtrl.prototype.simulate_bus_pos = function(pos) {
      this.buspos = {
        longitude: pos.longitude + Math.random() / 20,
        latitude: pos.latitude + Math.random() / 20
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
      var defer, posOptions;
      posOptions = {
        timeout: 10000,
        enableHighAccuracy: true
      };
      defer = this.$q.defer();
      this.$cordovaGeolocation.getCurrentPosition(posOptions).then((function(_this) {
        return function(pos) {
          var ret;
          ret = pos.coords;
          _this.storage[_this.storageKey.LAST_POSITION] = ret;
          return defer.resolve(ret);
        };
      })(this), (function(_this) {
        return function(err) {
          console.log('Fail to get current postion. Use fallback postion instead.');
          console.log(err.code + "," + err.message);
          _this.util.toast("Get current postion failed. " + err.code + ":" + err.message);
          return defer.reject(false);
        };
      })(this));
      return defer.promise;
    };

    return BuslocationCtrl;

  })();

  angular.module('app').controller('BuslocationCtrl', ['$scope', '$q', '$localStorage', '$cordovaGeolocation', 'Util', 'storageKey', BuslocationCtrl]);

}).call(this);

(function() {
  var EnergyFlowCtrl;

  EnergyFlowCtrl = (function() {
    function EnergyFlowCtrl($scope, $rootScope, BusData) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.BusData = BusData;
      this.bus = this.$rootScope.bus;
      this.img_base_url = "img/engineflow/";
      if (this.bus && this.bus.bid) {
        this.getdata();
      } else {
        this.fallback_init();
      }
    }

    EnergyFlowCtrl.prototype.getdata = function() {
      return this.BusData.busdata(this.bus.bid).then((function(_this) {
        return function(ret) {
          _this.data = ret.data;
          return _this.init_data();
        };
      })(this), (function(_this) {
        return function() {
          return _this.fallback_init();
        };
      })(this));
    };

    EnergyFlowCtrl.prototype.init_data = function() {
      this.$scope.gif_src = this.get_energy_flow_gif(this.data.BusData.status);
      this.$scope.fuel_cell_src = this.get_fuel_cell_img(this.data.GasData.remain);
      return this.$scope.battery_src = this.get_battery_img(this.data.PowerBatteryData.remain);
    };

    EnergyFlowCtrl.prototype.fallback_init = function() {
      this.$scope.gif_src = this.get_energy_flow_gif(null);
      this.$scope.fuel_cell_src = this.get_fuel_cell_img(null);
      return this.$scope.battery_src = this.get_battery_img(null);
    };

    EnergyFlowCtrl.prototype.get_energy_flow_gif = function(status) {
      var img;
      img = (function() {
        switch (status) {
          case 0:
            return "GIF-1044-E-only.gif";
          case 1:
            return "GIF-1044-E-only.gif";
          case 2:
            return "GIF-1044-H-and-E.gif";
          case 3:
            return "GIF-1044-H-to-E-and-engine.gif";
          case 4:
            return "GIF-1044-Engine-to-E.gif";
          default:
            return "GIF-1044-E-only.gif";
        }
      })();
      return this.img_base_url + img;
    };

    EnergyFlowCtrl.prototype.get_fuel_cell_img = function(remain) {
      var img;
      img = (function() {
        switch (false) {
          case !(remain >= 100):
            return "battery-h-100.png";
          case !(remain >= 90):
            return "battery-h-90.png";
          case !(remain >= 80):
            return "battery-h-80.png";
          case !(remain >= 70):
            return "battery-h-70.png";
          case !(remain >= 60):
            return "battery-h-60.png";
          case !(remain >= 50):
            return "battery-h-50.png";
          case !(remain >= 40):
            return "battery-h-40.png";
          case !(remain >= 30):
            return "battery-h-30.png";
          case !(remain >= 20):
            return "battery-h-20.png";
          case !(remain >= 10):
            return "battery-h-10.png";
          default:
            return "battery-h-0.png";
        }
      })();
      return this.img_base_url + img;
    };

    EnergyFlowCtrl.prototype.get_battery_img = function(remain) {
      var img;
      img = (function() {
        switch (false) {
          case !(remain >= 100):
            return "battery-e-100.png";
          case !(remain >= 90):
            return "battery-e-90.png";
          case !(remain >= 80):
            return "battery-e-80.png";
          case !(remain >= 70):
            return "battery-e-70.png";
          case !(remain >= 60):
            return "battery-e-60.png";
          case !(remain >= 50):
            return "battery-e-50.png";
          case !(remain >= 40):
            return "battery-e-40.png";
          case !(remain >= 30):
            return "battery-e-30.png";
          case !(remain >= 20):
            return "battery-e-20.png";
          case !(remain >= 10):
            return "battery-e-10.png";
          default:
            return "battery-e-0.png";
        }
      })();
      return this.img_base_url + img;
    };

    return EnergyFlowCtrl;

  })();

  angular.module('app').controller('EnergyFlowCtrl', ['$scope', '$rootScope', 'BusData', EnergyFlowCtrl]);

}).call(this);

(function() {
  var HealthCtrl;

  HealthCtrl = (function() {
    function HealthCtrl($scope, $stateParams, gettextCatalog) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.gettextCatalog = gettextCatalog;
      this.$scope.type = this.$stateParams.type;
      this.init_1m();
      this.$scope.total_distance = '400 KM';
      this.$scope.total_energy_saving = '300 KMK';
      this.$scope.total_emission_reduction = '200 KWH';
      this.$scope.onTabSelect = (function(_this) {
        return function(type) {
          _this.$scope.type = type;
          switch (type) {
            case 1:
              return _this.init_1m();
            case 2:
              return _this.init_3m();
            case 3:
              return _this.init_6m();
            default:
              return init_period();
          }
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

    HealthCtrl.prototype.init_1m = function() {
      var i, j, results;
      this.$scope.head = this.gettextCatalog.getString('December');
      this.$scope.labels = (function() {
        results = [];
        for (j = 1; j <= 30; j++){ results.push(j); }
        return results;
      }).apply(this);
      return this.$scope.data = [
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
    };

    HealthCtrl.prototype.init_3m = function() {
      var i;
      this.$scope.head = '10 ~ 12';
      this.$scope.labels = [10, 11, 12];
      return this.$scope.data = [
        (function() {
          var j, len, ref, results;
          ref = this.$scope.labels;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            results.push(Math.round(Math.random() * 100));
          }
          return results;
        }).call(this)
      ];
    };

    HealthCtrl.prototype.init_6m = function() {
      var i;
      this.$scope.head = '7 ~ 12';
      this.$scope.labels = [7, 8, 9, 10, 11, 12];
      return this.$scope.data = [
        (function() {
          var j, len, ref, results;
          ref = this.$scope.labels;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            results.push(Math.round(Math.random() * 100));
          }
          return results;
        }).call(this)
      ];
    };

    HealthCtrl.prototype.init_period = function() {
      return this.init_6m();
    };

    return HealthCtrl;

  })();

  angular.module('app').controller('HealthCtrl', ['$scope', '$stateParams', 'gettextCatalog', HealthCtrl]);

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
          return swiper.on("click", function(swiper) {
            var idx, item;
            console.log("click " + swiper.clickedIndex);
            idx = swiper.clickedIndex;
            item = swiper.slides[idx];
            return _this.load_detail(item);
          });
        };
      })(this);
      this.bind_click_event();
    }

    HomeCtrl.prototype.bind_click_event = function() {
      var sc;
      sc = document.getElementById("swiper-container");
      return sc.addEventListener("tap", this.click_handler.bind(this), false);
    };

    HomeCtrl.prototype.find_ancestor = function(el, cls) {
      while ((el = el.parentElement) && !el.classList.contains(cls)) {
        "a";
      }
      return el;
    };

    HomeCtrl.prototype.click_handler = function(ev) {
      var el, item;
      el = ev.target;
      item = this.find_ancestor(el, "swiper-slide");
      return this.load_detail(item);
    };

    HomeCtrl.prototype.load_detail = function(item) {
      var param, state, url;
      url = item.getAttribute("href");
      state = item.getAttribute('data-state');
      param = item.getAttribute('data-param');
      return this.$state.go(state, param && JSON.parse(param) || {});
    };

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
  var MessageDetailCtrl;

  MessageDetailCtrl = (function() {
    function MessageDetailCtrl($scope, $stateParams, Message) {
      var id;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.Message = Message;
      id = this.$stateParams.id;
      this.$scope.msg = this.Message.get(id);
    }

    return MessageDetailCtrl;

  })();

  angular.module('app').controller('MessageDetailCtrl', ['$scope', '$stateParams', 'Message', MessageDetailCtrl]);

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
    function NewProfileCtrl($scope, $rootScope, $state, $ionicHistory, gettextCatalog, moment, $cordovaFile, $cordovaImagePicker, userProfileSvc, util) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$ionicHistory = $ionicHistory;
      this.gettextCatalog = gettextCatalog;
      this.moment = moment;
      this.$cordovaFile = $cordovaFile;
      this.$cordovaImagePicker = $cordovaImagePicker;
      this.userProfileSvc = userProfileSvc;
      this.util = util;
      this.userprofile = {};
      this.$scope.datepickerObject = {
        callback: (function(_this) {
          return function(val) {
            return _this.datePickerCallback(val);
          };
        })(this)
      };
    }

    NewProfileCtrl.prototype.datePickerCallback = function(val) {
      this.$scope.datepickerObject.inputDate = val;
      return this.userprofile.birthday = this.moment(val).format('YYYY-MM-DD');
    };

    NewProfileCtrl.prototype.skip = function() {
      this.$ionicHistory.nextViewOptions({
        disableBack: true
      });
      return this.$state.go('app.home.energy');
    };

    NewProfileCtrl.prototype.submit = function(form) {
      var cuser, ret;
      if (form.$valid) {
        cuser = this.$rootScope.user;
        this.userprofile.uid = cuser.id;
        this.userprofile.phone = cuser.username;
        ret = this.userProfileSvc.save(this.userprofile);
        return ret.$promise.then((function(_this) {
          return function(ret) {
            _this.util.toast(_this.gettextCatalog.getString('update profile successful.'));
            return _this.skip();
          };
        })(this), (function(_this) {
          return function(err) {
            console.log('save failed. #{err}');
            return _this.util.toast(_this.gettextCatalog.getString('update profile failed. #{err}'));
          };
        })(this));
      }
    };

    NewProfileCtrl.prototype.imagepicker = function() {
      var options;
      options = {
        maximumImagesCount: 1,
        width: 105,
        height: 105,
        quality: 90
      };
      return this.$cordovaImagePicker.getPictures(options).then((function(_this) {
        return function(results) {
          console.log('img url', JSON.stringify(results));
          _this.imgurl = results[0];
          return _this.resolveFile(results[0]);
        };
      })(this), function(err) {
        return this.Util.toast(JSON.stringify(err));
      });
    };

    NewProfileCtrl.prototype.resolveFile = function(url) {
      var ext, name;
      name = url.split('/').pop();
      ext = url.split('.').pop();
      if (ext.toLowerCase() === "jpg") {
        ext = "jpeg";
      }
      return this.$cordovaFile.readAsArrayBuffer(cordova.file.cacheDirectory, name).then((function(_this) {
        return function(ret) {
          var blob;
          blob = new Blob([ret], {
            type: "image/" + ext,
            name: name
          });
          return _this.userprofile.avatar = blob;
        };
      })(this), (function(_this) {
        return function(err) {
          return console.log('read file error', JSON.stringify(err));
        };
      })(this));
    };

    NewProfileCtrl.prototype.imgtest = function() {
      var imgs;
      imgs = ["img/avatar.jpg", "img/wechat.png", "img/ibeacon-on.png"];
      return this.imgurl = imgs[Math.floor(Math.random() * imgs.length)];
    };

    return NewProfileCtrl;

  })();

  angular.module('app').controller('NewProfileCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory', 'gettextCatalog', 'moment', '$cordovaFile', '$cordovaImagePicker', 'userProfile', 'Util', NewProfileCtrl]);

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
  var SettingCtrl;

  SettingCtrl = (function() {
    function SettingCtrl($scope, $rootScope, $state, gettextCatalog, $ionicHistory, $localStorage, auth, userProfile, util, roles, storageKey) {
      var default_setting, sec;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.gettextCatalog = gettextCatalog;
      this.$ionicHistory = $ionicHistory;
      this.$localStorage = $localStorage;
      this.auth = auth;
      this.userProfile = userProfile;
      this.util = util;
      this.roles = roles;
      this.storageKey = storageKey;
      this.user = this.$rootScope.user;
      this.isdriver = this.auth.authorize(this.roles.driver);
      this.profile = this.userProfile.get(this.user.id);
      sec = this.gettextCatalog.getString("second");
      this.refresh_rate = "0";
      this.refresh_options = [
        {
          value: "0",
          label: this.gettextCatalog.getString("Manual")
        }, {
          value: "30",
          label: "30 " + sec
        }, {
          value: "60",
          label: "60 " + sec
        }, {
          value: "90",
          label: "90 " + sec
        }
      ];
      default_setting = {};
      default_setting[this.storageKey.SETTING_REFRESH_RATE] = this.refresh_rate;
      this.storage = this.$localStorage.$default(default_setting);
    }

    SettingCtrl.prototype.logoff = function() {
      this.auth.logout();
      this.util.toast(this.gettextCatalog.getString('logoff success.'));
      this.$ionicHistory.nextViewOptions({
        disableBack: true
      });
      return this.$state.go('app.home.energy');
    };

    SettingCtrl.prototype.update_refresh_rate = function() {
      return this.storage[this.storageKey.SETTING_REFRESH_RATE] = this.refresh_rate;
    };

    return SettingCtrl;

  })();

  angular.module('app').controller('SettingCtrl', ['$scope', '$rootScope', '$state', 'gettextCatalog', '$ionicHistory', '$localStorage', 'Auth', 'userProfile', 'Util', 'userRoles', 'storageKey', SettingCtrl]);

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
    function SmsCtrl($scope, $state, $interval, $sessionStorage, storageKey, gettextCatalog, sms, auth) {
      this.$scope = $scope;
      this.$state = $state;
      this.$interval = $interval;
      this.$sessionStorage = $sessionStorage;
      this.storageKey = storageKey;
      this.gettextCatalog = gettextCatalog;
      this.sms = sms;
      this.auth = auth;
      this.COUNTDOWN = 90;
      this.countdown = 0;
      this.setButton("V");
      this.user = this.$sessionStorage[this.storageKey.SIGNUP_USER];
      this.initSms();
    }

    SmsCtrl.prototype.initSms = function() {
      return this.sendSms(this.user['username'], this.successCallback.bind(this), this.errorCallback.bind(this));
    };

    SmsCtrl.prototype.sendSms = function(phone, success, failed) {
      if (this.countdown <= 0) {
        return this.sms.send(phone).then((function(_this) {
          return function(ret) {
            return success(ret.data);
          };
        })(this), (function(_this) {
          return function(err) {
            return failed(err);
          };
        })(this));
      }
    };

    SmsCtrl.prototype.successCallback = function(code) {
      this.receivecode = code;
      this.countdown = this.COUNTDOWN;
      this.setButton('V');
      return this.startCountdown();
    };

    SmsCtrl.prototype.errorCallback = function(err) {
      return this.showError(err);
    };

    SmsCtrl.prototype.startCountdown = function() {
      return this.timer = this.$interval((function(_this) {
        return function() {
          if (_this.countdown > 0) {
            return _this.countdown--;
          } else {
            _this.$interval.cancel(_this.timer);
            _this.timer = void 0;
            return _this.afterCountdown();
          }
        };
      })(this), 1000);
    };

    SmsCtrl.prototype.afterCountdown = function() {
      return this.setButton("S");
    };

    SmsCtrl.prototype.doVerify = function() {
      return this.countdown > 0 && this.receivecode.toString() === this.verifycode.toString();
    };

    SmsCtrl.prototype.verify = function() {
      if (this.doVerify()) {
        return this.signup();
      } else {
        return this.showError('sms code not match!');
      }
    };

    SmsCtrl.prototype.setButton = function(state) {
      if (state === 'S') {
        this.buttontext = "Resend";
        return this.buttonstate = "S";
      } else {
        this.buttontext = "Verify";
        return this.buttonstate = "V";
      }
    };

    SmsCtrl.prototype.action = function() {
      if (this.buttonstate === 'V') {
        return this.verify();
      } else {
        this.verifycode = "";
        this.error = "";
        return this.initSms();
      }
    };

    SmsCtrl.prototype.showError = function(err) {
      return this.error = err;
    };

    SmsCtrl.prototype.signup = function() {
      return this.auth.signup(this.user, (function(_this) {
        return function(user) {
          console.log('signup success');
          console.log(user);
          return _this.next();
        };
      })(this), function(err) {
        console.log('signup error');
        console.log(err);
        return this.showError('signup failed. #{err}');
      });
    };

    SmsCtrl.prototype.next = function() {
      return this.$state.go('app.createprofile');
    };

    return SmsCtrl;

  })();

  angular.module('app').controller('SmsCtrl', ['$scope', '$state', '$interval', '$sessionStorage', 'storageKey', 'gettextCatalog', 'Sms', 'Auth', SmsCtrl]);

}).call(this);

(function() {
  var TestCtrl;

  TestCtrl = (function() {
    function TestCtrl($scope, $ionicPopover, $ionicHistory, $state, $rootScope, user, Beacons, sms, $localStorage) {
      this.$scope = $scope;
      this.$ionicPopover = $ionicPopover;
      this.$ionicHistory = $ionicHistory;
      this.$state = $state;
      this.$rootScope = $rootScope;
      this.user = user;
      this.Beacons = Beacons;
      this.sms = sms;
      this.$localStorage = $localStorage;
      this.initPopover();
      this.$scope.get_users = (function(_this) {
        return function() {
          return _this.$scope.users = _this.user.all();
        };
      })(this);
      this.$scope.get_beacons = (function(_this) {
        return function() {
          return _this.$scope.beacons = _this.Beacons.all();
        };
      })(this);
      this.$scope.set_bus = (function(_this) {
        return function() {
          return _this.$scope.beacons.$promise.then(function(bs) {
            var beacon, bus;
            beacon = _.find(bs, function(b) {
              return b.id === 2;
            });
            bus = beacon.stick_on[0];
            console.log(bus);
            _this.$rootScope.bus = bus;
            return _this.$localStorage.bus = bus;
          });
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

  angular.module('app').controller('TestCtrl', ['$scope', '$ionicPopover', '$ionicHistory', '$state', '$rootScope', 'User', 'Beacons', 'Sms', '$localStorage', TestCtrl]);

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
  var TreeCtrl;

  TreeCtrl = (function() {
    function TreeCtrl($scope, $rootScope, BusData) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.BusData = BusData;
      this.bus = this.$rootScope.bus;
      this.BASE = 100;
      if (this.bus && this.bus.bid) {
        this.getdata();
      }
    }

    TreeCtrl.prototype.getdata = function() {
      return this.BusData.busdata(this.bus.bid).then((function(_this) {
        return function(ret) {
          var emission_reduction;
          _this.data = ret.data;
          emission_reduction = _this.data.EnergySavingData.emission_reduction;
          return _this.calc(emission_reduction);
        };
      })(this));
    };

    TreeCtrl.prototype.calc = function(emission_reduction) {
      this.$scope.tree = Math.floor(emission_reduction / this.BASE);
      this.$scope.percentage = emission_reduction % this.BASE;
      return this.set_percentage(this.$scope.percentage / this.BASE);
    };

    TreeCtrl.prototype.set_percentage = function(p) {
      var tree_h;
      tree_h = document.getElementById("tree").offsetHeight;
      return document.getElementById("bg").style.height = (tree_h * p) + "px";
    };

    return TreeCtrl;

  })();

  angular.module('app').controller('TreeCtrl', ['$scope', '$rootScope', 'BusData', TreeCtrl]);

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
      switch (id) {
        case "1":
          return "img/video/energyflow_sd_high.mp4";
        case "2":
          return "img/video/fuelcell_sd_high.mp4";
        case "3":
          return "img/video/zero_emission_sd_high.mp4";
      }
    };

    return VideoCtrl;

  })();

  angular.module('app').controller('VideoCtrl', ['$scope', '$state', '$stateParams', VideoCtrl]);

}).call(this);

(function() {
  var TrustedFilter;

  TrustedFilter = (function() {
    function TrustedFilter($sce) {
      return function(url, type) {
        if (type && type === 'html') {
          return $sce.trustAsHtml(url);
        } else {
          return $sce.trustAsResourceUrl(url);
        }
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
  var BeaconCheckin;

  BeaconCheckin = (function() {
    function BeaconCheckin($rootScope, $http, settings) {
      this.$rootScope = $rootScope;
      this.$http = $http;
      this.settings = settings;
      this.url = this.settings.baseurl + "/beacon/checkin/";
      this.user = this.$rootScope.user;
      this.event = {
        ENTER: 0,
        LEAVE: 1,
        STAY: 2
      };
    }

    BeaconCheckin.prototype.checkin = function(bid, event) {
      var data;
      data = {
        uid: this.user.id,
        bid: bid,
        event: event,
        timestamp: new Date()
      };
      return this.$http.post(this.url, data);
    };

    return BeaconCheckin;

  })();

  angular.module("app").service('BeaconCheckin', ['$rootScope', '$http', 'settings', BeaconCheckin]);

}).call(this);

(function() {
  var BeaconManager, BeaconModel, BeaconState;

  BeaconState = (function() {
    function BeaconState($rootScope, $localStorage, event, $timeout, BeaconCheckin) {
      this.$rootScope = $rootScope;
      this.$localStorage = $localStorage;
      this.event = event;
      this.$timeout = $timeout;
      this.BeaconCheckin = BeaconCheckin;
    }

    BeaconState.prototype.enter_bus = function(bus) {
      if (this.$rootScope.bus && this.$rootScope.bus.bid === bus.bid) {
        return this.update_ts();
      } else {
        this.save_bus(bus);
        this.BeaconCheckin.checkin(bus.bid, this.BeaconCheckin.event.ENTER);
        return this.$rootScope.$broadcast(this.event.ENTER_BUS, bus);
      }
    };

    BeaconState.prototype.leave_bus = function(bus) {
      return this.leaveTimer = this.$timeout((function(_this) {
        return function() {
          _this.save_bus(null);
          _this.BeaconCheckin.checkin(bus.bid, _this.BeaconCheckin.event.LEAVE);
          return _this.$rootScope.$broadcast(_this.event.LEAVE_BUS, bus);
        };
      })(this), 30 * 1000);
    };

    BeaconState.prototype.on_bus = function(bus) {
      if (this.leaveTimer) {
        this.$timeout.cancel(this.leaveTimer);
      }
      return this.update_ts();
    };

    BeaconState.prototype.save_bus = function(bus) {
      this.$rootScope.bus = bus;
      this.$localStorage.bus = bus;
      return this.update_ts();
    };

    BeaconState.prototype.update_ts = function() {
      var now;
      now = new Date();
      this.$rootScope.beacon_last_ts = now;
      return this.$localStorage.beacon_last_ts = now;
    };

    BeaconState.prototype.is_on_bus = function(bus) {
      return this.$rootScope.bus && (this.$rootScope.bus.bid = bus.bid);
    };

    BeaconState.prototype.load_state = function() {
      this.$localStorage.$default({
        bus: {
          bid: "9527",
          plate_number: "粤E9527"
        }
      });
      this.$rootScope.bus = this.$localStorage.bus;
      return this.$rootScope.beacon_last_ts = this.$localStorage.beacon_last_ts;
    };

    return BeaconState;

  })();

  BeaconModel = (function() {
    function BeaconModel(identifier1, uuid1, major1, minor1, buses) {
      this.identifier = identifier1;
      this.uuid = uuid1;
      this.major = major1;
      this.minor = minor1;
      this.buses = buses;
    }

    return BeaconModel;

  })();

  BeaconManager = (function() {
    function BeaconManager() {}

    BeaconManager.prototype.init_beacon_models = function(data) {
      var d, i, len, results;
      this.beacon_models = [];
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        d = data[i];
        results.push(this.beacon_models.push(new BeaconModel(d.identifier, d.uuid, d.major, d.minor, d.stick_on)));
      }
      return results;
    };

    BeaconManager.prototype.find_bus = function(identifier, uuid, major, minor) {

      /*
      		major: Optional, maybe undefined
      		minor: Optional, maybe undefined
       */
      var predicator, ret;
      predicator = function(m) {
        var result;
        result = m.uuid.toUpperCase() === uuid.toUpperCase();
        if (identifier) {
          result = result && m.identifier === identifier;
        }
        if (major) {
          result = result && m.major.toString() === major.toString();
        }
        if (minor) {
          result = result && m.minor.toString() === minor.toString();
        }
        return result;
      };
      ret = _.filter(this.beacon_models, predicator);
      return ret && ret.length > 0 && ret[0].buses || null;
    };

    return BeaconManager;

  })();

  angular.module("app").service("BeaconState", ['$rootScope', '$localStorage', 'event', '$timeout', 'BeaconCheckin', BeaconState]);

  angular.module("app").service("BeaconManager", BeaconManager);

}).call(this);

(function() {
  var Beacons;

  Beacons = (function() {
    function Beacons($resource, settings) {
      this.$resource = $resource;
      this.settings = settings;
      this.url = this.settings.baseurl + '/api/beacon/:id/';
      this.beacon = this.$resource(this.url, null, {
        query: {
          method: 'GET',
          headers: {
            Authorization: void 0
          },
          isArray: true
        }
      });
    }

    Beacons.prototype.all = function() {
      return this.beacon.query();
    };

    return Beacons;

  })();

  angular.module('app').service('Beacons', ['$resource', 'settings', Beacons]);

}).call(this);

(function() {
  var BusData;

  BusData = (function() {
    function BusData($http, settings) {
      this.$http = $http;
      this.settings = settings;
      this.url = this.settings.baseurl + '/vehicle/busdata/';
    }

    BusData.prototype.busdata = function(bid) {
      return this.$http.get(this.url + bid + "/");
    };

    return BusData;

  })();

  angular.module('app').service('BusData', ['$http', 'settings', BusData]);

}).call(this);

(function() {
  var Messages;

  Messages = (function() {
    function Messages($resource, settings) {
      this.$resource = $resource;
      this.settings = settings;
      this.url = this.settings.baseurl + "/api/news/:id/";
      this.message = this.$resource(this.url, {
        id: '@id'
      });
    }

    Messages.prototype.all = function() {
      return this.message.query();
    };

    Messages.prototype.get = function(id) {
      return this.message.get({
        id: id
      });
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
  var UserProfile;

  UserProfile = (function() {
    function UserProfile($resource, settings) {
      this.$resource = $resource;
      this.settings = settings;
      this.url = this.settings.baseurl + '/api/userprofile/:id/';
      this.userProfile = this.$resource(this.url, {
        id: '@uid'
      }, {
        update: {
          method: 'PUT',
          headers: {
            'Content-Type': void 0
          }
        }
      });
    }

    UserProfile.prototype.save = function(user) {
      var fd;
      fd = this.formdata(user);
      return this.userProfile.update(fd);
    };

    UserProfile.prototype.formdata = function(data) {
      var addFormData, fd, key, value;
      fd = new FormData();
      addFormData = function(key, value) {
        var ext;
        if (Object.prototype.toString.apply(value) === "[object Blob]") {
          ext = value.type.split("/").pop();
          return fd.append(key, value, "avatar." + ext);
        } else {
          return fd.append(key, value);
        }
      };
      for (key in data) {
        value = data[key];
        addFormData(key, value);
      }
      fd['uid'] = data['uid'];
      return fd;
    };

    UserProfile.prototype.get = function(id) {
      return this.userProfile.get({
        id: id
      });
    };

    return UserProfile;

  })();

  angular.module('app').service('userProfile', ['$resource', 'settings', UserProfile]);

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
