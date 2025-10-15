import supabase from "../../config/supabaseClient";
import { TAuthUser, TLoginData } from "./auth.interface";
import { config } from "../../config/env";

/**
 * Create new user with auth and profile
 */
const createUser = async (userData: TAuthUser) => {
  const { email, password, name, age, role } = userData;

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // 2. Create user profile in database
  if (authData.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: authData.user.email,
      name: name,
      age: age,
      role: role,
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      throw new Error("Failed to create user profile");
    }
  }

  return {
    user: authData.user,
    message: "User created successfully",
  };
};

/**
 * Login user with email and password
 */
const loginUser = async (loginData: TLoginData) => {
  const { email, password } = loginData;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Get user profile data
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
  }

  return {
    session: {
      ...data.session,
      user: data.user,
      userProfile: userProfile,
    },
    user: data.user,
  };
};

/**
 * Initiate Google OAuth login
 */
const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${config.backendUrl}/auth/callback/google`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { url: data.url };
};

/**
 * Initiate Facebook OAuth login
 */
const loginWithFacebook = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${config.backendUrl}/auth/callback/facebook`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { url: data.url };
};

/**
 * Handle OAuth callback and create user profile if needed
 */
const handleOAuthCallback = async (code: string) => {
  // Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    throw new Error("Failed to exchange code for session");
  }

  // Check if user profile exists in database
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching user:", fetchError);
  }

  // Create user profile if it doesn't exist
  if (!existingUser) {
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email,
      name:
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.name ||
        data.user.user_metadata?.display_name ||
        "User",
      role: "student",
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Error creating user profile:", profileError);
    }
  }

  return {
    session: data.session,
    user: data.user,
  };
};

/**
 * Delete user (requires admin service key)
 */
const deleteUser = async (userId: string) => {
  // @ts-ignore
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: "User deleted successfully" };
};

export const AuthServices = {
  createUser,
  loginUser,
  loginWithGoogle,
  loginWithFacebook,
  handleOAuthCallback,
  deleteUser,
};
