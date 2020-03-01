var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Discord = require('discord.js');
const Config = require('./auth.json'); 


function checkInput(inputtxt){
	var acceptableCharacters = /^[a-z\A-Z\d\-_\s]+$/;
	if(inputtxt.match(acceptableCharacters)){return true;}
	else{return false;}

}


var client = new Discord.Client();

client.on('ready', () =>{

   console.log('Logged in as $(client.user.tag)!');

});


client.on('message', msg =>{
  	const input = msg.content.split(' ');
	
	var reqURL="";
	let category=0;
	
    	if(input[0] === '!spell'){
		if(input.length > 1 && checkInput(input[1])){
			let indexOfSpace=msg.content.indexOf(' ');
			let unprocessedSpellName = msg.content.substr(indexOfSpace+1); 
			let processedSpellName = unprocessedSpellName.replace(/\s+/g,'-').toLowerCase();
			processedSpellName.toLowerCase();
			reqURL = 'http://www.dnd5eapi.co/api/spells/';
			reqURL = reqURL.concat(processedSpellName);
			category = 1;
		}
		
		else if(!checkInput(input[1])){
			category = -1;
		}

   	}
   
   	else if(input[0] === '!condition'){
		if(input.length > 1 && checkInput(input[1])){
			let condName = input[1].toLowerCase();
   			reqURL = 'http://www.dnd5eapi.co/api/conditions/';
	   		reqURL = reqURL.concat(condName);
			category = 2;
		}

		else if(!checkInput(input[1])){
			category = -1;
		}
	}
	if(category != 0){
		let request = new XMLHttpRequest();
		request.open('GET', reqURL);
	
		request.onload = function(){
			if(this.status == 200){
			
				let data = JSON.parse(this.responseText);
				console.log(data);
				msg.channel.send(data.desc);
				
			}
			else{	
			        if(category === 1){
				       msg.channel.send("can't find that spell");
				}
				else if(category === 2){
				       msg.channel.send("can't find that condition");
				}
				else if(category === -1){
				       msg.channel.send("please use valid input!");

				}
			}
		}	
	
		request.send();

	}

});

client.login(Config.token);

