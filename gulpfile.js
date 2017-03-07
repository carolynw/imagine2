/*global require */
(function () {
  "use strict";

  var gulp = require("gulp"),
    concat = require("gulp-concat-util"),
    connect = require("gulp-connect"),
    del = require("del"),
    fileInclude = require("gulp-file-include"),
    inject = require("gulp-inject"),
    rename = require("gulp-rename"),
    replace = require("gulp-replace"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify"),
    watch = require("gulp-watch");

  var src = {
    _root: "src/",
    html: [
      "src/html/**/*.html",
      "!src/html/**/_*.html" // excludes partials
    ],
    fonts: [
      "src/fonts/**/*.{ttf,woff,woff2,eot,svg}"
    ],
    images: [
      "src/images/**/*.{svg,gif,jpg,png,tif}"
    ],
    sass: [
      "src/sass/sage.scss"
    ],
    scripts: [
      "src/scripts/**/*.js"
    ]
  };

  var vendorSrc = {
    fonts: [
      "node_modules/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}",
      "node_modules/bootstrap/dist/fonts/**/*.{ttf,woff,woff2,eot,svg}",
      "node_modules/slick-carousel/slick/fonts/**/*.{ttf,woff,woff2,eot,svg}"
    ],
    images: [
      "node_modules/slick-carousel/slick/ajax-loader.gif"
    ],
    sass: [],
    scripts: [
      "node_modules/jquery/dist/jquery.js",
      "node_modules/bootstrap/dist/js/bootstrap.js",
      "node_modules/ScrollMagic/scrollmagic/uncompressed/ScrollMagic.js",
      "node_modules/slick-carousel/slick/slick.js",
      "node_modules/waypoints/lib/jquery.waypoints.js",
      "node_modules/waypoints/lib/shortcuts/inview.js"
    ]
  };

  var out = {
    _root: "dist/",
    html: "html/",
    fonts: "fonts/",
    images: "images/",
    scripts: "scripts/",
    styles: "styles/"
  };

  gulp.task("default", ["buildAll", "startLocalWebServer", "watch"]);
  gulp.task("buildAll", ["cleanOutput", "compileAllScripts", "compileSass", "compileHtml", "copyAllFonts", "copyAllImages", "moveRedirect"]);

  gulp.task("cleanOutput", function () {
    return del.sync(out._root + "**");
  });

  gulp.task("compileSass", function () {
    return gulp.src(src.sass)
      .pipe(sass().on("error", sass.logError))
      .pipe(gulp.dest(out._root + out.styles));
  });

  gulp.task("compileVendorScripts", function () {
    return gulp.src(vendorSrc.scripts)
      .pipe(concat("sage.vendor.js"))
      .pipe(gulp.dest(out._root + out.scripts))
      .pipe(uglify())
      .pipe(rename({
        suffix: ".min"
      }))
      .pipe(gulp.dest(out._root + out.scripts));
  });

  gulp.task("compileSrcScripts", function () {
    return gulp.src(src.scripts)
      .pipe(concat("sage.js"))
      .pipe(gulp.dest(out._root + out.scripts))
      .pipe(uglify())
      .pipe(rename({
        suffix: ".min"
      }))
      .pipe(gulp.dest(out._root + out.scripts));
  });

  gulp.task("compileAllScripts", ["compileVendorScripts", "compileSrcScripts"]);

  gulp.task("copyVendorFonts", function () {
    return gulp.src(vendorSrc.fonts)
      .pipe(gulp.dest(out._root + out.fonts));
  });

  gulp.task("copySrcFonts", function () {
    return gulp.src(src.fonts)
      .pipe(gulp.dest(out._root + out.fonts));
  });

  gulp.task("copyAllFonts", ["copyVendorFonts", "copySrcFonts"]);

  gulp.task("copyVendorImages", function () {
    return gulp.src(vendorSrc.images)
      .pipe(gulp.dest(out._root + out.images));
  });

  gulp.task("copySrcImages", function () {
    return gulp.src(src.images)
      .pipe(gulp.dest(out._root + out.images));
  });

  gulp.task("copyAllImages", ["copyVendorImages", "copySrcImages"]);

  gulp.task("compileHtml", ["compileAllScripts", "compileSass"], function () {
    var sageContent = gulp.src([out._root + out.scripts + "sage.min.js", out._root + out.styles + "sage.css"], {read: false});
    var vendorContent = gulp.src([out._root + out.scripts + "sage.vendor.min.js", out._root + out.styles + "sage.vendor.css"], {read: false});

    return gulp.src(src.html)
      .pipe(fileInclude({prefix: "@@", basepath: '@file'}))
      .pipe(replace(/[\u200B-\u200D\uFEFF]/g, "")) // works around a bug in fileInclude
      .pipe(inject(vendorContent, {name: "vendor", ignorePath: out._root}))
      .pipe(inject(sageContent, {name: "sage", ignorePath: out._root}))
      .pipe(gulp.dest(out._root + out.html));
  });

  gulp.task("moveRedirect", ["compileHtml"], function () {
    return gulp.src(out._root + out.html + "index.html")
      .pipe(gulp.dest(out._root));
  });

  gulp.task("startLocalWebServer", function () {
    return connect.server({
      port: 8888,
      root: out._root,
      livereload: true
    });
  });

  gulp.task("watch", function () {
    gulp.watch([src._root + "html/**/*.html"], ["compileHtml", refreshWebServer]);
    gulp.watch([src._root + "sass/**/*.scss"], ["compileSass", refreshWebServer]);
    gulp.watch([vendorSrc.scripts, src.scripts], ["compileAllScripts", refreshWebServer]);
    gulp.watch([vendorSrc.images, src.images], ["copyAllImages", refreshWebServer]);
    gulp.watch([vendorSrc.fonts, src.fonts], ["copyAllFonts", refreshWebServer]);

    function refreshWebServer() {
      return gulp.src(out._root)
        .pipe(connect.reload());
    }
  });
}());