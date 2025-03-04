import axios from "axios";

export default class ResumeService {
  static async list(data, config) {
    try {
      await new Promise((r) => setTimeout(r, 500));
      const response = await axios.get(`/api/resume/list`, {
        headers: {
          "Accept-Language": config.lang,
          Authorization: `Bearer ${config.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error?.response?.data ?? error;
    }
  }
}
