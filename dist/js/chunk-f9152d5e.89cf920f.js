(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f9152d5e"],{2591:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"bg-fff item-margin item-padding"},[a("el-tabs",{model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:"自定义",name:"customize"}},[a("el-form",{ref:"filtersForm",staticClass:"item-form",attrs:{rules:e.rules,model:e.filtersData,"label-width":"100px",size:"small",inline:""}},[a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{prop:"_service",label:"微服务："}},[a("el-select",{staticClass:"input-w",attrs:{placeholder:"请选择"},model:{value:e.filtersData._service,callback:function(t){e.$set(e.filtersData,"_service",t)},expression:"filtersData._service"}},e._l(e.serviceOptions,function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1)],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{prop:"_url",label:"url："}},[a("el-input",{staticClass:"input-w",attrs:{placeholder:"请输入内容"},model:{value:e.filtersData._url,callback:function(t){e.$set(e.filtersData,"_url",t)},expression:"filtersData._url"}})],1)],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{prop:"_method",label:"请求方式："}},[a("el-select",{staticClass:"input-w",attrs:{placeholder:"请选择"},model:{value:e.filtersData._method,callback:function(t){e.$set(e.filtersData,"_method",t)},expression:"filtersData._method"}},e._l(e.methodOptions,function(e){return a("el-option",{key:e.name,attrs:{label:e.name,value:e.name}})}),1)],1)],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{prop:"_form",label:"请求类型："}},[a("el-select",{staticClass:"input-w",attrs:{placeholder:"请选择"},model:{value:e.filtersData._form,callback:function(t){e.$set(e.filtersData,"_form",t)},expression:"filtersData._form"}},e._l(e.formOptions,function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1)],1),e._l(e.params,function(t,s){return a("el-col",{key:s,attrs:{span:24}},[a("el-form-item",{attrs:{label:0==s?"请求参数：":"   "}},[a("el-input",{staticClass:"ztree-w",attrs:{placeholder:"请输入字段名称"},model:{value:t.name,callback:function(a){e.$set(t,"name","string"===typeof a?a.trim():a)},expression:"item.name"}})],1),a("el-form-item",[a("el-input",{staticClass:"ztree-w",attrs:{placeholder:"请输入参数"},model:{value:t.code,callback:function(a){e.$set(t,"code","string"===typeof a?a.trim():a)},expression:"item.code"}}),0!=s?a("i",{directives:[{name:"show",rawName:"v-show",value:!t.id,expression:"!item.id"}],staticClass:"el-icon-error",on:{click:function(a){return e.removeDomain(t)}}}):e._e()],1)],1)}),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:""}},[a("el-button",{staticClass:"label-input-right",on:{click:e.addContent}},[e._v("新增参数")])],1)],1)],2),a("div",{staticClass:"item-footer"},[a("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(t){return e.submitForm("filtersForm")}}},[e._v("发送请求")])],1)],1)],1),a("el-tab-pane",{attrs:{label:"同步库存",name:"aync"}},[a("el-form",{ref:"ayncForm",staticClass:"item-form",attrs:{rules:e.rules,model:e.ayncFormData,"label-width":"100px",size:"small",inline:""}},[a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{prop:"goodsOwner",label:"货主："}},[a("el-input",{staticClass:"input-w",attrs:{disabled:"",placeholder:"请输入内容"},model:{value:e.name,callback:function(t){e.name=t},expression:"name"}})],1)],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{prop:"warehouseCode",label:"仓库："}},[a("el-select",{staticClass:"input-w",attrs:{placeholder:"请选择"},model:{value:e.ayncFormData.warehouseCode,callback:function(t){e.$set(e.ayncFormData,"warehouseCode",t)},expression:"ayncFormData.warehouseCode"}},e._l(e.warehouseOptions,function(e){return a("el-option",{key:e.code,attrs:{label:e.name,value:e.code}})}),1)],1)],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{prop:"productGoodsCode",label:"货品编码："}},[a("el-input",{staticClass:"input-w",attrs:{placeholder:"请输入内容"},model:{value:e.ayncFormData.productGoodsCode,callback:function(t){e.$set(e.ayncFormData,"productGoodsCode",t)},expression:"ayncFormData.productGoodsCode"}})],1)],1)],1)],1),a("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(t){return e.ayncForm("ayncForm")}}},[e._v("同步库存")])],1)],1)],1)},o=[],r=(a("7f7f"),{data:function(){return{activeName:"customize",rules:{},filtersData:{_url:"",_service:"",_method:"post",_form:!1},params:[{name:"",code:""}],serviceOptions:[{name:"order",id:"order-service"},{name:"collocation",id:"collocation-service"},{name:"content",id:"content-service"},{name:"system",id:"system-service"},{name:"product",id:"product-service"},{name:"retail-store",id:"retail-store-service"},{name:"user",id:"user-service"}],methodOptions:[{name:"get"},{name:"post"},{name:"put"},{name:"delete"}],formOptions:[{name:"form",id:!0},{name:"json",id:!1}],ayncFormData:{goodsOwner:null,warehouseCode:null,productGoodsCode:null},name:"",goodsOwnerOptions:[],warehouseOptions:[]}},created:function(){this.getGoodsOwner(),this.getWarehouse()},methods:{addContent:function(){this.params.push({code:"",name:""})},removeDomain:function(e){var t=this.params.indexOf(e);-1!==t&&this.params.splice(t,1)},submitForm:function(){for(var e,t,a=this,s=this.params,o=this.filtersData,r=new Object,l=0;l<s.length;l++)e=s[l].name?s[l].name:"",t=s[l].code?s[l].code:"",e&&(r[e]=t);this.request({url:o._service+"/"+o._url,method:o._method,form:o._form},r).then(function(e){a.$message.success("成功")})},getGoodsOwner:function(){var e=this;this.request(this.api.system.goodsOwner_getByUserId).then(function(t){e.name=t.name,e.ayncFormData.goodsOwner=t.code})},getWarehouse:function(){var e=this;this.request(this.api.system.warehouse_getListByUser).then(function(t){e.warehouseOptions=t})},ayncForm:function(){var e=this;this.request(this.api.product.productGoodsStock_synchronousStock,this.ayncFormData).then(function(t){e.$message.success("同步成功")}).catch(function(t){e.$message.error("同步失败")})}}}),l=r,n=(a("7cd67"),a("2877")),i=Object(n["a"])(l,s,o,!1,null,"d3d74fe8",null);t["default"]=i.exports},"5ca9":function(e,t,a){},"7cd67":function(e,t,a){"use strict";var s=a("5ca9"),o=a.n(s);o.a}}]);