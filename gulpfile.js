/*global require */
(function () {
    "use strict";

    var gulp = require("gulp"),
        concat = require("gulp-concat-util"),
        connect = require("gulp-connect"),
        cssmin = require("gulp-cssmin"),
        del = require("del"),
        fileInclude = require("gulp-file-include"),
        htmlhint = require("gulp-htmlhint"),
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
        fonts: "Content/fonts/",
        images: "Content/images/",
        scripts: "Content/scripts/",
        styles: "Content/styles/"
    };

    gulp.task("default", ["rebuild", "startLocalWebServer"]);
    gulp.task("rebuild", ["cleanOutput", "compileSass", "compileScripts", "compileHtml", "copyFonts", "copyImages"]);

    gulp.task("cleanOutput", function () {
        return del.sync(out._root + "**");
    });

    gulp.task("compileSass", function () {
        return gulp.src(src.sass)
            .pipe(sass().on("error", sass.logError))
            .pipe(cssmin())
            .pipe(rename({suffix: ".min"}))
            .pipe(gulp.dest(out._root + out.styles));
    });

    gulp.task("compileScripts", function () {
        return merge(compileVendorScripts(), compileScripts())
            .pipe(gulp.dest(out._root + out.scripts));

        function compileVendorScripts() {
            return gulp.src(vendorSrc.scripts)
                .pipe(concat("sage.vendor.js"))
                .pipe(uglify())
                .pipe(rename({suffix: ".min"}));
        }

        function compileScripts() {
            // The concats wrap the entire output .js in a single "use strict" statement and removes the redundant nested ones
            return gulp.src(src.scripts)
                .pipe(concat("sage.js", {process: stripUseStrictStatements}))
                .pipe(concat.header("(function() { \n  \"use strict\";\n\n"))
                .pipe(concat.footer("\n}());"))
                .pipe(uglify())
                .pipe(rename({
                    suffix: ".min"
                }));

            function stripUseStrictStatements(src) {
                return src.replace(/\s*(?:"|')use strict(?:"|');\s*\n/g, "\n");
            }
        }
    });

    gulp.task("compileHtml", function () {
        return merge(copyRedirect(), compileHtml());

        function copyRedirect() {
            return gulp.src(src._root + "html/index.html")
                .pipe(gulp.dest(out._root));
        }

        function compileHtml() {
            return gulp.src(src.html)
                .pipe(fileInclude({prefix: "@@", basepath: "@file"})) // note that fileInclude doesn't directly support nested @@include statements
                .pipe(fileInclude({prefix: "@@", basepath: "@file"})) // so we run it twice to process the first nested level
                .pipe(replace(/[\u200B-\u200D\uFEFF]/g, "")) // strip out file BOMs left by fileInclude as it leads to whitespace issues
                .pipe(htmlhint("./htmlhint.json"))
                .pipe(htmlhint.reporter())
                .pipe(gulp.dest(out._root + out.html));
        }
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