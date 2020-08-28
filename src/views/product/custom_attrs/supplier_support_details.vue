<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :rules="rules"
      :model="filtersData"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
    >
      <el-row>
        <el-tabs v-model="activeName" class="basic-wrap">
          <el-tab-pane label="支持原料" name="material">
            <!-- 原料table -->
            <div class="item-cont">
              <el-button size="small" :disabled="showDisabled" @click="openAddMaterial">添加原料</el-button>
              <span class="item-sub-title">
                已选&nbsp;
                <em>{{materialTableListData.length}}</em>&nbsp;项原料
              </span>
            </div>
            <div class="item-table">
              <el-table
                :data="materialTableListData"
                stripe
                empty-text="暂无数据"
                header-align="center"
                header-row-class-name="item-table-header"
                :highlight-current-row="true"
              >
                <el-table-column prop="code" align="center" label="标准编码" min-width="100"></el-table-column>
                <el-table-column prop="name" align="center" label="属性名称" min-width="100"></el-table-column>
                <el-table-column prop="materialCateName" align="center" label="分类" min-width="100"></el-table-column>
                <el-table-column prop="image" align="center" label="图片" width="80">
                  <template slot-scope="scope">
                    <img class="table-img-wh" :src="scope.row.image" alt>
                  </template>
                </el-table-column>
                <el-table-column prop="unitPrice" align="center" label="销售价格" min-width="100"></el-table-column>
                <el-table-column prop="sourceCode" align="center" label="外部编码" min-width="120">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="showDisabled"
                      v-model="scope.row.sourceCode"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label-class-name="text-center"
                  class-name="text-center"
                  align="center"
                  label="操作"
                  width="50"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="_type != 'show'"
                      @click="removeTableItem('material',scope.row)"
                      type="text"
                      size="small"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 原料table end  -->
          </el-tab-pane>
          <el-tab-pane label="支持工艺" name="technology">
            <!-- 工艺table  -->
            <div class="item-cont">
              <el-button size="small" :disabled="showDisabled" @click="openAddTechnology">添加工艺</el-button>
              <span class="item-sub-title">
                已选&nbsp;
                <em>{{technologyTableListData.length}}</em>&nbsp;项工艺
              </span>
            </div>
            <div class="item-table">
              <el-table
                :data="technologyTableListData"
                stripe
                empty-text="暂无数据"
                header-align="center"
                header-row-class-name="item-table-header"
                :highlight-current-row="true"
              >
                <el-table-column prop="code" align="center" label="标准编码" min-width="100"></el-table-column>
                <el-table-column prop="materialCateName" align="center" label="分类" min-width="100"></el-table-column>
                <el-table-column prop="name" align="center" label="原料名称" min-width="100"></el-table-column>
                <el-table-column prop="image" align="center" label="图片" width="80">
                  <template slot-scope="scope">
                    <img class="table-img-wh" :src="scope.row.image" alt>
                  </template>
                </el-table-column>
                <el-table-column prop="unitPrice" align="center" label="销售价格" min-width="100"></el-table-column>
                <el-table-column prop="sourceCode" align="center" label="外部编码" min-width="120">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="showDisabled"
                      v-model="scope.row.sourceCode"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label-class-name="text-center"
                  class-name="text-center"
                  align="center"
                  label="操作"
                  width="50"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="_type != 'show'"
                      @click="removeTableItem('technology',scope.row)"
                      type="text"
                      size="small"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 工艺table   End-->
          </el-tab-pane>
          <el-tab-pane label="成衣数据项" name="readyMade">
            <!-- 成衣table  -->
            <div class="item-cont">
              <el-button size="small" :disabled="showDisabled" @click="openAddReadyMade">添加成衣测量项</el-button>
              <span class="item-sub-title">
                已选&nbsp;
                <em>{{readyMadeTableListData.length}}</em>&nbsp;项测量项
              </span>
            </div>
            <div class="item-table">
              <el-table
                :data="readyMadeTableListData"
                stripe
                empty-text="暂无数据"
                header-align="center"
                header-row-class-name="item-table-header"
                :highlight-current-row="true"
              >
                <el-table-column prop="name" align="center" label="名称" min-width="100"></el-table-column>
                <el-table-column prop="fullCateName" align="center" label="分类" min-width="100"></el-table-column>
                <el-table-column prop="image" align="center" label="图片" min-width="80">
                  <template slot-scope="scope">
                    <img class="table-img-wh" :src="scope.row.image" alt>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label-class-name="text-center"
                  class-name="text-center"
                  align="center"
                  label="操作"
                  width="50"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="_type != 'show'"
                      @click="removeTableItem('readyMade',scope.row)"
                      type="text"
                      size="small"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 成衣table   End-->
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-form>
    <div class="item-footer">
      <el-button
        v-if="this._type == 'add'"
        size="small"
        @click="submitAndEditForm()"
        type="primary"
      >确认新增</el-button>
      <el-button
        v-else-if="this._type == 'edit'"
        size="small"
        @click="submitAndEditForm()"
        type="primary"
      >修改</el-button>
      <el-button size="small" @click="routerback()">取消</el-button>
    </div>
    <!-- 原料 -->
    <tp-material-dialog @setParentMaterialData="getSubMaterialList" ref="materialDialog"></tp-material-dialog>
    <!-- 工艺 -->
    <tp-technology-dialog @setParentTechnologyData="getSubTechnologyList" ref="technologyDialog"></tp-technology-dialog>
    <!-- 成衣数据 -->
    <tp-readymade-dialog @setParentReadyMadeData="getSubReadyMadeList" ref="readymadeDialog"></tp-readymade-dialog>
  </div>
