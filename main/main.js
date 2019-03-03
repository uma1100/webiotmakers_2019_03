var canvas = document.getElementById('myChart');
var context = canvas.getContext('2d');
var HP_count = 0;
function draw_HP(){
    context.clearRect(0,0,canvas.clientWidth,canvas.height);
    context.beginPath();
    
    context.lineWidth = 30;//線の太さを変える
    var start_ang = 2 * Math.PI - HP_count/180 * Math.PI;
    
    context.arc(140, 120, 100, start_ang,Math.PI, true);
    
    context.strokeStyle = "#ff0000";
    
    context.stroke();
    
    context.closePath();
    HP_count++;
}

// noprotect
// i2c-ADT7410 Driver:
// <script src="https://mz4u.net/libs/gc2/i2c-ADT7410.js"><\/script>

var head = document.querySelector('#head');

onload=function(){
  mainFunction();
  draw_HP();
}

async function mainFunction(){
  // WebI2C Initialized
  var i2cAccess = await navigator.requestI2CAccess();
  var port = i2cAccess.ports.get(1);
  var adt7410 = new ADT7410(port,0x48);
  await adt7410.init();
  while(true){
    var value = await adt7410.read();
    console.log('value:', value);
    head.innerHTML = value ? value : head.innerHTML;
    if(value >= 30)
    head.style.color = "red";
    await sleep(1000);
  }
}

function sleep(ms){
	return new Promise( function(resolve) {
		setTimeout(resolve, ms);
	});
}
