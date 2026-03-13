import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    url: "postgresql://postgres:wshzoro@localhost:5432/rncpapp?schema=public",
  },
});
