const menu = {
  template: ` 
    <el-menu :default-active="active" :collapse="isCollapse" :active-text-color="util.theme.menuColor" :background-color="util.theme.menuBGC" text-color="#fff">
        <el-menu-item :index="'' + (i+1)" v-for="(m,i) in menus" :key="i"  @click="route(m.path, i+1)" v-if="!m.submenus || m.submenus.length == 0">
            <i :class="m.icon"></i>
            <span slot="title">{{m.name}}</span>
        </el-menu-item>
        <el-submenu :index="'' + (i+1)" v-else>
            <template slot="title">
                <i :class="m.icon"></i>
                <span slot="title">{{m.name}}</span>
            </template>  
            <el-menu-item v-for="(sm,j) in m.submenus" :index="i + '-' + (j+1)" :key="j" @click="route(m.path+sm.path, i + '-' + (j+1))">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{sm.name}}
            </el-menu-item>
        </el-submenu>
    </el-menu>
    `,
  data() {
    return {
      isCollapse: false,
      menus: [],
      active: "1",
      util,
    }
  },
  methods: {
    route(path, index) {
      location.hash = path;
    }
  },
  created() {
    let userId = util.getUser().userId;
    // 1.通过ajax查询当前用户的菜单信息
    axios.get("/users/"+userId+"/menus")
      .then(resp => {
        let menus = {};
        // 重新组装
        resp.data.forEach(m => {
          if(!menus[m.parentId]){
            menus[m.parentId] = []
          }
          menus[m.parentId].push(m);
        })
        // 找出父菜单
        let data = menus[0];
        // 填充子菜单
        data.forEach(d => {
          d.submenus = menus[d.id];
        })
        // 赋值
        this.menus = data;
      })
      .catch(err => {
        console.log(err);
      })
  }
}
// 注册菜单组件
Vue.component("menu-list", menu);