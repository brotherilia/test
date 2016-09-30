"use strict";

module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);
  require("time-grunt")(grunt);

  grunt.initConfig({

    //*** Очистка ***//
    clean: {
      build: ["build"]
    },

    //*** Копирование ***//
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: "src/",
          src: [
            "css/**/*.css",
            "*.html"
          ],
          dest: "build"
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: "src/",
          src: ["*.html"],
          dest: "build"
        }]
      }
    },

    //*** Сборка CSS из LESS ***//
    less: {
      style: {
        files: {
          "build/css/style.css": "src/less/style.less"
        }
      }
    },

    //*** Обработка CSS: префиксование и "упаковка" медиа-запросов ***//
    postcss: {
      options: {
        processors: [
          require("autoprefixer")({browsers: [
            "last 2 versions",
            "> 1%"
          ]}),
          require("css-mqpacker")({
            sort: true
          })
        ]
      },
      style: {
        src: "build/css/style.css"
      }
    },

    //*** "Причесывание" CSS ***//
    csscomb: {
      style: {
        options: {
          config: "csscomb.json"
        },
        files: {
          "build/css/style.css": ["build/css/style.css"]
        }
      }
    },

    //*** Конкатенация CSS ***//
    concat: {
      css: {
        src: [ "build/css/normalize.css", "build/css/style.css" ],
        dest: "build/css/style.css",
        options: {
          separator: "\n\r/***** CONCATENATION HERE! *****/\n\r"
        }
      }
    },

    //*** Минификация CSS ***//
    csso: {
      style: {
        options: {
          report: "gzip"
        },
        files: {
          "build/css/style.min.css": ["build/css/style.css"]
        }
      }
    },

    //*** Локальный сервер с обновлением браузера ***//
    browserSync: {
      server: {
        bsFiles: {
          src: [
            "build/*.html",
            "build/css/*.css"
          ]
        },
        options: {
          server: "build/",
          watchTask: true,
          notify: false,
          open: true,
          ui: false
        }
      }
    },

    //*** Отслеживание изменений в исходниках ***//
    watch: {
      html: {
        files: ["src/*.html"],
        tasks: ["copy:html"],
        options: {spawn: false}
      },
      style: {
        files: ["src/less/**/*.less"],
        tasks: ["less", "postcss", "csscomb", "concat", "csso"],
        options: {spawn: false}
      }
    },

    //*** Отправка сборки в удаленную ветку "gh-pages" ***//
    "gh-pages": {
      options: {
        base: "build"
      },
      src: "**/*"
    }
  });

  grunt.registerTask("serve", [
    "browserSync",
    "watch"
  ]);

  grunt.registerTask("css", [
    "less",
    "postcss",
    "csscomb",
    "concat",
    "csso"
  ]);

  grunt.registerTask("build", [
    "clean",
    "copy:build",
    "css"
  ]);
};
