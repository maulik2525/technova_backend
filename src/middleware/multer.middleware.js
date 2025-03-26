import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/Cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "blog_posts";
    let resourceType = "auto";

    return {
      folder,
      resource_type: resourceType, 
      allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"], 
    };
  },
});

const upload = multer({ storage });

export { upload };




