export function printWinform(LODOP, printData,printSelsed) {
  //50*120竖版
  //中部中间相差高度
  let centerDiffHeight = 0;
  let initName=`${printData.productGoodsSn}合格证`;
  LODOP.PRINT_INITA("0mm", "0mm", "50.00mm", "120.00mm", initName);
  LODOP.SET_PRINTER_INDEX(printSelsed);
  LODOP.SET_PRINT_PAGESIZE(1, 500, 1200, "");//这里3表示纵向打印且纸高“按内容的高度”；1200表示纸宽138.5mm；0表示页底空白0mm
  LODOP.SET_PRINT_STYLE("FontName", "微软雅黑");
  //sn码
  let productGoodsSn = printData.productGoodsSn;
  LODOP.ADD_PRINT_TEXT("4.10mm", "10.05mm", "26.46mm", "9mm", "合格证");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
  LODOP.ADD_PRINT_TEXT("13.00mm", "3.40mm", "8.73mm", "5.29mm", "品牌：");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let tagBrandName = printData.tagBrandName;
  LODOP.ADD_PRINT_TEXT("11.69mm", "9.53mm", "38.34mm", "6.29mm", tagBrandName);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
  LODOP.ADD_PRINT_LINE("18.00mm", "3.40mm", "18.00mm", "46.6mm", 2, 0);
  let productGoodsName = `品名：${printData.productGoodsName}`;
  LODOP.ADD_PRINT_TEXT("22.50mm", "3.40mm", "44.2mm", "6.29mm", productGoodsName);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let brandOwnerName = `品牌商：${printData.brandOwnerName}`;
  LODOP.ADD_PRINT_TEXT("27.00mm", "3.40mm", "44.2mm", "5.29mm", brandOwnerName);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  LODOP.ADD_PRINT_TEXT("32.00mm", "3.40mm", "13.00mm", "5.29mm", "地址：");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let brandOwnerAddress = printData.brandOwnerAddress;
  LODOP.ADD_PRINT_TEXT("32.00mm", "10.00mm", "38.00mm", "8.73mm", brandOwnerAddress);
  LODOP.SET_PRINT_STYLEA(0, "TextNeatRow", true);//允许标点溢出，且英文单词拆开。
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let performanceStandard = `执行标准：${printData.performanceStandard}`;
  LODOP.ADD_PRINT_TEXT("39.00mm", "3.40mm", "44.71mm", "5.29mm", performanceStandard);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let safetyGrade = `安全类别：${printData.safetyGrade}`;
  LODOP.ADD_PRINT_TEXT("43.5mm", "3.40mm", "18.79mm", "5.29mm", safetyGrade);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let level = `等级：${printData.level}`;
  LODOP.ADD_PRINT_TEXT("43.5mm", "21.70mm", "18.00mm", "5.29mm", level);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6); 
  let qualityInspector = `检验员：${printData.qualityInspector}`;
  LODOP.ADD_PRINT_TEXT("43.5mm", "33.87mm", "14.00mm", "5.29mm", qualityInspector);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
  LODOP.ADD_PRINT_LINE("48.00mm", "3.41mm", "48.00mm", "46.6mm", 2, 0);
  LODOP.ADD_PRINT_TEXT("52.00mm", "3.41mm", "15.35mm", "5.29mm", "面料成分：");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let fabric = printData.fabric;
  LODOP.ADD_PRINT_TEXT("52.00mm", "14.29mm", "33.87mm", "8.73mm", fabric);
  LODOP.SET_PRINT_STYLEA(0, "TextNeatRow", true);//允许标点溢出，且英文单词拆开。
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  //配料成分距离顶部计算
  centerDiffHeight = getTextHeight(fabric, centerDiffHeight);
  let ingredientsHeight = (centerDiffHeight + 59) + 'mm';
  LODOP.ADD_PRINT_TEXT(ingredientsHeight, "3.41mm", "15.35mm", "5.29mm", "配料成分：");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let ingredients = printData.ingredients;
  LODOP.ADD_PRINT_TEXT(ingredientsHeight, "14.29mm", "33.87mm", "8.73mm", ingredients);
  LODOP.SET_PRINT_STYLEA(0, "TextNeatRow", true);//允许标点溢出，且英文单词拆开。
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  //里料成分距离顶部计算
  centerDiffHeight = getTextHeight(ingredients, centerDiffHeight);
  let liningHeight = (centerDiffHeight + 66) + 'mm';
  LODOP.ADD_PRINT_TEXT(liningHeight, "3.41mm", "15.35mm", "5.29mm", "里料成分：");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let lining = printData.lining;
  LODOP.ADD_PRINT_TEXT(liningHeight, "14.29mm", "33.87mm", "8.73mm", lining);
  LODOP.SET_PRINT_STYLEA(0, "TextNeatRow", true);//允许标点溢出，且英文单词拆开。
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  let filler = `填充物：${printData.filler}`;
  //填充物分距离顶部计算  
  centerDiffHeight = getTextHeight(lining, centerDiffHeight);
  let fillerHeight = (centerDiffHeight + 74) + 'mm';
  LODOP.ADD_PRINT_TEXT(fillerHeight, "3.40mm", "44.2mm", "5.29mm", filler);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  LODOP.ADD_PRINT_LINE("80.60mm", "3.41mm", "80.60mm", "46.6mm", 2, 0);
  LODOP.ADD_PRINT_BARCODE("84.60mm", "3.41mm", "24.00mm", "24.00mm", "QRCode", productGoodsSn);
  LODOP.SET_PRINT_STYLEA(0, "QRCodeVersion", 3);
  LODOP.SET_PRINT_STYLEA(0, "QRCodeErrorLevel", "H");
  let productCode = `款号：${printData.productCode}`;
  LODOP.ADD_PRINT_TEXT("84.67mm", "20.9mm", "26.46mm", "3.97mm", productCode);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
  let color = `颜色：${printData.color}`;
  LODOP.ADD_PRINT_TEXT("88.64mm", "20.9mm", "26.46mm", "3.97mm", color);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
  let size = `尺码：${printData.size}`;
  LODOP.ADD_PRINT_TEXT("92.6mm", "20.9mm", "26.46mm", "3.97mm", size);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
  let retailPrice = `￥${printData.retailPrice}`;
  LODOP.ADD_PRINT_TEXT("96.6mm", "20.9mm", "26.46mm", "3.97mm", retailPrice);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
  LODOP.ADD_PRINT_BARCODE("102.79mm", "1.00mm", "48.00mm", "8.49mm", "Code93", productGoodsSn);
  LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
  LODOP.ADD_PRINT_TEXT("115.00mm", "3.40mm", "43.2mm", "5.29mm", productGoodsSn);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
  LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
 //LODOP.PRINT_DESIGN(); //打印设计 
  // LODOP.PREVIEW();//打印预览
 LODOP.PRINT(); //不经打印预览的直接打印。
}
//获取字符串长度
function codePointLength(text) {
  var result = text.match(/(?:[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g);
  return result ? result.length : 0;
};
/**
 * @Deprecated   获取文本的高度判断相差
 * @Author elephant
 * @Date 2019/09/21
 * @Time 10.45
 * @Params str 上一条数据的字符串
            het 相差高度 进行累加
 * @Return number  返回相差高度
 */
function getTextHeight(str, het) {
  let len = codePointLength(str);
  if (len > 28) {
    return het + 2;
  } else {
    return het;
  }
}
