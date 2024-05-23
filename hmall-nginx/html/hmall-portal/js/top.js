const topApp = {
  template:`
  <div class="top">
    <div class="py-container">
      <div class="shortcut">
        <ul class="fl">
          <li class="f-item">黑马欢迎您！</li>
          <li class="f-item" v-if="!user">
            <a href="/login.html">请登录</a>　
            <span><a href="#">免费注册</a></span>
          </li>
          <li class="f-item" v-else>
            欢迎您 <span style="color: #e54346">{{user.username}}</span>
            <span @click="util.logout()"><a href="#">退出登录</a></span>
          </li>
        </ul>
        <ul class="fr">
          <li class="f-item"><a href="/">首页</a></li>
          <li class="f-item space"></li>
          <li class="f-item"><a href="/cart.html">我的购物车</a></li>
          <li class="f-item space"></li>
          <li class="f-item">我的黑马</li>
          <li class="f-item space"></li>
          <li class="f-item">黑马会员</li>
          <li class="f-item space"></li>
          <li class="f-item">企业采购</li>
          <li class="f-item space"></li>
          <li class="f-item">关注黑马</li>
          <li class="f-item space"></li>
          <li class="f-item">客户服务</li>
          <li class="f-item space"></li>
          <li class="f-item">网站导航</li>
        </ul>
      </div>
    </div>
  </div>
  `,
  data(){
    return {
      user: null,
      util
    }
  },
  mounted(){
    this.user = this.util.store.get("user-info")
  },
  methods:{

  },
}

Vue.component("top", topApp);