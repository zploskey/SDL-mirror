var j = require('path').join;

var platformspecificargs = "";
if (process.platform === 'darwin') { // OSX
  // The reason we need to have the -lSDL flag here and not use the bsconfig's
  // static_library field is that SDL2 is a dynamically loaded library. Adding
  // this flag to the linker, it automatically figures out what to do.
  platformspecificargs = 
    `"-framework", "CoreFoundation", "-framework", "CoreAudio", "-framework", "AudioToolbox", "-framework", "CoreVideo", "-framework", "Cocoa", "-framework", "Carbon", "-framework", "IOKit", "-lm", "-liconv", "-lobjc"`;
} else if (process.platform === 'freebsd' 
        || process.platform === 'linux'
        || process.platform === 'sunos') { // Linux-ish
  // Assume that those are installed globally
  // Unless out of date, use 
  // 
  //   sudo apt-get install mesa-common-dev
  //   sudo apt-get install freeglut3
  //   sudo apt-get install freeglut3-dev
  // 
  // To install OpenGL on linux.
  platformspecificargs = `"-lm", "-dl", "-lpthread", "-lrt"`
} else if (process.platform === "win32") {
  platformspecificargs = `"-lgdi32", "-lwinmm", "-limm32", "-lole32", "-loleaut32", "-lversion", "-lmingw32", "-lopengl32"`;
} else {
  throw new Error("Platform not support :(");
}

var bsconfigjson = `{
  "name": "sdl2",
  "sources": "fake_src",
  "c-linker-flags": [${platformspecificargs}],
  "static-libraries": ["libSDL2.a"],
  "allowed-build-kinds": ["bytecode", "native"],
  "refmt": 3,
}`;

require('fs').writeFileSync(j(__dirname, 'bsconfig.json'), bsconfigjson);
