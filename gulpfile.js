// 引入gulp
var gulp = require('gulp');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');

gulp.task('connect', function() {
    connect.server({
        livereload: true,
        root: 'dingding',
        port: 8586,
	
	//下面的代理其实在这个项目里没有用处	
            middleware: function(connect, opt) {
                return [
		    proxy(['/Card','/DataPlanOrder','/DataPlanOrderView','/DataPlanView','/OrderPayRecorder'],{target: 'http://54.255.145.79'}),
                ]
            }
    });
});
gulp.task('watch', function() {
     gulp.watch('dingding/css/*.css');//监控css文件
    gulp.watch(['dingding/home/*.html']); //监控html文件
}); //执行gulp server开
// 启动服务
gulp.task('default', function() {
    gulp.run(['connect','watch']);
});
