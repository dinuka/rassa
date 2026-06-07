import { signOut } from "next-auth/react";

const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const res = await fetch(input, init);
  if (res.status === 401) {
    await signOut({ callbackUrl: "/signin" });
  }
  return res;
};

export default apiFetch;
