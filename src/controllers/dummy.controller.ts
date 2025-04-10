import { Request, Response } from "express"; // Karena menggunakan TS jadi wajib mencantumkan Tipe Data

export default {
    dummy(req: Request, res: Response) {
        res.status(200).json({
            message: "Success Hit Endpoint /dummy -hasil",
            data: "OK"
        })
    },
};