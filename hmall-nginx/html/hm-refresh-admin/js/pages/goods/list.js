// 定义组件
const GoodsList = Vue.extend({
  template: `
    <div style="padding: 20px">
      <el-card class="operate-container" shadow="never" style="margin-bottom: 10px">
        <i class="el-icon-tickets"></i>
        <span>商品列表</span>
      </el-card>
      <el-card class="operate-container" shadow="never" style="margin-bottom: 10px">
       <el-form :inline="true" :model="params" size="small">
        <el-form-item label="商品id">
          <el-input v-model="params.id" placeholder="商品id"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="params.category" placeholder="分类"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="params.brand" placeholder="品牌"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
           <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      </el-card>
      <div class="add-btn" >
        <el-button type="primary" size="small" @click="beginAdd">新增商品</el-button>
      </div>
      <el-table
          :data="items"
          border
          style="width: 100%">
        <el-table-column
            v-for="h in headers" :key="h.prop"
            :prop="h.prop"
            :label="h.text"
            :width="h.width"
            :align="h.align"
            v-if="h.prop !== 'image' && h.prop !== 'spec'"
        >
        </el-table-column>
        <el-table-column
            v-else-if="h.prop === 'spec'"
            :prop="h.prop"
            :label="h.text"
            :width="h.width"
            :align="h.align"
        >
          <template slot-scope="scope">
            <div v-for="(v, k) in parseJSON(scope.row.spec)">
              {{k}} : {{v}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
            v-else
            :prop="h.prop"
            :label="h.text"
            :width="h.width"
            :align="h.align"
        >
          <template slot-scope="scope">
            <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.image"
                fit="fill"></el-image>
          </template>
    
        </el-table-column>
        <el-table-column align="center" label="操作" :width="160">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" circle size="mini"
                       @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button type="danger" plain icon="el-icon-delete" circle size="mini"
                       @click="handleDelete(scope.$index, scope.row)"></el-button>
            <el-tooltip class="item" v-if="scope.row.status === 2" effect="dark" content="上架" placement="top-start">
                <el-button type="success" plain icon="el-icon-upload2"  circle size="mini"
                       @click="handleUp(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" v-else effect="dark" content="下架" placement="top-start">
                <el-button type="info" plain icon="el-icon-download" circle size="mini"
                         @click="handleDown(scope.row.id)"></el-button>
            </el-tooltip>
    
          </template>
        </el-table-column>
      </el-table>
     <el-pagination
            v-show="total > pageSize"
            @current-change="handlePageChange"
            :current-page="params.pageNo"
            style="margin-top: 5px"
            background
            :page-size="pageSize"
            :page-sizes="pageSizes"
            @size-change="handleSizeChange"
            layout="prev, pager, next, total, sizes"
            :total="total">
        </el-pagination>
      <el-dialog title="商品信息" :visible.sync="formVisible" width="30%" style="padding: 0 20px;">
        <el-form :model="item" size="small" label-position="left" :label-width="formLabelWidth">
          <el-form-item label="商品名称" >
            <el-input v-model="item.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" >
            <el-input v-model="item.category" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品品牌" >
            <el-input v-model="item.brand" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="item.price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品库存">
            <el-input v-model="item.stock" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否广告推广" style="text-align: left">
            <el-switch v-model="item.isAD">
            </el-switch>
          </el-form-item>
          <el-form-item label="商品规格">
            <el-input v-model="item.spec" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-input v-model="item.image" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    `,
  data() {
    return {
      pageSize: 5,
      pageSizes: [5, 10, 20, 50, 100, 200],
      headers: [
        {prop: "id", text: "ID", width: 120, align: "center"},
        {prop: "name", text: "商品名称", width: 0, align: "center"},
        {prop: "category", text: "分类", width: 100, align: "center"},
        {prop: "brand", text: "品牌", width: 100, align: "center"},
        {prop: "price", text: "价格", width: 100, align: "center"},
        {prop: "image", text: "图片", width: 80, align: "center"},
        {prop: "spec", text: "规格", width: 180, align: "center"},
      ],
      items: [],
      total: 1000,
      formVisible: false, // 是否显示表单
      formLabelWidth: "100px", // 表单label宽度
      item: {isAD: false, image: ""}, // 表单中的酒店数据
      isEdit: false, // 是否是更新
      params:{
        pageNo: 1,
        pageSize: 5
      }, //  查询条件
    }
  },
  created() {
    this.query();
  },
  watch:{
    pageSize(){
      this.query();
    }
  },
  methods: {
    resetForm(){
      this.params = {};
      this.query();
    },
    handlePageChange(p){
      this.params.pageNo = p;
      this.query();
    },
    handleSizeChange(s){
      this.params.pageSize = s;
      this.query();
    },
    beginAdd(){
      this.isEdit = false;
      this.item = {};
      this.formVisible = true;
    },
    query(){
      let params = {};
      Object.keys(this.params).forEach(k => {
        if(this.params[k] && (this.params[k]+"").trim()){
          params[k] = (this.params[k]+"").trim();
        }
      })
      axios.get("/items/page", {params})
        .then(resp => {
          this.items = resp.data.list;
          this.total = parseInt(resp.data.total);
        })
        .catch(err => {
          console.log(err)
          this.items = [
            {
              "id": 317580,
              "name": "RIMOWA 26寸托运箱拉杆箱 SALSA AIR系列果绿色 820.70.36.4",
              "price": 86600,
              "stock": 2,
              "image": "https://m.360buyimg.com/mobilecms/s720x720_jfs/t6934/364/1195375010/84676/e9f2c55f/597ece38N0ddcbc77.jpg!q70.jpg.webp",
              "category": "拉杆箱",
              "brand": "RIMOWA",
              "spec": "{\"颜色\": \"蓝色\", \"尺码\": \"26寸\"}",
              "sold": 0,
              "commentCount": 0,
              "status": 1,
              "isAD": false,
              "createTime": "2019-04-30T16:00:00.000+00:00",
              "updateTime": "2019-04-30T16:00:00.000+00:00"
            },
            {
              "id": 546872,
              "name": "博兿（BOYI）拉杆包男23英寸大容量旅行包户外手提休闲拉杆袋 BY09186黑灰色",
              "price": 27500,
              "stock": 10000,
              "image": "https://m.360buyimg.com/mobilecms/s720x720_jfs/t3301/221/3887995271/90563/bf2cadb/57f9fbf4N8e47c225.jpg!q70.jpg.webp",
              "category": "拉杆箱",
              "brand": "博兿",
              "spec": "{\"颜色\": \"黑色\"}",
              "sold": 0,
              "commentCount": 0,
              "status": 1,
              "isAD": false,
              "createTime": "2019-04-30T16:00:00.000+00:00",
              "updateTime": "2019-04-30T16:00:00.000+00:00"
            },
            {
              "id": 561178,
              "name": "RIMOWA 30寸托运箱拉杆箱 SALSA AIR系列果绿色 820.70.36.4",
              "price": 1300,
              "stock": 10000,
              "image": "https://m.360buyimg.com/mobilecms/s720x720_jfs/t6934/364/1195375010/84676/e9f2c55f/597ece38N0ddcbc77.jpg!q70.jpg.webp",
              "category": "拉杆箱",
              "brand": "RIMOWA",
              "spec": "{\"颜色\": \"红色\", \"尺码\": \"30寸\"}",
              "sold": 0,
              "commentCount": 0,
              "status": 1,
              "isAD": false,
              "createTime": "2019-04-30T16:00:00.000+00:00",
              "updateTime": "2019-04-30T16:00:00.000+00:00"
            },
            {
              "id": 577967,
              "name": "莎米特SUMMIT 旅行拉杆箱28英寸PC材质大容量旅行行李箱PC154 黑色",
              "price": 71300,
              "stock": 10000,
              "image": "https://m.360buyimg.com/mobilecms/s720x720_jfs/t30454/163/719393962/79149/13bcc06a/5bfca9b6N493202d2.jpg!q70.jpg.webp",
              "category": "拉杆箱",
              "brand": "莎米特",
              "spec": "{\"颜色\": \"黑色\"}",
              "sold": 0,
              "commentCount": 0,
              "status": 1,
              "isAD": false,
              "createTime": "2019-04-30T16:00:00.000+00:00",
              "updateTime": "2019-04-30T16:00:00.000+00:00"
            },
            {
              "id": 584382,
              "name": "美旅AmericanTourister拉杆箱 商务男女超轻PP行李箱时尚大容量耐磨飞机轮旅行箱 25英寸海关锁DL7灰色",
              "price": 36600,
              "stock": 10000,
              "image": "https://m.360buyimg.com/mobilecms/s720x720_jfs/t1/22734/21/2036/130399/5c18af2aEab296c01/7b148f18c6081654.jpg!q70.jpg.webp",
              "category": "拉杆箱",
              "brand": "美旅箱包",
              "spec": "{\"颜色\": \"绿色\", \"尺寸\": \"25英寸\"}",
              "sold": 0,
              "commentCount": 0,
              "status": 1,
              "isAD": false,
              "createTime": "2019-04-30T16:00:00.000+00:00",
              "updateTime": "2019-04-30T16:00:00.000+00:00"
            }
          ];
          this.total = 124;
        });
    },
    handleEdit(v1, v2) {
      if(v2.status === 1){
        this.$message({
          message: '上架的商品不能修改，请先下架！',
          type: 'error'
        });
        return;
      }
      this.isEdit = true;
      this.item = JSON.parse(JSON.stringify(v2));
      this.formVisible = true;
    },
    handleDelete(v1, v2) {
      if(v2.status === 1){
        this.$message({
          message: '上架的商品不能删除，请先下架！',
          type: 'error'
        });
        return;
      }
      this.$confirm('此操作将永久删除商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteById(v2.id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    confirmEdit(){
      if(this.isEdit){
        axios.put("/items", this.item)
          .then(resp => {
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            this.formVisible = false;
            this.query();
          })
          .catch(err => {
            this.$message({
              message: '更新失败',
              type: 'error'
            });
            console.log(err);
          })
      }else{
        axios.post("/items", this.item)
          .then(resp => {
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.formVisible = false;
            this.query();
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
    deleteById(id){
      axios.delete("/items/" + id)
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.query();
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
          console.log(err);
        })
    },
    handleUp(id){
      this.updateStatus(id, 1);
    },
    handleDown(id){
      this.updateStatus(id, 2);
    },
    updateStatus(id, status){
      let action = status === 1 ? "上架" : "下架";

      axios.put("/items/status/" + id + "/" + status)
        .then(() => {
          this.$message({
            type: 'success',
            message: action + '成功!'
          });
          this.query();
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: action +'失败!'
          });
          console.log(err);
        })
    },
    parseJSON(str){
      return JSON.parse(str);
    }
  }
});