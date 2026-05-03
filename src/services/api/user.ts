import api from "../../libs/configApi";

export type UserProfile = {
  id: string;
  display_name: string;
  username: string;
  email: string;
  created_at: string;
};

export async function getMe(): Promise<UserProfile> {
  return api.get<UserProfile>("api/v1/me");
}
