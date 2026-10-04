import type { NextConfig } from "next";
import { basePath } from "./src/content/urls";
const config: NextConfig = {
  basePath,
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
};
export default config;
