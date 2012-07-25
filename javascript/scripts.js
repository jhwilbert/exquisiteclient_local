var num = new Array();
var recentnum = new Array();
var imageDir = "clock/";
var timer;

//CLOCK WRAPPER
function ClockAPI(){};
ClockAPI.Numbers = function Numbers(){};
ClockAPI.Numbers.getNumbers = function(callback){
	requestURL = "http://localhost:8888/exquisiteclock/exquisite_client_local_v1/feeds/feed.json?time="+Math.random();
	$.getJSON(requestURL, callback);
}

//LOADS THE FEED AND PUTS THE IMAGES INTO AN ARRAY NUM
function initClock(){
    
    console.debug("Loaded Clock")
	ClockAPI.Numbers.getNumbers(function(json){
	num = new Array();	
	$.each(json, function(i){
		var urls = new Array();
		for ( a=0; a < this.length; a++ )
		{
		  urls.push(this[a]["URL"]);
		}
		num.push(urls);
	});
	
	startClock();

	});
};

function updateClock(){
			
  $("#feeds").load("checksize.php",{}, function(data){
	
	if(data==0) {
	console.debug("UPDATE: dont do anything file is zero")	
	} else {
	
	ClockAPI.Numbers.getNumbers(function(json){
		recentnum = new Array();
		$.each(json, function(i){
			urls = new Array();
			for ( a=0; a < this.length; a++ )
			{
				if(this[a]["N"]=="1"){
					urls.push(this[a]["URL"]);
				}
			}
			recentnum.push(urls);
			console.debug(recentnum);
			});
		console.debug("i refreshed the clock");
			refreshClock();
		
			});
		
	}
		updateTimer = setTimeout("updateClock()",5000)
	});
}

//UPDATS THE FEED AND PUTS NEW IMAGES INTO AN ARRAY RECENTNUM

//STARTS THE CLOCK
function startClock(){
	t = getTime();
	setNum("sec2" ,t["s2"]);
	setNum("sec1" ,t["s1"]);
	setNum("min2" ,t["m2"]);
	setNum("min1" ,t["m1"]);
	setNum("hours2" ,t["h2"]);
	setNum("hours1" ,t["h1"]);
	updateTimer = setTimeout("updateClock()",5000)
	 //console.debug("called startClock");
	clock();
};

//STARTS THE CLOCK
function refreshClock(){

	t = getTime();

	setNewNum("hours1" ,t["h1"]);
	setNewNum("hours2" ,t["h2"]);	
	setNewNum("min1" ,t["m1"]);
	setNewNum("min2" ,t["m2"]);
	setNewNum("sec1" ,t["s1"]);
//	setNewNum("sec2" ,t["s2"]);

	//NOW WITH ANY RECENT UNUSED...THEN I WILL PUT THEM INTO THE MIX
	for ( c=0; c < recentnum.length; c++ )
	{
		var numbers = recentnum[c];
		while(numbers.length > 0){
			var file = numbers.shift();
			if(file){
				num[c].push(file);
			}
		};
	}
	//console.debug("depois refresh:"+urls+"recentnum:"+recentnum+"num:"+num);
};

//THIS FUNCTION RUNS EVERY SECOND UPDATES THE IMAGES IF THEY CHANGE
function clock() {
    clearInterval(timer);
	t = getTime();
	setNum("sec2" ,t["s2"]);
	if(parseInt(t["s2"], 10) == 0){
		setNum("sec1" ,t["s1"]);
		if(parseInt(t["s1"], 10) == 0){
			setNum("min2" ,t["m2"]);
			if(parseInt(t["m2"], 10) == 0){
				setNum("min1" ,t["m1"]);	
				if(parseInt(t["m1"], 10) == 0){
					setNum("hours2" ,t["h2"]);
					if(parseInt(t["h2"], 10) == 0){
						setNum("hours1" ,t["h1"]);
					}
				}
			}
		}
	}

	timer = setTimeout("clock()",1000)
}



 $(document).ready(function() {
		initClock();
 });


function rand ( s ) {
  return ( Math.floor ( Math.random ( ) * s + 1) );
}
//*********************************GETS LOCAL HOURS AND DIVIDE THE STRINGS ************************//
function getTime(){
	var t = new Array();
	var time = new Date();
	t["h1"] = time.getHours().toString().substring(0,1);
	t["h2"] = time.getHours().toString().substring(1,2);
	t["m1"] = time.getMinutes().toString().substring(0,1);
	t["m2"] = time.getMinutes().toString().substring(1,2);
	t["s1"] = time.getSeconds().toString().substring(0,1);
	t["s2"] = time.getSeconds().toString().substring(1,2);
	
	if(time.getHours().toString()<10){
		t["h2"]=t["h1"];
		t["h1"]=0;
	}
	if(time.getMinutes()<10){
		t["m2"]=t["m1"];
		t["m1"]=0;
	}
	if(time.getSeconds()<10){
		t["s2"]=t["s1"];
		t["s1"]=0;
	}
	return t;
}
//SETS A NEW NUMBER
function setNewNum(img, number){
	if(recentnum[number]){
		//TAKE THE NEW URL FROM THE RECENT ARRAY
		var file = recentnum[number].shift();
		if(file){
		//ADD IT TO THE MAIN ARRAY NOW...
		num[number].push(file);
		document[img].src = imageDir+file;
		} 
	}
}
//SETS A NUMBER (RANDOM)
function setNum(img, number){
    //console.debug("changeNum");
	var file = imageDir+num[number][rand(num[number].length)-1];
	if(file){	
			document[img].onerror = function (evt) {
				var missingfile = file;
				console.debug("not found:"+missingfile);
				
				var holderfile = imageDir+num[number][rand(num[number].length)-1];
				document[img].src = holderfile;
					$("#feeds").load("missingfiles.php", { missing: missingfile }, function(){  });
			}	
	document[img].src = file;
	}
}