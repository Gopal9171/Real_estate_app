import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (!res.headersSent){
    return res.status(200).json(users);
    }
  } catch (err) {
    console.log(err);
    if (!res.headersSent){
    return res.status(500).json({ message: "Failed to get users!" });
    }
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!res.headersSent){
    return res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
    if (!res.headersSent){
    return  res.status(500).json({ message: "Failed to get user!" });
    }
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    return res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete users!" });
  }
};

// export const savePost = async (req, res) => {
//   const postId = req.body.postId;
//   const tokenUserId = req.userId;

//   try {
//     const savedPost = await prisma.savedPost.findUnique({
//       where: {
//         userId_postId: {
//           userId: tokenUserId,
//           postId,
//         },
//       },
//     });

//     if (savedPost) {
//       await prisma.savedPost.delete({
//         where: {
//           id: savedPost.id,
//         },
//       });
//       return res.status(200).json({ message: "Post removed from saved list" });
//     } else {
//       await prisma.savedPost.create({
//         data: {
//           userId: tokenUserId,
//           postId,
//         },
//       });
//       return res.status(200).json({ message: "Post saved" });
//     }
//   } catch (err) {
//     console.log(err);
//     if (!res.headersSent) { // Ensure headers haven't been sent
//       return res.status(500).json({ message: "Failed to process request!" });
//     }
// };
export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    console.log(`User ID: ${tokenUserId}, Post ID: ${postId}`);

    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      console.log(`Found saved post. Deleting: ${savedPost.id}`);
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      if (!res.headersSent) { // Ensure headers haven't been sent
        return res.status(200).json({ message: "Post removed from saved list" });
      }
    } else {
      console.log(`Post not found. Creating new saved post.`);
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      if (!res.headersSent) { // Ensure headers haven't been sent
        return res.status(200).json({ message: "Post saved" });
      }
    }
  } catch (err) {
    console.error('Error occurred:', err);
    if (!res.headersSent) { // Ensure headers haven't been sent
      return res.status(500).json({ message: "Failed to process request!" });
    }
  }
};

//////////////////////Error Vala Code////////////////////////////////

// export const profilePosts = async (req, res) => {
//   //take a user id 
//   console.log("iniside: route func")
//   const tokenUserId = req.params.userId;
//   try {
//     const userPosts = await prisma.post.findMany({
//       where: { userId: tokenUserId },
//     });
//     const saved = await prisma.savedPost.findMany({
//       where: { userId: tokenUserId },
//       include: {
//         post: true,
//       },
//     });

//     const savedPosts = saved.map((item) => item.post);
//     if (!res.headersSent){
//    return res.status(200).json({ userPosts, savedPosts });
//     }
//   } catch (err) {
//     console.log(err);
//     if (!res.headersSent){
//     return res.status(500).json({ message: "Failed to get profile posts!" });
//     }
//   }
// };
//////////////////////////////////////////////////////////////////////////

/////////////////New Updated Code ///////////////////////////////////


export const profilePosts = async (req, res) => {
  const tokenUserId = req.params.userId;

  try {
    console.log("Inside route function");

    // Fetch posts by the user
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });

    // Fetch saved posts by the user
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    // Map saved posts to get the post details
    const savedPosts = saved.map((item) => item.post);

    if (!res.headersSent) {
      return res.status(200).json({ userPosts, savedPosts });
    }
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Failed to get profile posts!" });
    }
  }
};


///////////////////////////////////////////////////////////////////
// export const getNotificationNumber = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//     const number = await prisma.chat.count({
//       where: {
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//         NOT: {
//           seenBy: {
//             hasSome: [tokenUserId],
//           },
//         },
//       },
//     });
//     res.status(200).json(number);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get profile posts!" });
//   }
// };