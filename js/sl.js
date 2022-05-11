/*
* All Rights Reserved
* Author: Ashok Kumar Shah
* https://shahnashok.com
*/
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
if(window.location.hash)
{
	var hash = window.location.hash.substring(1);
	if(hash == "debug")
		document.getElementById('debug').style.display = "block";
}

var shah = new Object();
shah.log = function(msg) {
	if(shah.debug)
	{
		console.log(msg);
		document.getElementById('loganswer').textContent = msg;
	}
		
}

shah.table = function(msg) {
	if(shah.debug)
		console.table(msg);
}

var sl = TAFFY(config);
var packageMCQ = {};
var p=0 ;
var time=15 ;
shah.debug = true;
shah.prompt = [12, 17, 22, 27, 32, 37, 42, 47, 52, 57, 62, 67, 72, 77, 82, 87];
shah.struct = [{point: 12, snake: 7, ladder: 28}, {point: 17, snake: 5, ladder: 45}, {point: 22, snake: "Start", ladder: 43}, {point: 27, snake: 15, ladder: 34}, {point: 32, snake: 30, ladder: 51}, {point: 37, snake: 3, ladder: 58}, {point: 42, snake: 38, ladder: 59}, {point: 47, snake: 36, ladder: 55}, {point: 52, snake: 48, ladder: 73}, {point: 57, snake: 35, ladder: 83}, {point: 62, snake: 60, ladder: 81}, {point: 67, snake: 46, ladder: 75}, {point: 72, snake: 35, ladder: 90}, {point: 77, snake: 43, ladder: 95}, {point: 82, snake: 63, ladder: 99}, {point: 87, snake: 68, ladder: 93}];

shah.questionAttempt = 0;
shah.currentpos;
shah.filtered = [];
shah.lastrolled = 0;
shah.filteredIndex = 0;
shah.setpos = function(curpos) {
	
	shah.currentpos = curpos;
	console.log(curpos);
	
	var cellProp = $('td').filter(function(i,e){ return this.textContent.trim() == curpos }).get(0);
	
	
	
	var pX = ((54 * parseInt(cellProp.cellIndex)) );
	var pY = ((53.5 * parseInt(cellProp.parentNode.rowIndex)));
	setTimeout(() => {
		$('#player').animate({top: pY + 'px', left: pX + 'px'});
		
	},1000);
	
	
	
	//document.getElementsByClassName('dice')[0].className = "dice";
	if(curpos == "Stop")
	{
		shah.gameover();
	} else {
		setTimeout(setQuestion, 1000);
	}
}

shah.gameover = function()
{
	//alert('game over');
	$('#replay').show();
	$('#msgComplete').show();
	setTimeout(function()
	{
		//playSound('well done');
		$('#msgComplete').addClass('open');
		setTimeout(function()
		{
			$('#msgComplete span img').each(function(i, e)
			{
				 $(this).show().addClass('textEffect' + (i+1));
			});
		}, 300);
	}, 10);
}

var slLevels = new Array();	
sl().each(function (r) {
	if(slLevels.indexOf(r.level) == -1)
		slLevels.push(r.level);
});

var nextscreen = function(oldscreen, newscreen) {
	document.getElementById(oldscreen).style.display = "none";
	document.getElementById(newscreen).style.display = "block";
}

var selectlevel = function(level) {
	nextscreen('screen3', 'screen4');
	packageMCQ.level = level;
	
	var slThemes = [];
	sl({level: level}).each(function (r) {
		if(slThemes.indexOf(r.theme) == -1)
			slThemes.push(r.theme);
	});

	shah.log(slThemes);
	var themeHTML = "";
	for(var i=0; i<slThemes.length; i++)
		themeHTML += '<li onclick="selecttheme(\'' + slThemes[i] + '\')">' + slThemes[i] + '</li>';
	document.getElementById('selectTheme').innerHTML = themeHTML;
}

var selecttheme = function(theme) {
	nextscreen("screen4", "screen5");
	packageMCQ.theme = theme;
	
	shah.filtered = new Array();
	sl({level: packageMCQ.level, theme: packageMCQ.theme}).each(function(r)
	{
		shah.filtered.push(r);
	});
	
	shah.table(shah.filtered);
	
	shuffle(shah.filtered);
	shah.setpos("Start");
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}





var levelHTML = "";
for(var i=0; i<slLevels.length; i++)
	levelHTML += '<li onclick="selectlevel(\'' + (i+1) + '\')">Level ' + slLevels[i] + '</li>';
document.getElementById('selectLevel').innerHTML = levelHTML;


var setQuestion = function()
{
	shah.questionAttempt++;
	
	//reshuffle filtered questions before the question repeats
	if(shah.filteredIndex >= shah.filtered.length)
	{
		shuffle(shah.filtered);
		shah.filteredIndex = 0;
		shah.table(shah.filtered);
	}
	
	//insert information for q/a
	document.getElementById('questionTitleTxt').textContent = shah.filtered[shah.filteredIndex].question;
	
	for(var i=0; i<4; i++)
	{
		document.querySelectorAll('#userAnswer ul li')[i].textContent = shah.filtered[shah.filteredIndex].answers[i];
		if(i  == (parseInt(shah.filtered[shah.filteredIndex].correct) - 1))
		{
			document.querySelectorAll('#userAnswer ul li')[i].id = "correctans";
			shah.log('Ans: ' + shah.filtered[shah.filteredIndex].answers[i]);
		}
	}
	
	//show question viewer
	
	document.getElementById('questionViewer').style.bottom = "0px";
	
	startTimer(time);
	shah.filteredIndex++;
}

