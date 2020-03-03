var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Discord = require('discord.js');
const Config = require('./auth.json'); 

enum Codes {
	BLANK = 0,
	CONDITION = 2,
	ERROR = -1,
	SPELL = 1,
	SKILL = 3,
};

function checkInput(inputtxt){
	var acceptableCharacters = /^[a-z\A-Z\d\-_\s]+$/;
	if(inputtxt != ""){
		if(inputtxt.match(acceptableCharacters)){return true;}
		else{return false;}
	}
	return false;
}

function normalizeInput(inputtxt){
 console.log("normalize text");
}

var client = new Discord.Client();

client.on('ready', () =>{

   console.log('Bot on!');

});


client.on('message', msg =>{
  	const input = msg.content.split(' ');
	
	var reqURL='http://www.dnd5eapi.co/api/';
	let category=BLANK;
	
    	if(input[0] === '!spell'){
		reqURL = reqURL.concat('spells/');
		if(input.length > 1 && checkInput(input[1])){
			let indexOfSpace=msg.content.indexOf(' ');
			let unprocessedSpellName = msg.content.substr(indexOfSpace+1); 
			let processedSpellName = unprocessedSpellName.replace(/\s+/g,'-').toLowerCase();
			processedSpellName.toLowerCase();
			reqURL = reqURL.concat(processedSpellName);
			category = SPELL;
		}
		
		else if(input.length === 1 || !checkInput(input[1])){
			category = ERROR;
		}

   	}
   
   	if(input[0] === '!condition'){
		reqURL = reqURL.concat('conditions/');
		if(input.length > 1 && checkInput(input[1])){
			let condName = input[1].toLowerCase();
	   		reqURL = reqURL.concat(condName);
			category = CONDITION;
		}

		else if(input.length === 1 || !checkInput(input[1])){
			category = ERROR;
		}
	}

	if(input[0] === '!skill'){
		
		reqURL = reqURL.concat('skills/');
		if(input.length > 1 && checkInput(input[1])){
			let skillName = input[1].toLowerCase();
			reqURL = reqURL.concat(skillName);
			category = SKILL;

		}

		else if(input.length === 1 || !checkInput(input[1])){
			category = ERROR;
		}

	}

	if(category != BLANK){

		let request = new XMLHttpRequest();
		request.open('GET', reqURL);
	
		request.onload = function(){
			if(this.status == 200){
				
				let data = JSON.parse(this.responseText);

				console.log(data);
				if(category === 3){
					let finalMsg = "roll ";
					let abilityScore = String(data.ability_score.name); 
					console.log(data.ability_score.name);
					finalMsg=finalMsg.concat(abilityScore);
					msg.channel.send(finalMsg);
				}

				else{	
					msg.channel.send(data.desc);
				}
			}
			else{	
			        if(category === SPELL){
				       msg.channel.send("can't find that spell");
				}
				else if(category === CONDITION){
				       msg.channel.send("can't find that condition");
				}

				else if(category === SKILL){
				       msg.channel.send("can't find that skill");
				}
				else if(category === ERROR){
				       msg.channel.send("please use valid input!");

				}
			}
		}	
	
		request.send();

	}

});

client.login(Config.token);

