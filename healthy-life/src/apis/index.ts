import axios from "axios";
import { FIND_ID_BY_TOKEN, MAIL_PATH, RECOVERY_EMAIL } from "../constants";

export const sendEmailForId = async (email: string) => {
  const response = await axios.post(`${MAIL_PATH}${RECOVERY_EMAIL}`, {
    email,
  });
  return response.data.data;
};

export const sendEmailForPw = async (email: string, username: string) => {
  const response = await axios.post(`${MAIL_PATH}${RECOVERY_EMAIL}`, {
    email,
    username,
  });
  return response.data.data;
};

export const FetchIdByToken = async (token: string) => {
  const response = await axios.get(`${MAIL_PATH}${FIND_ID_BY_TOKEN(token)}`);
  return response.data.data;
};