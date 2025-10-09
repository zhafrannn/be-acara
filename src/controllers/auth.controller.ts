import { Request, Response } from "express";
import * as Yup from "yup";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

/**
 * TRegister ini untuk mendefinisikan struktur data yang diharapkan dari FE saat nanti melakukan registrasi
 */
type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test(
      "at-least-one-uppercase-letter",
      "Contains at least 1 uppercase letter",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    )
    .test("at-least-one-number", "Contains at least 1 number", (value) => {
      if (!value) return false;
      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password Must Be Matched!"),
});

export default {
  /**
   * Disini req.body mengambil data Request dari FE
   * Lalu, as unknown as digunakan untuk casting agar cocok dengan TRegister
   * as unknown ini memaksa TypeScript ini untuk mempercayai tipe data yang dikirimkan FE sama dengan tipe data TRegister
   */
  async register(req: Request, res: Response) {
    /**
         #swagger.tags = ['Auth']
         #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/components/schemas/RegisterRequest"}
         }
         */
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      /**
       * registerValidateSchema sedang melakukan validasi untuk setiap properti yang nanti didapat dari Request
       * validasi ini menggunakan package Yup
       */
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });

      response.success(res, result, "success registration");
    } catch (error) {
      response.error(res, error, "failed registration");
    }
  },

  async login(req: Request, res: Response) {
    /**
         #swagger.tags = ['Auth']
         #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/components/schemas/LoginRequest"}
         }
         */

    const { identifier, password } = req.body as unknown as TLogin;

    try {
      // Looking for the account
      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
        isActive: true,
      });

      if (!userByIdentifier) {
        return response.unauthorized(res, "user not found");
      }

      // Validate Password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return response.unauthorized(res, "user not found");
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      response.success(res, token, "login success");
    } catch (error) {
      response.error(res, error, "login failed");
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
         #swagger.tags = ['Auth']
         #swagger.security = [{
         "bearerAuth": []
         }]
         */
    try {
      const user = req.user;
      //penggunaan '?' disini agar ketika id dari user tidak ditemukan tidak akan terjadi error, hanya akan menjadi undifined
      const result = await UserModel.findById(user?.id);

      response.success(res, result, "success get user profile");
    } catch (error) {
      response.error(res, error, "failed get user profile");
    }
  },

  async activation(req: Request, res: Response) {
    /**
         #swagger.tags = ['Auth']
         #swagger.requestBody = {
            required: true,
            schema: {$ref: '#/components/schemas/ActivationRequest'}
         }
         */
    try {
      const { code } = req.body as unknown as { code: string };

      const user = await UserModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        },
        {
          new: true,
        }
      );

      response.success(res, user, "user successfully activated");
    } catch (error) {
      response.error(res, error, "user activation failed");
    }
  },
};
