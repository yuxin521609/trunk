<!--
 * @Description:频道管理 
 * @Author: elephant
 * @Date: 2019-08-13 18:05:00
 * @LastEditTime: 2020-03-02 11:22:10
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <!-- <div class="item-margin">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="90px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-form-item prop="valid" label="使用状态">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.valid">
            <el-option
              v-for="item in this.$common.getValidOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchWords" label="综合搜索：">
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.searchWords"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
          <el-button size="small" @click="handleResetFilters('filtersForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>-->
    <!--table  -->
    <div class="item-margin">
      <div class="item-cont">
        <el-button-group>
          <el-button size="small" type="primary" @click="openAddDetails">新增频道</el-button>
        </el-button-group>
      </div>
      <div class="item-table">
        <el-table
          :data="tableListData"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
        >
          <el-table-column prop="name" align="center" label="频道名称"  min-width="100"></el-table-column>
          <el-table-column prop="videoCount" align="center" label="视频数量" width="100"></el-table-column>
          <el-table-column prop="_tagNames" align="center" label="关联标签"  min-width="100"></el-table-column>
          <el-table-column prop="creatorName" align="center" label="创建人" width="100">
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间" min-width="100">
               <template slot-scope="scope">
              <p>{{scope.row.createTime | timestampToTime}}</p>
           </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                @click="openShowDetails(scope.row.id)"
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                @click="openEditDetails(scope.row.id)"
                type="text"
                size="small"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10,20,30,40,50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!--table END  -->
  </div>
</template>
<script>
export default {
  name:'channel_list',
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10, //每页数量
        valid: true, //有效状态
        subset:true
      },
      tableListData: [],
      total: null //总条目数
    };
  },
  created() {
    this.getTableList();
  },
  activated () {
    this.getTableList();
  },
  methods: {
       //获取列表
    getTableList() {
        this.request(this.api.product.videoChannel_list, this.filtersData).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            let channelTags=_data[i].videoChannelTags || [];
            let tagNameArr=[];
            for (let k = 0; k < channelTags.length; k++) {
              tagNameArr.push(channelTags[k].tagName);
            }
            _data[i]._tagNames=tagNameArr.join(',');
          }
        this.tableListData = _data;
        this.total = data.totalCount;
      });
    },
     //新增频道  跳转页面
    openAddDetails() {
      this.$router.push({
        path: "/product/video/add_channel",
        query: {
          type: "add"
        }
      });
    },
    //查看频道
    openShowDetails(params) {
      this.$router.push({
        path: "/product/video/show_channel",
        query: {
          id: params,
          type: "show"
        }
      });
    },
    //修改频道
    openEditDetails(params) {
      this.$router.push({
        path: "/product/video/edit_channel",
        query: {
          id: params,
          type: "edit"
        }
      });
    },
     //搜索
    handleSearch() {
         this.filtersData.pageIndex = 1;
      this.getTableList();
    },
    //清空重置
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
    },
    //当前页数修改时发生改变
    handleCurrentChange(val) {
      this.filtersData.pageIndex = val;
      this.getTableList();
    },
    // 每页显示多少条时发生改变
    handleSizeChange(val) {
      this.filtersData.pageSize = val;
      this.getTableList();
    }

  }
};
</script>
<style lang="less" scoped>
</style>
