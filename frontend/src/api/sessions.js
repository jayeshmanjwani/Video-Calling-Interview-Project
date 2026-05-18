import axiosInstance from "../lib/axios";

const authHeaders = (token) => ({
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

export const sessionApi = {
  createSession: async (data, token) => {
    const response = await axiosInstance.post("sessions", data, authHeaders(token));
    return response.data;
  },

  getActiveSessions: async (token) => {
    const response = await axiosInstance.get("sessions/active", authHeaders(token));
    return response.data;
  },
  getMyRecentSessions: async (token) => {
    const response = await axiosInstance.get("sessions/my-recent", authHeaders(token));
    return response.data;
  },

  getSessionById: async (id, token) => {
    const response = await axiosInstance.get(`sessions/${id}`, authHeaders(token));
    return response.data;
  },

  joinSession: async (id, token) => {
    const response = await axiosInstance.post(`sessions/${id}/join`, null, authHeaders(token));
    return response.data;
  },
  endSession: async (id, token) => {
    const response = await axiosInstance.post(`sessions/${id}/end`, null, authHeaders(token));
    return response.data;
  },
  getStreamToken: async (token) => {
    const response = await axiosInstance.get(`chat/token`, authHeaders(token));
    return response.data;
  },
};
