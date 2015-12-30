var gulp = require("gulp");

var del = require("del");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");

gulp.task("clean", function() {
    del(["./dist"]);
});

gulp.task("css", function() {
    gulp.src("./src/css/images/**/*")
        .pipe(gulp.dest("./dist/images"));
    gulp.src(["./src/css/jquery.mobile-1.4.5.min.css", "./src/css/styles.css"])
        .pipe(minifyCss())
        .pipe(concat("app.css"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("js", function() {
    gulp.src(["./src/js/jquery-2.1.4.min.js", "./src/js/jquery.mobile-1.4.5.min.js", "./src/js/Please-compressed.js", "./src/js/game.js"])
        .pipe(uglify())
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("build", ["clean", "css", "js"]);

gulp.task("watch", function() {
    gulp.watch(["./src/css/*.css", "./src/js/*.js"], ["build"]);
});