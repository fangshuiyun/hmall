
class ViewRouter{
  //Vue.use使用插件的时候,会给插件内部的install方法传递Vue构造函数,所以这里需要添加一个install方法来接受传递过来的Vue
  static install(_Vue){
  }
  constructor(options){
    //接收传递过来的路由项
    this.$options = options;
    //定义解析routes对象的变量
    this.routeMap = {};
    //定义路由的地址,使用Vue的方式是为了利用data的响应式,当curr改变时,所有关联了curr的视图也会发生改变
    this.app = new Vue({
      data:{
        curr:"/"
      }
    })

    //调用初始化方法
    this.init();
  }
  init(){
    //1、绑定路由事件
    this.bindEvent();
    //2、创建路由对象
    this.createRouteMap()
    //3、创建组件
    this.createComponents();
  }
  bindEvent(){
    //当页面加载完成执行一次视图更新.之后每次通过hashchange来执行更新
    window.addEventListener("load",this.handleChange.bind(this));
    window.addEventListener("hashchange",this.handleChange.bind(this))
  }
  handleChange(par){
    //更新视图
    this.app.curr = this.getHash() || "/";
  }
  getHash(){
    return location.hash.slice(1);
  }
  createRouteMap(){
    this.$options.routes.forEach((item)=>{
      this.routeMap[item.path] = item;
    })

  }
  createComponents(){
    //模拟vue-router内置组件router-view和router-link
    Vue.component("router-view",{
      render:h=>{
        var component = this.routeMap[this.app.curr].component;
        return h(component)
      }
    })

    Vue.component("router-link",{
      //router-link会接受父组件传入的to参数
      props:{
        to:{
          type:String,
          required:true
        }
      },
      render:function(h){
        return h("a",{
            attrs:{
              href:`#${this.to}`
            }
          },
          this.$slots.default
        )
      }
    })
  }
}