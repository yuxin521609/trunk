<style lang="less" scoped></style>
<template>
  <el-select :class="[widthClass]" v-model="organizationId" placeholder="请选择" filterable clearable ref="organization" @change="organizationChange" :disabled="isDirectly">
    <el-option v-for="item in organizationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'organization-select',
    props: {
      // 是否直属
      isDirectly: {
        default: false
      },
      value: {

      },
      // 输入框宽度
      widthClass: {
        default: ''
      },
      // 回调
      callBack: {
        type: Function
      },
      // 父级的全部参数
      formData: {
        default: null
      }
    },
    // 数据
    data() {
      return {
        organizationId: '',
        organizationList: []
      }
    },
    // 组件
    components: {},
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.organizationId = this.value;
        this.init();
      })
    },
    // 方法
    methods: {
      init(){
        this.getOrganizationIdByUserId();
      },
      // 获取用户机构id
      async getOrganizationIdByUserId(){
        let info = await this.request(this.api.user.get_userinfo, {}, true);
        if(this.formData){
          this.formData.allotMan = info.name;
          this.formData.createName = info.name;
          this.formData.relationDepId = info.departId;
          this.formData.relationDepName = info.departName;
        }
        let url = this.api.user.userCompany_getUserAllOrgByUserId;
        if(this.isDirectly){
          url = this.api.user.userCompany_getUserOrgByUserId;
        }
        this.request(url, {userId: info.userId}).then(data => {
          if(this.isDirectly){
            this.organizationList = [data];
            this.organizationId = this.organizationList[0].id;
            this.$emit('input', this.organizationId);
            if(this.callBack){
              this.callBack(this.organizationId, true);
            }
          }else {
            this.organizationList = data;
          }

        });
      },
      organizationChange(val){
        this.$emit('input', val);
        if(this.callBack){
          this.callBack(val)
        }
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
      value(val) {
        this.organizationId = val;
      }
    }
  }
</script>
