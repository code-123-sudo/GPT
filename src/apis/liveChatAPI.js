// CRUD operations on chat
import { BASE_URL } from "../constants.js";

export const createLiveChat = async (chatReqBody) => {
	try {
    	const response = await fetch(`${BASE_URL}/liveChat/`, {
        	method: "POST",
        	mode: "cors",
        	cache: "no-cache",
        	headers: {
          		"Content-Type": "application/json",
        	},
        	body: JSON.stringify(chatReqBody),
      	});
      	const data = await response.json();
      	return data;
    } catch (error) {
      	const resMessage = error.message || error.detail || error.toString();
    }
};

export const getLiveChat = async () => {
	try {
		console.log("function reached here2")
    	const response = await fetch(`${BASE_URL}/liveChat/`, {
        	method: "GET",
        	mode: "cors",
        	cache: "no-cache",
        	headers: {
          		"Content-Type": "application/json",
        	},
      	});
      	console.log("function ")
      	const data = await response.json();
      	return data;
    } catch (error) {
      	const resMessage = error.message || error.detail || error.toString();
    }
};

export const updateLiveChat = async (chatReqBody) => {
	try {
    	const response = await fetch(`${BASE_URL}/liveChat/`, {
        	method: "PUT",
        	mode: "cors",
        	cache: "no-cache",
        	headers: {
          		"Content-Type": "application/json",
        	},
        	body: JSON.stringify(chatReqBody),
      	});
      	const data = await response.json();
      	console.log(data)
      	return data;
    } catch (error) {
      	const resMessage = error.message || error.detail || error.toString();
    }
};

export const deleteLiveChat = async (chatReqBody) => {
	try {
    	const response = await fetch(`${BASE_URL}/liveChat/`, {
        	method: "DELETE",
        	mode: "cors",
        	cache: "no-cache",
        	headers: {
          		"Content-Type": "application/json",
        	},
        	body: JSON.stringify(chatReqBody),
      	});
      	const data = await response.json();
      	return data;
    } catch (error) {
      	const resMessage = error.message || error.detail || error.toString();
    }
};