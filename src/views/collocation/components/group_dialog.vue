 <template>
  <el-dialog
    v-if="dialogVisible"
    :title="_title"
    :visible.sync="dialogVisible"
    class="alarmPopup"
    width="500px"
  >
    <el-form :model="filtersData" :rules="rules" label-width="100px" size="small" ref="filtersForm">
      <el-form-item prop="name" label="分组名称：">
        <el-input
          placeholder="请输入内容"
          class="input-w-2"
          :disabled="showDisabled"
          v-model="filtersData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="包含标签：" v-if="_type != 'add'">{{tagStr}}</el-form-item>
      <el-form-item prop="sort" label="排序：">
        <el-select :disabled="showDisabled" v-model="filtersData.sort" class="input-w-2" placeholder="请选择">
          <el-option
            v-for="item in sortOptions"
            :key="item.num"
            :label="item.num"
            :value="item.num"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="description" label="分组描述：">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          class="input-w-2"
          :disabled="showDisabled"
          v-model="filtersData.description"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="item-right">
      <el-button size="small" @click="closeDialog('filtersForm')">取消</el-button>
      <el-button
        v-if="_type == 'add'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >确定</el-button>
      <el-button
        v-else-if="_type == 'edit'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "tp-group-dialog",
  data() {
    return {
      dialogVisible: false,
      filtersData: {
        sort: 0,
        name: "",
        description: ""
      },
      //验证
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 24, message: "最大长度24个字符", trigger: "blur" }
        ],
        description: [
          { max: 120, message: "最大长度120个字符", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请选择排序", trigger: "change" }]
      },
      editDisabled: false, //可编辑状态  除使用状态其他都不可编辑
      showDisabled: false, //查看时 使用状态不可编辑
      sortOptions: [],
      _type: "",
      _id: "",
      _title: "新增",
      tagStr: ""
    };
  },

  created() {
    this.init();
  },
  methods: {
    init() {
      this._type = "";
      this._id = "";
      this._title = "";
      this.tagStr = "";
      this.sortOptions = [];
      this.filtersData = {
        sort: 0,
        name: "",
        description: ""
      };
    },
    //初始化
    popupInit(_type, _title, _id) {
      this.init();
      this._type = _type;
      this._id = _id;
      this._title = _title;
      //对象还需初始化
      switch (_type.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          this.getSortData(_type);
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getSortData(_type);
          this.getTagGroupData(_id);
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getSortData(_type);
          this.getTagGroupData(_id);
          break;
      }
      this.dialogVisible = true;
    },
    //关闭
    closeDialog(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields(); //重置选项
    },
    //保存表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.collocation.collocationTagGroup_save,
            this.filtersData
          ).then(data => {
            this.$message.success("保存成功");
            this.closeDialog(formName);
            setTimeout(() => {
              this.$emit("refreshItem", "刷新吧兄弟");
            }, 500);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // //获取列表数据
    getTagGroupData(_id) {
      this.request(this.api.collocation.collocationTagGroup_get, {
        id: _id
      }).then(res => {
        console.log(res);
        let arr = [];
        let items = res.collocationTagItems;
        for (let i = 0; i < items.length; i++) {
          arr.push(items[i].tagName);
        }
        this.tagStr = arr.join("、");
        this.filtersData = res;
      });
    },
    //
    getSortData(_type) {
      this.request(
        this.api.collocation.collocationTagGroup_selectMaxSort,
        {}
      ).then(res => {
        console.log(res == null);
        let num = _type == "add" ? (res == null ? 1 : Number(res) + 1) : res;
        let arr = [];
        for (let i = 1; i <= num; i++) {
          arr.push({
            num: i
          });
        }
        if (_type == "add") {
          this.filtersData.sort = num;
        }
        this.sortOptions = arr;
      });
    },
    //修改表单
    editForm(formName) {
      this.submitForm(formName);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
