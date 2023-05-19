import axios from "axios";

import { typesApi } from "./shared/constants/Phone";
import { errors } from "./shared/constants/errors";

const axiosInstance = axios.create({
  baseURL: "https://api.green-api.com/",
});

const GreenApiAPI = {
  sendMessage: async (
    recipientNumber: string,
    message: string,
    idInstance: string,
    apiTokenInstance: string
  ) => {
    const url = `waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const data = {
      chatId: `${recipientNumber}${typesApi.endingsPhonePersonal}`,
      message: message,
    };

    try {
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || errors.FAILED_SEND_MESSAGE
      );
    }
  },

  getStatusInstance: async (idInstance: string, apiTokenInstance: string) => {
    try {
      const url = `waInstance${idInstance}/getStatusInstance/${apiTokenInstance}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || errors.ERROR_AUTHORIZED);
    }
  },

  getChats: async (idInstance: string, apiTokenInstance: string) => {
    try {
      const url = `waInstance${idInstance}/getChats/${apiTokenInstance}`;
      const response = await axiosInstance.post(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || errors.FAILED_GET_CHATS);
    }
  },

  checkedMessage: async (
    idInstance: string,
    apiTokenInstance: string,
    recipientNumber: string
  ) => {
    try {
      const url = `waInstance${idInstance}/ReadChat/${apiTokenInstance}`;
      const data = {
        chatId: `${recipientNumber}${typesApi.endingsPhonePersonal}`,
      };
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || errors.FAILED_GET_NOTIFICATION
      );
    }
  },

  getNotification: async (idInstance: string, apiTokenInstance: string) => {
    try {
      const url = `waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || errors.FAILED_GET_NOTIFICATION
      );
    }
  },

  deleteNotification: async (
    idInstance: string,
    apiTokenInstance: string,
    receiptId: number
  ) => {
    try {
      const url = `waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || errors.FAILED_DELETE_NOTIFICATION
      );
    }
  },

  getSettingsProfile: async (idInstance: string, apiTokenInstance: string) => {
    try {
      const url = `waInstance${idInstance}/GetSettings/${apiTokenInstance}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || errors.FAILED_GET_SETTINGS_PROFILE
      );
    }
  },

  checkPhone: async (
    idInstance: string,
    apiTokenInstance: string,
    recipientNumber: string
  ) => {
    const url = `waInstance${idInstance}/CheckWhatsapp/${apiTokenInstance}`;
    try {
      const response = await axiosInstance.post(url, {
        phoneNumber: recipientNumber,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || errors.USER_NOT_FOUND);
    }
  },

  getMessages: async (
    recipientNumber: string,
    idInstance: string,
    apiTokenInstance: string
  ) => {
    const url = `waInstance${idInstance}/GetChatHistory/${apiTokenInstance}`;
    const data = {
      chatId: `${recipientNumber}@c.us`,
      count: 20,
    };

    try {
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || errors.FAILED_GET_MESSAGE
      );
    }
  },
};

export { GreenApiAPI };
