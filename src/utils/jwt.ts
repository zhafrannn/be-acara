import jwt from "jsonwebtoken";
import { SECRET } from "./env";
import { IUserToken } from "./interfaces";

/**
 * Token JWT yang dihasilkan punya 3 bagian utama, dipisah dengan titik (.): header.payload.signature
 * nantinya token tsb akan menjadi string yang sangat panjang yang dipisahkan oleh titik
 * header disini kita menggunakan user dari IUserToken yang memiliki informasi role dan id
 * payload disini kita menggunakan string yang didapat dari random string yang diacak oleh package crypto yang disimpan di .env SECRET
 */
export const generateToken = (user: IUserToken) => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });
  return token;
};
export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
