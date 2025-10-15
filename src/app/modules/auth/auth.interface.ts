export type TAuthUser = {
  email: string;
  password: string;
  name: string;
  age: string;
  role: "user" | "admin";
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TUserProfile = {
  id: string;
  email: string;
  name: string;
  age?: string;
  role: "user" | "admin";
  created_at: string;
};
