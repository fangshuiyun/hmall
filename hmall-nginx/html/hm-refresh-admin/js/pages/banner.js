const banner = {
  template: `
    <div class="banner" >
        <el-image class="icon"  src="./images/1.png"></el-image>
        <div class="title">河马商城管理系统</div>
        <el-dropdown trigger="hover" >
            <span class="el-dropdown-link">
                <i class="el-icon-menu"></i> 主题
            </span>
            <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item style="font-size: 12px; line-height: 16px; display: flex; align-items: center;">
                <span>背景色&nbsp;</span><el-color-picker size="mini" v-model="util.theme.menuBGC"></el-color-picker>
                </el-dropdown-item>
                <el-dropdown-item style="font-size: 12px; line-height: 16px; display: flex; align-items: center;">
                <span>字体色&nbsp;</span><el-color-picker size="mini" v-model="util.theme.menuColor"></el-color-picker>
                </el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
              <i class="el-icon-user"></i> {{user.name}}
          </span>
          <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="1">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </div>
    `,
  data() {
    return {
      util,
      user: {}
    }
  },
  created() {
    // 判断是否登录
    if (!util.isLogin()) {
      // 未登录
      location = "/login.html";
    }
    this.user = util.store.get("user-info")
  },
  methods: {
    handleCommand(i) {
      this.logout();
    },
    logout(){
      util.logout();
      location = "/login.html";
    }
  }

}
// 注册顶部banner组件
Vue.component("banner", banner);