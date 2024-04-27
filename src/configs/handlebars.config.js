import handlebars from "express-handlebars";
import { isEmptyArray, cookieExists } from "../helpers/utils.js";

const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    isEmptyArray: isEmptyArray,
    cookieExists: cookieExists,
  },
});

export default hbs;
