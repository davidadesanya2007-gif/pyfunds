import { supabase } from "../supabase";

export const getCurrentUser = async () => {

  const {
    data:{ user }
  } = await supabase.auth.getUser();

  if(!user) return null;

  const { data, error } =
    await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

  if(error){

    console.log(error);
    return null;

  }

  return data;

};