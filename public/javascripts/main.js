
new Vue({
  el: '#app',
  data:{
    title:'test',
    container:'',
    app:''
  },
  mounted: function () {
    this.$nextTick(function () {
      // 代码保证 this.$el 在 document 中
      this.initPixi();
      this.getJsonData();
    })
  },
  methods:{
    /**
     * 初始化pixijs的方法
     * @return {Object} container pixi的容器
     * @return {Object} app pixi主要对象
     */
    initPixi:function(){
      this.container = new PIXI.Container();
      this.app = new PIXI.autoDetectRenderer(1000, 800, {backgroundColor : '0x103300'});
      document.getElementById('app').appendChild(this.app.view);
    },
    /**
     * 获取json数据
     * @return {[type]} [description]
     */
    getJsonData:function(){
      //使用vue-source方式获取
      // this.$http.get('/json/data.json').then(function(res){
      //   var obj = res.body;
      //   // console.log(obj);
      //   this.renderPath(obj);
      // });
      //使用vue-source方式获取
      this.$http.get('/getDeviceList').then(function(res){
        // console.log(res);
      })
      var _this = this;
      //使用axios插件发送get请求到后台请求数据
      axios.get('/getDeviceList').then(function(res){
        var objs = res.data;
        for(var i in objs){
          // console.log(objs[i].type);
          var obj = JSON.parse(objs[i].data);
          // console.log(obj);
          if(objs[i].type == "path"){
            _this.renderPath(obj);
          }
        }
      })
    },
    /**
     * 渲染路径的方法 type="path"
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    renderPath:function(obj){
      var path = obj.path;
      var str = '';
      for(var i = 0;i<path.length;i++){
        for(var j = 0;j<path[i].length;j++){
          str += path[i][j];
          if((j != 0) && (j != path[i].length-1)){
            str +=',';
          }
        }
        str +=' ';
      }

      var dom = document.createElement('path');
      dom.setAttribute('d',str);
      dom.setAttribute('style','fill:'+obj.fill+'; stroke: '+obj.stroke+'; stroke-width: '+obj.strokeWidth);
      var graphics = new PIXI.Graphics();
      var svg = document.createElement('svg');
      svg.appendChild(dom);

      this.container.addChild(graphics);
      SVGGraphics.drawSVG(graphics, svg);
      //属性设置
      graphics.x = obj.left;
      graphics.y = obj.top;
      graphics.width = obj.width;
      graphics.height = obj.height;
      graphics.scale.x = obj.scaleX;
      graphics.scale.y = obj.scaleY;
      this.app.render(this.container);
    }

  }
})
