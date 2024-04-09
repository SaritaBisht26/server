import SessionLog from "../model/sessionLogSchema.js";
const getLogSession = async (req, res) => {
  try {
    const sessions = await SessionLog.find({ userId: req.user._id });
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logLoginSession = async (userId, ipAddress, userAgent) => {
  try {
    const sessionLog = new SessionLog({
      userId,
      ipAddress,
      userAgent,
      loginTime: new Date(),
    });
    await sessionLog.save();
  } catch (error) {
    console.error("Error logging login session:", error);
  }
};

const logLogoutSession = async (userId) => {
  try {
    const sessionLog = await SessionLog.findOne({ userId, logoutTime: null });
    if (sessionLog) {
      sessionLog.logoutTime = new Date();
      await sessionLog.save();
    }
  } catch (error) {
    console.error("Error logging logout session:", error);
  }
};

export { logLoginSession, logLogoutSession, getLogSession };
