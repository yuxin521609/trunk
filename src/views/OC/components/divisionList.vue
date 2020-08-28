<template>
    <div class="cont-inline">
        <el-select v-model="viewModel.provinceCode" @change='provinceChangeEvent' clearable placeholder="省/直辖市">
            <el-option v-for="(item,index) in proList" :key="index"
                       :label="item.name"
                       :value="item.code">
            </el-option>
        </el-select>
        <el-select v-model="viewModel.municipalityCode" @change="cityChangeEvent" clearable placeholder="市">
            <el-option v-for="(item,index) in muniList" :key="index"
                       :label="item.name"
                       :value="item.code">
            </el-option>
        </el-select>
        <el-select v-model="viewModel.areaCode" @change="areaChangeEvent" clearable placeholder="区/县">
            <el-option v-for="(item,index) in areaList" :key="index"
                       :label="item.name"
                       :value="item.code">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    export default {
        name: "division-list",
        props: {
            viewModel: {
                // 接收绑定参数

            }
        },
        watch: {
        },
        data() {
            return {
                proList: [],
                muniList: [],
                areaList: []
            };
        },
        created() {
            // 获取数据
            this.getAllDivision()
        },
        methods: {
            // 省的选择事件
            provinceChangeEvent(code) {
                let pro = this.proList.find(t => t.code == code);
                if(pro){
                    this.viewModel.province = pro.name;
                    this.viewModel.provinceCode = pro.code;
                    this.muniList = this.divisionInfo.municipalitys[code];
                }else {
                    this.muniList = [];
                }
                this.viewModel.municipality = '';
                this.viewModel.municipalityCode = '';
                this.viewModel.area = '';
                this.viewModel.areaCode = '';
                this.areaList = [];
            },
            // 城市的选择事件
            cityChangeEvent(code) {
                let muti = this.muniList.find(t => t.code == code);
                if(muti){
                    this.viewModel.municipality = muti.name;
                    this.viewModel.municipalityCode = muti.code;
                    this.areaList = this.divisionInfo.areas[code];
                }else {
                    this.areaList = [];
                }
                this.viewModel.area = '';
                this.viewModel.areaCode = '';
            },
            // 区的选择事件
            areaChangeEvent(code) {
                let area = this.areaList.find(t => t.code == code);
                if(area){
                    this.viewModel.area = area.name;
                    this.viewModel.areaCode = area.code;
                    this.viewModel.divisionId = area.id;
                    this.$emit("set-division", this.viewModel);
                }
            },
            // 获取所有的省市区回显组合及下拉数据
            async getAllDivision() {
                if(localStorage.getItem("divisionInfo") != null) {
                    this.divisionInfo = JSON.parse(localStorage.getItem("divisionInfo"));
                    this.proList = this.divisionInfo.provinces;
                    this.getEditList();
                    return;
                }
                // 获取省市区下拉数据
                let divisionInfo = await this.request(this.api.system.division_get_info, {});
                // 初始化数据 转对象
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
                // 获取市区数据
                this.getEditList();
                // 存储下拉数据
                localStorage.setItem("divisionInfo", JSON.stringify(this.divisionInfo));
            },
            // 编辑获取子集列表
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
