// 定义组件
const AuthRole = Vue.extend({
  template: `
     <div style="padding: 20px">
         <el-card class="operate-container" shadow="never" style="margin-bottom: 10px">
          <i class="el-icon-tickets"></i>
          <span>角色列表</span>
          <el-button size="mini" class="btn-add" @click="handleAdd()" 
              style="margin-left: 20px">添加角色</el-button>
         </el-card>
          <el-table :data="tableData" style="width: 100%"  row-key="id" border header-align="center">
              <el-table-column align="center" prop="id" label="编号" width="280"></el-table-column>
              <el-table-column align="center" prop="name" label="名称" width="280"></el-table-column>
              <el-table-column align="center" prop="label" label="描述" width="280"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini" type="success" plain
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button plain
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  <el-button plain
                    size="mini"
                    type="primary"
                    @click="handleMenuAuth(scope.$index, scope.row)">管理菜单权限</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog title="角色信息" :visible.sync="formVisible" width="30%" style="padding: 0 20px;">
              <el-form ref="form" :model="item" size="small" label-position="left" :label-width="formLabelWidth">
                <el-form-item label="角色名称" >
                  <el-input v-model="item.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" >
                  <el-input v-model="item.description" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="formVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmForm">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog title="角色菜单权限信息" :visible.sync="showMenuAuth" width="30%" style="padding: 0 20px;">
              <el-tree ref="tree"
                :data="menuData"
                show-checkbox
                node-key="id"
                :default-expanded-keys="level1Menus"
                :default-checked-keys="level2Menus"
                :props="defaultProps">
              </el-tree>
              <div slot="footer" class="dialog-footer">
                <el-button @click="showMenuAuth = false">取 消</el-button>
                <el-button type="primary" @click="confirmMenuAuth">确 定</el-button>
              </div>
            </el-dialog>
     </div>
    `,
  data() {
    return {
      tableData: [], //菜单列表
      item: {}, // 表单参数
      formVisible: false, // 是否显示编辑框
      showMenuAuth: false, // 是否显示角色的菜单权限
      isEdit: false, // 是否是编辑
      formLabelWidth: "100px", // 表单label宽度
      menuData: [],
      level1Menus: [], // 当前角色的1级菜单 id
      level2Menus: [], // 当前角色的2级菜单 id
      defaultProps: {
        children: 'submenus',
        label: 'name'
      },
      currentRoleId: 0
    }
  },
  created() {
    this.init();
  },
  methods: {
    handleEdit(i, r) {
      this.isEdit = true;
      this.item = JSON.parse(JSON.stringify(r));
      this.formVisible = true;
    },
    handleDelete(i, r) {
      this.$confirm('此操作将永久角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteById(r.id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleAdd(i, r) {
      this.isEdit = false;
      this.item = {};
      this.formVisible = true;
    },
    deleteById(id) {
      axios.delete("/roles/" + id)
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          util.reload(this);
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
          console.log(err);
        })
    },
    confirmForm() {
      if (this.isEdit) {
        axios.put("/role", this.item)
          .then(resp => {
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            this.formVisible = false;
            util.reload(this);
          })
          .catch(err => {
            this.$message({
              message: '更新失败',
              type: 'error'
            });
            console.log(err);
          })
      } else {
        axios.post("/role", this.item)
          .then(resp => {
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.formVisible = false;
            util.reload(this,);
          })
          .catch(err => {
            this.$message({
              message: '新增失败',
              type: 'error'
            });
            console.log(err);
          })
      }
    },
    init() {
      axios.get("/roles/all")
        .then(resp => {
          this.tableData = resp.data;
        })
        .catch(err => {
          this.$message({
            message: '查询失败',
            type: 'error'
          });
          console.log(err)
        });
    },
    handleMenuAuth(i, r) {
      this.currentRoleId = r.id;
      // 查询所有菜单
      axios.get("/menus/all")
        .then(resp => {
          let menus = {};
          // 重新组装
          resp.data.forEach(m => {
            if (!menus[m.parentId]) {
              menus[m.parentId] = []
            }
            menus[m.parentId].push(m);
          })
          // 找出父菜单
          let data = menus[0];
          // 填充子菜单
          data.forEach(d => {
            d.submenus = menus[d.id];
            this.level1Menus.push(d.id);
          })
          // 赋值
          this.menuData = data;
          // 查询当前角色的菜单权限
          axios.get("/roles/"+r.id+"/menus")
            .then(rp => {
              let l2s = [];
              rp.data.forEach(m => {
                if (m.parentId !== 0 || !m.hasChildren) {
                  l2s.push(m.id)
                }
              })
              this.showMenuAuth = true;
              this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(l2s);
              })
            })
            .catch(err => {
              this.$message({
                message: '查询失败',
                type: 'error'
              });
              console.log(err)
            })
        })
        .catch(err => {
          this.$message({
            message: '查询失败',
            type: 'error'
          });
          console.log(err)
        })
    },
    confirmMenuAuth() {
      // 获取所有的menuId
      let menuIds = this.$refs.tree.getCheckedKeys();
      // 结合roleId发送到服务端
      axios.put("/roles/menus", {id: this.currentRoleId, menuIds: menuIds})
        .then(() => {
          // 关闭窗口
          this.showMenuAuth = false;
          // 提示
          this.$message({
            message: '更新权限成功',
            type: 'success'
          });
        })
        .catch(err => {
          this.$message({
            message: '更新权限失败',
            type: 'error'
          });
          console.log(err)
        })
    }
  }
});