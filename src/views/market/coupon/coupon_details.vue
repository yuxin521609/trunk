<template>
  <div class="bg-fff item-margin coupon-box">
    <!-- 卡券配置 -->
    <el-form
      class="item-form coupon-form"
      :model="filtersData"
      :rules="rules"
      label-width="120px"
      size="small"
      ref="filtersForm"
    >
      <el-tabs v-model="activeName" class="basic-wrap">
        <!-- 数据汇总 -->
        <el-tab-pane v-if="paramType != 'add'" label="数据汇总" name="dataSummary">
          <div class="summary-wrap">
            <dl v-for="(item,index) in summaryData" :key="index">
              <dt>{{item.name}}</dt>
              <dd>{{item.val}}</dd>
            </dl>
          </div>
        </el-tab-pane>
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <el-form-item prop="name" label="卡券标题：">
            <el-input
              class="input-w-2"
              :disabled="showDisabled"
              placeholder="请输入卡券标题，如：领券到店立享受优惠"
              v-model="filtersData.name"
            ></el-input>
          </el-form-item>
          <el-form-item prop="type" label="卡券类型：">
            <el-select
              class="input-w-2"
              @change="handleTypeChange"
              placeholder="请选择"
              v-model="filtersData.type"
              :disabled="editDisabled"
            >
              <el-option
                v-for="item in COUPON.type"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 根据卡券类型切换  -->
          <!-- 面额 元  -->
          <el-form-item
            v-if="filtersData.type == 'REDUCE'"
            prop="denomination"
            :rules="[
              { required: true, message: '面额不能为空',trigger: 'blur'},
               { validator: validateNaturalNumber, trigger: 'blur' }
            ]"
            label="面额："
          >
            <el-input
              class="input-w"
              :disabled="editDisabled"
              placeholder="请输入减免金额"
              v-model="filtersData.denomination"
            ></el-input>
            <em>元</em>
          </el-form-item>
          <!-- 面额 折  -->
          <el-form-item
            v-else-if="filtersData.type == 'DISCOUNTS'"
            prop="denomination"
            :rules="[
              { required: true, message: '折扣不能为空',trigger: 'blur'},
              { validator: validateDiscount, trigger: 'blur' }
            ]"
            label="面额："
          >
            <el-input
              class="input-w"
              :disabled="editDisabled"
              placeholder="请输入折扣,如9.9"
              v-model="filtersData.denomination"
            ></el-input>
            <em>折</em>
          </el-form-item>
          <!-- 实物描述 -->
          <el-form-item
            v-else-if="filtersData.type == 'GIFT'"
            prop="giftDescription"
            :rules="[{required: true, message: '请输入实物描述', trigger: 'blur'},
             { min: 1, max: 10, message: '最长不超过10个字符', trigger: 'blur' }]"
            label="实物描述："
          >
            <el-input
              class="input-w-2"
              :disabled="editDisabled"
              placeholder="请输入实物描述，如：纯棉毛巾一条"
              v-model="filtersData.giftDescription"
            ></el-input>
          </el-form-item>
          <!-- 根据卡券类型切换 END -->
          <el-form-item prop="usingCondition" label="使用条件：">
            <el-select
              class="input-w-2"
              @change="handleConditionChange"
              :disabled="editDisabled"
              placeholder="请选择"
              v-model="filtersData.usingCondition"
            >
              <el-option
                v-for="item in COUPON.usingCondition"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 根据使用条件切换  -->
          <el-form-item
            v-if="filtersData.usingCondition == 'AMOUNT'"
            prop="minAmount"
            :rules="[
              { required: true, message: '金额不能为空',trigger: 'blur'},
              { validator: validateNaturalNumber, trigger: 'blur' }
            ]"
            label="满："
          >
            <el-input
              class="input-w"
              :disabled="editDisabled"
              placeholder="请输入条件金额"
              v-model="filtersData.minAmount"
            ></el-input>
            <em>元可使用</em>
          </el-form-item>
          <el-form-item
            v-if="filtersData.usingCondition == 'SUBSTANCE'"
            prop="minAmount"
            :rules="[
              { required: true, message: '件数不能为空',trigger: 'blur'},
              { validator: validateNaturalNumber, trigger: 'blur' }
            ]"
            label="满："
          >
            <el-input
              class="input-w"
              :disabled="editDisabled"
              placeholder="请输入购物数量"
              v-model="filtersData.minAmount"
            ></el-input>
            <em>件可使用</em>
          </el-form-item>
          <!-- 根据使用条件切换 END  -->
          <el-form-item
            prop="totalLimit"
            :rules="[
              { required: true, message: '可领数量不能为空',trigger: 'blur'},
              { validator: validateNaturalNumber, trigger: 'blur' }
            ]"
            label="可领数量："
          >
            <el-input
              class="input-w-2"
              :disabled="editDisabled"
              placeholder="请输入卡券库存数量"
              v-model="filtersData.totalLimit"
            ></el-input>
            <el-button
              v-if="paramType == 'edit'"
              @click="totalLimitVisible=true;"
              type="text"
              size="mini"
            >增加</el-button>
          </el-form-item>
        </el-tab-pane>
        <!-- 基本设置 END-->
        <!-- 适用范围 -->
        <el-tab-pane label="适用范围" name="area">
          <el-form-item prop="storeId" label="适用门店：">
            <el-select
              class="input-w-2"
              @change="handleStoreGet"
              :disabled="editDisabled"
              clearable
              filterable
              placeholder="请选择"
              v-model="filtersData.storeId"
            >
              <el-option
                v-for="item in storeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="timeBugFlag" required class="time-wrap" label="持续时间：">
            <el-col :span="11">
              <el-form-item prop="sendStartTime" class="mb-0">
                <el-date-picker
                  :disabled="showDisabled"
                  :clearable="false"
                  v-model="filtersData.sendStartTime"
                  type="date"
                  placeholder="请选择开始日期"
                  :picker-options="pickerOptionsA"
                  format="yyyy 年 MM 月 dd 日"
                  class="input-w"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="sendEndTime" class="mb-0">
                <el-date-picker
                  :clearable="false"
                  :disabled="showDisabled"
                  v-model="filtersData.sendEndTime"
                  type="date"
                  placeholder="请选择结束日期"
                  :picker-options="pickerOptionsB"
                  format="yyyy 年 MM 月 dd 日"
                  class="input-w"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item prop="validityType" label="有效时间类型：">
            <el-select
              class="input-w-2"
              @change="handleValidityTypeChange"
              :disabled="editDisabled"
              placeholder="请选择"
              v-model="filtersData.validityType"
            >
              <el-option
                v-for="item in  COUPON.validityType"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="filtersData.validityType == 'COLLECTION'"
            prop="validityPeriod"
            :rules="[
              { required: true, message: '天数不能为空',trigger: 'blur'},
              { validator: validateNaturalNumber, trigger: 'blur' }
            ]"
            label="领取后："
          >
            <el-input
              class="input-w"
              :disabled="showDisabled"
              placeholder="请输入天数，如：7"
              v-model="filtersData.validityPeriod"
            ></el-input>
            <em>天内有效</em>
          </el-form-item>
          <el-form-item
            class="time-wrap"
            v-else-if="filtersData.validityType == 'PERIOD'"
            label="有效日期："
            required
          >
            <el-col :span="11">
              <el-form-item prop="usingStartTime" class="mb-0">
                <el-date-picker
                  :disabled="editDisabled"
                  :clearable="false"
                  v-model="filtersData.usingStartTime"
                  type="date"
                  placeholder="请选择开始日期"
                  :picker-options="pickerOptionsC"
                  format="yyyy 年 MM 月 dd 日"
                  class="input-w"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="usingEndTime" class="mb-0">
                <el-date-picker
                  :clearable="false"
                  :disabled="showDisabled"
                  v-model="filtersData.usingEndTime"
                  type="date"
                  placeholder="请选择开始日期"
                  :picker-options="pickerOptionsD"
                  format="yyyy 年 MM 月 dd 日"
                  class="input-w"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item prop="range" label="适用商品：">
            <el-select
              class="input-w-2"
              placeholder="请选择"
              :disabled="editDisabled"
              v-model="filtersData.range"
            >
              <el-option label="通用" value="GENERAL"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="superposition" label="叠加折扣：">
            <el-select
              :disabled="editDisabled"
              class="input-w-2"
              placeholder="请选择折扣叠加规则"
              v-model="filtersData.superposition"
            >
              <!-- <el-option label="不可叠加" :value="false"></el-option> -->
              <el-option label="叠加所有折扣" :value="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="userLimitType" label="领取规则：">
            <el-select
              class="input-w-2"
              :disabled="editDisabled"
              placeholder="请选择领取规则"
              v-model="filtersData.userLimitType"
            >
              <el-option label="限领一张；" value="SINGLE"></el-option>
              <el-option label="限领一张，可重复领取；" value="HOLD_SINGLE"></el-option>
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <!-- 适用范围 END-->
        <!-- 其他设置 -->
        <el-tab-pane label="其他设置" name="other">
          <!-- <el-form-item prop="forward" label="转发设置：">
            <el-select class="input-w-2" placeholder="请选择" v-model="filtersData.forward">
              <el-option label="不允许转发" :value="false"></el-option>
              <el-option label="允许转发" :value="true"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="页面封面：" prop="cover">
            <el-upload-img
              :disabled="showDisabled"
              v-model="filtersData.cover"
              ImgTips="图片小于128K，建议尺寸750×600"
              ImgSize="0.128"
              :EchoDisplayImages="productImages"
              CatalogName="market"
            ></el-upload-img>
          </el-form-item>
          <el-form-item label="分享海报：" prop="poster">
            <el-upload-img
              :disabled="showDisabled"
              v-model="filtersData.poster"
              ImgTips="图片小于2M，建议尺寸1334×750"
              :EchoDisplayImages="posterImages"
              CatalogName="market"
            ></el-upload-img>
          </el-form-item>
          <el-form-item label="规则说明：" prop="description">
            <p>{{topDesc}}</p>
            <el-input
              :disabled="showDisabled"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 12}"
              class="coupon-textarea"
              v-model="filtersData.description"
            ></el-input>
          </el-form-item>
          <el-form-item prop="forwardCopywriting" label="转发文案：">
            <el-input
              class="input-w-2"
              :disabled="showDisabled"
              placeholder
              v-model="filtersData.forwardCopywriting"
            ></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 其他设置 END-->
      </el-tabs>
      <div class="item-footer">
        <el-button
          v-if="paramType == 'add'"
          size="small"
          @click="submitForm('filtersForm')"
          type="primary"
        >保存</el-button>
        <el-button
          v-else-if="paramType == 'edit'"
          size="small"
          @click="editForm('filtersForm')"
          type="primary"
        >修改</el-button>
        <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
      </div>
    </el-form>
    <!-- 卡券配置END -->
    <!-- 预览 -->
    <div class="coupon-preview">
      <div class="preview-banner">
        <img :src="filtersData.cover" alt />
      </div>
      <!-- 下部 -->
      <div class="preview-cont">
        <ul class="cont-top">
          <li>
            <img class="store-img" :src="storeObj.logoImage" alt />
          </li>
          <li>
            <p>{{!!storeObj.name ? storeObj.name : ''}}</p>
            <p>{{!!storeObj.addressInfo ? storeObj.addressInfo : ''}}</p>
          </li>
          <li>
            <img :src="previewImg.couponLocation" alt />
          </li>
        </ul>
        <!-- 中 -->
        <div class="cont-center">
          <h3 class="title">优惠券</h3>
          <div class="coupon-wrap">
            <img class="center-bg" :src="previewImg.couponWrap" alt />
            <img class="center-circle" :src="previewImg.couponSemicircle" alt />
            <ul class="center-txt">
              <li>{{couponViewName}}</li>
              <li>{{couponConditionView}}{{filtersData.superposition?' 、可叠加':''}}</li>
              <li>{{couponTimeView}}</li>
            </ul>
            <nav class="center-nav">点击领取</nav>
          </div>
        </div>
        <!-- 下 -->
        <div class="cont-bottom">
          <h3 class="title">卡券规则</h3>
          <div
            class="bottom-txt"
            style="white-space: pre-wrap;"
            v-html="handleHtml((!!topDesc ? topDesc :'') + filtersData.description)"
          ></div>
        </div>
      </div>
    </div>
    <!-- 预览END -->
    <!-- dialog -->
    <el-dialog
      title="增加可领数量"
      width="400px"
      :visible.sync="totalLimitVisible"
      class="video-wrap"
      append-to-body
    >
      <el-form
        class
        :model="totalLimitForm"
        label-width="120px"
        size="small"
        ref="totalLimitFormRef"
      >
        <el-form-item label="当前可领总数：">
          <p>{{filtersData.totalLimit}}</p>
        </el-form-item>
        <el-form-item
          prop="addTotalLimit"
          :rules="[
            { required: true, message: '增加数量不能为空',trigger: 'blur'},
            { validator: validateNaturalNumber, trigger: 'blur' }
          ]"
          label="增加数量："
        >
          <el-input class="input-w" placeholder="请输入所需增加的数量" v-model="totalLimitForm.addTotalLimit"></el-input>
          <em>张</em>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="small" @click="addTotalLimit('totalLimitFormRef')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- dialogEND -->
  </div>
