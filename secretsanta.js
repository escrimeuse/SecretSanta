document.addEventListener('DOMContentLoaded', function main() {
	
	/*
	This function adds another participant field to the form
	*/
	function addPerson() {
		numParticipants++;	// adding a new person, so increment the number of participants
		
		// now we will create new HTML elements to add to the page
		
		var newLabel = document.createElement('label');
		newLabel.setAttribute('for','person'+numParticipants);
		
		var labelText = document.createTextNode('Name');
		newLabel.appendChild(labelText);
		
		var newTextInput = document.createElement('input');
		newTextInput.setAttribute('id','person'+numParticipants);
		newTextInput.setAttribute('type','text');
		
		var newRemoveButton = document.createElement('a');
		newRemoveButton.setAttribute('id','remove_p'+numParticipants);
		var removeText = document.createTextNode('Remove');
		newRemoveButton.appendChild(removeText);
		newRemoveButton.addEventListener('click',removePerson);
		
		var newParagraph = document.createElement('p');
		newParagraph.setAttribute('id','p'+numParticipants);
		newParagraph.appendChild(newLabel);
		newParagraph.appendChild(newTextInput);
		newParagraph.appendChild(newRemoveButton);
		document.getElementById("participants").appendChild(newParagraph);
		
	}
	
	/*
	This function removes the selected participant from the form
	*/
	function removePerson() {
		var pToRemove = this.id.replace('remove_','');
		var pToRemove = document.getElementById(pToRemove);
		pToRemove.parentNode.removeChild(pToRemove);
	}
		
	
	/*
	This function pairs up all the participants into givers and receivers
	*/
	function getPairs() {
		
		// first let's get all our participants from the form
		var participants = document.forms["secretsanta"];
		var index=0;
		var participantArray = [];
		while(index<participants.length) {
			// this loops through all the participants and adds them to our array
			participantArray[index]=document.forms["secretsanta"][index].value;
			console.log(participantArray[index]);
			index++;
		}
		
		/* 
		Now we're going to randomly select a pairing for each person. 
		The rules for pairings are as follows:
		- a participant cannot be paired with themselves (i.e.: Person A cannot be the secret santa for Person A)
		- a participant cannot be paired more than once (i.e.: Person A and Person B cannot both be the secret santa for Person C)
		- every participant must be paired 
		*/
		var shuffledParticipants = shuffle(participantArray);
		var count = 0;
		var pairings = {};
		while (count < participantArray.length) {
			var giver = participantArray[count];
			var receiver = shuffledParticipants.pop();
			
			if (giver == receiver) {
				var temp = receiver;
				receiver = shuffledParticipants.pop();
				shuffledParticipants.push(temp);
				
			} 
			
			pairings[giver]=receiver;
			
			count++;
			
		}
		console.log(pairings);
		
		return pairings;
		
	}

	/*source of the shuffle function: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	NOTE: I added code so that this function does NOT change the array being passed as an argument. Instead, it makes a copy
	of said array (which is then called shuffledArray), and then shuffles and returns shuffledArray.
	*/
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		var shuffledArray = [];
		
		var index=0;
		while(index<array.length) {
			shuffledArray[index]=array[index];
			index++;
		}

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = shuffledArray[currentIndex];
			shuffledArray[currentIndex] = shuffledArray[randomIndex];
			shuffledArray[randomIndex] = temporaryValue;
		}

		return shuffledArray;
	}	

	/*
	This function displays all the giver/receiver pairings in the browser
	*/
	function displayPairs() {
		var pairs = getPairs();
		var displayArea = document.getElementById("pairings");
		displayArea.innerHTML = ''; 
		
		for (key in pairs) {
			var text = document.createTextNode(key + ' will give to ' + pairs[key]);
			var newNode = document.createElement('p');
			newNode.appendChild(text);
			displayArea.appendChild(newNode);
		}
		
		
	}
	
	/*
	This function displays the message passed as an argument to the browser
	*/
	function displayValidationError(themessage) {
		var displayArea = document.getElementById("pairings");
		displayArea.innerHTML = ''; 

		var text = document.createTextNode(themessage);
		var newNode = document.createElement('p');
		newNode.appendChild(text);
		displayArea.appendChild(newNode);
	}
	
	/*
	This function validates form input. If the input is valid, then it proceeds with creating/displaying pairs (by calling displayPairs())
	*/
	function validate() {
		var participants = document.forms["secretsanta"];
		
		if (participants.length > 1) {
			
			// we check that all fields have something entered in them
			var count = 0;
			var emptyFields = false;
		
			while (count < participants.length) {
				
				if (!document.forms["secretsanta"][count].value.trim()) { 
					emptyFields = true;
					break;
				}
				count++;
			}
			
			if (emptyFields) {
				displayValidationError("You have empty fields");
				return;
			}
			
		
		
				
		} else {
			displayValidationError('You must have 2 or more participants');
			return;
		}
		
		// if everything is valid, then we proceed with creating/displaying pairs
		displayPairs();
		

	}
		
	var numParticipants=3;
	
	document.getElementById("addmore").addEventListener("click",addPerson);
	document.getElementById("remove_p1").addEventListener("click",removePerson);
	document.getElementById("remove_p2").addEventListener("click",removePerson);
	document.getElementById("remove_p3").addEventListener("click",removePerson);
	document.getElementById("pair").addEventListener("click",validate);
	
});