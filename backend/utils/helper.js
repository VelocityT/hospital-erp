import bcrypt from "bcrypt";

export const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
};


export const extractArray = (body, key) => {
  const value = body[key];
  // console.log(body[key]);
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};
