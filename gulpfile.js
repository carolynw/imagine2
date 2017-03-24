/// <binding BeforeBuild='rebuild' Clean='cleanOutputs' ProjectOpened='default' />
/*global require, module */

"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    connect = require("gulp-connect"),
    del = require("del"),
    fileInclude = require("gulp-file-include"),
    htmlHint = require("gulp-htmlhint"),
    merge = require("gulp-merge"),
    rename = require("gulp-rename"),
    replace = require("gulp-replace"),
    sass = require("gulp-sass"),
    sourceMaps = require("gulp-sourcemaps"), // Ensure other modules are supported - https://github.com/floridoo/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support
    uglify = require("gulp-uglify"),
    wrapJs = require("gulp-wrap-js");

var gulpConfig = {
    themeProjectRoot: "./src/",
    webProjectRoot: "./tmp/",
    testSiteRoot: "./dist/",
    contentFolder: "Content/"
};

/*****************************
 Sources
 *****************************/

var vendorSrc = {
    fonts: [
        "./node_modules/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}",
        "./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff,woff2,eot,svg}",
        "./node_modules/slick-carousel/slick/fonts/**/*.{ttf,woff,woff2,eot,svg}"
    ],
    images: [
        "./node_modules/slick-carousel/slick/ajax-loader.gif"
    ],
    sass: [],
    scripts: [
        "./node_modules/jquery/dist/jquery.js",
        "./node_modules/bootstrap/dist/js/bootstrap.js",
        "./node_modules/ScrollMagic/scrollmagic/uncompressed/ScrollMagic.js",
        "./node_modules/slick-carousel/slick/slick.js"
    ]
};

var src = {
    html: [
        gulpConfig.themeProjectRoot + "html/**/*.html",
        "!" + gulpConfig.themeProjectRoot + "html/**/_*.html" // excludes 'partial' HTML files which should be handled by fileInclude
    ],
    fonts: [
        gulpConfig.themeProjectRoot + "fonts/**/*.{ttf,woff,woff2,eot,svg}"
    ],
    images: [
        gulpConfig.themeProjectRoot + "images/**/*.{svg,gif,jpg,png,tif}"
    ],
    sass: [
        gulpConfig.themeProjectRoot + "sass/sage.scss",
        gulpConfig.themeProjectRoot + "sass/htmlEditor.scss"
    ],
    scripts: [
        gulpConfig.themeProjectRoot + "scripts/framework/**/*.js", // important: must be first due to load-order concerns
        gulpConfig.themeProjectRoot + "scripts/**/*.js",
        "!" + gulpConfig.themeProjectRoot + "scripts/**/*.test.js" // exclude unit tests
    ]
};

/*****************************
 Frontend Test Site
 *****************************/

gulp.task("TestSite-Server", ["TestSite-All"], function () {
    gulp.watch([gulpConfig.themeProjectRoot + "html/**/*.html"], ["TestSite-Html", refreshWebServer]);
    gulp.watch([vendorSrc.fonts, src.fonts], ["TestSite-Fonts", refreshWebServer]);
    gulp.watch([vendorSrc.images, src.images], ["TestSite-Images", refreshWebServer]);
    gulp.watch([gulpConfig.themeProjectRoot + "sass/**/*.scss"], ["TestSite-Sass", refreshWebServer]);
    gulp.watch([vendorSrc.scripts, src.scripts], ["TestSite-Scripts", refreshWebServer]);

    function refreshWebServer() {
        return gulp.src(gulpConfig.webProjectRoot)
            .pipe(connect.reload());
    }

    return connect.server({
        port: 8888,
        root: gulpConfig.testSiteRoot,
        livereload: true
    });
});

gulp.task("TestSite-All", ["TestSite-Clean", "Content-All", "TestSite-Fonts", "TestSite-Html", "TestSite-Images", "TestSite-Sass", "TestSite-Scripts"]);

gulp.task("TestSite-Clean", function () {
    // del.sync ensures del completes before other tasks are run
    return del.sync([gulpConfig.testSiteRoot + "**"]);
});

gulp.task("TestSite-Fonts", ["Content-Fonts"], function () {
    return gulp.src(gulpConfig.webProjectRoot + gulpConfig.contentFolder + "fonts/**")
        .pipe(gulp.dest(gulpConfig.testSiteRoot + gulpConfig.contentFolder + "fonts/"));
});

