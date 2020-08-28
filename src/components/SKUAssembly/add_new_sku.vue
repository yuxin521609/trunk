number<template>
  <el-dialog
    v-if="SKUDialogVisible"
    title="SKU"
    :visible.sync="SKUDialogVisible"
    class="alarmPopup new-sku"
    width="1000px"
    append-to-body
    :before-close="handleClose"
  >
    <el-form
      :model="filtersData"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
      :rules="rules"
    >
      <el-row>
        <el-col :span="10">
          <el-form-item prop="name" label="SKU名称：">
            <el-input :disabled="showDisabled" class="input-w" placeholder="请输入内容" v-model="filtersData.name"></el-input>
          </el-form-item>
          <el-form-item prop="image" label="SKU图片：">
            <el-upload-img
             :disabled="showDisabled"
              v-model="filtersData.image"
              :EchoDisplayImages="productImages"
              CatalogName="product"
            ></el-upload-img>
          </el-form-item>
          <el-form-item prop="valid" label="使用状态：">
            <el-select :disabled="showDisabled" class="input-w" placeholder="请选择" v-model="filtersData.valid">
              <el-option
                v-for="item in this.$common.getValidLowerOptions()"
                :key="item.status_id"
                :label="item.status_name"
                :value="item.status_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="transfer-wrap" :span="14">
          <el-transfer
            v-model="selectedSKUData"
            :data="skuListData"
            :props="skuProps"
            :titles="['可选', '已选']"
            @change="skuHandleChange"
            @left-check-change="skuLeftChange"
            @right-check-change="skuRightChange"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入"
          ></el-transfer>

          <!-- 不要删除空DIV  :render-content="renderFunc" -->
          <div class="transfer-one"></div><div class="transfer-two"></div>
        </el-col>
      </el-row>
    </el-form>
    <div class="item-right">
      <el-button size="small" @click="closeDialog('filtersForm')">取消</el-button>
      <el-button
        v-if="skuType == 'add'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >确定</el-button>
      <el-button
        v-else-if="skuType == 'edit'"
        size="small"
        @click="editForm('filtersForm')"
        type="primary"
      >修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ElUploadImg from "@/components/uploadImg/el_upload_img";
