"use strict";

const { src, dest, watch, series, parallel } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const panini = require("panini");
const browsersync = require("browser-sync").create();

/* Paths */
var path = {
    build: {
        html: "dist/",
        js: "dist/assets/js/",
        css: "dist/assets/css/",
        images: "dist/assets/img/"
    },
    src: {
        html: "src/*.html",
        js: "src/assets/js/*.js",
        css: "src/assets/sass/**/*.scss",
        images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}"
    },
    watch: {
        html: "src/**/*.html",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.scss",
        images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}"
    },
    clean: "./dist"
};

/* BrowserSync */
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
}

/* HTML */
function html() {
    panini.refresh();
    return src(path.src.html, { base: "src/" })
        .pipe(plumber())
        .pipe(panini({
            root: "src/",
            layouts: "src/tpl/layouts/",
            partials: "src/tpl/partials/",
            helpers: "src/tpl/helpers/",
            data: "src/tpl/data/"
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

/* SCSS Compilation */
function styles() {
    return src(path.src.css, { base: "src/assets/sass/" })
        .pipe(plumber())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 8 versions"],
            cascade: false
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: { removeAll: true }
        }))
        .pipe(removeComments())
        .pipe(rename({ suffix: ".min", extname: ".css" }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

/* JavaScript */
function js() {
    return src(path.src.js, { base: "./src/assets/js/" })
        .pipe(plumber())
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min", extname: ".js" }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

/* Image Optimization */
function images() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(dest(path.build.images));
}

/* Cleaning */
function clean() {
    return del(path.clean);
}

/* Watching Files */
function watchFiles() {
    watch(path.watch.html, html);
    watch(path.watch.css, styles);
    watch(path.watch.js, js);
    watch(path.watch.images, images);
}

/* Build Tasks */
const build = series(clean, parallel(html, styles, js, images));
const watchTask = parallel(build, watchFiles, browserSync);

/* Export Tasks */
exports.html = html;
exports.styles = styles;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watchTask;
exports.default = watchTask;

