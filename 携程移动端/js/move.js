/*动态设置像素比*/
//console.log(1 / window.devicePixelRatio);
var dpr = 1 / window.devicePixelRatio;
document.write('<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale='+dpr+',minimum-scale='+dpr+',maximum-scale='+dpr+'" />')
/*设置rem*/
var dpr = 1 / window.devicePixelRatio;
document.write('<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale='+dpr+',minimum-scale='+dpr+',maximum-scale='+dpr+'" />')

//console.log(document.documentElement.clientWidth);
var fz = document.documentElement.clientWidth / 10;
document.getElementsByTagName('html')[0].style.fontSize = fz + 'px';