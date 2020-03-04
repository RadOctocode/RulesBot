var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Discord = require('discord.js');
const Config = require('./auth.json'); 

const BLANK = 0;
const CONDITION = 1;
const ERROR = 2;
const SPELL = 3;
const SKILL = 4;

function checkInput(inputtxt){
	var acceptableCharacters = /^[a-z\A-Z\d\-_\s]+$/;
	if(inputtxt != ""){
		if(inputtxt.match(acceptableCharacters)){return true;}
		else{return false;}
	}
	return false;
}

function determineCategory(inputtxt,parameter){
	let indexOfSpace=inputtxt.indexOf(' ');
	let unprocessedName = inputtxt.substr(0,indexOfSpace);
	if(!parameter){
		return ERROR;
	}
	switch(unprocessedName){
		case '!spell':
			return SPELL; 
			break;
		case '!condition':
			return CONDITION;
			break;
		case '!skill':
			return SKILL;
			break;
		default:
			return BLANK;
			
	}

}//return EMUN

function processParameter(inputtxt){
	let indexOfSpace=inputtxt.indexOf(' ');
	let unprocessedName = inputtxt.substr(indexOfSpace+1); 
	let processedName = unprocessedName.replace(/\s+/g,'-').toLowerCase();
	if(checkInput(processedName)){
		return processedName;
	}
	else{
		return "";
	}

}//return cleaned parameter 

var client = new Discord.Client();

client.on('ready', () =>{
   
   console.log('Bot on!');

});


client.on('message', msg =>{
  	const input = msg.content.split(' ');
	
	var reqURL='http://www.dnd5eapi.co/api/';

	let parameter = processParameter(msg.content);
	let category = determineCategory(msg.content,parameter);
	
	if(category != ERROR && category != BLANK){
		switch(category){
			case SPELL:
				reqURL = reqURL.concat('spells/');
				break;

			case SKILL:
				reqURL = reqURL.concat('skills/');
				break;

			case CONDITION:
				reqURL = reqURL.concat('conditions/');
				break;

		}
	
		reqURL = reqURL.concat(parameter);
	}

	if(category != BLANK){

		let request = new XMLHttpRequest();
		request.open('GET', reqURL);
	
		request.onload = function(){
			if(this.status == 200){
				
				let data = JSON.parse(this.responseText);

				console.log(data);
				if(category === SKILL){
					let finalMsg = "roll ";
					let abilityScore = String(data.ability_score.name); 
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

