import Post from "../models/post.model.js";
// import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { errorHandler } from "../utils/error.js";

import path from "path"; // Import path for file extension extraction

export const createPost = async (req, res, next) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Please provide all required fields"));
    }
    console.log(req.body);
    // Generate slug
    const slug = req.body.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, ""); // Remove special characters

    // Cloudinary or Multer file URL
    const blogPostUrl = req.file?.path || "";
    const mediaType = blogPostUrl ? path.extname(blogPostUrl).toLowerCase() : "";

    // Create new post
    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
      image: blogPostUrl,
      mediaType, // Store extracted file type
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.log(error);
    next(error);
  }
};


export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      // ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }

  try {
    const localBlogPostFile = req?.file?.path;
    const isBlogPostExits = await Post.findById(
      req.params.postId
    );

    console.log("req.body",req.body)

    if(!isBlogPostExits){
      return next(errorHandler(403, "Blog post does not exist!"));
    }

    let blogPostUrl;
    if (localBlogPostFile) {
      const uploadBlogPost = await uploadOnCloudinary(localBlogPostFile);
      console.log("blogPostUrl", uploadBlogPost);
      blogPostUrl = uploadBlogPost.url;
    }

    const updatedBlogPostPayload = {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: blogPostUrl ? blogPostUrl : isBlogPostExits.image,
    }

    console.log("updatedBlogPostPayload",updatedBlogPostPayload);

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          updatedBlogPostPayload
        },
      },
      { new: true }
    );

    console.log("updatedPost",updatedPost)
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
