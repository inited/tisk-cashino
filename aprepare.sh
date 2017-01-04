#!/bin/sh
rm -rf platforms plugins
mkdir platforms plugins
ionic platform add android
ionic plugin add cordova-plugin-console
ionic plugin add cordova-plugin-device
ionic plugin add cordova-plugin-splashscreen
ionic plugin add cordova-plugin-statusbar
ionic plugin add cordova-plugin-bluetoothle
ionic plugin add cordova-plugin-whitelist