<template>
 <div>
   <!-- 选择调出入方信息 -->
    <el-dialog min-width="800px" max-width="1200px" :title="dialogIncludeObj.type === 'out' ? '选择调出方客户' : '选择调入方客户'" :visible.sync="dialogIncludeObj.isDialogTableVisible">
      <template v-if="dialogIncludeObj.type === 'out'">
        <el-form class="item-form" :model="dialogIncludeObj.formDataOut" label-width="90px" size="small" ref="formData" inline>
          <el-form-item label="客户类型：">
            <el-select
              placeholder="请选择"
              class="input-w"
              v-model="dialogIncludeObj.formDataOut.orderStatus"
              filterable
              clearable>
              <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchOutTableData" type="primary" plain>搜索</el-button>
            <el-button @click="initOutTableFormData" plain>重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dialogIncludeObj.tableOutDate.data" max-height="350" class="mt-10">
          <el-table-column label="单选" align="center" min-width="50">
            <template slot-scope="scope">
              <el-radio-group v-model="dialogIncludeObj.checkOutItem">
                <el-radio :label="scope.row">&nbsp;</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="名称" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10">
          <!-- 分页 -->
          <el-pagination
            class="mr-20"
            @size-change=""
            @current-change=""
            :current-page="dialogIncludeObj.formDataOut.pageIndex"
            :page-sizes="[10,20,30,40,50]"
            :page-size="dialogIncludeObj.formDataOut.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dialogIncludeObj.tableOutDate.totalCount"
          ></el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogIncludeObj.dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="outNext">下一步</el-button>
        </span>
      </template>
      <template v-else>
        <el-form
          class="item-form"
          :model="dialogIncludeObj.formDataIn"
          label-width="90px"
          size="small"
          ref="formData"
          inline>
          <el-form-item label="客户类型：" prop="orderStatus">
            <el-select
              placeholder="请选择"
              class="input-w"
              v-model="dialogIncludeObj.formDataIn.orderStatus"
              filterable
              clearable>
              <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchInTableData" type="primary" plain>搜索</el-button>
            <el-button @click="initInTableFormData" plain>重置</el-button>
          </el-form-item> 
        </el-form>
        <el-table :data="dialogIncludeObj.tableInDate.data" max-height="350" class="mt-10">
          <el-table-column label="单选" align="center" min-width="50">
            <template slot-scope="scope">
              <el-radio-group v-model="dialogIncludeObj.checkInItem">
                <el-radio :disabled="scope.row.status == 10" :label="scope.row">&nbsp;</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
           <el-table-column label="最后一次采配时间" align="center" min-width="90">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogIncludeObj.isDialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="inPrev">上一步</el-button>
          <el-button type="primary" @click="inNext">下一步</el-button>
        </span>
      </template>
    </el-dialog>
 </div>
</template>

<script>

export default {
  data() {
    return {
      // 选择框数据
      selectList:[{
        id:1,
        name:'张三'
      }],
      // 弹框中包裹的对象
      dialogIncludeObj:{
        // out为调出方，in调入方
        type:'out',
        // 弹出框是否显示
        isDialogTableVisible:true,
        // 调出单检索条件 ---
        formDataOut:{
          orderStatus:null,
          pageIndex:1,
          pageSize:10
        },
        // 调出单
        tableOutDate:{
          data:[{
            name:'111'
          }],
          totalCount:15
        },
        // 选中调出单某一项
        checkOutItem:{},
        // 调入单检索条件 ---
        formDataIn:{
          orderStatus:null
        },
        // 调入单
        tableInDate:{
          data:[{
            name:'111'
          }]
        },
        // 选中调入单某一项
        checkInItem:{}
      },
    }
  },
  created() {
    
  },
  methods: {
    // 搜索
    searchOutTableData() {

    },
    // 重置fromData选项
    initOutTableFormData() {

    },
    // 搜索
    searchInTableData() {

    },
    // 重置fromData选项
    initInTableFormData() {

    },
    // 调出单下一步
    outNext() {
      this.dialogIncludeObj.type = 'in';
    },
    // 调入单上一步
    inPrev() {
      this.dialogIncludeObj.type = 'out';
    },
    // 调入单下一步
    inNext() {

    }
  },
  components: {

  }
};
</script>
<style  lang="less" scoped>
</style>
