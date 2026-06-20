import { apiFetch } from "../../../config/apiConfig";

export const sendMessage = async (message, conversationId) => {
  return await apiFetch("/chat", {
    method: "POST", body: JSON.stringify({message, conversationId}) 
  });
};

export const updateConversationTitle = async (id, title) => {
  return await apiFetch( `/chat/conversation/${id}/title`, {
    method: "PUT", body: JSON.stringify(title)
  });
};

export const getHistory = async () => {
  return await apiFetch("/chat/history");
};

export const getCount = async () => {
  return await apiFetch("/chat/count");
};

export const createConversation = async (title) => {
  return await apiFetch("/chat/conversation", {
    method: "POST", body: JSON.stringify({title})
  });
};

export const getConversations = async () => {
  return await apiFetch("/chat/conversations");
};

export const getConversation = async (id) => {
  return await apiFetch(`/chat/conversation/${id}`);
};

export const deleteConversation = async (id) => {
  return await apiFetch(`/chat/conversation/${id}`, {
    method: "DELETE"
  });
};

export const editMessage = async (messageId, newMessage) => {
  return await apiFetch("/chat/message/edit", {
    method: "PUT", body: JSON.stringify({messageId, newMessage})
  });
};