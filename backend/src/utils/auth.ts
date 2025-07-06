import jwt from 'jsonwebtoken'

// Generate Otp
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

// Verify JWT token
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
};
