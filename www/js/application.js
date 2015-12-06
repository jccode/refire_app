(function() {
  angular.module('app', ['ionic', 'ngCordova', 'gettext', 'ngStorage', 'permission']);

}).call(this);

(function() {
  var Bootstrap;

  Bootstrap = (function() {
    function Bootstrap($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          return StatusBar.styleDefault();
        }
      });
    }

    return Bootstrap;

  })();

  angular.module('app').run(['$ionicPlatform', Bootstrap]);

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
  var Roles,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Roles = (function() {
    function Roles(Permission, $rootScope) {
      $rootScope.roles = ['user', 'admin'];
      Permission.defineManyRoles(['user', 'admin'], function(stateParams, roleName) {
        return indexOf.call($rootScope.roles, roleName) >= 0;
      });
    }

    return Roles;

  })();

  angular.module('app').run(['Permission', '$rootScope', Roles]);

}).call(this);

(function() {
  var Config;

  Config = (function() {
    function Config($stateProvider, $urlRouterProvider) {
      $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      }).state('app.health', {
        url: '/health',
        views: {
          'menuContent': {
            templateUrl: 'templates/health.html'
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
            only: ['user', 'admin']
          }
        }
      }).state('app.setting', {
        url: '/setting',
        views: {
          'menuContent': {
            templateUrl: 'templates/setting.html'
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
            only: ['user', 'admin']
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
        },
        data: {
          permissions: {
            only: ['admin']
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
      });
      $urlRouterProvider.otherwise('/app/playlists');
    }

    return Config;

  })();

  angular.module('app').config(['$stateProvider', '$urlRouterProvider', Config]);

}).call(this);

(function() {
  var AppCtrl;

  AppCtrl = (function() {
    function AppCtrl($scope, $ionicModal, $timeout) {
      $scope.loginData = {};
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        return $scope.modal = modal;
      });
      $scope.closeLogin = function() {
        return $scope.modal.hide();
      };
      $scope.login = function() {
        return $scope.modal.show();
      };
      $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        return $timeout(function() {
          return $scope.closeLogin();
        }, 1000);
      };
      $scope.logout = function() {
        return console.log('Logout');
      };
    }

    return AppCtrl;

  })();

  angular.module('app').controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', AppCtrl]);

}).call(this);

(function() {
  var NativeTestCtrl;

  NativeTestCtrl = (function() {
    function NativeTestCtrl($scope, $cordovaDevice, $cordovaToast, $cordovaLocalNotification) {
      this.$scope = $scope;
      this.$cordovaDevice = $cordovaDevice;
      this.$cordovaToast = $cordovaToast;
      this.$cordovaLocalNotification = $cordovaLocalNotification;
      this.deviceInfo();
      this.toast();
      this.localNotification();
    }

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

  angular.module('app').controller('NativeTestCtrl', ['$scope', '$cordovaDevice', '$cordovaToast', '$cordovaLocalNotification', NativeTestCtrl]);

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
  var TestCtrl;

  TestCtrl = (function() {
    function TestCtrl($scope, $ionicPopover, $ionicHistory, $state, $rootScope) {
      this.$scope = $scope;
      this.$ionicPopover = $ionicPopover;
      this.$ionicHistory = $ionicHistory;
      this.$state = $state;
      this.$rootScope = $rootScope;
      this.initPopover();
      this.$scope.changeRole = (function(_this) {
        return function() {
          return _this.$rootScope.roles = ['user', 'admin'];
        };
      })(this);
    }

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

  angular.module('app').controller('TestCtrl', ['$scope', '$ionicPopover', '$ionicHistory', '$state', '$rootScope', TestCtrl]);

}).call(this);

(function() {
  var Auth;

  Auth = (function() {
    function Auth($http, $rootScope, $localStorage) {
      var $storage, anon_user, get_current_user, set_current_user;
      anon_user = {
        username: '',
        authorities: []
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
        return user;
      };
      this.userRoles = {};
      this.user = get_current_user();
      this.authorize = (function(_this) {
        return function(access) {
          return false;
        };
      })(this);
      this.isLoggedIn = (function(_this) {
        return function(user) {
          return false;
        };
      })(this);
      this.login = (function(_this) {
        return function(user, success, error) {
          return $http.post('/login', user).success(function(user) {
            set_current_user(user);
            return success(user);
          }).error(error);
        };
      })(this);
      this.logout = (function(_this) {
        return function(success, error) {
          return $http.post('/logout').success(function() {
            set_current_user(anon_user);
            return success();
          }).error(error);
        };
      })(this);
      return this;
    }

    return Auth;

  })();

  angular.module('app').factory('Auth', ['$http', '$rootScope', '$localStorage', Auth]);

}).call(this);
