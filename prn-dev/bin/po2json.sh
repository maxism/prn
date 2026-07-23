#!/bin/bash

cd bin
npx po2json "../locales/ru.po" -f jed -p "../assets/locales/ru.json"
# node "../node_modules/po2json/bin/po2json" "../locales/de.po" -f jed -p "../assets/locales/de.json"
