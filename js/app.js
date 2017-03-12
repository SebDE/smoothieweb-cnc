angular.module("smoothieWeb", ['cfp.hotkeys'])
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        }
    })
    .factory('cmdService', function($http) {
        var config =  { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} };
        //var url = "http://cxy.bit.local/";
        var url = "http://192.168.0.34/";
        return {
            cmd_silent: function(cmd,callback) {
                $http.post(url+'command_silent',cmd+'\n',config).success(callback);
            },
            cmd: function(cmd,callback) {
                $http.post(url+'command',cmd+'\n',config).success(callback);
            }
        }
    })
    .factory('fhemService', function($http) {
        var config =  { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} };
        //var url = "http://cxy.bit.local/";
        var url = "http://192.168.0.146:8083/fhem?";
        return {
            cmd: function(cmd,callback) {
                $http.get(url+cmd,config).success(callback);
            }
        }
    })
    .component("jogPanel",{
        templateUrl: 'templates/jogPanel.html',
        controller: function($scope,cmdService,$rootScope,hotkeys){
            hotkeys.add({
                combo: 'up',
                description: 'Y +',
                callback: function() {
                    event.preventDefault();
                    $scope.jogYp();
                }
            });
            hotkeys.add({
                combo: 'down',
                description: 'Y -',
                callback: function() {
                    event.preventDefault();
                    $scope.jogYm();
                }
            });
            hotkeys.add({
                combo: 'left',
                description: 'X -',
                callback: function() {
                    event.preventDefault();
                    $scope.jogXm();
                }
            });
            hotkeys.add({
                combo: 'right',
                description: 'X +',
                callback: function() {
                    event.preventDefault();
                    $scope.jogXp();
                }
            });
            hotkeys.add({
                combo: '+',
                description: 'Z +',
                callback: function() {
                    event.preventDefault();
                    $scope.jogZp();
                }
            });
            hotkeys.add({
                combo: '-',
                description: 'Z -',
                callback: function() {
                    event.preventDefault();
                    $scope.jogZm();
                }
            });

            $rootScope.distance="1.0";
            $scope.setDistance = function(val) {
                $rootScope.distance = val;
            };
            $scope.motorOff = function() {
                cmdService.cmd_silent('M18',function (data,status) {
                    console.log(status);
                });
            };
            $scope.motorOn = function() {
                cmdService.cmd_silent('M17',function (data,status) {
                    console.log(status);
                });
            };
            $scope.jogXp = function() {
                cmdService.cmd_silent('G91 G0 X'+$rootScope.distance+' F1500 G90',function (data,status) {
                    console.log(status);
                });
            };
            $scope.jogXm = function() {
                cmdService.cmd_silent('G91 G0 X-'+$rootScope.distance+' F1500 G90',function (data,status) {
                    console.log(status);
                });
            };
            $scope.jogZp = function() {
                cmdService.cmd_silent('G91 G0 Z'+$rootScope.distance+' F750 G90',function (data,status) {
                    console.log(status);
                });
            };
            $scope.jogZm = function() {
                cmdService.cmd_silent('G91 G0 Z-'+$rootScope.distance+' F750 G90',function (data,status) {
                    console.log(status);
                });
            };
            $scope.jogYp = function() {
                cmdService.cmd_silent('G91 G0 Y'+$rootScope.distance+' F1500 G90',function (data,status) {
                    console.log(status);
                });
            };
            $scope.jogYm = function() {
                cmdService.cmd_silent('G91 G0 Y-'+$rootScope.distance+' F1500 G90',function (data,status) {
                    console.log(status);
                });
            }
        }
    })
    .component("powerPanel",{
        templateUrl: 'templates/powerPanel.html',
        controller: function($scope,fhemService){
            $scope.compToggle = function() {
                fhemService.cmd('cmd.Hauptschalter_Kompressor=set%20Hauptschalter_Kompressor%20toggle',function(data,status){
                   console.log(status);
                });
            };
            $scope.millToggle = function() {
                fhemService.cmd('cmd.Hauptschalter_Fraese=set%20Hauptschalter_Fraese%20toggle',function(data,status){
                    console.log(status);
                });
            };
            $scope.latheToggle = function() {
                fhemService.cmd('cmd.Hauptschalter_Drehbank=set%20Hauptschalter_Drehbank%20toggle',function(data,status){
                    console.log(status);
                });
            };
            $scope.USBToggle = function() {
                fhemService.cmd('cmd.USB_Ladegeraet=set%20USB_Ladegeraet%20toggle',function(data,status){
                    console.log(status);
                });
            };
        }
    })
    .component("wcsPanel",{
        templateUrl: 'templates/wcsPanel.html',
        controller: function($scope,cmdService){
            $scope.xpos = "0.000";
            $scope.zpos = "0.000";
            $scope.ypos = "0.000";
            $scope.getPos = function() {
                cmdService.cmd('M114',function (data,status) {
                    $scope.xpos = data.match(/[X][:]\d+[.]\d+/)[0].substring(2);
                    $scope.zpos = data.match(/[Z][:]\d+[.]\d+/)[0].substring(2);
                    $scope.ypos = data.match(/[Y][:]\d+[.]\d+/)[0].substring(2);
                });
            };
            $scope.homeX = function() {
                cmdService.cmd('G28 X',function (data,status) {
                    $scope.getPos();
                });
            };
            $scope.homeY = function() {
                cmdService.cmd('M17 G60 G4 P500 G61 G92 Y0',function (data,status) {
                    $scope.getPos();
                });
            };
            $scope.homeZ = function() {
                cmdService.cmd('G28 Z',function (data,status) {
                    $scope.getPos();
                });
            };
            $scope.zeroX = function() {
                cmdService.cmd('G92 X0',function (data,status) {
                    $scope.getPos();
                });
            };
            $scope.zeroZ = function() {
                cmdService.cmd('G92 Z0 G0 Z5',function (data,status) {
                    $scope.getPos();
                });
            };
            $scope.zeroY = function() {
                cmdService.cmd('G92 Y0',function (data,status) {
                    $scope.getPos();
                });
            };
            $scope.zeroXY = function() {
                cmdService.cmd('G92 X0 Y0',function (data,status) {
                    $scope.getPos();
                });
            };
        }
    })
    .component("filePanel",{
        templateUrl: 'templates/filePanel.html',
        controller: function($scope,cmdService){
            $scope.files = [];
            $scope.selectedFileIndex = -1;
            $scope.refreshFiles = function() {
                $scope.files = [];
                cmdService.cmd('M20',function (data,status) {
                    $.each(data.split("\n"), function(c) {
                        var e = this.trim();
                        if (e.match(/\.g(code)?$/)) {
                            $scope.files.push(e);
                        }
                    });
                });
            };
            $scope.selectFile = function(index) {
              $scope.selectedFileIndex = index;
            };
            $scope.unselectFile = function() {
                $scope.selectedFileIndex = -1;
            };
            $scope.playFile = function(index) {
                console.log('play /sd/'+$scope.files[index]);
                cmdService.cmd_silent('play /sd/'+$scope.files[index],function (data,status) {
                    console.log(status);
                });
            }
        }
    })
    .component("actionPanel",{
        templateUrl: 'templates/actionPanel.html',
        controller: function($scope,cmdService,hotkeys){
            hotkeys.add({
                combo: '3',
                description: 'Spindle On',
                callback: function() {
                    event.preventDefault();
                    $scope.spindleOn();
                }
            });
            hotkeys.add({
                combo: '5',
                description: 'Spindle Off',
                callback: function() {
                    event.preventDefault();
                    $scope.spindleOff();
                }
            });
            hotkeys.add({
                combo: '9',
                description: 'Cooling Off',
                callback: function() {
                    event.preventDefault();
                    $scope.coolOff();
                }
            });
            hotkeys.add({
                combo: '7',
                description: 'Mist On',
                callback: function() {
                    event.preventDefault();
                    $scope.mistOn();
                }
            });
            hotkeys.add({
                combo: '8',
                description: 'Air On',
                callback: function() {
                    event.preventDefault();
                    $scope.airOn();
                }
            });
            $scope.VacOn = function() {
                cmdService.cmd_silent('M10',function (data,status) {
                    console.log(status);
                });
            };
            $scope.VacOff = function() {
                cmdService.cmd_silent('M11',function (data,status) {
                    console.log(status);
                });
            };
            $scope.spindleOn = function() {
                cmdService.cmd_silent('M3',function (data,status) {
                    console.log(status);
                });
            };
            $scope.spindleOff = function() {
                cmdService.cmd_silent('M5',function (data,status) {
                    console.log(status);
                });
            };
            $scope.PSUOn = function() {
                cmdService.cmd_silent('M1',function (data,status) {
                    console.log(status);
                });
            };
            $scope.PSUOff = function() {
                cmdService.cmd_silent('M2',function (data,status) {
                    console.log(status);
                });
            };
            $scope.airOn = function() {
                cmdService.cmd_silent('M8',function (data,status) {
                    console.log(status);
                });
            };
            $scope.mistOn = function() {
                cmdService.cmd_silent('M7',function (data,status) {
                    console.log(status);
                });
            };
            $scope.coolOff = function() {
                cmdService.cmd_silent('M9',function (data,status) {
                    console.log(status);
                });
            };
            $scope.sendCMD = function() {
                cmdService.cmd(document.getElementById("cmdInput").value,function (data,status) {
                    console.log(data);
                });
            };
            $scope.resume = function() {
                cmdService.cmd('M24',function (data,status) {
                    console.log(data);
                });
            };
            $scope.halt = function() {
                cmdService.cmd('M25',function (data,status) {
                    console.log(data);
                });
            };
            $scope.resetBoard = function() {
                cmdService.cmd_silent('reset',function (data,status) {
                    console.log(status);
                });
            };
        }
    });

