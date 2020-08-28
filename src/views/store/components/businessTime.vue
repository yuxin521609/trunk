<template>
 <div class="time">
  <input
    @click.stop="b" 
    :value="value"
    class="el-input-short"
    :class="{'wl-input-short2':disabled}"
    placeholder="请选择营业时间"
    :disabled="disabled"
  ></input>
  <div id="box" v-show="isBox">
    <span class="s1"></span>
    <span class="s2"></span>
    <div class="left ml-20">
      <ul>
        <li :class="{color409eff:leftIndex == index}" :key="index" @click.stop="fnList(index)" v-for="(item, index) in 24">{{ index < 10 ? '0' + index : index  }}</li>
      </ul>
    </div>
    <div class="left">
      <ul>
        <li :class="{color409eff:rightIndex == index}" :key="index" @click.stop="fnRight(index)" v-for="(item, index) in 60">{{ index < 10 ? '0' +  index : index  }}</li>
      </ul>
    </div>
  </div>
</div>
</template>
<script>

import { getToken } from "@/utils/auth";
import { setTimeout, clearTimeout } from 'timers';
let token = getToken();
export default {
  props: ['operationbegin','disabled'],
  model: {
    prop: 'checked',
    event: 'change'
  },
  data() {
    return {
      isBox:false,
      value:'',
      leftIndex:null,
      rightIndex:null,
      time:null
    };
  },
  created() {
    var that = this;
    document.addEventListener('click', function(e) {
      that.isBox = false;
      e.stopPropagation();
    }, false)
  },
  mounted(){

  },
  watch: {
    operationbegin(v) {
      this.value = v;
      this.leftIndex = paseInt(v.match(/\d+/g)[0]);
      this.rightIndex = paseInt(v.match(/\d+/g)[1]);
      console.log(this.leftIndex)
    }
  },
  methods: {
    b() {
        this.isBox = !this.isBox;
        clearTimeout(this.time);
        this.time = setTimeout(() => {
          this.isBox = false;
        },30000)
    },
    change() {
      that.isBox = false;
    },
    fnList(index) {
        this.leftIndex = index;
         if(this.rightIndex === null) return;
        this.value = this.todou(index) + ':' + this.todou(this.rightIndex);
        this.isBox = false;
        this.$emit('change',this.value);
    },
    fnRight(index) {
        this.rightIndex = index;
        if(this.leftIndex === null) return;
        this.value = this.todou(this.leftIndex) + ':' + this.todou(index);
        this.isBox = false;
        this.$emit('change',this.value);
    },
    todou(number) {
        return number < 10 ? '0' + number : number;
    }
  }
};
</script>

<style lang="less" scoped>
  .time{
    position: relative;
    display: inline-block;
    width: 180px;
    margin-right: 10px;
  }
  #box{
    background: #fff;
    width: 160px;
    height: 250px;
    display: flex;
    border-radius: 5px;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    position: absolute;
    font-size: 12px;
    color: #606266;
    margin: 10px;
    z-index: 9999;
  }
  #box:after{
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    top: -12px;
    left: 48px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #fff;
    content: " ";
    border-width: 6px;
  }
  .s1{
    position: absolute;
    top: 100px;
    left: 20px;
    width: 120px;
    border:1px solid #f5f5f5;
  }
  .s2{
    position: absolute;
    top: 150px;
    left: 20px;
    width: 120px;
    border: 1px solid #f5f5f5;
  }
  .left{
    width: 60px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
  }
  .left::-webkit-scrollbar {
    display: none;
  }
  .left::-moz-scrollbar {
    display: none;
  }
  .left::-o-scrollbar {
    display: none;
  }
  .color409eff{
    color: #409eff;
    font-weight: bold;
    font-size: 13px;
  }
  .ml-20{
    margin-left: 20px;
  }
  .left:hover{
    overflow: auto;
  }
  #box ul li{
    width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  li:hover{
    background: #f5f5f5;
  }
  .nav_wrap{  
    height: 400px;  
    width: 200px;  
    overflow: hidden;  
    border: 1px solid #ccc;  
    margin: 20px auto;  
  }  
  .nav_ul{  
    height: 100%;  
    width: 220px;  
    overflow-y: auto;  
    overflow-x: hidden;  
  }  
  .nav_li{  
    border: 1px solid #ccc;  
    margin: -1px;  
    height: 40px;  
    line-height: 40px;  
    text-align: center;  
    font-size: 12px;  
    width: 200px;  
  }  
  .btn_wrap{  
    text-align: center;  
  } 
  .el-input-short {
    width: 180px;
    padding-right: 30px;
    height: 32px;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .wl-input-short2{
    background: #F5F7FA;
    color: #C0C4CC;
  }
  input::-webkit-input-placeholder {
    color: #C0C4CC;
}
</style>