gulp.task("TestSite-Html", function () {
    return merge(copyRedirect(), compileHtml());

    function copyRedirect() {
        return gulp.src(gulpConfig.themeProjectRoot + "html/index.html")
            .pipe(gulp.dest(gulpConfig.testSiteRoot));
    }

    function compileHtml() {
        return gulp.src(src.html)
            .pipe(fileInclude({prefix: "@@", basepath: "@file"})) // note that fileInclude doesn't directly support nested @@include statements
            .pipe(fileInclude({prefix: "@@", basepath: "@file"})) // so we run it twice to process the first nested level
            .pipe(replace(/[\u200B-\u200D\uFEFF]/g, "")) // strip out file BOMs left by fileInclude as it leads to whitespace issues
            .pipe(htmlHint("./htmlhint.json"))
            .pipe(htmlHint.reporter())
            .pipe(gulp.dest(gulpConfig.testSiteRoot + "html"));
    }
});

gulp.task("TestSite-Images", ["Content-Images"], function () {
    return gulp.src(gulpConfig.webProjectRoot + gulpConfig.contentFolder + "images/**")
        .pipe(gulp.dest(gulpConfig.testSiteRoot + gulpConfig.contentFolder + "images/"));
});

gulp.task("TestSite-Sass", ["Content-Sass"], function () {
    return gulp.src(gulpConfig.webProjectRoot + gulpConfig.contentFolder + "styles/**")
        .pipe(gulp.dest(gulpConfig.testSiteRoot + gulpConfig.contentFolder + "styles/"));
});

gulp.task("TestSite-Scripts", ["Content-Scripts"], function () {
    return gulp.src(gulpConfig.webProjectRoot + gulpConfig.contentFolder + "scripts/**")
        .pipe(gulp.dest(gulpConfig.testSiteRoot + gulpConfig.contentFolder + "scripts/"));
});

/*****************************
 Common Content
 *****************************/

gulp.task("Content-All", ["Content-Clean", "Content-Fonts", "Content-Images", "Content-Sass", "Content-Scripts"]);

gulp.task("Content-Clean", function () {
    // del.sync ensures del completes before other tasks are run
    return del.sync([gulpConfig.webProjectRoot + gulpConfig.contentFolder + "**"]);
});

gulp.task("Content-Fonts", function () {
    return gulp.src(vendorSrc.fonts.concat(src.fonts))
        .pipe(gulp.dest(gulpConfig.webProjectRoot + gulpConfig.contentFolder + "fonts"));
});

gulp.task("Content-Images", function () {
    return gulp.src(vendorSrc.images.concat(src.images))
        .pipe(gulp.dest(gulpConfig.webProjectRoot + gulpConfig.contentFolder + "images"));
});

gulp.task("Content-Sass", function () {
    return gulp.src(src.sass)
        .pipe(sourceMaps.init())
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourceMaps.write("./", {mapSources: mapSources}))
        .pipe(gulp.dest(gulpConfig.webProjectRoot + gulpConfig.contentFolder + "styles"));

    function mapSources(sourcePath) {
        return "/" + gulpConfig.themeProjectRoot + "/sass/" + sourcePath;
    }
});

gulp.task("Content-Scripts", function () {
    return merge(compileVendorScripts(), compileScripts())
        .pipe(gulp.dest(gulpConfig.webProjectRoot + gulpConfig.contentFolder + "scripts"));

    function compileVendorScripts() {
        return gulp.src(vendorSrc.scripts, {base: "./node_modules"})
            .pipe(sourceMaps.init())
            .pipe(concat("sage.vendor.js"))
            .pipe(uglify())
            .pipe(rename({suffix: ".min"}))
            .pipe(sourceMaps.write("./", {mapSources: mapSources}));

        function mapSources(sourcePath) {
            return "/node_modules/" + sourcePath;
        }
    }

    function compileScripts() {
        return gulp.src(src.scripts, {base: "./"})
            .pipe(sourceMaps.init())
            .pipe(concat("sage.js"))
            // Optimization: wrap in self-executing function with common globals/settings passed in for better minification
            .pipe(wrapJs("(function(window) { \n  \"use strict\";\n\n%= body %\n}(window));"))
            .pipe(uglify())
            .pipe(rename({
                suffix: ".min"
            }))
            .pipe(sourceMaps.write("./", {mapSources: mapSources}));

        function mapSources(sourcePath) {
            return "/" + sourcePath;
        }
    }
});