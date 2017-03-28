/// <binding BeforeBuild='rebuild' Clean='cleanOutputs' ProjectOpened='default' />
/*global require, module */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    del = require('del'),
    fileInclude = require('gulp-file-include'),
    html2js = require('gulp-html2js'),
    htmlHint = require('gulp-htmlhint'),
    merge = require('merge-stream'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'), // Ensure other modules are supported - https://github.com/floridoo/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support
    uglify = require('gulp-uglify'),
    wrapJs = require('gulp-wrap-js');

var paths = {
    source: './src/',
    output: './dist/'
};

/*****************************
 Sources
 *****************************/

var vendorSrc = {
    fonts: [
        './node_modules/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}',
        './node_modules/bootstrap/dist/fonts/**/*.{ttf,woff,woff2,eot,svg}',
        './node_modules/slick-carousel/slick/fonts/**/*.{ttf,woff,woff2,eot,svg}'
    ],
    images: [
        './node_modules/slick-carousel/slick/ajax-loader.gif'
    ],
    scripts: [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './node_modules/ScrollMagic/scrollmagic/uncompressed/ScrollMagic.js',
        './node_modules/slick-carousel/slick/slick.js',
        './node_modules/vue/dist/vue.js',
        './node_modules/vuejs-paginate/dist/index.js',
        './node_modules/vue-router/dist/vue-router.js'
    ]
};

var src = {
    html: [
        paths.source + 'html/**/*.html',
        '!' + paths.source + 'html/**/_*.html' // excludes 'partial' HTML files which should be handled by fileInclude
    ],
    fonts: [
        paths.source + 'fonts/**/*.{ttf,woff,woff2,eot,svg}'
    ],
    images: [
        paths.source + 'images/**/*.{svg,gif,jpg,png,tif}'
    ],
    sass: [
        paths.source + 'sass/sage.scss',
        paths.source + 'sass/htmlEditor.scss'
    ],
    scripts: [
        paths.source + 'vue/**/*.js',
        paths.source + 'scripts/framework/**/*.js', // important: must be first due to load-order concerns
        paths.source + 'scripts/**/*.js',
        '!' + paths.source + 'scripts/**/*.test.js' // exclude unit tests
    ],
    vue: [
        paths.source + 'vue/**/*.vue'
    ]
};

/*****************************
 Mock Site for frontend dev
 *****************************/

gulp.task('Server-start-mock', ['Compile-all', 'Compile-html'], function () {
    gulp.watch([src.fonts], ['Compile-fonts', refreshWebServer]);
    gulp.watch([paths.source + 'html/**/*.html'], ['Compile-html', refreshWebServer]);
    gulp.watch([src.images], ['Compile-images', refreshWebServer]);
    gulp.watch([paths.source + 'sass/**/*.scss'], ['Compile-sass', refreshWebServer]);
    gulp.watch([src.scripts], ['Compile-scripts', refreshWebServer]);
    gulp.watch([src.vue], ['Compile-templates', refreshWebServer]);

    function refreshWebServer() {
        return gulp.src(paths.source)
            .pipe(connect.reload());
    }
    return connect.server({
        port: 8888,
        root: paths.output,
        livereload: true
    });
});

/*****************************
 Cleanup
 *****************************/

gulp.task('Clean-output', function () {
    return del.sync([paths.output + '**']);
});

/*****************************
 Compilation
 *****************************/

gulp.task('Compile-all', ['Clean-output', 'Compile-fonts', 'Compile-images', 'Compile-sass', 'Compile-scripts', 'Compile-templates', 'Compile-vendor']);

gulp.task('Compile-fonts', function () {
    return gulp.src(src.fonts)
        .pipe(gulp.dest(paths.output + 'content/fonts/'));
});

// Note: this is deliberately excluded from Compile-all as it is for mockSite use only
gulp.task('Compile-html', function () {
    return merge(copyRedirect(), CompileHtml());

    function copyRedirect() {
        return gulp.src(paths.source + 'html/index.html')
            .pipe(gulp.dest(paths.output));
    }

    function CompileHtml() {
        return gulp.src(src.html)
            .pipe(fileInclude({prefix: '@@', basepath: '@file'})) // note that fileInclude doesn't directly support nested @@include statements
            .pipe(fileInclude({prefix: '@@', basepath: '@file'})) // so we run it twice to process the first nested level
            .pipe(replace(/[\u200B-\u200D\uFEFF]/g, '')) // strip out file BOMs left by fileInclude as it leads to whitespace issues
            .pipe(htmlHint('./htmlhint.json'))
            .pipe(htmlHint.reporter())
            .pipe(gulp.dest(paths.output + 'html/'));
    }
});

gulp.task('Compile-images', function () {
    return gulp.src(src.images)
        .pipe(gulp.dest(paths.output + 'content/images/'));
});

gulp.task('Compile-sass', function () {
    return gulp.src(src.sass)
        .pipe(sourceMaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourceMaps.write('./', {mapSources: mapSources}))
        .pipe(gulp.dest(paths.output + 'content/styles/'));

    function mapSources(sourcePath) {
        return '/' + paths.source + '/sass/' + sourcePath;
    }
});

gulp.task('Compile-scripts', function () {
    return gulp.src(src.scripts, {base: './'})
        .pipe(sourceMaps.init())
        .pipe(concat('sage.js'))
        // Optimization: wrap in self-executing function with common globals set for better minification
        .pipe(wrapJs('(function(window) { \n  \'use strict\';\n\n%= body %\n}(window));'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourceMaps.write('./', {mapSources: mapSources}))
        .pipe(gulp.dest(paths.output + 'content/scripts/'));

    function mapSources(sourcePath) {
        return '/' + sourcePath;
    }
});

gulp.task('Compile-templates', function () {
    gulp.src(src.vue)
        .pipe(html2js('sage.templates.js', {
            adapter: 'javascript',
            base: src.vue[0].replace("**/*.vue", ""),
            name: 'vueTemplates'
        }))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.output + 'content/scripts/'));
});

gulp.task('Compile-vendor', function () {
    return merge(compileVendorScripts(), copyVendorImages(), copyVendorFonts());

    function compileVendorScripts() {
        return gulp.src(vendorSrc.scripts, {base: './node_modules'})
            .pipe(sourceMaps.init())
            .pipe(concat('sage.vendor.js'))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(sourceMaps.write('./', {mapSources: mapSources}))
            .pipe(gulp.dest(paths.output + 'content/scripts/'));

        function mapSources(sourcePath) {
            return '/node_modules/' + sourcePath;
        }
    }

    function copyVendorImages() {
        return gulp.src(vendorSrc.images)
            .pipe(gulp.dest(paths.output + 'content/images/'));
    }

    function copyVendorFonts() {
        return gulp.src(vendorSrc.fonts)
            .pipe(gulp.dest(paths.output + 'content/fonts/'));
    }
});