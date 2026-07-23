#!/bin/bash
cd bin
npx babel "../app" -d "../src_es5" --presets=@babel/preset-env,@babel/react --plugins=@babel/plugin-proposal-class-properties,@babel/plugin-proposal-export-default-from,@babel/plugin-proposal-optional-chaining;
find "../src_es5" -type f \( -name '*.js' \) -print > "../list";

tools/bin/xgettext.exe --omit-header --keyword=l --keyword=ln:1,2 --keyword=lc:1c,2 --keyword=lnc:1c,2,3 --files-from="../list" --language=JavaScript --from-code=UTF-8 --join-existing --output="../locales/ru.po";

rm -rf "../src_es5";
rm -rf "../list";
