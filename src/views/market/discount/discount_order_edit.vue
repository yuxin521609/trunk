<template>
   <div>
      <el-dialog title="选择商品" :visible.sync="dialogTableVisible">
        <div class="box">
          <el-form
            class="item-form"
            size="small"
            :inline="true"
            :model="goodsFiltersData">
            <!-- 模糊查询 -->
            <el-form-item prop="cateIdentifier" clearable label="品类：">
              <el-cascader
                class="input-w"
                :options="classData"
                v-model="cateArr"
                :value="cateArr"
                @change="cascaderGet"
                :show-all-levels="false"
                :props="props"
                change-on-select
              ></el-cascader>
            </el-form-item>
            <el-form-item label="品牌：">
              <el-select class="input-w" filterable clearable placeholder="请选择" v-model="goodsFiltersData.brandId">
                <el-option
                  v-for="item in brandOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="售价：">
              <el-input placeholder="请输入售价最小值" clearable  v-model.number="goodsFiltersData.retailPriceGE" class="el-input-width155"></el-input>
              <el-input placeholder="请输入售价最大值" clearable  v-model.number="goodsFiltersData.retailPriceLE" class="el-input-width155 ml-10"></el-input>
            </el-form-item>
            <el-form-item label="季节：">
              <el-select v-model="goodsFiltersData.seasonalStyleCode" clearable placeholder="请选择">
                <el-option v-for="(item, index) in codeItem_list_get.data" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <br/>
            <el-form-item label="店内库存：">
              <el-input placeholder="请输入库存最小值" clearable  v-model="goodsFiltersData.quantityLowerLimit" class="el-input-width155"></el-input>
              <el-input placeholder="请输入库存最大值" clearable  v-model="goodsFiltersData.quantityUpperLimit" class="el-input-width155 ml-10"></el-input>
            </el-form-item>
            <el-form-item label="关键词：">
              <el-input placeholder="请输入关键词，如：货号、款号、商品名称" clearable  v-model="goodsFiltersData.searchWords" class="el-input-width355"></el-input>
            </el-form-item>
            <!-- 搜索，重置 -->
            <el-form-item>
              <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
              <el-button size="small" @click="handleResetFilters">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="box">
          <!-- 全部商品 -->
          <div class="item-table">
            <el-button size="small" type="primary" class="ml-20 mt-24" @click="marketingMiddleground_addPageSingleProduct">本页全部添加</el-button>
            <el-table
                class="mt-20"
              :data="goodsList.data"  
              stripe
              empty-text="暂无数据"
              header-align="center"
              header-row-class-name="item-table-header"
              :highlight-current-row="true">
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品款号" min-width="100">
                <template  slot-scope="scope">{{ scope.row.productCode|| '--' }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品货号" min-width="150">
                <template  slot-scope="scope">{{ scope.row.code || '--' }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="品牌" min-width="100">
                <template  slot-scope="scope">{{ scope.row.productBrandName || '--' }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="品类" min-width="100">
                <template  slot-scope="scope">{{ scope.row.fullCateName || '--' }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品名称" min-width="100">
                <template  slot-scope="scope">{{ scope.row.name || '--' }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品图片" min-width="100">
                <template  slot-scope="scope"><img class="discountImg" :src="scope.row.image" alt=""></template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="店内库存" min-width="100">
                <template  slot-scope="scope">{{ scope.row.stock === null ? '门店没有该商品' : scope.row.stock }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="售价" min-width="100">
                <template  slot-scope="scope">{{ scope.row.retailPrice || '--'  }}</template>
              </el-table-column>
              <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="当前折扣" min-width="100">
                <template  slot-scope="scope">{{ scope.row.discountStr || '--' }}</template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                  fixed="right"
                  label-class-name="text-center"
                  class-name="text-center"
                  align="center"
                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.currentDiscount === null" size="small" @click="marketingMiddleground_addStatelessSingleProduct(scope.row)">添加</el-button>
                    <el-button type="text" v-if="scope.row.currentDiscount === 0" size="small" @click="marketingMiddleground_addOtherInSingleProduct(scope.row)">切换到当前折扣</el-button>
                    <el-button type="text" v-if="scope.row.currentDiscount === 1" size="small" @click="marketingMiddleground_removeInSingleProduct(scope.row)">从列表内剔除</el-button>
                  </template>
              </el-table-column>
            </el-table>
            <div class="pagination mt-10 mb-20">
              <!-- 分页 -->
              <el-pagination
                  class="mr-20"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="goodsFiltersData.pageIndex"
                  :page-sizes="[10,20,30,40,50]"
                  :page-size="goodsFiltersData.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="goodsList.totalCount"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-form
        :model="discountData"
        label-width="150px"
        class="form-label"
        :rules="rules"
        ref="formName">
        <!-- 1.折扣类型选择 -->
        <div class="box">
          <el-form-item label="适用门店：" prop="storeId">
            <el-select 
              clearable 
              filterable 
              v-model="discountData.storeId" 
              @focus="visibleChange"
              :disabled="isEdit ? isEdit : false" 
              @change="changeStore" 
              class="el-input-short">
              <el-option v-for="(item, index) in storeList.data" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="折扣方案类型：" prop="type">
            <el-select v-model="discountData.type" :disabled="isEdit ? isEdit : false" class="el-input-short">
              <el-option v-for="(item, index) in discountType" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 2.折扣内容配置 -->
        <template>
          <!-- （预约）折扣 -->
          <div class="box" v-if="discountData.type === 0">
            <el-form-item label="预约折扣类型：" prop="appointmentDiscountType">
              <el-select 
                v-model="discountData.appointmentDiscountType" 
                class="el-input-short" 
                @change="discountData.appointmentDiscountEd = null"
                placeholder="请选择预约折扣类型">
                <el-option v-for="(item, index) in appointmentDiscountType" :key="index" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="减免金额：" v-show="discountData.appointmentDiscountType !== null && discountData.appointmentDiscountType === 0" prop="appointmentDiscountEd">
              <el-input v-enter-number v-model="discountData.appointmentDiscountEd"  placeholder="请输入金额，如50" class="el-input-width155"></el-input>&nbsp;元
            </el-form-item>
            <el-form-item label="折扣额度：" v-show="discountData.appointmentDiscountType !== null && discountData.appointmentDiscountType === 1" prop="appointmentDiscountEd">
              <el-input  v-model="discountData.appointmentDiscountEd" v-discount  placeholder="请输入折扣，如3.5" class="el-input-width155"></el-input>&nbsp;折
            </el-form-item>
            <el-form-item label="" prop="" class="mt-74">
              <el-button type="primary" @click="saveDiscount">保存</el-button>
              <el-button @click="href('market/discount/discount_manage_list')">取消</el-button>
            </el-form-item>
          </div>
          <!-- （阶梯）折扣 -->
          <div class="box" v-if="discountData.type === 1">
            <el-form-item label="阶梯折扣类型：" prop="ladderDiscountType">
              <el-select @change="changeLadderDiscountType" v-model="discountData.ladderDiscountType" class="el-input-short" placeholder="请选择阶梯折扣类型">
                <el-option v-for="(item, index) in ladderDiscountType" :key="index" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <!-- 设置阶梯 -->
            <el-form-item label="设置阶梯：" prop="ladderDiscountList">
              <div class="addRadder">
                <div 
                  v-for="(item, index) in discountData.ladderDiscountList"
                  :key="index"
                  >
                  <!-- 满数量打折 -->
                  <div v-show="discountData.ladderDiscountType  === 0">满
                    <el-input class="el-input-mini mlr10px mb-10" v-enter-number v-model="item.quantity"></el-input>件，打
                    <el-input v-discount class="el-input-mini mlr10px" v-model="item.value"></el-input>折
                    <i class="el-icon-remove  mlr10px" @click="deleteLadderItem(index)"></i></div>
                  <!-- 满金额打折 -->
                  <div v-show="discountData.ladderDiscountType  === 1">满
                    <el-input class="el-input-mini mlr10px mb-10" v-enter-number v-model="item.quantity"></el-input>元，打
                    <el-input v-discount class="el-input-mini mlr10px" v-model="item.value"></el-input>折
                    <i class="el-icon-remove  mlr10px" @click="deleteLadderItem(index)"></i></div>
                  <!-- 满数量减免指定金额 -->
                  <div v-show="discountData.ladderDiscountType  === 2">满
                    <el-input class="el-input-mini mlr10px mb-10" v-enter-number v-model="item.quantity"></el-input>件，减
                    <el-input class="el-input-mini mlr10px" v-enter-number v-model="item.value"></el-input>元
                    <i class="el-icon-remove  mlr10px" @click="deleteLadderItem(index)"></i></div> 
                  <!-- 满金额减免指定金额 -->
                  <div v-show="discountData.ladderDiscountType  === 3">满
                    <el-input class="el-input-mini mlr10px mb-10" v-enter-number v-model="item.quantity"></el-input>元，减
                    <el-input class="el-input-mini mlr10px" v-enter-number v-model="item.value"></el-input>元
                    <i class="el-icon-remove  mlr10px" @click="deleteLadderItem(index)"></i></div>
                </div>
                <el-button @click="createLadder">新增阶梯</el-button>
              </div>
            </el-form-item>
            <el-form-item label="" prop="" class="mt-74">
              <el-button type="primary" @click="saveDiscount">保存</el-button>
              <el-button @click="href('market/discount/discount_manage_list')">取消</el-button>
            </el-form-item>
          </div>
          <!-- 单品折扣 -->
          <div v-if="discountData.type === 2">
            <div class="box">
              <el-form-item label="单品折扣类型：" prop="itemDiscountType">
                <el-select 
                  v-model="discountData.itemDiscountType" 
                  class="el-input-short" 
                  @change="discountData.itemDiscountEd = null"
                  placeholder="请选择单品折扣类型">
                  <el-option v-for="(item, index) in itemDiscountType" :key="index" :label="item" :value="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="折扣额度：" v-show="discountData.itemDiscountType !== null && discountData.itemDiscountType ===1"  prop="itemDiscountEd">
                <el-input placeholder="请输入折扣，如3.5" v-discount v-model="discountData.itemDiscountEd" class="el-input-width155"></el-input>&nbsp;折
              </el-form-item>
              <el-form-item label="定价：" v-show="discountData.itemDiscountType !== null && discountData.itemDiscountType === 0"  prop="itemDiscountEd">
                <el-input placeholder="请输入定价，如：299" v-enter-number v-model="discountData.itemDiscountEd" class="el-input-width155"></el-input>&nbsp;元
              </el-form-item> 
              <el-form-item label="" prop="" class="mt-74">
                <el-button type="primary" @click="saveDiscount">{{ isGoods ? '刷新折扣' :  '下一步，选商品' }}</el-button>
                <el-button @click="href('market/discount/discount_manage_list')">取消</el-button>
              </el-form-item>
            </div>
            <div class="box" v-if="isGoods">
              <el-form
                class="item-form"
                size="small"
                :inline="true"
                :model="goodsFiltersDataCheck">
                <!-- 模糊查询 -->
                <el-form-item prop="cateIdentifier" clearable label="品类：">
                  <el-cascader
                    class="input-w"
                    :options="classData"
                    v-model="cateArrs"
                    :value="cateArrs"
                    @change="cascaderGets"
                    :show-all-levels="false"
                    :props="props"
                    change-on-select
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="品牌：">
                  <el-select class="input-w" filterable clearable placeholder="请选择" v-model="goodsFiltersDataCheck.brandId">
                    <el-option
                      v-for="item in brandOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="售价：">
                  <el-input placeholder="请输入售价最小值" clearable  v-model="goodsFiltersDataCheck.retailPriceGE" class="el-input-width155"></el-input>
                  <el-input placeholder="请输入售价最大值" clearable  v-model="goodsFiltersDataCheck.retailPriceLE" class="el-input-width155 ml-10"></el-input>
                </el-form-item>
                <el-form-item label="季节：">
                  <el-select v-model="goodsFiltersDataCheck.seasonalStyleCode" clearable placeholder="请选择">
                    <el-option v-for="(item, index) in codeItem_list_get.data" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <br/>
                <el-form-item label="店内库存：">
                  <el-input placeholder="请输入库存最小值" clearable  v-model="goodsFiltersDataCheck.quantityLowerLimit" class="el-input-width155"></el-input>
                  <el-input placeholder="请输入库存最大值" clearable  v-model="goodsFiltersDataCheck.quantityUpperLimit" class="el-input-width155 ml-10"></el-input>
                </el-form-item>
                <el-form-item label="关键词：">
                  <el-input placeholder="请输入关键词，如：货号、款号、商品名称" clearable  v-model="goodsFiltersDataCheck.searchWords" class="el-input-width355"></el-input>
                </el-form-item>
                <!-- 搜索，重置 -->
                <el-form-item>
                  <el-button size="small" @click="handleSearchCheck" type="primary" plain>搜索</el-button>
                  <el-button size="small" @click="handleResetFiltersCheck">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="box" v-if="isGoods">
              <div class="item-table">
                <el-button size="small" type="primary" class="ml-20 mt-24" @click="dialogTableVisible = true">添加商品</el-button>
                <el-table
                    class="mt-20"
                  :data="goodsCheckList.data"
                  stripe
                  empty-text="暂无数据"
                  header-align="center"
                  header-row-class-name="item-table-header"
                  :highlight-current-row="true">
                  <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品款号" min-width="100">
                    <template  slot-scope="scope">{{ scope.row.productCode|| '--' }}</template>
                  </el-table-column>
                  <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品货号" min-width="100">
                    <template  slot-scope="scope">{{ scope.row.code || '--' }}</template>
                  </el-table-column>
                  <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="品牌" min-width="100">
                    <template  slot-scope="scope">{{ scope.row.productBrandName || '--' }}</template>
                  </el-table-column>
                  <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="品类" min-width="100">
                    <template  slot-scope="scope">{{ scope.row.fullCateName || '--' }}</template>
                  </el-table-column>
                  <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品名称" min-width="100">
                    <template  slot-scope="scope">{{ scope.row.name || '--' }}</template>
                  </el-table-column>
                  <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="商品图片" min-width="100">
                    <template  slot-scope="scope"><img class="discountImg" :src="scope.row.image" alt=""></template>
                  </el-table-column>
                  <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="店内库存" min-width="100">
                    <template  slot-scope="scope">{{ scope.row.stock === null ? '门店没有该商品' : scope.row.stock }}</template>
                  </el-table-column>
                  <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="售价" min-width="100">
                    <template  slot-scope="scope">{{ scope.row.retailPrice || '--'  }}</template>
                  </el-table-column>
                  <!-- 操作 -->
                  <el-table-column
                      fixed="right"
                      label-class-name="text-center"
                      class-name="text-center"
                      align="center"
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="marketingMiddleground_removeInSingleProduct(scope.row)">剔除</el-button>
                      </template>
                  </el-table-column>
                </el-table>
                <div class="pagination mt-10 mb-20">
                  <!-- 分页 -->
                  <el-pagination
                      class="mr-20"
                      @size-change="handleSizeChangeCheck"
                      @current-change="handleCurrentChangeCheck"
                      :current-page="goodsFiltersDataCheck.pageIndex"
                      :page-sizes="[10,20,30,40,50]"
                      :page-size="goodsFiltersDataCheck.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="goodsCheckList.totalCount"
                  ></el-pagination>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-form>
   </div>
</template>

<script>

export default {
  data() {
    return {
      // 季节列表
      codeItem_list_get:[],
      // 快速创建保留门店id
      fastCreateStoreId:null,
      // 快速创建剔除已有门店
      fastCreateTF:true,
      // 是否编辑
      isEdit:this.$route.query.isEdit,
      // 是否快速创建
      isFastCreate:this.$route.query.isFastCreate,
      // 单品商品信息是否存在
      isGoods:false,
      // 折扣id
      discountId:this.$route.query.discountId,
      // 弹框
      dialogTableVisible:false,
      // 全部商品
      goodsList:{},
      // 已添加
      goodsCheckList:{},
      // 新建折扣方案提交对象
      discountData:{
        // 折扣方案类型
        type:null, 
        // 门店名称
        storeName:null, 
        // 门店 id
        storeId:null, 
        // 门店 id （备份），检验已有折扣时使用；
        _storeId:null, 
        // 预约折扣类型
        appointmentDiscountType:null,
        // 预约折扣额度或折扣
        appointmentDiscountEd:null,
        // 阶梯折扣类型
        ladderDiscountType:null, 
        // 阶梯折扣方式
        ladderDiscountList:[],
        // 单品折扣类型 
        itemDiscountType:null, 
        // 单品折扣额度或折扣
        itemDiscountEd:null 
      },
      // 折扣校验
      rules:{
        // 门店校验
        storeId: [{ required: true, validator: async (rule, value, callback) => {
          var discountData = this.discountData;
          if(!value) {
            callback(new Error('请选择门店！'))
          };
          // 如果查询的门店id与当前选择的门店id一致，则折扣不再做检验；
          if(discountData.storeId == discountData._storeId) {
            var request = false;
          }else{
            var request = await this.request(
              this.api.market.marketingMiddleground_confirmDiscountByStoreId,
              {
                "storeId": discountData.storeId,
                "type": discountData.type,
                discount:discountData.type == 2 ? discountData.itemDiscountEd : 0,
                discountType:discountData.type == 2 ? discountData.itemDiscountType : 0
              }
            );
          }
          if(request.confirm) {
            callback(new Error('已有折扣方案！'))
          }else{
            callback();
          };
        }, trigger: 'blur' }],
        // 折扣类型校验
        type: [{ required: true, message: '请选择折扣方案类型！', trigger: 'blur' }],
        // 预约折扣类型校验
        appointmentDiscountType: [{ required: true, message: '请选择预约折扣类型！', trigger: 'blur' }],
        // 预约折扣或金额校验，首先不能为空，其次需要符合折扣金额的格式，如 3.2折；
        appointmentDiscountEd: [{ required: true, validator: (rule, value, callback) => {
          const appointmentDiscountType = this.discountData.appointmentDiscountType;
          let re = /^\d(\.\d?)?$/g;
          let res = /^\d+?$/g;
          if(!value) {
            var name = appointmentDiscountType ? '请输入折扣额度!' : '请输入减免金额!';
            callback(new Error(name));
          }
          // 预约折扣类型为1，折扣额度数值检测
          if(appointmentDiscountType) {
            if(!re.test(value)) {
              callback(new Error('请输入正确的折扣额度！'));
            }else{
              callback();
            }
          // 预约折扣类型为0，减免金额数值检测
          }else{
            if(!res.test(value)) {
              callback(new Error('请输入正确的减免金额！'));
            }else{
              callback();
            }
          }
        }, trigger: 'blur' }],
        // 阶梯折扣类型校验
        ladderDiscountType: [{ required: true, message: '请选择阶梯折扣类型！', trigger: 'blur' }],
        // 阶梯折扣或金额校验
        ladderDiscountList: [{ required: true, validator: (rule, arr, callback) => {
          const discountType = this.discountData.ladderDiscountType;
          let re = /^\d(\.\d?)?$/g;
          let res = /^\d+?$/g;
          if(!arr.length) {
            callback(new Error('至少添加一条折扣方案！'));
          };
          var list = [];
          // 将所有阶梯类型填写项添加到一个集合中，统一做判断
          arr.forEach((item, index) => {
            list.push(item.quantity);
            list.push(item.value);
          })
          const someItem = list.every((item, index) => {
            return item;
          });
          if(!someItem) {
            callback(new Error('阶梯填写项不能为空！'));
          }else{
            // 判断满减打折，或满件打折，因为是两种规则，所有分别判断
            if(discountType < 2) {
              var quantityList = [];
              var valueList = [];
              // 将所有阶梯类型填写项添加到一个集合中，统一做判断
              arr.forEach((item, index) => {
                quantityList.push(item.quantity);
                valueList.push(item.value);
              })
              var a = quantityList.every((item, index) => {
                console.log(/^\d+?$/g.test(item))
                return /^\d+?$/g.test(item);
              })
              if(!a) {
                callback(new Error('请输入正确的折扣额度！'));
              }
              var b = valueList.every((item, index) => {
                console.log(/^\d(\.\d?)?$/g.test(item))
                return /^\d(\.\d?)?$/g.test(item);
              })
              if(!b) {
                callback(new Error('请输入正确的折扣额度！'));
              }
            // 判断满数量减额，这里只有一种规则
            }else{
              let checkItem = list.every((item, index) => {
                return /^\d+?$/g.test(item);
              })
              if(!checkItem) {
                callback(new Error('请输入正确的减免金额！'));
              }
            }
          };
          if(arr.length > 1) {
            let deWeightItemArr = [];
            let deWeightItemValueArr = [];
            arr.forEach((item, index) => {
              deWeightItemArr.push(item.quantity);
              deWeightItemValueArr.push(item.value);
            });
            var nary = deWeightItemArr.sort();
            var narys = deWeightItemValueArr.sort();
            for(var i = 0; i < nary.length - 1; i++) {
              if(nary[i] == nary[i + 1]) {
                callback(new Error('同一门店、同一折扣类型，不能存在相同的折扣方案！'));
              };
            }
            for(var i = 0; i < narys.length - 1; i++) {
              if(narys[i] == narys[i + 1]) {
                callback(new Error('同一门店、同一折扣类型，不能存在相同的折扣方案！'));
              };
            }
          };
          if(discountType == 3) {
            var checkItemTF = arr.every((item, index) => {
              return parseInt(item.quantity) >= parseInt(item.value)
            });
            if(!checkItemTF) {
              callback(new Error('减免金额不能超过阶梯金额！'));
            }else{
              callback();
            }
          }else{
            callback();
          }
        }, trigger: 'blur' }],
        // 单品折扣类型校验
        itemDiscountType: [{ required: true, message: '请选择单品折扣类型！', trigger: 'blur' }],
        // 单品折扣或金额校验
        itemDiscountEd: [{ required: true, validator: (rule, value, callback) => {
          const itemDiscountType = this.discountData.itemDiscountType;
          let re = /^\d(\.\d?)?$/g;
          let res = /^\d+?$/g;
          if(!value) {
            var names = itemDiscountType ? '请输入折扣额度!' : '请输入减免金额!';
            callback(new Error(names));
          }
          // 预约折扣类型为1，折扣额度数值检测
          if(itemDiscountType) {
            if(!re.test(value)) {
              callback(new Error('请输入正确的折扣额度！'));
            }else{
              callback();
            }
          // 预约折扣类型为0，减免金额数值检测
          }else{
            if(!res.test(value)) {
              callback(new Error('请输入正确的减免金额！'));
            }else{
              callback();
            }
          }
        }, trigger: 'blur' }],
      },
      // 检索全部商品
      goodsFiltersData:{
        // 当前页码
        pageIndex: 1,
        // 每页数量
        pageSize: 10,
        // 门店id
        storeId:null,
        // 折扣类型
        type:null,
        // 折扣值
        discount:null,
        // 品类id
        cateIdentifier:null,
        // 品牌id
        brandId:null,
        // 售价最小值
        retailPriceGE:null, 
        // 售价最大值
        retailPriceLE:null, 
        // 库存最小值
        quantityLowerLimit:null, 
        // 库存最大值
        quantityUpperLimit:null, 
        // 季节
        seasonalStyleCode:null,
        // 关键词
        searchWords:null 
      },
      // 全部品牌
      brandOptions:[],
      // 检索已选商品
      goodsFiltersDataCheck:{
        // 当前页码
        pageIndex: 1,
        // 每页数量
        pageSize: 10,
        // 折扣id
        discountId:null,
        // 品类id
        cateId:null,
        // 品类id
        cateIdentifier:null,
        // 品牌id
        brandId:null,
        // 售价最小值
        retailPriceGE:null, 
        // 售价最大值
        retailPriceLE:null, 
        // 库存最小值
        quantityLowerLimit:null, 
        // 库存最大值
        quantityUpperLimit:null, 
        // 季节
        seasonalStyleCode:null,
        // 关键词 
        searchWords:null 
      },
      // 单品折扣列表
      itemDiscountData:{
        data:[]
      },
      // 门店列表
      storeList:{},
      // 折扣类型
      discountType:[
        '预约折扣',
        '阶梯折扣',
        '单品折扣'
      ],
      // 预约折扣类型
      appointmentDiscountType:[
        '预约减免指定金额',
        '预约折上折'
      ],
       // 预约折扣类型
      ladderDiscountType:[
        '满数量打折',
        '满金额打折',
        '满数量减免指定金额',
        '满金额减免指定金额'
      ],
      // 单品折扣类型
      itemDiscountType:[
        '定价促销',
        '单品折扣'
      ],
      classData: [],
      classList: [],
      cateArr: [],
      cateArrs: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      }
    };
  },
  created() {
    var that = this;
    this.getClassData(); // 获取商品
    this.codeItem_list(); // 获取季节列表
    this.getStoreList(); // 获取门店列表
    this.getBrandOptions(); // 获取品牌
    if(this.isEdit || this.isFastCreate) {
      this.discountData.type = this.$route.query.type;
      switch(this.$route.query.type) {
        case 0:
          this.marketingMiddleground_queryDiscountSetting();
          break;
        case 1:
          this.marketingMiddleground_queryDiscountParameter();
          break;
        case 2:
          this.marketingMiddleground_querySingleProductDiscount();
          break;
      }
    };
    document.onkeydown = function(e) {
         var key = window.event.keyCode;
         if (key == 13) {
            if(that.dialogTableVisible) {
              that.handleSearch();
            }else{
              that.handleSearchCheck();
            }
         }
      };
  },
  mounted() {},
  methods: {
    /**
     * （获取季节）
     */
    codeItem_list(item) {
      const that = this;

      this.request(
        this.api.market.codeItem_list,
        {
          codeSetId:'06b11574-ef82-4ae4-a8a9-a25f903083df'
        },
        true
      ).then(res => {
        that.codeItem_list_get = res;
      });
    },
    /**
     * 获取品牌
     */
    getBrandOptions() {
      this.request(
        this.api.product.productBrand_list,
        {},
        true
        ).then(data => {
          let _data = data.data;
          this.brandOptions = _data;
      });
    },
    /**
     * 获取分类
     */
    getClassData() {
      //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
      this.$common.getClassSelect(this, 1).then(res => {
        this.classData = res.ztree;
        this.classList = res.list;
      });
    },
    /**
     * 
     */
    cascaderGet(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.goodsFiltersData.cateIdentifier = obj.identifier;
    },
    /**
     * 
     */
    cascaderGets(e) {
      let cateId = JSON.parse(JSON.stringify(e)).pop();
      let obj = this.classList.find(item => item.id == cateId);
      this.goodsFiltersDataCheck.cateIdentifier = obj.identifier;
    },
    /**
     * 删除某个阶梯
     */
    deleteLadderItem(index) {
      this.discountData.ladderDiscountList.splice(index,1);
    },
    /**
     * （单品全部添加）
     */
    marketingMiddleground_addPageSingleProduct() {
      const that = this;
      const discountData = this.discountData;
      const data = {
        "discountId": this.discountId,
        "goodsCodeList": [],
        "storeId": discountData.storeId
      };
      this.goodsList.data.forEach((item, index) => {
        if(item.currentDiscount === null) {
          data.goodsCodeList.push(item.code)
        }
      });
      this.request(
        this.api.market.marketingMiddleground_addPageSingleProduct,
        data,
        true
      ).then(res => {
        this.warn('本页全部商品添加成功！');
        that.marketingMiddleground_listProduct();
        that.marketingMiddleground_listSingleProduct();
      });
    },
    /**
     * （单品添加）
     */
    marketingMiddleground_addStatelessSingleProduct(item) {
      const that = this;
      const discountData = this.discountData;

      this.request(
        this.api.market.marketingMiddleground_addStatelessSingleProduct,
        {
          discountId:this.discountId,
          goodsCode:item.code
        },
        true
      ).then(res => {
        this.warn('商品添加成功！');
        that.marketingMiddleground_listProduct();
        that.marketingMiddleground_listSingleProduct();
      });
    },
    /**
     * （单品从列表内剔除）
     */
    marketingMiddleground_removeInSingleProduct(item) {
      const that = this;
      const discountData = this.discountData;

      this.request(
        this.api.market.marketingMiddleground_removeInSingleProduct,
        {
          discountId:this.discountId,
          goodsCode:item.code
        },
        true
      ).then(res => {
        this.warn('剔除成功！');
        that.marketingMiddleground_listProduct();
        that.marketingMiddleground_listSingleProduct();
      });
    },
    /**
     * （单品切换到当前折扣）
     */
    marketingMiddleground_addOtherInSingleProduct(item) {
      const that = this;
      const discountData = this.discountData;

      this.request(
        this.api.market.marketingMiddleground_addOtherInSingleProduct,
        {
          sourceDiscountId:item.sourceDisocuntId,
          goodsCode:item.code,
          targetDiscountId:this.discountId
        },
        true
      ).then(res => {
        this.warn('已切换到当前折扣！');
        that.marketingMiddleground_listProduct();
        that.marketingMiddleground_listSingleProduct();
      });
    },
    /**
     * （已选商品）
     */
    marketingMiddleground_listSingleProduct() {
      const that = this;
      const discountData = this.discountData;
      
      Object.assign(this.goodsFiltersDataCheck, {
        storeId:discountData.storeId,
        discountId:this.discountId
      });
      this.request(
        this.api.market.marketingMiddleground_listSingleProduct,
        this.goodsFiltersDataCheck,
        true
      ).then(res => {
        that.goodsCheckList = res;
      });
    },
    /**
     * （全部商品）
     */
    marketingMiddleground_listProduct() {
      const that = this;
      const discountData = this.discountData;

      Object.assign(this.goodsFiltersData, {
        storeId:discountData.storeId,
        type:discountData.itemDiscountType,
        discount:discountData.itemDiscountEd
      }); 
      this.request(
        this.api.market.marketingMiddleground_listProduct,
        this.goodsFiltersData,
        true
      ).then(res => {
        that.goodsList = res;
      });
    },
    /**
     * （query）查询预约折扣方案
     */
    marketingMiddleground_queryDiscountSetting() {
      const that = this;
      const discountData = this.discountData;

      this.request(
        this.api.market.marketingMiddleground_queryDiscountSetting,
        {
          id:this.discountId
        },
        true
      ).then(res => {
        if(that.isFastCreate) {
          this.fastCreateStoreId = res.storeId;
          res.storeId = null;
          res.storeName = null;
        };
        
        Object.assign(that.discountData, {
          storeName:res.storeName, // 门店名称
          storeId:res.storeId, // 门店 id
          _storeId:res.storeId, // 门店 id （备份），检验已有折扣时使用；
          appointmentDiscountType:res.type,// 预约折扣类型
          appointmentDiscountEd:res.value,// 预约折扣额度
        })
      });
    },
    /**
     * （query）查询阶梯折扣方案
     */
    marketingMiddleground_queryDiscountParameter() {
      const that = this;
      const discountData = this.discountData;

      this.request(
        this.api.market.marketingMiddleground_queryDiscountParameter,
        {
          id:this.discountId
        },
        true
      ).then(res => {
        var ladderDiscountType = null;
        var otherDiscount = res.otherDiscount && res.otherDiscount[0];

        if(otherDiscount.discountType === 0 && otherDiscount.type === 0) {
          ladderDiscountType = 3;
        }else if(otherDiscount.discountType === 0 && otherDiscount.type === 1) {
          ladderDiscountType = 1;
        }else if(otherDiscount.discountType === 1 && otherDiscount.type === 0) {
          ladderDiscountType = 2;
        }else if(otherDiscount.discountType === 1 && otherDiscount.type === 1) {
          ladderDiscountType = 0;
        };

        if(that.isFastCreate) {
          this.fastCreateStoreId = res.storeId;
          res.storeId = null;
          res.storeName = null;
        };

        Object.assign(that.discountData, {
          storeName:res.storeName, // 门店名称
          storeId:res.storeId, // 门店 id
          _storeId:res.storeId, // 门店 id （备份），检验已有折扣时使用；
          ladderDiscountType, // 阶梯折扣类型
          ladderDiscountList:res.otherDiscount,// 预约折扣方式
        })
      });
    },
    /**
     * （query）查询单品折扣方案
     */
    marketingMiddleground_querySingleProductDiscount() {
      const that = this;
      const discountData = this.discountData;

      this.request(
        this.api.market.marketingMiddleground_querySingleProductDiscount,
        {
          id:this.discountId
        },
        true
      ).then(res => {
        if(that.isFastCreate) {
          this.fastCreateStoreId = res.storeId;
          res.storeId = null;
          res.storeName = null;
        };
        Object.assign(that.discountData, {
          storeName:res.storeName, // 门店名称
          storeId:res.storeId, // 门店 id
          _storeId:res.storeId, // 门店 id （备份），检验已有折扣时使用；
          itemDiscountType:res.type,// 预约折扣类型
          itemDiscountEd:res.discount,// 预约折扣额度
        });
        // 快速创建不展示商品
        if(that.isFastCreate) return;
        that.isGoods = true;
        that.marketingMiddleground_listSingleProduct(); // 查询已添加商品
        that.marketingMiddleground_listProduct(); // 查询全部商品
      });
    },
    /**
     * 新建或更新（预约）折扣方案
     */
    createAppointmentDiscount() {
      const that = this;
      const discountData = this.discountData;
      const url =  this.isEdit 
        ? this.api.market.marketingMiddleground_updateDiscountSetting // 更新预约折扣
        : this.api.market.marketingMiddleground_createDiscountSetting; // 新建预约折扣

      this.request(
        url,
        {
          "storeId": discountData.storeId, // 门店id
          "storeName": discountData.storeName, // 门店名称
          "type": discountData.appointmentDiscountType, // 0：满，1：打折。
          "value": discountData.appointmentDiscountEd, // value
          "id":this.discountId
        },
        true
      ).then(res => {
        if(this.discountId) {
          this.warn('更新成功！')
        }else{
          this.warn('创建成功！')
        };
        this.href('market/discount/discount_manage_list');
      });
    },
    /**
     * 新建或更新（阶梯）折扣方案
     */
    createLadderDiscount() {
      const that = this;
      const discountData = this.discountData;
      const url =  this.isEdit 
        ? this.api.market.marketingMiddleground_updateDiscountParameterS // 更新阶梯折扣
        : this.api.market.marketingMiddleground_createDiscountParameter;// 新建阶梯折扣
      const data =  {
        "storeDiscountParameterVOS": discountData.ladderDiscountList,
        "storeId": discountData.storeId,
        "storeName": discountData.storeName,
        "id":this.discountId
      };
      // 请求
      this.request(
        url,
        data,
        true
      ).then(res => {
        if(this.discountId) {
          this.warn('更新成功！')
        }else{
          this.warn('创建成功！')
        };
        this.href('market/discount/discount_manage_list');
      });
    },
    /**
     * 新建或更新（单品）折扣方案
     */
    createItemDiscount() {
      const that = this;
      const discountData = this.discountData;
      const url =  this.isEdit 
        ? this.api.market.marketingMiddleground_updateSingleProductDiscount // 更新单品折扣
        : this.api.market.marketingMiddleground_createSingleProductDiscount;// 新建单品折扣
      const data = {
        "createWayType": this.isFastCreate ? 1 : 0, // 区分营销中台-正常创建：0，还是快速创建：1
        "discount": discountData.itemDiscountEd, // 折扣 ?  
        "platformType": 1, // 平台类型（0：APP，1：中台）
        "storeId": discountData.storeId,
        "storeName": discountData.storeName,
        "type": discountData.itemDiscountType, // 减金额打折类型(0:满减，1:打折)
        "sourceId": this.discountId, // 营销中台-快速创建-源门店单品折扣ID ?
        "id":this.discountId
      };
      this.request(
        url,
        data,
        true
      ).then(res => {
        if(that.isEdit) {
          that.warn('更新成功！');
          that.marketingMiddleground_listProduct();
        }else{
          that.warn('创建成功！');
          this.discountId = res.id;
          that.isGoods = true;
          that.isEdit = true;
          that.marketingMiddleground_listProduct();
          that.marketingMiddleground_listSingleProduct();
        };
      });
    },
    /**
     * 改变阶梯方案
     */
    changeLadderDiscountType() {
      this.discountData.ladderDiscountList = [];
    },
    /**
     * 新增阶梯方案
     */
    createLadder() {
      let discountData = this.discountData;
      let ladderDiscountType = discountData.ladderDiscountType;
      // 设置完阶梯折扣方案，才能添加阶梯
      if(ladderDiscountType === null) {
        this.warn('请先选择阶梯折扣类型！','warning');
        return;
      };
      // 添加
      discountData.ladderDiscountList.push({
        "discountType": ladderDiscountType == 0 ||  ladderDiscountType == 2 ? 1 : 0, // 折扣类型（0，满金额减免，1，满数量减免）
        "quantity": null,
        "type":  ladderDiscountType == 0 || ladderDiscountType == 1 ? 1 : 0, // 判断满减还是打折类型（0:满减，1:打折）
        "value": null,
        "id":this.discountId &&  this.discountId 
      });
    },
    /**
     * 选择适用门店时
     */
    changeStore(id) {
      var item = this.storeList.data.find((v, i) => {
          return id == v.id;
      })
      this.discountData.storeName = item.name;
    
      console.log(item.name)
    },
    /**
     * 门店下拉框下拉或隐藏时
     */
    visibleChange() {
      if(this.fastCreateTF) {
        if(this.isFastCreate) {
          var index = this.storeList.data.findIndex((v, i) => {
            return this.fastCreateStoreId == v.id;
          })
          this.storeList.data.splice(index, 1);
          this.fastCreateTF = false;
        }
      }
    },
    /**
     * 新建或更新折扣方案
     */
    saveDiscount() {
      const that = this;
      const discountData = this.discountData;
      this.$refs.formName.validate((v) => {
        if (v) {
          // 把对象中所有的不规范折扣数值清除，如：3. 3.22，=> 处理成3 3.2；
          // /(\d\.\D)|(\d\.\d{2})/g 
          this.discountData = JSON.parse(JSON.stringify(discountData).replace(/(\d\.\D)|(\d\.\d{2})/g,(value) => {
            value = value.replace(/(\.\D)/,'"');
            value = value.replace(/(\d$)/,'');
            return value;
          }));
          console.log(this.discountData);
          // return;
          switch(discountData.type) {
            // 新建或更新预约折扣
            case 0:
              this.createAppointmentDiscount();
              break;
            // 新建或更新阶梯折扣
            case 1:
              this.createLadderDiscount();
              break;
            // 新建或更新单品折扣
            case 2:
              this.createItemDiscount();
              break;
          }
        } else {
          let type = this.discountData.type;
          let discountName = '';
          switch(type) {
            case 0:
              discountName = '预约折扣';
              break;
            case 1:
              discountName = '阶梯折扣';
              break;
            case 2:
              discountName = '单品折扣';
              break;
          };
          // this.warn(`新建${discountName}信息未填写完整，请填写完整后重试！`,'warning');
          return;
        }
      }); 
    },
    /**
     * 查询门店列表
     */
    getStoreList() {
        const that = this;

        this.request(
        that.api.store.storeBasic_list,
        {
          pricingPower:0
        },
        true
        ).then(res => {
          that.storeList = res;
        });
    },
    /**
     * 提示
     * @param { String } message 提示文案
     * @param { String } type 提示类型
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || 'success'
      });
    },
    /**
     * 跳转
     * @param { String } routeName 路由跳转名字
     */
    href(routeName) {
      this.$router.push({
        path: `/${routeName}`
      });
    },
   /**
     * 模糊搜索
     */
    handleSearch() {
        this.goodsFiltersData.pageIndex = 1;
        this.goodsFiltersData.searchWords = this.goodsFiltersData.searchWords && this.goodsFiltersData.searchWords.replace(/(^\s)|(\s$)/g, '');
        this.marketingMiddleground_listProduct();
    },
     /**
     * 模糊搜索
     */
    handleSearchCheck() {
        this.goodsFiltersDataCheck.pageIndex = 1;
        this.goodsFiltersDataCheck.searchWords = this.goodsFiltersDataCheck.searchWords && this.goodsFiltersDataCheck.searchWords.replace(/(^\s)|(\s$)/g, '');
        this.marketingMiddleground_listSingleProduct();
    },
    /**
     * 搜索重置
     */
    handleResetFilters() {
      Object.assign(this.goodsFiltersData,{
        pageIndex: 1,// 当前页码
        pageSize: 10,// 每页数量
        storeId:null,
        type:null,
        discount:null,
        cateIdentifier:null,// 品类id
        brandId:null,// 品牌id
        retailPriceGE:null, // 售价最小值
         retailPriceLE:null, // 售价最大值
        quantityLowerLimit:null, // 库存最小值
        quantityUpperLimit:null, // 库存最大值
        seasonalStyleCode:null, // 季节
        searchWords:null // 关键词
      });
      this.cateArr = [];
    },
    /**
     * 点击页数
     * @param { Number } pageIndex 当前页
     */
    handleCurrentChange(pageIndex){
        this.goodsFiltersData.pageIndex = pageIndex;
        if(!this.discountData.itemDiscountEd) {
          this.warn('请填写折扣额度或金额！','warning');
          return;
        };
        this.marketingMiddleground_listProduct();
    },
    /**
     *  选择每页多少条数
     *  @param { Number } pageSize 每页条数
     */
    handleSizeChange(pageSize){
        this.goodsFiltersData.pageSize = pageSize;  
        if(!this.discountData.itemDiscountEd) {
          this.warn('请填写折扣额度或金额！','warning');
          return;
        };
        this.marketingMiddleground_listProduct();
    },
    /**
     * 搜索重置
     */
    handleResetFiltersCheck() {
        Object.assign(this.goodsFiltersDataCheck,{
        // 当前页码
        pageIndex: 1,
        // 每页数量
        pageSize: 10,
        // 折扣id
        discountId:null,
        // 品类id
        cateId:null,
        // 品类id
        cateIdentifier:null,
        // 品牌id
        brandId:null,
        // 售价最小值
        retailPriceGE:null, 
        // 售价最大值
        retailPriceLE:null, 
        // 库存最小值
        quantityLowerLimit:null, 
        // 库存最大值
        quantityUpperLimit:null, 
        // 季节
        seasonalStyleCode:null,
        // 关键词 
        searchWords:null 
      });
        this.cateArrs = [];
    },
    /**
     * 点击页数
     * @param { Number } pageIndex 当前页
     */
    handleCurrentChangeCheck(pageIndex){
      this.goodsFiltersDataCheck.pageIndex = pageIndex;
      this.marketingMiddleground_listSingleProduct();
    },
    /**
     *  选择每页多少条数
     *  @param { Number } pageSize 每页条数
     */
    handleSizeChangeCheck(pageSize){
      this.goodsFiltersDataCheck.pageSize = pageSize;  
      this.marketingMiddleground_listSingleProduct();
    },
  },
  components: {}
};
</script>
<style  lang="less" scoped>
  .box{
    padding: 20px 20px 20px 20px;
    margin: 8px 8px 0 8px;
    background: #fff;
  }
  .el-input-short{
    width: 300px;
  }
  .el-input-mini{
    width: 90px;
  }
  .mlr10px{
    margin: 0 10px;
  }
  .addRadder{
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    width: 400px;
    padding: 15px;
  }
  .mb-10{
    margin-bottom: 10px;
  }
  .mb-100{
    margin-bottom: 100px;
  }
  .ml-10{
    margin-left: 10px;
  }
  .mt-74{
    margin-top: 74px;
  }
  .el-input-width155{
    width:300px;
  }
  .el-input-width355{
    width: 355px;
  }
  .el-input__inners{
    width: 300px;
  }
  .el-dialog__wrapper /deep/ .el-dialog{
    width: 80%;
  }
  .discountImg{
    width: 40px;
    height: 40px;
  }
</style>