</template>
<script>
import { validateNaturalNumber, validateDiscount } from "@/utils/validate";
import { timesTampConvertsDate } from "@/utils/index";
import ElUploadImg from "@/components/uploadImg/el_upload_img";

let mirrorFiltersData=null;
export default {
  components: {
    ElUploadImg
  },
  data() {
    return {
      //引入卡券右侧视图图片
      previewImg: {
        couponLocation: require("@/assets/coupon/coupon_location.png"),
        couponSemicircle: require("@/assets/coupon/coupon_semicircle.png"),
        couponWrap: require("@/assets/coupon/coupon_wrap.png")
      },
      //自然数验证
      validateNaturalNumber: validateNaturalNumber,
      //折扣验证
      validateDiscount: validateDiscount,
      //日期
      pickerOptionsA: {
        disabledDate: time => {
          let delay = this.filtersData.sendEndTime
          if (!!this.filtersData.sendEndTime) {
            return time.getTime() < (Date.now() - (24 * 60 * 60 * 1000)) || time.getTime() > new Date(delay).getTime();
          } else {
            return time.getTime() < (Date.now() - (24 * 60 * 60 * 1000));
          }
        }
      },
      pickerOptionsB: {
        disabledDate: time => {
          return (
            time.getTime() < new Date(this.filtersData.sendStartTime).getTime()
          ); //减去一天的时间代表可以选择同一天;
        }
      },
      pickerOptionsC: {
        disabledDate: time => {
          let delay = this.filtersData.usingEndTime
          if (!!this.filtersData.usingEndTime) {
            return  time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000 || time.getTime() > new Date(delay).getTime();
          } else {
            return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000;
          }
        }
      },
      pickerOptionsD: {
        disabledDate: time => {
          return (
            time.getTime() < new Date(this.filtersData.usingStartTime).getTime()
          ); //减去一天的时间代表可以选择同一天;
        }
      },
      //数据汇总
      summaryData: [
        { name: "卡券总量", tag: "total", val: "" },
        { name: "领取人数", tag: "limitUser", val: "" },
        { name: "领取次数", tag: "limitCount", val: "" },
        { name: "核销数量", tag: "writeOffCount", val: "" },
        { name: "关联订单数量", tag: "orderCount", val: "" },
        { name: "关联订单金额", tag: "orderAmount", val: "" },
        { name: "获新客数量", tag: "newCustomerCount", val: "" },
        { name: "", tag: "", val: null }
      ],
      //门店列表数据
      storeOptions: [],
      paramType: "",
      paramId: "",
      //标签切换默认
      activeName: "basic",
      totalLimitForm: {
        addTotalLimit: null
      },
      filtersData: {
        name: "", //卡券标题
        type: "", //卡券类型
        denomination: "", //面额
        giftDescription: "", //实物描述
        usingCondition: "", //使用条件
        minAmount: "", //条件金额
        totalLimit: "", //卡券总量
        storeId: "", //适用门店ID
        storeName: "", //适用门店名称
        sendStartTime: null, //持续时间 开始
        sendEndTime: null, //持续时间 结束
        validityType: "", //有效时间类型
        validityPeriod: "", //有效时间 天数 或下面字段
        usingStartTime: null, //有效时间 开始日期 或上面字段
        usingEndTime: null, //有效时间 结束日期  或上上字段
        range: "", //适用商品
        superposition: "", //是否叠加折扣
        userLimitType: "", //领取规则
        cover:"https://lss-app-temporary.oss-cn-beijing.aliyuncs.com/applet-WeChat/coupon_banner.png", //页面封面
        poster:"https://lss-app-temporary.oss-cn-beijing.aliyuncs.com/applet-WeChat/coupon_poster.jpg", //分享海报
        description: "2：领取卡券后到店消费或出示后核销兑现；3：卡券面额不可兑换现金或其他等值商品；4：卡券解释权归门店所有。", //规则说明
        forwardCopywriting: "有一张特权券等待您的领取。" //转发文案
      },
      timeBugFlag: false,
      editDisabled: false,
      showDisabled: false,
      productImages: [ { url: "https://lss-app-temporary.oss-cn-beijing.aliyuncs.com/applet-WeChat/coupon_banner.png" }],
      posterImages: [ { url: "https://lss-app-temporary.oss-cn-beijing.aliyuncs.com/applet-WeChat/coupon_poster.jpg" }],
      storeObj: {},
      totalLimitVisible: false, //可领数量弹窗 增量状态
      couponTimeView: "",
      rules: {
        //规则验证
        name: [
          { required: true, message: "请输入卡券标题", trigger: "blur" },
          { min: 1, max: 20, message: "最长不超过20个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择卡券类型", trigger: "change" }
        ],
        usingCondition: [
          { required: true, message: "请选择使用条件", trigger: "change" }
        ],
        range: [
          { required: true, message: "请选择适用商品", trigger: "change" }
        ],
        storeId: [
          { required: true, message: "请选择适用门店", trigger: "change" }
        ],
        superposition: [
          { required: true, message: "请选择折扣叠加", trigger: "change" }
        ],
        validityType: [
          { required: true, message: "请选择有效时间类型", trigger: "change" }
        ],
        userLimitType: [
          { required: true, message: "请选择领取规则", trigger: "change" }
        ],
        forwardCopywriting: [
          { required: true, message: "请输入转发文案", trigger: "blur" },
          { max: 22, message: "最长不超过22个字符", trigger: "blur" }
        ],
        sendStartTime: [
          {required: true, message: "请选择开始日期", trigger: "change"}
        ],
        sendEndTime: [
          { required: true, message: "请选择结束日期", trigger: "change"}
        ],
        usingStartTime: [
          { required: true, message: "请选择开始日期",trigger: "change"}
        ],
        usingEndTime: [
          {required: true, message: "请选择结束日期",trigger: "change"}
        ]
      }
    };
  },
  created() {
    mirrorFiltersData=null; 
    this.getParentParams();
  },
  methods: {
    /**
     * @description:根据上个页面的参数进行判断 新增等等
     * @author: elephant
     * @param {name,couponId} name: 路由名称 couponId 卡券ID
     * @return: null
     * @Date: 2019-10-08 16:16:07
     */
    getParentParams() {
      let itemStatus = this.$route.name;
      this.paramId = this.$route.query.couponId;
      switch (itemStatus.toString()) {
        case "add_coupon": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          this.activeName = "basic";
          this.paramType = "add";
          this.getStoreData();
          break;
        case "edit_coupon": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.paramType = "edit";
          this.activeName = "dataSummary";
          this.getPromiseCouponAll();
          this.getCouponStatisticalData();
          break;
        case "show_coupon": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.paramType = "show";
          this.activeName = "dataSummary";
          this.getPromiseCouponAll();
          this.getCouponStatisticalData();
          break;
      }
      //回显时间出现问题 此时坐下延迟处理
      setTimeout(() => {
        this.timeBugFlag = true;
      }, 500);
    },
    //新增
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let filter = this.$common.deepCopy(this.filtersData);
          filter.usingEndTime = this.endTime(filter.usingEndTime);
          filter.sendEndTime = this.endTime(filter.sendEndTime);
          this.request(this.api.market.coupon_save, filter).then(data => {
            this.$message.success("保存成功");
            setTimeout(() => {
              this.routerback();
            }, 1500);
          });
        } else {
          this.$message.error("请输入必填项");
        }
      });
    },
    //修改提交
    editForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let filter = this.$common.deepCopy(this.filtersData);
          if(mirrorFiltersData.usingEndTime != filter.usingEndTime){
            filter.usingEndTime = this.endTime(filter.usingEndTime);
          }
          if(mirrorFiltersData.sendEndTime != filter.sendEndTime){
            filter.sendEndTime = this.endTime(filter.sendEndTime);
          }
          this.request(this.api.market.coupon_save, filter).then(data => {
            this.$message.success("修改成功");
            setTimeout(() => {
              this.routerback();
            }, 1500);
          });
        } else {
          this.$message.error("请输入必填项");
        }
      });
    },
    //获取卡券统计
    getCouponStatisticalData(){
       this.request(this.api.market.coupon_statistical, { id: this.paramId })
       .then( data => {
          for (let i = 0; i < this.summaryData.length; i++) {
            for (let k in data) {
              if(this.summaryData[i].tag == k){
                this.summaryData[i].val=data[k];
              }
            }
          }
        });
    },
    /**
     * @description: 并发获取接口数据
     * @author: elephant
     * @param {type}
     * @return:
     * @Date: 2019-10-21 16:00:19
     */
    getPromiseCouponAll() {
      Promise.all([
        this.getPromiseCouponData(),
        this.getPromiseStoreData()
      ]).then(res => {
        //处理卡券返回的数据
        this.handlePromiseCouponData(res[0]);
        //处理门店返回的数据
        this.handlePromiseStoreData(res[1]);
      });
    },
    /**
     * @description: promise 获取回显数据
     * @author: elephant
     * @param id
     * @return: resolve(data)
     * @Date: 2019-10-21 15:54:56
     */
    getPromiseCouponData() {
      return new Promise((resolve, reject) => {
        this.request(this.api.market.coupon_get, { id: this.paramId }).then(
          data => {
            resolve(data);
          }
        );
      });
    },
    /**
     * @description: promise 获取适用门店数据
     * @author: elephant
     * @param {type}
     * @return:
     * @Date: 2019-10-21 15:57:11
     */
    getPromiseStoreData() {
      return new Promise((resolve, reject) => {
        this.request(this.api.retailStore.storeBasic_list4Feign, {
          valid: true
        }).then(data => {
          resolve(data);
        });
      });
    },
    /**
     * @description: 处理 promise 返回的卡券数据
     * @author: elephant
     * @param {data}
     * @return:
     * @Date: 2019-10-21 16:04:46
     */
    handlePromiseCouponData(res) {
      mirrorFiltersData = this.$common.deepCopy(res);
      this.filtersData = res;
      if (!!res.cover) {
        this.productImages = [{ url: res.cover }];
      }
      if (!!res.poster) {
        this.posterImages = [{ url: res.poster }];
      }
    },
    /**
     * @description: 处理 promise 返回的门店数据
     * @author: elephant
     * @param {data}
     * @return:
     * @Date: 2019-10-21 16:04:46
     */
    handlePromiseStoreData(res) {
      this.storeOptions = res.data;
      this.handleStoreGet(this.filtersData.storeId);
    },
    //卡券类型切换清空
    handleTypeChange(val) {
      this.filtersData.denomination = "";
      this.filtersData.giftDescription = "";
    },
    //使用条件切换清空
    handleConditionChange(val) {
      this.filtersData.minAmount = "";
    },
    //有效时间类型
    handleValidityTypeChange(val) {
      this.filtersData.usingStartTime = null;
      this.filtersData.usingEndTime = null;
      this.filtersData.validityPeriod = "";
    },
    //获取适用门店列表
    getStoreData() {
      this.request(this.api.retailStore.storeBasic_list4Feign, {
        valid: true
      }).then(res => {
        this.storeOptions = res.data;
      });
    },
    //增加可领数量
    addTotalLimit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.filtersData.totalLimit = Number(this.totalLimitForm.addTotalLimit) + Number(this.filtersData.totalLimit);
          this.$message({
            type: "success",
            message: "数量增加成功"
          });
          this.closeDialog();
        } else {
          this.$message.error("请输入增加数量");
        }
      });
    },
    //适用门店发生改变
    handleStoreGet(val) {
      if (!!val) {
        let _obj = this.storeOptions.find(item => item.id == val);
        this.filtersData.storeName = _obj.name;
        this.storeObj = _obj;
      }
    },
    //时间处理
    endTime(val) {
      if (val != null) {
        let date = new Date(val);
        let t = (date.getTime() / 1000 + 86399) * 1000;
        return new Date(t);
      }
    },
    //html
    handleHtml(content) {
      var reg = /[;；]/g;
      content = content.replace(reg, "$&\r\n");
      return content;
    },
    //后退
    routerback() {
      this.$router.go(-1);
    },
    //关闭
    closeDialog() {
      this.totalLimitForm.addTotalLimit = null;
      this.totalLimitVisible = false;
    }
  },
  
  computed: {
    //卡券字典项集合
    COUPON() {
      let COUPONOBJ = {};
      let codeSet = this.$store.getters.codeData;
      //卡券类型
      if (codeSet.COUPON001) COUPONOBJ.type = codeSet.COUPON001.codeItemList;
      //卡券发放类型
      if (codeSet.COUPON002) COUPONOBJ.issueType = codeSet.COUPON002.codeItemList;
      //卡券使用渠道
      if (codeSet.COUPON003) COUPONOBJ.channel = codeSet.COUPON003.codeItemList;
      //卡券使用范围
      if (codeSet.COUPON004) COUPONOBJ.range = codeSet.COUPON004.codeItemList;
      //卡券使用条件
      if (codeSet.COUPON005) COUPONOBJ.usingCondition = codeSet.COUPON005.codeItemList;
      //卡券有效类型
      if (codeSet.COUPON006) COUPONOBJ.validityType = codeSet.COUPON006.codeItemList;
      return COUPONOBJ;
    },
    //卡券展示名称
    couponViewName() {
      let type = this.filtersData.type;
      switch (type) {
        //元
        case "REDUCE":
          return `${this.filtersData.denomination}元`;
          break;
        //折
        case "DISCOUNTS":
          return `${this.filtersData.denomination}折`;
          break;
        //实物
        case "GIFT":
          return `${this.filtersData.giftDescription}`;
          break;
      }
    },
    //卡券展示条件
    couponConditionView() {
      let usingCondition = this.filtersData.usingCondition;
      switch (usingCondition) {
        //无门槛
        case "UNCONDITIONAL":
          return `无门槛`;
          break;
        //满金额
        case "AMOUNT":
          return `满${this.filtersData.minAmount}元可用`;
          break;
        //满几件
        case "SUBSTANCE":
          return `满${this.filtersData.minAmount}件可用`;
          break;
      }
    },
    //规则说明
    topDesc() {
      if (this.filtersData.validityType == "COLLECTION") {
        this.couponTimeView = `领取后${this.filtersData.validityPeriod}天可用；`;
        return `1：卡券有效期为领取后${this.filtersData.validityPeriod}天内；`;
      } else if (this.filtersData.validityType == "PERIOD") {
        let startTime = timesTampConvertsDate(this.filtersData.usingStartTime) || '--';
        let startViewTime = timesTampConvertsDate(this.filtersData.usingStartTime,true) || '--';
        let endTime = timesTampConvertsDate(this.filtersData.usingEndTime) || '--';
        let endViewTime = timesTampConvertsDate(this.filtersData.usingEndTime,true) || '--';
        this.couponTimeView = `${startViewTime}-${endViewTime}`;
        return `1：卡券有效期为${startTime}至${endTime}；`;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.coupon-textarea {
  width: 300px;
}
.coupon-box {
  display: flex;
  justify-content: space-between;
}
.coupon-form {
  flex: 1;
}
.coupon-form /deep/ .mb-0 {
  margin-bottom: 0;
}
.coupon-preview {
  min-width: 375px;
  margin: 20px 0;
  width: 375px;
  height: 700px;
  background: #f5f5f5;
  margin-right: 10%;
  box-shadow: #aaa 2px 10px 10px;
  overflow-y: auto;
}
.time-wrap {
  width: 556px;
}
.summary-wrap {
  width: 600px;
  display: flex;
  flex-wrap: wrap;
  > dl {
    width: 25%;
    text-align: center;
    > dt {
      background-color: #f5f5f5;
    }
    dt,
    dd {
      border: 1px solid #eeeeee;
      height: 40px;
      line-height: 40px;
      border-bottom: 0;
      border-right: 0;
    }
    dt,
    dd:last-child {
      border-right: 1px solid #eeeeee;
    }
  }
  > dl:nth-child(1n + 5) > dd {
    border-bottom: 1px solid #eeeeee;
  }
}
// 右侧视图
.preview-banner {
  width: 375px;
  height: auto;
  > img {
    width: 375px;
    height: 100%;
  }
}
.preview-cont {
  width: 375px;
  background-color: #d02c2c;
  padding: 20px 12px;
}
.cont-top {
  width: 100%;
  height: 60px;
  border: 1px solid #da4b4b;
  background-color: #b52323;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  position: relative;
  > li:nth-child(1) {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
    }
  }
  > li:nth-child(2) {
    margin-left: 12px;
    width: 250px;
    > p {
      font-size: 12px;
      color: #ffffff;
    }
    > p:nth-child(2) {
      font-size: 12px;
      color: #ef8585;
    }
  }
  > li:nth-child(3) {
    width: 10px;
    height: 15px;
    position: absolute;
    top: 22px;
    right: 16px;
    > img {
      width: 100%;
      height: 100%;
    }
  }
}
.cont-center {
  margin-top: 12px;
  width: 100%;
  height: 154px;
  border: 1px solid #da4b4b;
  background-color: #b52323;
  border-radius: 6px;
  padding: 20px;
  position: relative;
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  position: relative;
}
.title::before,
.title::after {
  content: "";
  display: block;
  width: 80px;
  height: 1px;
  /* border-bottom: 1px dotted #eee; */
  /* border: 1px dashed #eee; */
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYIAAAACCAYAAABVPdvlAAAAR0lEQVRIS2M8ffr0fwYkYGpqyojMR2ePqh8NH+Q0MZoeRtPDaHpAhMBQLT8ZRzPyaEYezchDPyPDfDBUC6JR92NvftOrfAYAhOwG0kBjIZQAAAAASUVORK5CYII=)
    no-repeat left center;
  background-size: 100% 100%;
  position: absolute;
  top: 12px;
  overflow: hidden;
}
.title::before {
  left: 25px;
}
.title::after {
  right: 25px;
}
.coupon-wrap {
  width: 100%;
  height: 78px;
  margin-top: 12px;
  position: relative;
  padding: 15px 16px 0 25px;
  .center-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .center-circle {
    position: absolute;
    right: 60px;
    top: 0;
    width: 56px;
    height: 78px;
  }
  .center-txt {
    position: absolute;
    left: 25px;
    top: 10px;
    > li:nth-child(1) {
      color: #ffc590;
      font-size: 16px;
    }
    > li:nth-child(2) {
      color: #650909;
      font-size: 12px;
    }
    > li:nth-child(3) {
      color: #650909;
      font-size: 10px;
    }
  }
  .center-nav {
    border-radius: 3px;
    background-color: #ffb36e;
    text-align: center;
    font-size: 14px;
    color: #d33f3f;
    font-weight: bold;
    line-height: 32px;
    width: 74px;
    height: 32px;
    position: absolute;
    top: 23px;
    right: 16px;
  }
}
.cont-bottom {
  margin-top: 12px;
  width: 100%;
  border: 1px solid #da4b4b;
  background-color: #b52323;
  border-radius: 6px;
  padding: 20px;
  position: relative;
  .bottom-txt {
    margin-top: 20px;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>