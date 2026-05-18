import { useMutation, useQuery } from "@tanstack/react-query";
import { useClerk } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
  const { getToken } = useClerk();

  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: async (data) => {
      const token = await getToken();
      return sessionApi.createSession(data, token);
    },
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error) => {
      console.error("Create session error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to create room");
    },
  });

  return result;
};

export const useActiveSessions = () => {
  const { getToken } = useClerk();

  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: async () => {
      const token = await getToken();
      return sessionApi.getActiveSessions(token);
    },
  });

  return result;
};

export const useMyRecentSessions = () => {
  const { getToken } = useClerk();

  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: async () => {
      const token = await getToken();
      return sessionApi.getMyRecentSessions(token);
    },
  });

  return result;
};

export const useSessionById = (id) => {
  const { getToken } = useClerk();

  const result = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const token = await getToken();
      return sessionApi.getSessionById(id, token);
    },
    enabled: !!id,
    refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
  });

  return result;
};

export const useJoinSession = () => {
  const { getToken } = useClerk();

  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: async (id) => {
      const token = await getToken();
      return sessionApi.joinSession(id, token);
    },
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) => {
      console.error("Join session error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to join session");
    },
  });

  return result;
};

export const useEndSession = () => {
  const { getToken } = useClerk();

  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: async (id) => {
      const token = await getToken();
      return sessionApi.endSession(id, token);
    },
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) => {
      console.error("End session error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to end session");
    },
  });

  return result;
};
