import swaggerAutogen from "swagger-autogen";


const doc = {
    info: {
        version: "v0.0.1",
        title: "API Documentation Event",
        description: "API Documentation Event",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server",
        },
        {
            url: "https://be-acara-theta.vercel.app/api",
            description: "Deploy Server",
        },
    ],
    components: {
        securitySchemes : {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest: {
                identifier: "zhafran848@mail.com",
                password: "123hafran",
            },
        },
    },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)