// CRUD operations on chatInfo
// CRUD operations on chat
import { BASE_URL } from "../constants.js";

export const createChatInfo = async (chatReqBody) => {
	try {
    	const response = await fetch(`${BASE_URL}/chatInfo/`, {
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

export const getChatInfo = async (chatName) => {
	try {
		console.log("function reached here")
    	const response = await fetch(`${BASE_URL}/chatInfo/?name=${chatName}`, {
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

export const getChatsInfo = async () => {
	try {
		console.log("function reached here2")
    	const response = await fetch(`${BASE_URL}/chatsInfo/`, {
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

export const updateChatInfo = async (chatReqBody) => {
	try {
    	const response = await fetch(`${BASE_URL}/chatInfo/`, {
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

export const deleteChatInfo = async (chatReqBody) => {
	try {
    	const response = await fetch(`${BASE_URL}/chatInfo/`, {
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