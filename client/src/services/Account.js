import axios from "axios";

export default class AccountService {
  static async googleAuth(data, config) {
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const response = await axios.post(
        `/api/account/google-auth`,
        {
          google_access_token: data.access_token,
        },
        { headers: { "Accept-Language": config.lang } }
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data ?? error;
    }
  }

  static async register(data, config) {
    try {
      await new Promise((r) => setTimeout(r, 500));
      const response = await axios.post(
        `/api/account/register`,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
        },
        { headers: { "Accept-Language": config.lang } }
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data ?? error;
    }
  }

  static async login(data, config) {
    try {
      await new Promise((r) => setTimeout(r, 500));
      const response = await axios.post(
        `/api/account/login`,
        {
          email: data.email,
          password: data.password,
        },
        { headers: { "Accept-Language": config.lang } }
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data ?? error;
    }
  }

  static async checkAuth(data, config) {
    try {
      await new Promise((r) => setTimeout(r, 500));
      const response = await axios.get(
        `http://127.0.0.1:3000/api/account/check-auth`,
        {
          headers: {
            "Accept-Language": config.lang,
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error?.response?.data ?? error;
    }
  }
}
