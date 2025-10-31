import swaggerAutogen from "swagger-autogen";

// ini adalah konfigurasi dari swagger nya
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
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "sjw2025@yopmail.com",
        password: "Asdqwe123",
      },
      RegisterRequest: {
        fullName: "Sung Jin Woo",
        username: "sungjinwoo",
        email: "sjw2024@yopmail.com",
        password: "Asdqwe123",
        confirmPassword: "Asdqwe123",
      },
      ActivationRequest: {
        code: "abcdef",
      },
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        banner: "fileUrl",
        category: "category ObjectID",
        description: "",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: "region id",
          coordinates: [0, 0],
          address: "",
        },
        isOnline: false,
        isFeatured: false,
        isPublish: false,
      },
      CreateBannerRequest: {
        title: "Banner - Title",
        image: "banner - imageUrl",
        isShow: false,
      },
      CreateTicketRequest: {
        price: 0,
        name: "Ticket - name",
        events: "6903f0c152819c548ec74538",
        description: "Ticket - description",
        quantity: 0,
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
    },
  },
};

/**
 * ouputFile ini adalah file yang nanti akan dibaca oleh swagger
 * sifatnya generated tidak perlu diubah secara manual
 * */
const outputFile = "./swagger_output.json";

// untuk membaca ada endpoint apa saja di api.ts
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);

/**
 * ketika dijalankan npm run docs
 * maka akan menjalankan docs yang telah diatur sebelumnya di package.json yang mengarah ke file ini yang dimana adalah konfigurasi swagger
 * lalu setelah itu akan muncul file bernama swagger_output.json
 */
