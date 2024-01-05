// CRUD operations on chat
import { BASE_URL } from "../constants.js";

export const createChat = async (chatReqBody) => {
	try {
    	const response = await fetch(`${BASE_URL}/chat/`, {
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

export const getChat = async (chatName) => {
	try {
		console.log("function reached here")
    	const response = await fetch(`${BASE_URL}/chat/?name=${chatName}`, {
        	method: "GET",
        	mode: "cors",
        	cache: "no-cache",
        	headers: {
          		"Content-Type": "application/json",
        	}
      	});
      	console.log("response is ",response)
      	const data = await response.json();
      	return data;
    } catch (error) {
      	const resMessage = error.message || error.detail || error.toString();
    }
};

export const getChats = async () => {
	try {
		console.log("function reached here2")
    	const response = await fetch(`${BASE_URL}/chats/`, {
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

export const updateChat = async (chatReqBody) => {
	try {
    	const response = await fetch(`${BASE_URL}/chat/`, {
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

export const deleteChat = async (chatName) => {
	try {
    	const response = await fetch(`${BASE_URL}/chat/?name=${chatName}`, {
        	method: "DELETE",
        	mode: "cors",
        	cache: "no-cache",
        	headers: {
          		"Content-Type": "application/json",
        	},
      	});
      	const data = await response.json();
      	return data;
    } catch (error) {
      	const resMessage = error.message || error.detail || error.toString();
    }
};