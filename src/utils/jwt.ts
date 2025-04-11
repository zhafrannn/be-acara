import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { SECRET } from "./env";

/**
 * Omit adalah utility type dari TypeScript yang dipakai untuk menghapus properti tertentu dari sebuah tipe.
 * Disini data yang dihilangkan adalah "password" "activationCode" "isActive" "email" "fullName" "profilePicture" "userName" dan hanya menyisakan data "role"
 * Lalu disini juga menambahkan property id secara manual karena _id dari MongoDB biasanya tidak secara eksplisit ditulis di User interface, tapi tetap perlu ada untuk token dalam kasus IUserToken ini.
 * Jadi IuserToken ini hanya mewarisi "role" dan "id"
 */
export interface IUserToken 
    extends Omit<
        User, 
        | "password" 
        | "activationCode" 
        | "isActive" 
        | "email" 
        | "fullName" 
        | "profilePicture" 
        | "userName"
    > {
        id? : Types.ObjectId;
    }

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