import supabase from "../utils/supabase";
import { Pet } from "../types";

export const petService = {
  async getPets(): Promise<Pet[]> {
    const { data, error } = await supabase.from("pets").select("*");
    if (error) throw new Error(error.message);
    return data;
  },

  async getPetById(id: string): Promise<Pet | null> {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  },

  async createPet(pet: Omit<Pet, "id" | "created_at">): Promise<Pet> {
    const { data, error } = await supabase
      .from("pets")
      .insert([
        {
          name: pet.name,
          species: pet.species,
          breed: pet.breed || null, // Optional field
          age: pet.age,
          owner_id: pet.owner_id, // Required field
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updatePet(
    id: string,
    updates: Partial<Omit<Pet, "id" | "created_at">>
  ): Promise<Pet> {
    const { data, error } = await supabase
      .from("pets")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deletePet(id: string): Promise<void> {
    const { error } = await supabase.from("pets").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
