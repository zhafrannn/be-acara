import { Types } from "mongoose";
import { User } from "../models/user.model";
import { Request } from "express";

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
    | "username"
  > {
  id?: Types.ObjectId;
}

export interface IReqUser extends Request {
  user?: IUserToken;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search: number;
}
