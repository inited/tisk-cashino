(function() {
	"use strict";

	angular
		.module('app')
		.factory("printService", service);

	service.$inject = ['bluetoothService', '$q', '$timeout'];

	function service(bluetoothService, $q, $timeout) {

		var cp1250 = {129:1,131:3,136:8,144:16,152:24,160:32,164:36,166:38,167:39,168:40,169:41,171:43,172:44,173:45,174:46,176:48,177:49,180:52,181:53,182:54,183:55,184:56,187:59,193:65,194:66,196:68,199:71,201:73,203:75,205:77,206:78,211:83,212:84,214:86,215:87,218:90,220:92,221:93,223:95,225:97,226:98,228:100,231:103,233:105,235:107,237:109,238:110,243:115,244:116,246:118,247:119,250:122,252:124,253:125,258:67,259:99,260:37,261:57,262:70,263:102,268:72,269:104,270:79,271:111,272:80,273:112,280:74,281:106,282:76,283:108,313:69,314:101,317:60,318:62,321:35,322:51,323:81,324:113,327:82,328:114,336:85,337:117,340:64,341:96,344:88,345:120,346:12,347:28,350:42,351:58,352:10,353:26,354:94,355:126,356:13,357:29,366:89,367:121,368:91,369:123,377:15,378:31,379:47,380:63,381:14,382:30,711:33,728:34,729:127,731:50,733:61,8211:22,8212:23,8216:17,8217:18,8218:2,8220:19,8221:20,8222:4,8224:6,8225:7,8226:21,8230:5,8240:9,8249:11,8250:27,8364:0,8482:25};

		function html2pos(txt) {
			console.log(txt);
			return txt
				.replace(/^<?[^>]*?>/g,    "")
				.replace(/<!--[^>]*-->/g,    "")
				.replace(/ class="ng-binding"/g, "")

				.replace(/\n/g,         "")
				.replace(/<pos>/g,      "\x1B@")
				.replace(/<\/pos>/g,    "")
				.replace(/<h1>/g,       "\x1B!\x30")
				.replace(/<\/h1>/g,     "\x1B!\x00")
				.replace(/<h2[^>]*>/g,       "\x1B!\x20")
				.replace(/<\/h2>/g,     "\x1B!\x00")
				.replace(/<h3>/g,       "\x1B!\x10")
				.replace(/<\/h3>/g,     "\x1B!\x00")
				.replace(/<br( )*\/>/g, "\n")
				.replace(/<br>/g, 		"\n")
				.replace(/<center>/g,   "\x1b@\x1Ba\x01")
				.replace(/<\/center>/g, "\x1Ba\x00")
				.replace(/<b>/g,        "\x1B!\x08")
				.replace(/<\/b>/g,      "\x1B!\x00")
				.replace(/<small[^>]*>/g,    "\x1B!\x01")
				.replace(/<\/small>/g,  "\x1B!\x00")
				.replace(/<u>/g,        "\x1B-\x02")
				.replace(/<\/u>/g,      "\x1B-\x00")
				.replace(/<i>/g,        "\x1B-\x01")
				.replace(/<\/i>/g,      "\x1B-\x00")
				.replace(/<div[^>]*>/g, "")
				.replace(/<\/div>/g,  "")
				;
		}

		function btPrint(s, address, serviceUUID, charUUID) {
			var len = 75;
			console.log("btPrint()");
			var deferred = $q.defer();
			var string = "\x1b@Write Hello World\r\n";
			var bytes = stringToBytes1250(s.substr(0,len));
			var encodedString = bluetoothle.bytesToEncodedString(bytes);
			bluetoothle.write(function (res) {
					console.log("write res:" + JSON.stringify(res));
					console.log("write len:" + s.length);
					if (s.length > len) {
						$timeout(function () {
							console.log("tisknu zbytek");
							btPrint(s.substr(len), address, serviceUUID, charUUID).then(deferred.resolve, deferred.reject);
						}, 100);
					} else {
						$timeout(function () {
							console.log("uz mam vsechno vytisknute");
							deferred.resolve(res);
						}, 5000);
					}
				}, function (res) {
					console.log("write err:" + JSON.stringify(res));
					deferred.reject(res);
				},
				{
					"service": serviceUUID,
					"address": address,
					"characteristic": charUUID,
					"value":encodedString,
					"type":"noResponse"
				});

			return deferred.promise;
		}

		function stringToBytes1250(string) {
			var bytes = new ArrayBuffer(string.length * 2);
			var bytesUint16 = new Uint16Array(bytes);
			for (var i = 0; i < string.length; i++) {
				var c = string.charCodeAt(i);
				if (c >= 129) {
					c = cp1250[c];
					if (c) {
						c += 128;
					} else {
						c = 46; //tecka
					}
				}
				bytesUint16[i] = c;
			}
			return new Uint8Array(bytesUint16);
		}

		function print(html) {
			var deferred = $q.defer();
			var device = bluetoothService.getConnectedDevice();
			if(device == null) {
				deferred.reject({message:"No device connected"});
			} else {
				bluetoothService.discover(device.address).then(function(response) {
					console.log(response);
					var writeService = null;
					var writeCharacteristics = null;
					for (var i in response.services) {
						var service = response.services[i];
						for (var j in service.characteristics) {
							var characteristic = service.characteristics[j];
							if (characteristic.properties.write &&
								characteristic.properties.write == true &&
								characteristic.properties.writeWithoutResponse &&
								characteristic.properties.writeWithoutResponse == true) {
								writeCharacteristics = characteristic;
								break;
							}
						}
						if (writeCharacteristics != null) {
							writeService = service;
							break;
						}
					}

					if (writeService != null && writeCharacteristics != null) {
						btPrint(html2pos(html), device.address, writeService.uuid, writeCharacteristics.uuid).then(deferred.resolve, deferred.reject);
					}
				});
			}

			return deferred.promise;
		}

		return {
			print: print
		};
	}
})();