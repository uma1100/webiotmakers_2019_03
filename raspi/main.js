const MAX_GAIN = 1650;
const FSR_VARIATION = 10;
const FSR_LOOP = 10;
const FSR_SLEEP = 20;
var canvas = document.getElementById('myChart');
var context = canvas.getContext('2d');
var d_count = 0;
var count = 0;
var alc = 0;
var pow = 0;
var count_num = 0;

const ws = new WebSocket("wss://4191333.xyz:3052/?room=team_g");

function data_get(ondo_data){
	//console.log(ondo_data);
     $(function(){
	console.log(ondo_data);
	$.get('https://script.google.com/macros/s/AKfycbzgb1ZL_qHBG1ziYBMdB7ql1pgw3U5Q1s5CFeJz7KNa1Bt1smc/exec',{'ondo':ondo_data});
      });
}

function draw_HP(damage){
    context.clearRect(0,0,canvas.clientWidth,canvas.height);
    context.beginPath();
    
    context.lineWidth = 30;//線の太さを変える
    context.textAlign = "center";
    d_count += damage;
    var start_ang = 2 * Math.PI - d_count/180 * Math.PI;
    if(start_ang <= Math.PI){
	    start_ang = Math.PI + 0.01;
     }
   console.log(start_ang); 
    context.arc(canvas.width/2, 220, 200, start_ang,Math.PI, true);
    if(d_count <= 11*1.8 ){
    	context.strokeStyle = "#64FE2E"; //green
}else if(d_count <= 44*1.8){
      context.strokeStyle = "#BFFF00"; //yellow
}else if(d_count <= 72*1.8){
	context.strokeStyle = "#FFBF00"; //orange
}else{
  context.strokeStyle = "#FE2E2E";   //red
  ws.send(true);
}
    
    context.stroke();
    
    context.closePath();
}

var head = document.querySelector('#head');
var ondo = document.querySelector('#ondo');

onload=function(){
  mainFunction();
  draw_HP(0);
}

async function mq303a(ads1015) { //alcohol
  try {
    var alc = await ads1015.read(0);
    return MAX_GAIN - alc;
  } catch (error) {
    if (error.code != 4) {
      head.innerHTML = "ERROR";
    }
    console.log("error: code:" + error.code + " message:" + error.message);
  }
}

async function mainFunction(){
  // WebI2C Initialized
  var i2cAccess = await navigator.requestI2CAccess();
  var port = i2cAccess.ports.get(1);
  var adt7410 = new ADT7410(port,0x48);
  await adt7410.init();
  //var ads1015 = new ADS1015(port, 0x49);
  //await ads1015.init();
  while(true){
    var value = await adt7410.read(); //温度
    //alc = await mq303a(ads1015); //alcohol
    alc = alc/(1000 * 5);	//アルコール血中濃度
    damage = (alc*100)/0.18; // damage計算 alc=0.2%でHP→0
    //console.log('value:', value);
    damage = damage.toFixed(1); //有効桁 1
    value = Math.round(value);
    ondo.innerHTML = value ? value : ondo.innerHTML;
    alc = alc.toFixed(3);
    alc_param.innerHTML = alc ? alc : alc_param.innerHTML;
    count_num++; 
    if(count_num % 3 == 0){
       draw_HP(value);
	data_get(value);
     }
    //ondo.style.color = "red";
    await sleep(1000);
  }
}

function sleep(ms){
	return new Promise( function(resolve) {
		setTimeout(resolve, ms);
	});
}
