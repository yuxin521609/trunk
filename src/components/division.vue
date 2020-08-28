<template>
    <div class="cont-inline">
        <el-select :class="[widthClass]" v-model="viewModel.provinceCode" :disabled="isDisabled" @change='provinceChangeEvent' clearable placeholder="省/直辖市" v-if="level >= 1">
            <el-option v-for="(item,index) in proList" :key="index"
                       :label="item.name"
                       :value="item.code">
            </el-option>
        </el-select>
        <el-select :class="[widthClass]" v-model="viewModel.municipalityCode" :disabled="isDisabled" @change="cityChangeEvent" clearable placeholder="市" v-if="level >= 2" style="margin:0 5px;">
            <el-option v-for="(item,index) in muniList" :key="index"
                       :label="item.name"
                       :value="item.code">
            </el-option>
        </el-select>
        <el-select :class="[widthClass]" v-model="viewModel.areaCode" :disabled="isDisabled" @change="areaChangeEvent" clearable placeholder="区/县" v-if="level >= 3">
            <el-option v-for="(item,index) in areaList" :key="index"
                       :label="item.name"
                       :value="item.code">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    export default {
        name: "division",
        props: {
            // 接收绑定参数
            value: String,
            label:'地址',
            // 输入框宽度
            widthClass: {
                default: ''
            },
            // 输入框占位符
            placeholder: {
                type: String,
                default: "请选择"
            },
            // 显示几级
            level: {
                type: Number,
                default: 3
            },
            // 是否查询使用  如果查询使用  组件绑定的v-model值返回为code
            isSearch: {
                type: Boolean,
                default: false
            },
            // 是否禁止修改
            isDisabled: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            value(val) {
                if(!val){
                    // 如果是查询使用的话  会有重置
                    if(this.isSearch){
                        this.init();
                    }
                    return;
                }
                // 编辑
                if(!this.isSearch){
                    // 保存回显id
                    this.divisionId = val;
                    // 获取数据
                    this.getAllDivision();
                }
            },
        },
        data() {
            return {
                viewModel: {
                    province: '',
                    provinceCode: '',
                    provinceId: '',
                    municipality: '',
                    municipalityCode: '',
                    municipalityId: '',
                    area: '',
                    areaCode: '',
                    areaId: '',
                    divisionId: '',
                },
                proList: [],
                muniList: [],
                areaList: [],
                // 通过divisionId回显的数据
                divisionList: [],
                // 所有的省市区下拉数据
                divisionInfo: {},
                // 选中的id
                divisionId: ''
            };
        },
        created() {
            this.divisionId = this.value;
            this.getAllDivision();
        },
        methods: {
            // 初始化选择
            init(){
                this.viewModel = {
                    province: '',
                    provinceCode: '',
                    provinceId: '',
                    municipality: '',
                    municipalityCode: '',
                    municipalityId: '',
                    area: '',
                    areaCode: '',
                    areaId: '',
                    divisionId: '',
                };
                this.muniList = [];
                this.areaList = [];
            },
            // 省的选择事件
            provinceChangeEvent(code) {
                let pro = this.proList.find(t => t.code == code);
                if(pro){
                    this.viewModel.province = pro.name;
                    this.viewModel.provinceCode = pro.code;
                    this.viewModel.provinceId = pro.id;
                    this.muniList = this.divisionInfo.municipalitys[code];
                    this.$emit('input', pro.code);
                }else {
                    this.viewModel.province = '';
                    this.viewModel.provinceCode = '';
                    this.viewModel.provinceId = '';
                    this.muniList = [];
                    this.$emit('input', '');
                }
                this.viewModel.municipality = '';
                this.viewModel.municipalityCode = '';
                this.viewModel.municipalityId = '';
                this.viewModel.area = '';
                this.viewModel.areaCode = '';
                this.viewModel.areaId = '';
                this.areaList = [];
                this.viewModel.divisionId = '';
                this.$emit("set-division", this.viewModel);
            },
            // 城市的选择事件
            cityChangeEvent(code) {
                let muti = this.muniList.find(t => t.code == code);
                if(muti){
                    this.viewModel.municipality = muti.name;
                    this.viewModel.municipalityCode = muti.code;
                    this.viewModel.municipalityId = muti.id;
                    this.areaList = this.divisionInfo.areas[code];
                    this.$emit('input', muti.code);
                }else {
                    if(this.viewModel.provinceId){
                        this.$emit('input', this.viewModel.provinceCode);
                    }
                    this.viewModel.municipality = '';
                    this.viewModel.municipalityCode = '';
                    this.viewModel.municipalityId = '';
                    this.areaList = [];
                }
                this.viewModel.area = '';
                this.viewModel.areaCode = '';
                this.viewModel.areaId = '';
                this.viewModel.divisionId = '';
                this.$emit("set-division", this.viewModel);
            },
            // 区的选择事件
            areaChangeEvent(code) {
                let area = this.areaList.find(t => t.code == code);
                if(area){
                    this.viewModel.area = area.name;
                    this.viewModel.areaCode = area.code;
                    this.viewModel.areaId = area.id;
                    this.viewModel.divisionId = area.id;
                    this.$emit('input', area.code);
                }else {
                    if(this.viewModel.municipalityId){
                        this.$emit('input', this.viewModel.municipalityCode);
                    }
                    this.viewModel.area = '';
                    this.viewModel.areaCode = '';
                    this.viewModel.areaId = '';
                    this.viewModel.divisionId = '';
                }
                this.$emit("set-division", this.viewModel);
            },
            // 获取所有的省市区回显组合及下拉数据
            async getAllDivision() {
                if(localStorage.getItem("division") != null && localStorage.getItem("divisionInfo") != null) {
                    this.divisionList = JSON.parse(localStorage.getItem("division"));
                    // 有id 视为编辑  获取回显数据
                    if(this.divisionId){
                        this.viewModel = this.divisionList.find(t => t.id == this.divisionId);
                    }
                    this.divisionInfo = JSON.parse(localStorage.getItem("divisionInfo"));
                    this.proList = this.divisionInfo.provinces;
                    this.getEditList();
                    return;
                }
                // 获取省市区回显组合
                this.divisionList = await this.request(this.api.system.division_all, {}, true);
                // 有id 视为编辑  获取回显数据
                if(this.divisionId){
                    this.viewModel = this.divisionList.find(t => t.id == this.divisionId);
                }
                // 存储回显组合数据
                localStorage.setItem("division", JSON.stringify(this.divisionList));
                // 获取省市区下拉数据
                let divisionInfo = await this.request(this.api.system.division_get_info, {}, true);
                // 初始化数据 转对象
                // 市
                if(divisionInfo && divisionInfo.municipalitys.length){
                    let municipalitys = {};
                    divisionInfo.municipalitys.forEach(item => {
                        let key = Object.keys(item)[0];
                        municipalitys[key] = item[key];
                    });
                    divisionInfo.municipalitys = municipalitys;
                }else{
                    divisionInfo.municipalitys = {};
                }
                // 区
                if(divisionInfo && divisionInfo.areas.length){
                    let areas = {};
                    divisionInfo.areas.forEach(item => {
                        let key = Object.keys(item)[0];
                        areas[key] = item[key];
                    })
                    divisionInfo.areas = areas;
                }else {
                    divisionInfo.areas = {};
                }
                this.divisionInfo = divisionInfo;
                // 获取省份数据
                this.proList = this.divisionInfo.provinces;
                // 获取市  区数据
                this.getEditList();
                // 存储下拉数据
                localStorage.setItem("divisionInfo", JSON.stringify(this.divisionInfo));
            },
            // 获取市  区列表
            getEditList(){
                if(this.viewModel.provinceCode){
                    this.muniList = this.divisionInfo.municipalitys[this.viewModel.provinceCode];
                }
                if(this.viewModel.municipalityCode){
                    this.areaList = this.divisionInfo.areas[this.viewModel.municipalityCode];
                }
            }

        }
    };
</script>
<style scoped>
.el-form-item__content{
    width: 80%;
}
.el-select{
    width: 25%;
}
.cont-inline{
    display: inline;
}
</style>
