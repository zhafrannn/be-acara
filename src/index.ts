import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import router from "./routes/api";
import db from "./utils/database";
import docs from "./docs/route";

async function init () {
    try {
        const result = await db();
        console.log("database status ", result);

        const app = express();

        /**
         * cors : Cross-Origin Resource Sharing
         * Adalah mekanisme keamanan di browser yang mengatur apakah suatu origin (misal dari FE) boleh mengakses origin saat ini.
         * contoh untuk mengizinkan localhost:5000 mengakses routes origin saat ini(localhost:3000)
         * app.use(cors({
            origin: "http://localhost:5000", // hanya izinkan frontend ini
            credentials: true, // kalau kamu pakai cookie/token via header
           }));
         * jika seperti contoh dibawah maka semua origin dapat mengakses routes pada origin saat ini
         */
        app.use(cors())
        app.use(bodyParser.json());

        const PORT = 3000;

        app.get('/', (req, res) => {
            res.status(200).json({
                message: "Server is running!",
                data:null
            });
        });

        app.use('/api', router);

        docs(app);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.log(error);
        
    }
}

init();


