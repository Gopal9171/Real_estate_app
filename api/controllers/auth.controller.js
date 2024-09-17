import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
export const register = async (req, res) => {
    //     const {username, email, password}= req.body;
    //    console.log({username, email, password})
    //     // hash the password
    // const hashedPassword  = await bcrypt.hash(password,10);
    // console.log("hashed Password" ,hashedPassword);

    //     //create a new user and save to data base 

    //     const newUser= await prisma.user.create({
    //         data:{
    //           username,
    //           email,
    //           password:hashedPassword,
    //         },
    //     });
    //     console.log(newUser);
    // const { username, email, password } = req.body;

    // // Basic validation
    // if (!username || !email || !password) {
    //     return res.status(400).json({ error: "All fields are required" });
    // }

    // try {
    //     console.log({ username, email, password });

    //     // Hash the password
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     console.log("Hashed Password:", hashedPassword);

    //     // Create a new user and save to the database
    //     const newUser = await prisma.user.create({
    //         data: {
    //             username,
    //             email,
    //             password: hashedPassword,
    //         },
    //     });

    //     console.log(newUser);
    //     res.status(201).json(newUser); // Respond with the newly created user

    // } catch (error) {
    //     console.error("Error creating user:", error);
    //     if (error.code === "P2002") { // Prisma error code for unique constraint violation
    //         return res.status(400).json({ error: "Email already exists" });
    //     }
    //     res.status(500).json({ error: "An error occurred while creating the user" });
    // }
    const { username, email, password } = req.body;

    try {
        // HASH THE PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE A NEW USER AND SAVE TO DB
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        if (err.code === 'P2002') {
            // P2002 is the error code for unique constraint violations
            const duplicatedField = err.meta.target;
            return  res.status(409).json({ message: `The ${duplicatedField} is already in use.` });
        } else {
            // Log and return a generic error for other cases
            console.log(err);
            return res.status(500).json({ message: "Failed to create user!" });
        }
    }



}
export const login = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    try {
        // CHECK IF USER EXISTS
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            if (!res.headersSent) { // Ensure headers haven't been sent
                return res.status(400).json({ message: "Invalid Credentials!" });
            }
        }

        // CHECK IF THE PASSWORD IS CORRECT
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            if (!res.headersSent) { // Ensure headers haven't been sent
                return res.status(400).json({ message: "Invalid Credentials!" });
            }
        }

        const age = 1000 * 60 * 60 * 24 * 7; // Cookie age

        const token = jwt.sign(
            {
                id: user.id,
                isAdmin: false,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
        );

        const { password: userPassword, ...userInfo } = user;

        // Set cookie and respond
        return res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
        }).status(200).json(userInfo);

    } catch (err) {
        console.error('Error occurred:', err);
        if (!res.headersSent) { // Ensure headers haven't been sent
            return res.status(500).json({ message: "Failed to login" });
        }
    }
};


export const logout = (req, res) => {

    return res.clearCookie("token").status(200).json({ message: 'Logout Successful' });

}