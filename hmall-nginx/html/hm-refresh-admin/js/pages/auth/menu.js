// 定义组件
const AuthMenu = Vue.extend({
  template: `
    <div style="padding: 20px">
     <el-card class="operate-container" shadow="never" style="margin-bottom: 10px">
      <i class="el-icon-tickets"></i>
      <span>菜单列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加菜单</el-button>
    </el-card>
      <el-table header-align="center"
          :data="tableData"
          style="width: 100%"
          row-key="id"
          border
          lazy
          :load="load"
          :tree-props="{children: 'submenus', hasChildren: 'hasChildren'}">
          <el-table-column prop="id" label="编号" width="250"></el-table-column>
          <el-table-column align="center" prop="name" label="名称" width="250"></el-table-column>
          <el-table-column align="center" prop="path" label="路径" width="250"></el-table-column>
          <el-table-column align="center" prop="icon" label="图标" width="250">
            <template slot-scope="scope">
              <i :class="scope.row.icon"></i>
              <span style="margin-left: 10px">{{ scope.row.icon }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini" type="success" plain
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button plain
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <el-button plain
                v-if="scope.row.parentId===0"
                size="mini"
                type="primary"
                @click="handleAdd(scope.$index, scope.row)">新增</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="菜单信息" :visible.sync="formVisible" width="30%" style="padding: 0 20px;">
          <el-form :model="item" size="small" label-position="left" :label-width="formLabelWidth">
            <el-form-item label="菜单名称" >
              <el-input v-model="item.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单路径" >
              <el-input v-model="item.path" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" v-show="hasIcon">
              <el-input v-model="item.icon" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="formVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmForm">确 定</el-button>
          </div>
        </el-dialog>
    </div>
     
    `,
  data() {
    return {
      tableData: [], //菜单列表
      item: {
        hasChildren: false,
        parentId: 0
      }, // 表单参数
      formVisible: false, // 是否显示编辑框
      isEdit: false, // 是否是编辑
      formLabelWidth: "100px", // 表单label宽度
      hasIcon: true, // 是否需要图标
    }
  },
  created() {
    this.init();
  },
  methods: {
    load(tree, treeNode, resolve) {
      axios.get("/menus/of/parent/" + tree.id)
        .then(resp => {
          resolve(resp.data)
        })
        .catch(err => {
          console.log(err)
        });
    },
    handleEdit(i, r) {
      this.hasIcon = r.parentId === 0;
      this.isEdit = true;
      this.item = JSON.parse(JSON.stringify(r));
      this.formVisible = true;
    },
    handleDelete(i, r) {
      console.log(r);
      this.$confirm('此操作将永久删除菜单及下级菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteById(r.id, r.parentId === 0);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleAdd(i, r) {
      this.isEdit = false;
      this.item = {
        hasChildren: false,
        parentId: r ? r.id : 0
      };
      this.hasIcon = !r;
      this.formVisible = true;
    },
    deleteById(id, isLevel1) {
      axios.delete("/menus/" + id)
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          util.reload(this, isLevel1);
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
        axios.put("/menus", this.item)
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
        axios.post("/menus", this.item)
          .then(resp => {
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.formVisible = false;
            util.reload(this, this.item.parentId === 0);
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
      axios.get("/menus/of/parent/0")
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
    }
  }
});