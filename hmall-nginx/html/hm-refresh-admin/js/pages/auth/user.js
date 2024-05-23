// 定义组件
const AuthUser = Vue.extend({
  template: `
    <div style="padding: 20px">
     <el-card class="operate-container" shadow="never" style="margin-bottom: 10px">
      <i class="el-icon-tickets"></i>
      <span>用户列表</span>
    </el-card>
    <br>
       <el-form :inline="true" :model="params" size="small">
        <el-form-item label="用户名">
          <el-input v-model="params.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="params.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.status" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="冻结" value="2"></el-option>
            <el-option label="失败锁定" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异常状态">
          <el-select v-model="params.riskStatus" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="无异常" value="1"></el-option>
            <el-option label="重试密码" value="2"></el-option>
            <el-option label="异地登录" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
           <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    
      <el-table header-align="center"
          :data="tableData"
          style="width: 100%; margin-top: 10px"
          row-key="id"
          border>
          <el-table-column align="center" prop="id" label="编号" width="100"></el-table-column>
          <el-table-column align="center" prop="username" label="用户名" width="100"></el-table-column>
          <el-table-column align="center" prop="phone" label="手机号" width="120"></el-table-column>
          <el-table-column align="center" prop="role" label="角色" width="100"></el-table-column>
          <el-table-column align="center" prop="failureTimes" label="登录失败次数" width="120"></el-table-column>
          <el-table-column align="center" prop="latestLoginTime" label="最近登录时间" width="180"></el-table-column>
          <el-table-column align="center" prop="riskStatus" label="风险情况" width="120" @click="userId = scope.row.id">
            <template slot-scope="scope">
              {{riskStatusMap[scope.row.riskStatus]}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="状态" width="90" @click="userId = scope.row.id">
            <template slot-scope="scope">
              {{statusMap[scope.row.status]}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini" type="primary" plain
                @click="handleRoleAuth(scope.row.id)">角色</el-button>
              <el-button plain v-if="scope.row.status===1"
                size="mini"
                type="danger"
                @click="handleFrozen(scope.row.id)">冻结</el-button>
              <el-button plain v-if="scope.row.status===1"
                size="mini"
                type="warning"
                @click="handleLock(scope.row.id)">锁定</el-button>
              <el-button plain v-if="scope.row.status!==1"
                size="mini"
                type="success"
                @click="handleRecover(scope.row.id)">恢复</el-button>
            </template>
          </el-table-column>
        </el-table>
         <div style="display: flex;  margin-top: 10px">
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="params.pageSize"
                :total="total">
              </el-pagination>
      </div>
        <el-dialog title="用户角色信息" :visible.sync="formVisible" width="30%" style="padding: 0 20px;">
          <el-select v-model="roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
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
      total: 0, // 总条数
      item: {}, // 表单参数
      roleIds: [], // 用户的角色id
      userId: 0, // 用户id
      roles: [], // 所有的可选角色
      formVisible: false, // 是否显示编辑框
      isEdit: false, // 是否是编辑
      formLabelWidth: "100px", // 表单label宽度
      params: {
        pageNo: 1, //页码
        pageSize: 5, // 每页大小
        name: "", // 用户名
        phone: "", // 手机号
        status: "", // 状态
        riskStatus: "", // 异常状态
        bTime: "", // 最近一次登录成功时间的起始值
        eTime: "", // 最近一次登录成功时间的结束值
      },
      statusMap:["", "正常", "冻结", "锁定"],
      riskStatusMap:["", "无风险", "密码重试", "异地登录"],
    }
  },
  created() {
    this.search();
    this.queryAllRoles();
  },
  methods: {
    resetForm(formName) {
      this.params = {
        pageNo: 1, //页码
        pageSize: 5, // 每页大小
        name: "", // 用户名
        phone: "", // 手机号
        status: "", // 状态
      };
      this.search();
    },
    handleCurrentChange(page) {
      this.params.pageNo = page;
      this.search();
    },
    handleFrozen(id) {
      this.updateUserState(id, 2);
    },
    handleLock(id) {
      this.$confirm('请选择锁定时长', '提示', {
        confirmButtonText: '10分钟',
        cancelButtonText: '60分钟',
        type: 'warning'
      }).then(() => this.updateUserState(id, 3, 10))
        .catch(() => this.updateUserState(id, 3, 60));
    },
    handleRecover(id) {
      this.updateUserState(id, 1);
    },
    handleAdd(i, r) {
      this.isEdit = false;
      this.item = {};
      this.formVisible = true;
    },
    updateUserState(id, state, lockMinutes) {
      let msg = this.statusMap[state];
      axios.put("/users/state", {id, state, lockMinutes})
        .then(() => {
          this.$message({
            type: 'success',
            message: msg+'成功!'
          });
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: msg+'失败!'
          });
          console.log(err);
        })
    },
    search() {
      let params = {};
      Object.keys(this.params).forEach(k => {
        if(this.params[k]){
          params[k] = this.params[k];
        }
      })
      axios.get("/users/page",{params})
        .then(resp => {
          resp.data.list.forEach(u => u.enable = u.id + "/" + u.enable)
          this.tableData = resp.data.list;
          this.total = parseInt(resp.data.total);
        })
        .catch(err => {
          this.$message({
            message: '查询失败，展示临时数据',
            type: 'error'
          });
          console.log(err)
          this.tableData = [
            {
              "id": 317581,
              "username": "Jack",
              "phone": "13688990912",
              "role": "用户",
              "status": 2,
              "riskStatus": 3,
              "failureTimes": 3,
              "latestFailTime": "2019-04-30 21:09:11",
              "latestLoginTime": "2019-04-30 21:10:10"
            },
            {
              "id": 3175802,
              "username": "Rose",
              "phone": "13688990912",
              "role": "用户",
              "status": 3,
              "riskStatus": 2,
              "failureTimes": 5,
              "latestFailTime": "2019-04-30 21:09:11",
              "latestLoginTime": "2019-04-30 21:10:10"
            },
            {
              "id": 317583,
              "username": "Hope",
              "phone": "13688990913",
              "role": "管理员",
              "status": 1,
              "riskStatus": 1,
              "failureTimes": 0,
              "latestFailTime": "2019-04-30 21:09:11",
              "latestLoginTime": "2019-05-30 12:20:10"
            }
          ];
          this.total = 20;
        });
    },
    queryAllRoles() {
      axios.get("/roles/all")
        .then(resp => {
          this.roles = resp.data;
        })
        .catch(err => {
          this.$message({
            message: '查询角色失败',
            type: 'error'
          });
          console.log(err)
        });
    },
    handleRoleAuth(id) {
      this.userId = id;
      // 查询用户角色
      axios.get("/users/" + id + "/roles")
        .then(resp => {
          this.roleIds = resp.data;
          this.formVisible = true;
        })
        .catch(err => {
          this.$message({
            message: '查询用户角色失败',
            type: 'error'
          });
          console.log(err)
        });
    },
    confirmForm() {
      // 更新用户角色
      axios.put("/users/role", {id: this.userId, roleIds: this.roleIds})
        .then(() => {
          this.formVisible = false;
          this.$message({
            message: '更新角色成功',
            type: 'success'
          });
        })
        .catch(err => {
          this.$message({
            message: '更新角色失败',
            type: 'error'
          });
          console.log(err)
        });
    }
  }
});