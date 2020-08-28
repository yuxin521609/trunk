<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :rules="rules"
      :model="filtersData"
      label-width="100px"
      size="small"
      ref="filtersForm"
    >
      <el-form-item v-if="_type != 'add'" label="已选分类：">
        <div>{{cateNames}}</div>
      </el-form-item>
      <el-form-item :prop="_type == 'add'?'categories':''" label="商品分类：">
        <div class="input-w-2">
          <el-cascader-multi
            :disabled="showDisabled"
            v-model="cateIdArr"
            @change="cateChangeGet"
            :data="classData"
            :only-last="true"
            :clearable="true"
            :is-two-dimension-value="false"
            separator="/"
            value-key="id"
            label-key="name"
            children-key="children"
          ></el-cascader-multi>
        </div>
      </el-form-item>
      <el-form-item prop="type" label="测量类型：">
        <el-select
          class="input-w-2"
          placeholder="请选择"
          :disabled="editDisabled"
          v-model="filtersData.type"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="测量项：">
        <el-input
          class="input-w-2"
          placeholder="请输入内容"
          :disabled="editDisabled"
          v-model="filtersData.name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="image" label="图片：">
        <el-upload-img
          v-model="filtersData.image"
          :EchoDisplayImages="productImgs"
          CatalogName="crm"
        ></el-upload-img>
      </el-form-item>
      <el-form-item prop="valid" label="使用状态：">
        <el-radio v-model="filtersData.used" :disabled="showDisabled" :label="true">使用中</el-radio>
        <el-radio v-model="filtersData.used" :disabled="showDisabled" :label="false">未使用</el-radio>
      </el-form-item>
      <el-form-item prop="description" label="备注：">
        <el-input
          type="textarea"
          class="input-w-2"
          :disabled="showDisabled"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="filtersData.description"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="item-footer">
      <el-button
        v-if="_type == 'add'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >确定</el-button>
      <el-button
        v-else-if="_type == 'edit'"
        size="small"
        @click="editSubmitForm('filtersForm')"
        type="primary"
      >修改</el-button>
      <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
    </div>
    <!-- 图片上传组件 -->
  </div>
</template>
<script>
/**
 * 规格详情页面 新增 修改 查看 同一页面
 */
import ElUploadImg from "@/components/uploadImg/el_upload_img";
export default {
  data() {
    return {
      filtersData: {
        type: "",
        name: "",
        image: "",
        used: true,
        description: "",
        categories: []
      },
      cateIdArr: [],
      classData: [],
      classList: [],
      cateNames: "",
      //标签切换默认
      activeName: "basic",
      rules: {
        //规则验证
        code: [{ required: true, message: "请选择商品分类", trigger: "blur" }],
        name: [
          { required: true, message: "请输入测量项", trigger: "blur" },
          { max: 20, message: "不超过20个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择测量类型分类", trigger: "change" }
        ],
        categories: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        description: [{ max: 240, message: "不超过240个字符", trigger: "blur" }]
      },
      typeOptions: [
        {
          type: 1,
          name: "净体测量"
        },
        {
          type: 2,
          name: "成衣测量"
        }
      ],
      productImgs: [],
      editDisabled: false,
      showDisabled: false,
      _type: "",
      _id: ""
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
  },
  methods: {
    //多选分类发生改变的时候获取的ID
    // elCascaderGet(arr) {
    //   this.selectedCateIdArr=arr;
    // },
    cateChangeGet() {
      let careIdArr = this.cateIdArr,
        careIdLen = careIdArr.length;
      let list = this.classList,
        listLen = list.length;
      let categories = [];
      for (let i = 0; i < careIdLen; i++) {
        for (let k = 0; k < listLen; k++) {
          if (careIdArr[i] == list[k].id) {
            categories.push({
              id: list[k].id,
              name: list[k].name,
              code: list[k].code
            });
          }
        }
      }
      this.filtersData.categories = categories;
    },
    getClassData(_disabledIds) {
      this.$common.getClassSelect(this, 1, _disabledIds).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    //获取上页面参数
    getQueryparams() {
      //console.log(this.$route.query.id);
      this._type = this.$route.query.type;
      this._id = this.$route.query.id;
      let itemStatus = this._type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          this.getClassData();
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getData();
          break;
      }
    },
    //获取数据
    getData() {
      this.request(this.api.user.crm_measurement_get, { id: this._id }).then(
        data => {
          let _data = data;
          this.filtersData = _data;
          if (!!_data.image) {
            this.productImgs = [{ url: _data.image }];
          }
          let arr = [],
            cateIds = [];
          let Categories = _data.measurementCategories;
          for (let i = 0; i < Categories.length; i++) {
            arr.push(Categories[i].categoriesName); //此处的字段是错误的
            cateIds.push(Categories[i].categoriesId);
          }
          this.cateNames = arr.join("、");
          this.getClassData(cateIds);
        }
      );
    },
    //新增
    submitForm(formName) {
      console.log(this.filtersData.categories);

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(
            this.api.user.crm_measurement_create,
            this.filtersData
          ).then(data => {
            this.$message.success("新增成功");
            setTimeout(() => {
              this.routerback();
            }, 500);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //修改保存
    editSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let categories = this.filtersData.measurementCategories;
          let arr = [];
          for (let i = 0; i < categories.length; i++) {
            arr.push({
              id: categories[i].categoriesId,
              name: categories[i].categoriesName,
              code: categories[i].categoriesCode
            });
          }
          this.filtersData.categories.push(...arr);
          this.request(
            this.api.user.crm_measurement_update,
            this.filtersData
          ).then(data => {
            this.$message.success("修改成功");
            setTimeout(() => {
              this.routerback();
            }, 500);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //后退
    routerback() {
      this.$router.go(-1);
    }
  },
  components: {
    ElUploadImg
  }
};
</script>
<style lang="less" scoped>
.disabled .el-upload–picture-card {
  display: none;
}
</style>
