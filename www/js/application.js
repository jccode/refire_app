(function() {
  angular.module('app', ['ionic', 'ngCookies', 'ngCordova', 'gettext', 'ngStorage', 'permission', 'base64']);

}).call(this);

(function() {
  var Bootstrap;

  Bootstrap = (function() {
    function Bootstrap($ionicPlatform, $http, settings) {
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

  angular.module('app').run(['$ionicPlatform', '$http', 'settings', Bootstrap]);

}).call(this);

(function() {
  angular.module('app').constant({
    'userRoles': {
      user: 'user',
      admin: 'admin'
    },
    'event': {
      LOGIN: 'login',
      LOGOUT: 'logout'
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
            only: [roles.user]
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
            only: [roles.user]
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
            only: [roles.admin]
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

  angular.module('app').config(['$stateProvider', '$urlRouterProvider', 'userRoles', Config]);

}).call(this);

(function() {
  angular.module('app').constant({
    'settings': {
      baseurl: 'http://192.168.1.103:8080',
      apiurl: 'http://192.168.1.103:8080/api'
    }
  });

}).call(this);

(function() {
  var Ajax;

  Ajax = (function() {
    function Ajax($httpProvider, $rootScope, event) {
      var basic_auth_header, serialize;
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
      basic_auth_header = function(user) {
        return 'Basic ' + $base64.encode(user.username + ':' + user.password);
      };
      $httpProvider.defaults.headers.common['Authorization'] = basic_auth_header($rootScope.user);
      $rootScope.$on(event.LOGIN, function(event, user) {
        return $httpProvider.defaults.headers.common['Authorization'] = basic_auth_header(user);
      });
      $rootScope.$on(event.LOGOUT, function(event) {
        return $httpProvider.defaults.headers.common['Authorization'] = '';
      });
    }

    return Ajax;

  })();

  angular.module('app').config(['$httpProvider', '$rootScope', 'event', Ajax]);

}).call(this);

(function() {
  var Config, CsrfInterceptor,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CsrfInterceptor = (function() {
    function CsrfInterceptor($cookies) {
      var allowMethods, cookieName, headerName;
      headerName = 'X-XSRF-TOKEN';
      cookieName = 'XSRF-TOKEN';
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

}).call(this);

(function() {
  var AppCtrl;

  AppCtrl = (function() {
    function AppCtrl($scope, $rootScope, $state, $ionicModal, $ionicPopup, $timeout, auth, $ionicHistory, Util) {
      var self;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$ionicModal = $ionicModal;
      this.$ionicPopup = $ionicPopup;
      this.$timeout = $timeout;
      this.auth = auth;
      this.$ionicHistory = $ionicHistory;
      this.Util = Util;
      this.loginModal();
      this.permissionCheck();
      this.$scope.loginData = {};
      self = this;
      this.$scope.doLogin = (function(_this) {
        return function() {
          console.log('Doing login', JSON.stringify(_this.$scope.loginData));
          return _this.auth.login(_this.$scope.loginData, function(user) {
            console.log('login success.', JSON.stringify(user));
            _this.$ionicHistory.nextViewOptions({
              disableBack: true
            });
            _this.$state.go(_this.forward.name);
            return _this.$scope.closeLogin();
          }, function(e) {
            this.Util.toast('login failed.' + JSON.stringify(e));
            return console.log('login failed', JSON.stringify(e));
          });
        };
      })(this);
      this.$scope.logout_old = (function(_this) {
        return function() {
          return _this.auth.logout(function() {
            _this.Util.toast('logout successful');
            console.log('logout successful');
            _this.$ionicHistory.nextViewOptions({
              disableBack: true
            });
            return _this.$state.go('app.playlists');
          }, function(e) {
            _this.Util.toast('logout failed. ' + JSON.stringify(e));
            return console.log('logout failed. ' + JSON.stringify(e));
          });
        };
      })(this);
      this.$scope.logout = (function(_this) {
        return function() {
          _this.auth.logout();
          _this.Util.toast('logout successful');
          console.log('logout successful');
          _this.$ionicHistory.nextViewOptions({
            disableBack: true
          });
          return _this.$state.go('app.playlists');
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
      return this.$scope.$on("$stateChangePermissionDenied", (function(_this) {
        return function(toState, toParams) {
          if (!_this.auth.isLoggedIn()) {
            console.log(toState);
            console.log(toParams);
            _this.forward = toParams;
            return _this.$scope.login();
          } else {
            return _this.$ionicPopup.alert({
              title: 'Permission denied',
              template: 'You don\'t have permission to view this page.'
            });
          }
        };
      })(this));
    };

    return AppCtrl;

  })();

  angular.module('app').controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicPopup', '$timeout', 'Auth', '$ionicHistory', 'Util', AppCtrl]);

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
  var Auth,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Auth = (function() {
    function Auth($http, $rootScope, $localStorage, $base64, settings, event) {
      var $storage, anon_user, get_current_user, l, role_prefix, set_current_user;
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
        this.user = user;
        return user;
      };
      role_prefix = 'ROLE_';
      l = role_prefix.length;
      this.user = get_current_user();
      this.authorize = (function(_this) {
        return function(role) {
          var auth, auths;
          console.log(_this.user.authorities);
          auths = (function() {
            var i, len, ref, results;
            ref = this.user.authorities;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              auth = ref[i];
              results.push(auth.authority.slice(l).toLowerCase());
            }
            return results;
          }).call(_this);
          return indexOf.call(auths, role) >= 0;
        };
      })(this);
      this.isLoggedIn = (function(_this) {
        return function(user) {
          user = user || _this.user;
          return user.username !== '';
        };
      })(this);
      this.login_old = (function(_this) {
        return function(user, success, error) {
          return $http.post(settings.baseurl + '/login', user).success(function(user) {
            set_current_user(user);
            return success(user);
          }).error(error);
        };
      })(this);
      this.login = (function(_this) {
        return function(user, success, error) {
          var headers;
          headers = {
            Authorization: 'Basic ' + $base64.encode(user.username + ':' + user.password)
          };
          return $http.post(settings.apiurl + '/user', user, {
            headers: headers
          }).success(function(user) {
            set_current_user(user);
            success(user);
            return $rootScope.$broadcast(event.LOGIN, user);
          }).error(error);
        };
      })(this);
      this.logout_old = (function(_this) {
        return function(success, error) {
          return $http.post(settings.baseurl + '/logout').success(function() {
            set_current_user(anon_user);
            return success();
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
          return fn('ok');
        }, function(error) {
          return fn(error);
        });
      } else {
        return this.$ionicPopup.alert({
          template: msg
        }).then(function(res) {
          return fn(res);
        });
      }
    };

    return Util;

  })();

  angular.module('app').service('Util', ['$rootScope', '$window', '$ionicPopup', '$cordovaToast', Util]);

}).call(this);