</template>
<script>
/**
 *制造商支持 新增 修改 查看 同一页面
 */
import MaterialDialog from "@/components/customAttribute/material_dialog";
import ReadyDadeDialog from "@/components/customAttribute/ready_made_dialog";
import TechnologyDialog from "@/components/customAttribute/technology_dialog";


export default {
  data() {
    return {
      filtersData: {
        cateIdentifier: "",
        manufacturerMeasurements: [], //制造商量体数据
        manufacturerProductionMaterials: [] //制造商原料数据
      },
      //标签切换默认
      activeName: "material",
      rules: {
        //规则验证
        code: [
          { required: true, message: "请选择品牌编码", trigger: "change" }
        ],
        name: [{ required: true, message: "请选择品牌名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择品牌分类", trigger: "blur" }]
      },
      editDisabled: false,
      showDisabled: false,
      materialTableListData: [], //原料数据
      technologyTableListData: [], //工艺数据
      readyMadeTableListData: [], //成品数据
      _type: "",
      _id: ""
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
  },
  methods: {
    //获取上页面参数
    getQueryparams() {
      let params = this.$route.query;
      this._type = params._type;
      this._id = params.id;
      this.filtersData.cateId = params.cateId;
      this.filtersData.cateName = params.cateName;
      this.filtersData.cateIdentifier = params.cateIdentifier;
      this.filtersData.fullCateName = params.fullCateName;
      this.filtersData.manufacturerName = params.manufacturerName;
      this.filtersData.manufacturerId = params.manufacturerId;
      let itemStatus = this._type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
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
      this.request(this.api.product.manufacturerProductionInformation_get, {
        id: this._id
      }).then(data => {
        let _data = data;
        this.filtersData =JSON.parse(JSON.stringify(_data));
        //循环找到原料工艺列表数据
        let Materials = _data.manufacturerProductionMaterials;
        let materialsTable = [],
          technologyTable = [];
        for (let i = 0; i < Materials.length; i++) {
          if (Materials[i].type == 2) {
            materialsTable.push(Materials[i]);
          } else {
            technologyTable.push(Materials[i]);
          }
        }
        //回显列表数据；
        this.materialTableListData = materialsTable;
        this.technologyTableListData = technologyTable;
        this.readyMadeTableListData = _data.manufacturerMeasurements;
      });
    },
    //新增
    submitAndEditForm() {
      if (this.materialTableListData.length <= 0) {
        this.$message.error("原料数据不能为空");
        this.activeName = "material";
        return false;
      }
      if (this.technologyTableListData.length <= 0) {
        this.$message.error("工艺数据不能为空");
        this.activeName = "technology";
        return false;
      }
      if (this.readyMadeTableListData.length <= 0) {
        this.$message.error("成品数据不能为空");
        this.activeName = "readyMade";
        return false;
      }
      //处理量体
      let filters = JSON.parse(JSON.stringify(this.filtersData));
      let manufacturer = this.setSubmitData(this.readyMadeTableListData);
      filters.manufacturerMeasurements = manufacturer;
      let material = this.setSubmitData(this.materialTableListData, 2);
      let technology = this.setSubmitData(this.technologyTableListData, 1);
      filters.manufacturerProductionMaterials = [...material, ...technology];
      if (this._type == "edit") {
        let mirrorFilters =JSON.parse(JSON.stringify(this.filtersData));
        //镜像原料工艺
        let mirrorMT = mirrorFilters.manufacturerProductionMaterials;
        //镜像成衣数据项
        let mirrorMR = mirrorFilters.manufacturerMeasurements;
        //原料工艺
        let MT = filters.manufacturerProductionMaterials;
        //成衣数据项
        let MR = filters.manufacturerMeasurements;
        let deleteMT = [],
          deleteMr = [];
        for (let i = 0; i < mirrorMT.length; i++) {
          let flag = false;
          for (let k = 0; k < MT.length; k++) {
            if (
              mirrorMT[i].materialId == MT[k].materialId &&
              MT[k].id != null
            ) {
              flag = true;
            }
          }
          if (!flag) {
            //此处是已删除的数据 但不正确 还要知道当前数据是不是删除后又新增的
            mirrorMT[i].status = 9;
            deleteMT.push(mirrorMT[i]);
          }
        }
        for (let i = 0; i < mirrorMR.length; i++) {
          let flag = false;
          for (let k = 0; k < MR.length; k++) {
            if (
              mirrorMR[i].measurementId == MR[k].measurementId &&
              MR[k].id != null
            ) {
              flag = true;
            }
          }
          if (!flag) {
            //此处是已删除的数据 但不正确 还要知道当前数据是不是删除后又新增的
            mirrorMR[i].status = 9;
            deleteMr.push(mirrorMR[i]);
          }
        }
        filters.manufacturerProductionMaterials = [...MT, ...deleteMT];
        filters.manufacturerMeasurements = [...MR, ...deleteMr];
      }
      this.request(
        this.api.product.manufacturerProductionInformation_save,
        filters
      ).then(data => {
        this.$message.success("保存成功");
        setTimeout(() => {
          this.routerback();
        }, 500);
      });
    },
    setSubmitData(list, type) {
      let params = this.filtersData;
      for (let i = 0; i < list.length; i++) {
        list[i].cateId = params.cateId;
        list[i].cateName = params.cateName;
        list[i].cateIdentifier = params.cateIdentifier;
        list[i].fullCateName = params.fullCateName;
        list[i].manufacturerName = params.manufacturerName;
        list[i].manufacturerId = params.manufacturerId;
        if (type) {
          list[i].type = type;
        }
      }
      return list;
    },
    /**添加原料
     * 判断当前状态是修改还是新增
     * 当状态是修改时 把数据做个镜像发进去
     * 子级处理好的返回父级
     */
    openAddMaterial() {
      this.$refs.materialDialog.popupInit(
        this.filtersData.cateIdentifier,
        "edit",
        [...this.materialTableListData]
      );
    },
    //原料添加成功后返回的数据
    getSubMaterialList(list) {
      this.materialTableListData = list;
    },
    //添加工艺
    openAddTechnology() {
      this.$refs.technologyDialog.popupInit(
        this.filtersData.cateIdentifier,
        "edit",
        [...this.technologyTableListData]
      );
    },
    getSubTechnologyList(list) {
      this.technologyTableListData = list;
    },
    //添加成衣数据
    openAddReadyMade() {
      this.$refs.readymadeDialog.popupInit(
        this.filtersData.cateId,
        "edit",
        [...this.readyMadeTableListData]
      );
    },
    getSubReadyMadeList(list) {
      this.readyMadeTableListData = list;
    },
    //统一删除
    removeTableItem(cateName, row) {
      switch (cateName) {
        case "material":
          this.deleteList(cateName, this.materialTableListData, row);
          break;
        case "technology":
          this.deleteList(cateName, this.technologyTableListData, row);
          break;
        default:
          //readyMade
          this.deleteList(cateName, this.readyMadeTableListData, row);
          break;
      }
    },
    deleteList(cateName, list, row) {
      let index = -1;
      if (cateName == "readyMade") {
        index = list.findIndex(item => item.measurementId == row.measurementId);
      } else {
        index = list.findIndex(item => item.materialId == row.materialId);
      }
      if (index != -1) {
        list.splice(index, 1);
      }
    },
    //后退
    routerback() {
      if (this._type == "edit") {
        this.$router.go(-1);
      } else if (this._type == "add") {
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
    }
  },
  components: {
    [MaterialDialog.name]: MaterialDialog,
    [ReadyDadeDialog.name]: ReadyDadeDialog,
    [TechnologyDialog.name]: TechnologyDialog
  }
};
</script>
<style lang="less" scoped>
.item-sub-title {
  margin-left: 20px;
  em {
    color: red;
  }
}
</style>
