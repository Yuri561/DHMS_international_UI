import User from "../models/User.js";
import bcrypt from "bcrypt";

const loginUser = async (req, res) => {
  try {
    const body = req.body?.data || req.body || {};
    const username = body.username?.trim();
    const password = body.password;
    // make role optional unless you truly need it to login:
    const role = body.role;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username: new RegExp(`^${username}$`, "i") });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid username or password" });

    req.session.regenerate(err => {
      if (err) {
        console.error("session regenerate error:", err);
        return res.status(500).json({ message: "Login failed" });
      }

      req.session.userId = user._id.toString();
      req.session.username = user.username;
      req.session.role = user.role; // don’t trust the client-sent role

      req.session.save(saveErr => {
        if (saveErr) {
          console.error("session save error:", saveErr);
          return res.status(500).json({ message: "Login failed" });
        }

        return res.status(200).json({
          message: "Login successful",
          user: {
            id: user._id,
            username: user.username,
            role: user.role
          }
        });
      });
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

export default loginUser;
