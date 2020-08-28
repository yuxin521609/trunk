<style lang="less" scoped>
  .base{background: #fff;}
</style>
<template>
  <!-- 渠道订单 -->
  <div class="base">
    <!-- table -->
    <div class="table">
      <div class="item-cont">
        <el-button-group>
          <el-button size="small" type="primary" @click="openAddClass">新增</el-button>
        </el-button-group>
      </div>
      <!-- table订单 -->
      <template>
        <el-table :data="tableData.data">
          <el-table-column prop="code" label="货主编号" width="100"></el-table-column>
          <el-table-column prop="name" label="货主名称" min-width="100"></el-table-column>
          <el-table-column prop="orgName" label="隶属机构" min-width="100"></el-table-column>
          <el-table-column prop="description" label="备注" min-width="100"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="90">
            <template slot-scope="scope">{{scope.row.updateTime | timestampToTime}}</template>
          </el-table-column>
          <el-table-column prop="used" label="启停状态" width="80">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.used"
                  active-color="#13ce66"
                  @change="switchValid(scope.row)"
                  inactive-color="#9d9d9d">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              label-class-name="text-center"
              class-name="text-center"
              label="操作"
              width="140"
          >
            <template slot-scope="scope">
              <el-button @click="handleEditClick(scope.row.id)" type="text" size="small">编辑</el-button>
              <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="tableData.pageIndex"
              :page-sizes="[10,20,30,40,50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.totalCount">
          </el-pagination>
        </div>
      </template>        
    </div>
    <!--新增 编辑-->
    <el-dialog :title="isAdd ? '新增货主' : '编辑货主'" :visible.sync="addAndEditDialog" class="alarmPopup" width="420px">
      <el-form :model="addAndEditForm"  :rules="rules"  label-width="100px" size="small" ref="addAndEditDialogForm">
        <el-form-item prop="orgId" label="隶属机构：">
          <organization-select v-model="addAndEditForm.orgId" width-class="input-w-2" ref="organization" :disabled="!isAdd"></organization-select>
        </el-form-item>
        <el-form-item prop="code" label="货主编号：">
          <el-input class="input-w-2" placeholder="请输入内容" v-model="addAndEditForm.code" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="货主名称：">
          <el-input class="input-w-2" placeholder="请输入内容" v-model="addAndEditForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="used" label="启停状态" width="80">
          <el-switch v-model="addAndEditForm.used" active-color="#13ce66" inactive-color="#9d9d9d"></el-switch>
        </el-form-item>
        <el-form-item prop="description" label="备注：">
          <el-input class="input-w-2" type="textarea" v-model="addAndEditForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div class="item-footer item-right">
        <el-button size="small" @click="addAndEditDialog = false">取消</el-button>
        <el-button size="small" @click="submitForm('addAndEditDialogForm')" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import OrganizationSelect from "@/views/system/components/OrganizationSelect.vue";
  import { validateNumber } from '@/utils/validate'
  export default {
    name: 'shipper_list',
    components: {
      OrganizationSelect
    },
    data() {
      return {
        filtersData: {
          pageIndex: 1,//当前页码
          pageSize: 10//每页数量
        },
        // 表格数据
        tableData: {},
        // 新增和编辑
        addAndEditDialog: false,
        isAdd: true,
        addAndEditForm: {
          orgId: '',
          description: '',
          code: '',
          name: '',
          used: true
        },
        //验证
        rules: {
          code: [
            { required: true, trigger: "blur", validator: validateNumber}
          ],
          name: [
            {required: true, message: "请输入货主名称", trigger: "blur"}
          ],
          orgId: [
            {required: true, message: "请选择机构", trigger: "change"}
          ]
        },
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.getTableList()
      })
    },
    activated() {
      this.getTableList();
    },
    methods: {
      //获取列表
      getTableList(){
        this.request(this.api.system.goodsOwner_list,this.filtersData).then(data=>{
          this.tableData =data;
        });
      },
      // 获取详情
      getDetails(id){
        this.request(this.api.system.goodsOwner_get, {id: id}).then(data => {
          this.addAndEditForm = data;
        });
      },
      //新增
      openAddClass() {
        this.isAdd = true;
        this.addAndEditDialog = true;
        this.addAndEditForm = {
          orgId: '',
          description: '',
          code: '',
          name: '',
          used: true
        };
        this.$nextTick(() => {
          this.$refs.addAndEditDialogForm.resetFields();
        })
      },
      //修改
      handleEditClick(id) {
        this.isAdd = false;
        this.addAndEditDialog = true;
        this.getDetails(id)
      },
      //保存
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.request(this.api.system.goodsOwner_save, this.addAndEditForm).then(data => {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.addAndEditDialog = false;
              this.getTableList();
            });
          }
        });
      },
      //滑块开关
      switchValid(params){
        this.request(this.api.system.goodsOwner_updateValid,params).then(data=>{
          this.$message({
            type: "success",
            message: "状态修改成功！"
          });
        })
      },
      //删除仓库
      handleDeleteClick(params) {
        if(params.used){
          this.$message({
            type: "error",
            message: "不能删除未停用的货主！"
          });
          return;
        }
        if (!confirm("确定要删除当前行数据么？")){
          return;
        }
        this.request(this.api.system.goodsOwner_logicDelete, params).then(data => {
          this.$message({
            type: "success",
            message: "删除货主成功！"
          });
          this.getTableList();
        });
      },

      // 表格更改条数
      handleSizeChange(val){
        this.filtersData.pageSize=val;
        this.getTableList();
      },
      // 表格更改页数
      handleCurrentChange(val){
        this.filtersData.pageIndex=val;
        this.getTableList();
      }
    }
  }
</script>



