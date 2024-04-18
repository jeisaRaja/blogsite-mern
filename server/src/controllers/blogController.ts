import { Request, Response } from "express";
import Blog from "../Schema/Blog";
import User from "../Schema/User";
import Notification, { INotification } from "../Schema/Notification";
import Ajv from "ajv";
import Comment from "../Schema/Comment";
import { Types } from 'mongoose';

const ajv = new Ajv()
// Get All Published Blog
export const getRecentBlogs = async (req: Request, res: Response) => {
  const publishedBlogs = await Blog.find({ draft: false }).populate({
    path: "author",
    select: "personal_info.username personal_info.email personal_info.profile_img"
  })
  const recentBlogs = publishedBlogs.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  res.status(200).json(recentBlogs)
}

// /all/blogs
// /category/blogs

// Get One Blog Details
export const getOneBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params
    const blog = await Blog.findOne({ blog_id: blogId }).populate({
      path: 'author',
      select: 'personal_info.username personal_info.profile_img'
    }).populate({
      path: 'comments',
      match: { isReply: false },
      populate: [{
        path: 'commented_by',
        select: 'personal_info.username personal_info.profile_img'
      }, {
        path: 'children',
        populate: {
          path: 'commented_by',
          select: 'personal_info.username personal_info.profile_img'
        }
      }],
    })
    if (!blog) {
      return res.status(400).json("blog not found")
    }
    blog.activity!.total_reads += 1
    await blog.save()
    if (!req.session.user) {
      return res.json({ blog, like: false })
    }
    const user = await User.findById(req.session.user._id)
    if (!user) {
      return res.json({ blog, like: false })

    }
    const likeStatus = await Notification.findOne({ type: 'like', blog: blog._id, user: user._id })
    if (!likeStatus) {
      return res.json({ blog, like: false })
    }
    return res.json({ blog, like: true })
  } catch (e) {
    return res.status(400).json("blog not found")
  }
}

export const toggleLikeBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params
    const blog = await Blog.findOne({ blog_id: blogId })
    if (!blog) {
      return res.status(400).json({ error: "blog not found" })
    }
    const user = await User.findById(req.session.user?._id)
    if (!user) {
      return res.status(400).json({ error: "user invalid" })
    }
    const likeStatus = await Notification.findOne({ type: 'like', blog: blog._id, user: user._id })
    if (!likeStatus) {
      const notificationObj: INotification = {
        type: 'like',
        blog: blog._id,
        user: user._id,
        notification_for: blog.author._id
      }
      const notification = await Notification.create(notificationObj)
      if (blog.activity && blog.activity.total_likes !== undefined) {
        blog.activity.total_likes += 1;
        await blog.save()
      }
      return res.status(200).json({ success: "ok", notification })
    }
    await Notification.deleteOne({ _id: likeStatus._id });
    if (blog.activity && blog.activity.total_likes !== undefined) {
      blog.activity.total_likes -= 1;
      await blog.save()
    }
    return res.status(200).json({ success: "ok" })
  } catch (e) {
    const error: Error = e as Error
    console.log(error.name)
    return res.status(400).json({ error: error.message })
  }
}

export const getLike = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params
    const blog = await Blog.findOne({ blog_id: blogId })
    if (!blog) {
      return res.status(400).json({ error: "blog not found" })
    }
    const user = await User.findById(req.session.user?._id)
    if (!user) {
      return res.status(400).json({ error: "user invalid" })
    }
    const likeStatus = await Notification.findOne({ type: 'like', blog: blog._id, user: user._id })
    let like = false
    if (likeStatus) {
      like = true
    }
    res.status(200).json({ like })
  } catch (e) {
    const error: Error = e as Error
    return res.status(400).json({ error: error.message })
  }
}
// Get Blogs by filter

// Comment
interface Comment {
  blog_id: string;
  blog_author: string;
  comment: string;
  children: string[];
  commented_by: string;
  isReply?: boolean;
  parent?: string;
}


const validateCommentSchema = ajv.compile({
  type: "object",
  properties: {
    blog_id: { type: "string" },
    comment: { type: "string" },
    commented_by: { type: "string" },
    isReply: { type: "boolean" },
    parent: { type: "string" }
  },
  required: ["blog_id", "comment", "commented_by"],
  additionalProperties: false
})

interface CommentRequestBody {
  blog_id: string;
  comment: string;
  commented_by: string;
  isReply?: boolean;
  parent?: string;
}


export const addComment = async (req: Request, res: Response) => {
  const requestBody = req.body as CommentRequestBody;
  if (!validateCommentSchema(requestBody)) {
    return res.status(400).json({ error: 'invalid input' })
  }

  try {
    const blog = await Blog.findOne({ blog_id: req.body.blog_id })
    if (!blog) {
      return res.status(400).json({ error: 'no blog found' })
    }

    const newComment = {
      blog_id: blog?.id,
      comment: req.body.comment,
      commented_by: req.body.commented_by,
      blog_author: blog?.author,
      isReply: Boolean(requestBody.isReply),
      parent: Boolean(requestBody.isReply) ? requestBody.parent : undefined
    }

    const comment = await Comment.create(newComment)
    blog.comments?.push(comment._id as Types.ObjectId)
    if (blog.activity) {
      blog.activity.total_comments += 1
    }
    if (comment.isReply) {
      await Comment.findByIdAndUpdate(
        comment.parent,
        { $push: { children: comment._id } },
        { new: true }
      );
    }
    await blog.save()
    const populatedComment = await comment.populate({
      path: 'commented_by',
      select: "personal_info.username personal_info.email personal_info.profile_img"
    })
    return res.status(200).json({ success: 'comment added', comment: populatedComment })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export const getBlogsByAuthor = async (req: Request, res: Response) => {
  const { user_id } = req.params
  const blogs = await Blog.find({ author: user_id, draft: false })
  return res.status(200).json({blogs})
}
