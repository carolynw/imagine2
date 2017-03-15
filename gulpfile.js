/*global require */
(function () {
    "use strict";

    var gulp = require("gulp"),
        concat = require("gulp-concat-util"),
        connect = require("gulp-connect"),
        del = require("del"),
        fileInclude = require("gulp-file-include"),
        merge = require("gulp-merge"),
        rename = require("gulp-rename"),
        replace = require("gulp-replace"),
        sass = require("gulp-sass"),
        uglify = require("gulp-uglify"),
        watch = require("gulp-watch");

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

    var src = {
        _root: "src/",
        html: [
            "src/html/**/*.html",
            "!src/html/**/_*.html" // exclude partial HTML files which should be handled by fileInclude
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

    var out = {
        _root: "dist/",
        html: "html/",
        fonts: "fonts/",
        images: "images/",
        scripts: "scripts/",
        styles: "styles/"
    };

    gulp.task("default", ["rebuild", "startLocalWebServer"]);
    gulp.task("rebuild", ["cleanOutput", "compileSass", "compileScripts", "compileHtml", "copyFonts", "copyImages"]);

    gulp.task("cleanOutput", function () {
        return del.sync(out._root + "**");
    });

    gulp.task("compileSass", function () {
        return gulp.src(src.sass)
            .pipe(sass().on("error", sass.logError))
            .pipe(gulp.dest(out._root + out.styles));
    });

    gulp.task("compileScripts", function () {
        var streams = [
            gulp.src(vendorSrc.scripts)
                .pipe(concat("sage.vendor.js"))
                .pipe(uglify())
                .pipe(rename({
                    suffix: ".min"
                })),
            gulp.src(src.scripts)
                .pipe(concat("sage.js"))
                .pipe(uglify())
                .pipe(rename({
                    suffix: ".min"
                }))
        ];

        return merge(streams)
            .pipe(gulp.dest(out._root + out.scripts));
    });

    gulp.task("compileHtml", function () {
        gulp.src(src._root + src.html + "index.html")
            .pipe(gulp.dest(out._root));

        return gulp.src(src.html)
            .pipe(fileInclude({prefix: "@@", basepath: "@file"})) // note that fileInclude doesn't directly support nested @@include statements
            .pipe(fileInclude({prefix: "@@", basepath: "@file"})) // so we run it twice to process the first nested level
            .pipe(replace(/[\u200B-\u200D\uFEFF]/g, "")) // strip out file BOMs left by fileInclude as it leads to whitespace issues
            .pipe(gulp.dest(out._root + out.html));
    });

    gulp.task("copyFonts", function () {
        return gulp.src(vendorSrc.fonts.concat(src.fonts))
            .pipe(gulp.dest(out._root + out.fonts));
    });

    gulp.task("copyImages", function () {
        return gulp.src(vendorSrc.images.concat(src.images))
            .pipe(gulp.dest(out._root + out.images));
    });

    gulp.task("startLocalWebServer", function () {
        gulp.watch([src._root + "html/**/*.html"], ["compileHtml", refreshWebServer]);
        gulp.watch([src._root + "sass/**/*.scss"], ["compileSass", refreshWebServer]);
        gulp.watch([vendorSrc.scripts, src.scripts], ["compileScripts", refreshWebServer]);
        gulp.watch([vendorSrc.images, src.images], ["copyImages", refreshWebServer]);
        gulp.watch([vendorSrc.fonts, src.fonts], ["copyFonts", refreshWebServer]);

        function refreshWebServer() {
            return gulp.src(out._root)
                .pipe(connect.reload());
        }

        return connect.server({
            port: 8888,
            root: out._root,
            livereload: true
        });
    });
}());