export default {
  name: "tp-new-sku",
  props: {
    placeholder: "请选择",
    value: ""
  },
  data() {
    return {
      SKUDialogVisible: false,
      filtersData: {
        image: "",
        name: "",
        valid: null,
         price:0,
         productGoodsMaterials:[]
      },
      skuType: "",
      skuIndex: null,
      skuProps: {
        key: "materialId",
        label:'_label'
      },
      showDisabled:false,
      //验证
      rules: {
        name: [{ required: true, message: "请输入SKU名称", trigger: "blur" }],
        image: [{ required: true, message: "请上传图片", trigger: "blur" }],
        valid: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      skuListData: [], //数据是[{},{}]
      //已选SKU数据
      selectedSKUData: [], //存的是IDS
      productImages: []
    };
  },
  created () {
  },
  methods: {
    /*
    * @params: type 增加还是修改等类型 String
                    default null
              list  原料工艺数据 Array
                    default null
    */
    popupInit(type, mtList) {
      this.skuType = type;
      //感觉此处最好带过来参数
      //this.init();
      for (let i = 0; i < mtList.length; i++) {
        mtList[i].disabled=false;
        mtList[i]._label=`${mtList[i].name}/${mtList[i].code}`;

      }
      this.skuListData = mtList;
      this.resetMTList();
      this.SKUDialogVisible = true;
    },
    //修改时初始化
    editPopupInit(type, mtList, skuItem, skuIndex,isEchoDisplay) {
      this.skuType = type;
      //初始化禁选状态
      for (let i = 0; i < mtList.length; i++) {
        mtList[i].disabled=false;
        mtList[i]._label=`${mtList[i].name}/${mtList[i].code}`;
      }
      this.skuListData = mtList;
      this.resetMTList(isEchoDisplay);
      let item = JSON.parse(JSON.stringify(skuItem));
      this.filtersData = item;
      let itemMaterials = item.productGoodsMaterials;
      let arr = [];
      for (let i = 0; i < itemMaterials.length; i++) {
        arr.push(itemMaterials[i].materialId);
      }
      this.selectedSKUData = [...arr];
      this.skuIndex = skuIndex;
      if (!!item.image) {
        this.productImages = [{ url: item.image }];
      }
      //相同属性分类互斥
      this.skuHandleMaterialCateMutex([]);
      //调取接口获取互斥
      this.getRequestMutex([]);
      if(isEchoDisplay == 'show'){
        this.showDisabled = true;
      }else{
        this.showDisabled = false;
      }
      this.SKUDialogVisible = true;
    },
    getParentParams() {
      //对象还需初始化
      // switch (this._skuType.toString()) {
      //   case "add": //新增
      //     break;
      //   case "edit": //修改
      //     break;
      //   case "show": //查看
      //     break;
      // }
    },
    /**
     * 数据发生变动
     * value 右侧全部数据   direction 向左或向右移动
     * movedkeys 移动的数据
     */
    skuHandleChange(value, direction, movedkeys) {
      //数据向左侧传输
      if (direction == "left") {
        //初始化disabled
        this.resetMTList();
        //相同属性分类互斥
        this.skuHandleMaterialCateMutex(value);
        //调取接口获取互斥
        this.getRequestMutex(value);
        //修改时改变使用状态
        if(this.skuType == 'edit'){
          this.$message({
            message: '已选数据发生改变将改变使用状态',
            type: 'warning'
          });
          this.filtersData.valid=false;
        }
      } else {
        //数据向右边传输
      }
    },
    /**
     * 右侧勾选的时候 不做处理
     * 因为发生互斥变化的时候 只取左侧勾选数据 和右侧已有数据
     *
     */
    skuRightChange(itemAll, item) {
      // console.log(itemAll);
      // console.log(item);
    },
    /**
     * 左侧被勾选触发，
     * 1、当被勾选时 拿到右侧的数据和当前的数据先进行属性分类互斥 ，
     * 2、再进行调用接口互斥；
     */
    skuLeftChange(itemAll, item) {
      this.resetMTList();
      //相同属性分类互斥
      // for (let i = 0; i < this.skuListData.length; i++) {
      //   console.log(this.skuListData[i].id +'------'+this.skuListData[i].materialId);


      // }
      // console.log(itemAll);
      this.skuHandleMaterialCateMutex(itemAll);
      //调取接口获取互斥
      this.getRequestMutex(itemAll);
    },
    //处理属性分类互斥
    skuHandleMaterialCateMutex(itemAll) {
      //数据集合
      let listAll = [...itemAll, ...this.selectedSKUData];
      let skuList = this.skuListData;
      //处理数据集合
      let itemData = this.getIdsListData(listAll);
      if (listAll.length > 0) {
        //对数据对象进行循环 判别出属性分类互斥
        for (let i = 0; i < itemData.length; i++) {
          let itemCateId = itemData[i].materialCateId;
          let itemMaterialId = itemData[i].materialId;
          for (let k = 0; k < skuList.length; k++) {
            let skuCateId = skuList[k].materialCateId;
            let skuMaterialId = skuList[k].materialId;
            if (itemCateId == skuCateId && itemMaterialId != skuMaterialId) {
              skuList[k].disabled = true;
            }
          }
        }
      }
    },
    //调用互斥接口 获取互斥ID
    getRequestMutex(itemAll) {
      console.log(itemAll);
      let listAll = [...itemAll, ...this.selectedSKUData];
      if (listAll.length > 0) {
        this.request(
          this.api.product.customizedProductMaterial_listExclusionMaterial,
          { selectedMaterialIds: listAll }
        ).then(res => {
          //互斥ID数组
          let _data = res.data,
            _dataLen = _data.length;
          let skuList = this.skuListData,
            skuListLen = skuList.length;
          for (let i = 0; i < skuListLen; i++) {
            for (let k = 0; k < _dataLen; k++) {
              if (skuList[i].materialId == _data[k]) {
                skuList[i].disabled = true;

              }
            }
          }

        });
      }
    },
    //点击加号重置左侧分类 增加type 判断是否右侧清空
    resetMTList(isEchoDisplay) {
      let skuList = this.skuListData;
      if(isEchoDisplay != 'show'){
        for (let k = 0; k < skuList.length; k++) {
          skuList[k].disabled = false;
        }
      }else{
        for (let k = 0; k < skuList.length; k++) {
          skuList[k].disabled = true;
        }
      }
    },
    //保存时判断
    submitForm(formName) {
      this.addAndEditForm(formName)
    },
    //修改保存 和新增数据不一样  还有 当在回显修改时 数据还要做判断
    editForm(formName){
      if(this.skuType == 'edit'){
        this.addAndEditForm(formName,'edit')
      }
    },
    //新增和保存   回显还单独做处理
    addAndEditForm(formName,addType){
       let skuData = this.selectedSKUData;
      if (skuData <= 0) {
        this.$message({
          message: "请勾选分类",
          type: "error"
        });
        return false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let selectedIdsData = this.getIdsListData(skuData);
          let zType = false,
            mType = false;
          for (let i = 0; i < selectedIdsData.length; i++) {
            if (selectedIdsData[i].type == 1) {
              zType = true;
            } else if (selectedIdsData[i].type == 2) {
              mType = true;
            }
            if (zType && mType) {
              break;
            }
          }
          if (!zType || !mType) {
            this.$message({
              message: "已选必须含有一条原料及一条工艺",
              type: "error"
            });
            return false;
          }
          //处理数据 productGoodsId 问题
          let csPGS= this.filtersData.productGoodsMaterials;
          for (let i = 0; i < csPGS.length; i++) {
            for (let k = 0; k < selectedIdsData.length; k++) {
             if(csPGS[i].materialId == selectedIdsData[k].materialId){
                selectedIdsData[k]=csPGS[i]
             }
            }
          }
          //计算价格
          let ptGsMs=selectedIdsData;
          for (let k = 0; k < ptGsMs.length; k++) {
              this.filtersData.price += ptGsMs[k].usageAmount * ptGsMs[k].unitPrice
          }
          if(addType == 'edit'){
            for (let i = 0; i < selectedIdsData.length; i++) {
              if(!selectedIdsData[i].productGoodsId){
                 selectedIdsData[i].id=null;
              }
            }
            this.filtersData.productGoodsMaterials = selectedIdsData;
            this.$emit("setParentEditSKUData", JSON.parse(JSON.stringify(this.filtersData)),addType,this.skuIndex);
          }else{
            this.filtersData.productGoodsMaterials = selectedIdsData;
            this.$emit("setParentSKUData", this.filtersData);
          }

          this.closeDialog();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //根据已选ID 获取原数据
    getIdsListData(_ids) {
      let skuList = this.skuListData;
      let ids = _ids;
      let idsArr = [];
      for (let i = 0; i < ids.length; i++) {
        for (let k = 0; k < skuList.length; k++) {
          if (ids[i] == skuList[k].materialId) {
            idsArr.push(skuList[k]);
            break;
          }
        }
      }
      return idsArr;
    },
    closeDialog() {
      this.init();
      this.SKUDialogVisible = false;
    },
    handleClose(done) {
      this.init();
      done();
      this.SKUDialogVisible = false;
    },
    init() {
      this.filtersData = {
        image: "",
        name: "",
        valid: null,
        price:0,
        productGoodsMaterials:[]
      };
      this.skuType = "";
      this.skuIndex = null;
      this.skuListData = []; //数据是[{},{}]
      this.selectedSKUData = []; //存的是IDS
      this.productImages = [];
    },
    filterMethod(query, item) {
      return item._label.toUpperCase().indexOf(query.toUpperCase()) > -1;
    },
    //处理数据
    renderFunc(h, option) {
      return (
        <span>
          {option.name} / {option.code}
        </span>
      );
    }
  },
  components: {
    ElUploadImg
  }
};
</script>
<style lang="less" scoped>
.new-sku /deep/ .el-transfer-panel__header .el-checkbox .el-checkbox__input {
  display: none;
}
.transfer-wrap{
  position: relative;
  .transfer-one{
    position: absolute;
    width: 200px;
    height: 40px;
    left: 0;
    top: 0;
  }
   .transfer-two{
    position: absolute;
    width: 200px;
    height: 40px;
    left:295px;
    top: 0;
  }
}
</style>
