/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

/**
 * Creates a video element for a new participant
 *
 * @param {String} name - the name of the new participant, to be used as tag
 *                        name of the video element.
 *                        The tag of the new element will be 'video<name>'
 * @return
 */

function Participant(name, sendMessage) {
	this.name = name;
	var container = document.createElement('div');
	container.id = name;
	
	if (document.getElementById('participants')) {
		container.className = isPresentMainParticipant() ? PARTICIPANT_CLASS : PARTICIPANT_MAIN_CLASS;
		var div = document.createElement('div');
		var video = document.createElement('video');
		var rtcPeer;

		container.appendChild(video);
		container.appendChild(div);
		container.onclick = switchContainerClass;
		document.getElementById('participants').appendChild(container);

		div.appendChild(document.createTextNode(name));

		video.id = 'video-' + name;
		video.autoplay = true;
		video.controls = false;
	}
	if (document.getElementById('participants-img')) {
		container.classList.add('image', 'col');
		var img = document.createElement('img');
		img.setAttribute('src',  require("../images/resource/author-1.jpg"));
		img.style.borderRadius = '50%';
		container.appendChild(img);
		
		document.getElementById('participants-img').appendChild(container);
	}

	this.getElement = function() {
		return container;
	}

	this.getVideoElement = function() {
		return video;
	}

	function switchContainerClass() {
		if (container.className === PARTICIPANT_CLASS) {
			var elements = Array.prototype.slice.call(document.getElementsByClassName(PARTICIPANT_MAIN_CLASS));
			elements.forEach(function(item) {
					item.className = PARTICIPANT_CLASS;
				});

				container.className = PARTICIPANT_MAIN_CLASS;
			} else {
			container.className = PARTICIPANT_CLASS;
		}
	}

	function isPresentMainParticipant() {
		return ((document.getElementsByClassName(PARTICIPANT_MAIN_CLASS)).length != 0);
	}

	this.offerToReceiveVideo = function(error, offerSdp, wp){
		if (error) return console.error ("sdp offer error")
		console.log('Invoking SDP offer callback function');
		var msg =  { id : "receiveVideoFrom",
				sender : name,
				sdpOffer : offerSdp
			};
		sendMessage(msg);
	}


	this.onIceCandidate = function (candidate, wp) {
		//   console.log("Local candidate" + JSON.stringify(candidate));
		  
		  var message = {
		    id: 'onIceCandidate',
		    candidate: candidate,
		    name: name
		  };
		  sendMessage(message);
	}

	Object.defineProperty(this, 'rtcPeer', { writable: true});

	this.dispose = function() {
		console.log('Disposing participant ' + this.name);
		if (this.rtcPeer) this.rtcPeer.dispose();
		container.parentNode.removeChild(container);
	};
}

export {
	Participant
}