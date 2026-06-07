import { signOut } from "next-auth/react";

const apiFetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
  const res = await fetch(...args);
  if (res.status === 401) {
    await signOut({ callbackUrl: "/signin" });
  }
  return res;
};

export default apiFetch;