var submitAnswer = function()
{	
	setTimeout(() => {
		clearInterval(counter);
		timeCount.textContent="15"
		var newpos;
		var bool=false;
		for(var i=0; i<shah.struct.length; i++)
		{
			if(shah.currentpos == shah.struct[i].point)
			{
				newpos = shah.struct[i];
				bool=true
				break;
			}
		}
	
		
		var attempt = (document.getElementsByClassName('active')[0].id == "correctans") ? true : false;
		
		var randomNum;
		
		randomNum = Math.floor(Math.random() * 6) + 1;
		//hide question viewer
		document.getElementById('questionViewer').style.bottom = "";
		
		setTimeout(function()
		{
			/* shah.setpos((attempt == true) ? newpos.ladder : newpos.snake); */
			if(shah.currentpos == "Start") shah.currentpos = 1;
			if(shah.currentpos == "Stop") shah.currentpos = 100;
			if (attempt){
				if(bool){
					shah.setpos(newpos.ladder)
				}else{
				shah.currentpos += randomNum;}
			}else{
				if(bool){
					shah.setpos(newpos.snake)
				}else{
				 switch(shah.currentpos){
					 case 1 :
						 shah.currentpos = 0;
						 break
					case 2 :
						shah.currentpos =0;
						break
					case 3 :
							shah.currentpos-=1;
							break
					case 4 :
						shah.currentpos-=1;
						break
					case 5 :
						shah.currentpos-=1;
						break
					case 6 :
						shah.currentpos-=3;
						break
	
				}
				if (shah.currentpos>6){
					shah.currentpos-=randomNum	;
				}}
		}
	
			var tempholder;
			
			if(shah.currentpos == 0)		tempholder = "Start";
			else if(shah.currentpos >= 100)	tempholder = "Stop";
			else 							tempholder = shah.currentpos;
		
			
			shah.setpos(tempholder);	
	
	
	
	
	
	
	
	
	
			document.getElementById((attempt == true) ? "correctsound" : "incorrectsound").play();
			document.getElementsByClassName('active')[0].className = "";
		}, 1000);
		
		
	}, 1000);

	
}

var setactiveans = function(ele)
{
	if(document.querySelector('.active'))
		document.querySelector('.active').className = "";
	ele.className = "active";
}

function playagain() {
    location.href = document.URL;
}


var setfixroll = function(toroll)
{
	window.toroll = toroll;
}

var clearfixroll = function()
{
	window.toroll = "";
}

var preload = ["img/digit1.png",
    "img/digit2.png",
    "img/digit3.png",
    "img/digit4.png",
    "img/digit5.png",
    "img/digit6.png",
    "img/grass.png",
    "img/snake1.png",
    "img/snake2.png",
    "img/snakes/ludoSnake1.png",
    "img/snakes/ludoSnake2.png",
    "img/snakes/ludoSnake3.png",
    "img/snakes/ludoSnake4.png",
    "img/snakes/ludoSnake5.png",
    "img/snakes/ludoSnake6.png",
    "img/snakes/ludoSnake7.png",
    "img/snakes/ludoSnake8.png",
    "img/snakes/ludoSnake8.png",
    "img/snakes/ludoSnake9.png",
    "img/snakes/ludoSnake10.png",
    "img/snakes/ludoSnake11.png",
    "img/snakes/ludoSnake12.png",
    "img/snakes/ludoSnake13.png",
    "img/snakes/ludoSnake14.png",
    "img/snakes/ludoSnake15.png",
    "img/snakes/ludoSnake16.png"];
	
var promises = [];
for (var i = 0; i < preload.length; i++) {
    (function(url, promise) {
        var img = new Image();
        img.onload = function() {
          promise.resolve();
        };
        img.src = url;
    })(preload[i], promises[i] = $.Deferred());
}

$(document).ready(function() {

	$.when.apply($, promises).done(function() {
		$('body').addClass('done');
	});



});

function startTimer(time){
    counter = setInterval(timer, 1000);
        function timer(){
           
            timeCount.textContent = time; //changing the value of timeCount with time value
            time--; //decrement the time value
            if(time < 9){ //if timer is less than 9
                let addZero = timeCount.textContent; 
                timeCount.textContent = "0" + addZero; //add a 0 before time value
            }
            if(time <0){ //if timer is less than 0
                clearInterval(counter); //clear counter
                timeText.textContent = "Time Off"; //change the time text to time off
				document.getElementById('questionViewer').style.bottom = "";
				
					switch (shah.currentpos){
							case 1 :
								shah.currentpos = 0;
								break
						   case 2 :
							   shah.currentpos =0;
							   break
						   case 3 :
								   shah.currentpos-=1;
								   break
						   case 4 :
							   shah.currentpos-=1;
							   break
						   case 5 :
							   shah.currentpos-=1;
							   break
						   case 6 :
							   shah.currentpos-=1;
							   break
					}
					   
					   if (shah.currentpos>6){
						   shah.currentpos-=1	;
					   }
					   var tempholder;
		
					   if(shah.currentpos == 0)		tempholder = "Start";
					   else if(shah.currentpos >= 100)	tempholder = "Stop";
					   else 							tempholder = shah.currentpos;
				   
					   
					   shah.setpos(tempholder);
					
			

				
            }
        }
        
    }
	document.getElementById("userAnswer").addEventListener("click", submitAnswer);