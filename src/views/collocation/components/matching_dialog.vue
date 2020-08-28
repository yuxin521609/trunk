<!--
 * @Description: 标签
 * @Author:elephant
 * @Date: 2019-08-20 08:58:17
 * @LastEditTime: 2019-08-20 14:51:36
 * @LastEditors: Please set LastEditors
 -->
 <template>
  <el-dialog
    v-if="dialogVisible"
    :title="_title"
    :visible.sync="dialogVisible"
    class="alarmPopup"
    width="500px"
  >
    <el-form
      :model="filtersData"
      :rules="rules"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
    >
      <el-form-item prop="name" label="标签名称：">
        <el-input
          class="input-w-2"
          placeholder="请输入内容"
          :disabled="editDisabled"
          v-model="filtersData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属分组：">
        <el-select
          class="input-w-2"
          placeholder="请选择"
          :disabled="showDisabled"
          v-model="filtersData.tagGroupId"
          @change="tagGroupIdGet"
        >
          <el-option
            v-for="item in groupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
         <el-form-item  prop="image"  label="标签图片：">
           <el-upload-img
            v-model="filtersData.image"
            :EchoDisplayImages="productImages"
            CatalogName="product"
            ></el-upload-img>
        </el-form-item>
      <el-form-item prop="description" label="标签描述：">
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
        @click="editForm('filtersForm')"
        type="primary"
      >修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ElUploadImg from '@/components/uploadImg/el_upload_img';
export default {
  name: "tp-matching-dialog",
  data() {
    return {
      dialogVisible: false,
      filtersData: {
        name: "", //标签名称
        image:'',
        tagGroupId:'',
        tagGroupName:'',
        description: ""
      },
      productImages:[],
      //验证
      rules: {
        name: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
          { max: 24, message: "最大长度24个字符", trigger: "blur" }
        ],
        description: [
          { max: 120, message: "最大长度120个字符", trigger: "blur" }
        ]
      },
      editDisabled: false, //可编辑状态  除使用状态其他都不可编辑
      showDisabled: false, //查看时 使用状态不可编辑
      _type: "",
      _id: "",
      _title: "新增",
      groupOptions: [],
      setGroupData: []
    };
  },
  created() {
    this.init();
    this.getTagGroupList();
  },
  methods: {
    init() {
      this._type = "";
      this._id = "";
      this._title = "";
      this.setGroupData = [];
      this.productImages=[];
      this.filtersData = {
        name: "",
        description: "",
        image:'',
         tagGroupId:'',
        tagGroupName:'',

      };
    },
    getTagGroupList() {
      this.request(this.api.collocation.collocationTagGroup_list, {}).then(
        res => {
          this.groupOptions = res.data;
        }
      );
    },
     //分组ID改变时获取ID 同时赋值name
    tagGroupIdGet(val) {
      let _obj = this.groupOptions.find(item => item.id == val);
      this.filtersData.tagGroupName = _obj.name;
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
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getListData(_id);
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getListData(_id);
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
            this.api.collocation.collocationTag_save,
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
    getListData(_id) {
      this.request(this.api.collocation.collocationTag_get, {
        id: this._id
      }).then(res => {
        console.log(res);
        if(!!res.image){
          this.productImages=[{url:res.image}];
        }else{
          this.productImages=[];
        }
         this.filtersData = res;
      });
    },
    //修改表单
    editForm(formName) {
      this.submitForm(formName);
    },

  },
    components: {
      ElUploadImg
    },
};
</script>
<style lang="less" scoped>
</style>
