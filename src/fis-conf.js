/*ignore列表*/
fis.set('project.exclude', ['**.svn', '**.git', '**/_*.styl', 'Gruntfile.js', 'package.json']);
fis.set('project.ignore', ['fis3-conf.js', 'fis-conf.js']);

/*stylus编译*/
fis.match('*.scss', {
    parser: fis.plugin('sass'), //启用fis-parser-sass插件
    rExt: '.css'
}).match('/sass/(**.scss)',{
	release: '/css/$1'
}).match('_*.scss', {
    release: false
});

