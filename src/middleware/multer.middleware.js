import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloudinary.js";

// Configure storage to handle both images and videos
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "blog_posts";
    let resourceType = "auto"; // Auto-detect file type (image or video)

    return {
      folder,
      resource_type: resourceType, // Allows images & videos
      allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"], // Add video formats
    };
  },
});

const upload = multer({ storage });

export { upload };






// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import {cloudinary} from "../utils/cloudinary.js";

// // Configure storage to handle both images and videos
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     let folder = "blog_posts";
//     let resourceType = "auto"; // Auto-detect file type (image or video)

//     return {
//       folder,
//       resource_type: resourceType, // Allows images & videos
//       allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"], // Add video formats
//     };
//   },
// });

// const upload = multer({ storage });

// export { upload};