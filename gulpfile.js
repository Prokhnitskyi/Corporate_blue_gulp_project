var gulp              =          require('gulp'),
	sass              =          require('gulp-sass'),
	browserSync       =          require('browser-sync'),
	concat            =          require('gulp-concat'),
	uglify            =          require('gulp-uglify'),
	cssnano           =          require('gulp-cssnano'),
	rename            =          require('gulp-rename'),
	del               =          require('del'),
	imagemin          =          require('gulp-imagemin'),
	pngquant          =          require('imagemin-pngquant'),
	cache             =          require('gulp-cache'),
	autoprefixer      =          require('gulp-autoprefixer'),
	fileinclude       =          require('gulp-file-include');

	gulp.task('sass', function () {
	return gulp.src('src/sass/main.sass')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true}))
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}))
});


gulp.task('fileinclude', function() {
  gulp.src(['src/pages/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('src/'));
});


/*gulp.task('scripts', function () {
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js' // Можно добавить элементы массива с подключаемыми библиотеками, в директории есть magnific-popup
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/js/'));
});*/

/*gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/libs.css') // libs.css получаем из sass с импортом
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css/'));
});*/

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false

	});
});

gulp.task('clean', function() {
	return del.sync('build');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('img', function () {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressivev: true,
		svgoPlugins: [{removeViewBow: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('build/img'));
});


gulp.task('watch', ['browser-sync', 'fileinclude'], function () {
	gulp.watch('src/sass/**/*.+(scss|sass)', ['sass']);
	gulp.watch('src/html_includes/*.html', ['fileinclude']);
	gulp.watch('src/pages/*.html', ['fileinclude']);
	gulp.watch('src/pages/*.html', browserSync.reload);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('js/**/*.html', browserSync.reload);
});


gulp.task('build', ['clean', 'img', 'sass'], function() {

	var buildCss = gulp.src([
			'src/css/main.css',
			'src/css/libs.min.css'
		]).pipe(gulp.dest('build/css'));


	var buildFonts = gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('build/fonts'));

	var buildJs = gulp.src('src/js/**/*')
		.pipe(gulp.dest('build/js'));

	var buildHtml = gulp.src('src/*.html')
		.pipe(gulp.dest('build'));
});