# Simple Webinterface for Smoothieboard as CNC Controller

## Configuration

1. Change IP to match to your Smoothieboard IP in js/app.js

```javascript
.factory('cmdService', function($http) {
        var config =  { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} };
        //var url = "http://cxy.bit.local/";
        var url = "http://192.168.0.34/";
```
