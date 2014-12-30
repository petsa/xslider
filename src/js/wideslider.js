var PI = PI ? PI : {};

(function(w,$,pi){

	pi.wideslider = function(options){

		var _default = {
			trigger : "",
			currentSlideNum : 0,
			during : 1000,
			effect:"fade",
			autoPlay : true
		};
		var opts = $.extend({},_default,options),
		wideslider = {
			ctn : $(opts.sliderId),
			wideSliders : $(opts.sliderId).find('[data-role="slide"]'),
			wideTriggers : $(opts.sliderId).find('[data-role="trigger"]'),
			sliderLength : "",
			sliderHeight : "",
			scrollDistance : 0,
			autoClock : "",
			/**
			 * [getSliderLength 获取幻灯片长度]
			 * @return {[type]} [description]
			 */
			getSliderLength : function(){
				var _this = this;
				if( _this.sliderLength == "" )
				{
					_this.sliderLength = _this.wideSliders.length;
				}
				return _this.sliderLength;
			},
			/*获取播放元素*/
			getWideSliders : function(){
				this.wideSliders = $(opts.sliderId).find('[data-role="slide"]');
				return true;
			},
			/*获取控制导航*/
			getWideTriggers : function(){
				this.wideTriggers = $(opts.sliderId).find('[data-role="trigger"]');
				return true;
			},
			/*设置幻灯片高度*/
			setsliderHeight : function(){
				if( !opts.height == "" )
				{
					this.ctn.css({
						height: opts.height
					});
				}
			},
			/*获取宽度*/
			getSliderWidth : function(){
				return this.ctn.width();
			},
			/*设置幻灯片宽度*/
			setSliderWidth : function(){
				this.scrollDistance = this.getSliderWidth();
				this.wideSliders.css({
					left: this.scrollDistance + "px",
					opacity : 1,
					width : this.scrollDistance
				});
				this.wideSliders.eq(opts.currentSlideNum).css({
					left: 0 + 'px'
				});
			},
			/*通过图片获取url设置到背景，实现全屏*/
			setSliderBackground : function(){
				var _this = this;
				this.slideImgUrl = [];
				this.wideSliders.each(function(index, el) {
					 //console.log( index );
					_this.slideImgUrl[index] = $(this).find("img").eq(0).attr("src");
					$(this).css({
						"background-image": 'url("'+ _this.slideImgUrl[index] +'")'
					});
				});
			},
			/*幻灯片初始化*/
			sliderInit : function(){
				var _this = this,
					timeout = "";
				//设置当前trigger
				if( _this.getWideTriggers() ){
					this.wideTriggers.eq(opts.currentSlideNum).addClass('current');
				}
				// //设置当前slide
				// this.wideSliders.eq(opts.currentSlideNum).addClass('current');
				if( opts.effect == "scroll" )
				{	
					this.setSliderWidth();
				}
				if( opts.effect == "fade" )
				{	
					_this.wideSliders.css({
						opacity: 0
					});
				}
				this.ctn.on('click', '[data-role="trigger"]', function(event) {
					var index = parseInt( $(this).attr("data-indent") );
					if( index == opts.currentSlideNum ){
						return;
					}
					clearInterval( _this.autoClock );
					clearTimeout( timeout );
					_this.changeControl( parseInt( $(this).attr("data-indent") ) );
					event.preventDefault();
					timeout = setTimeout(function(){
										_this.autoSwitch();
									},5000);
					/* Act on the event */
				});
				_this.changeControl(0);
				_this.autoSwitch();
			},
			/**
			 * [changeControl 切换控制中心，根据不同参数，调用不用切换方法]
			 * @param  {[type]} index [目标target]
			 * @return {[type]}       [description]
			 */
			changeControl : function(index){
				var _this = this;
				switch( opts.effect ){
					case "fade":
						_this.fadeChange(index);
						break;
					case "scroll":
						_this.scrollChange(index);
						break;
					default:
						_this.fadeChange(index);
				}
			},
			/*滚动切换*/
			scrollChange : function(index){
				var _this = this,
					readyPosition = 0 ;
				if( _this.wideSliders.eq(opts.currentSlideNum).is(":animated") )
				{
					return;
				}
				this.wideTriggers.eq(opts.currentSlideNum).removeClass('current');
				this.wideTriggers.eq(index).addClass('current');
				if( index == opts.currentSlideNum ){
					return;
				}else if(index > opts.currentSlideNum){
					readyPosition = _this.scrollDistance;
				}else{
					readyPosition = - _this.scrollDistance;
				}
				_this.wideSliders.eq(opts.currentSlideNum).stop(true,true)
				.animate({
					"left": "-=" + readyPosition + "px" },
					{
						duration : opts.during,
						easing : "swing"
					});
				_this.wideSliders.eq(index)
				.css({
					left: readyPosition + 'px'
				})
				.animate({
					"left": "-=" + readyPosition + "px" },
					{
						duration : opts.during,
						easing : "swing"
					});
				//更新当前页面
				opts.currentSlideNum = index;
			},
			/*渐变切换方法*/
			fadeChange : function(index){
				var _this = this;
				this.wideTriggers.eq(opts.currentSlideNum).removeClass('current');
				this.wideTriggers.eq(index).addClass('current');
				_this.wideSliders.eq(opts.currentSlideNum).stop(true,true).animate({
					"opacity": 0},
					opts.during).removeClass('current');
				_this.wideSliders.eq(index).animate({
					"opacity": 1},
					opts.during, function() {
					_this.wideSliders.eq(index).addClass('current');
					/* stuff to do after animation is complete */
				});
				//更新当前页面
				opts.currentSlideNum = index;
			},
			/**
			 * [creatTrigger 创建trigger]
			 * @return {[true]}     [创建trigger结束，通知其他方法执行]
			 */
			creatTrigger : function( ){
				var _trigger = "",
					_this = this;
				if( opts.trigger == "" )
				{
					_trigger = $('<ul class="m-wslider-ft" data-role="ft"></ul>');
					var triggerNum = this.getSliderLength();
					for( var i = 0; i <  triggerNum ; i ++){
						var num = i ,
							temLi = $('<li data-role="trigger" data-indent="'+ num +'">' + (num + 1) + '</li>');
						_trigger.append( temLi );
					}
					_this.ctn.append( _trigger );
				}
				else{
					var _childrens = this.ctn.find('[data-role="trigger"]');
					_childrens.each(function(index, el) {
						$(this).attr("data-indent",index);
					});
				}
				this.sliderInit();
			},
			/*自动播放*/
			autoSwitch : function(){
				var _this = this;
				if(opts.autoPlay){
					this.autoClock = setInterval(function(){
						if( opts.currentSlideNum + 1 < _this.sliderLength ){
							_this.changeControl( opts.currentSlideNum + 1 );
						}
						else{
							_this.changeControl( 0 );
						}
					},5000)
				}
			},
			init : function(){
				this.setsliderHeight();
				this.setSliderBackground();
				this.creatTrigger();
			}
		}
		//初始化
		$(function(){
			//console.log( wideslider );
			wideslider.init();
		})
		/*窗口大小改变*/
		$(w).resize(function(event) {
			if( opts.effect =="scroll" ){
				wideslider.setSliderWidth();
			}
			/* Act on the event */
		});
	}

})(window,jQuery,PI)