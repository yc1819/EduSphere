// src/storage/studyMaterialStorage.js
const STUDY_KEY = "study_materials";

/* Get all study materials */
export const getAllMaterials = () => {
  const data = localStorage.getItem(STUDY_KEY);
  return data ? JSON.parse(data) : [];
};

/* Add new study material */
export const addMaterial = (material) => {
  const materials = getAllMaterials();
  materials.push({ id: Date.now(), ...material });
  localStorage.setItem(STUDY_KEY, JSON.stringify(materials));
};

/* Delete a material */
export const deleteMaterial = (id) => {
  let materials = getAllMaterials();
  materials = materials.filter((m) => m.id !== id);
  localStorage.setItem(STUDY_KEY, JSON.stringify(materials));
};
