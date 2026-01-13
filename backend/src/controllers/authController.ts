import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d'
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      isAdmin: false
    });

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email);
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password });

    // Check if password field exists
    if (!user.password) {
      console.error('User password field is null/undefined');
      res.status(500).json({ message: 'User account has invalid password data' });
      return;
    }

    // Check password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      console.log('Password validation failed for user:', email);
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    console.log('Login successful for user:', email);

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: (error as Error).message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    res.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Failed to get user info', error: (error as Error).message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const userId = req.user.id;

    await User.update(
      { firstName, lastName, phone },
      { where: { id: userId } }
    );

    const updatedUser = await User.findByPk(userId);
    const { password: _, ...userWithoutPassword } = updatedUser!.toJSON();

    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: (error as Error).message });
  }
};

// Helper endpoint to create admin user if it doesn't exist (for development)
export const createAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@smartlocks.ge' } });
    
    if (existingAdmin) {
      console.log('Existing admin found:', { 
        id: existingAdmin.id, 
        email: existingAdmin.email, 
        hasPassword: !!existingAdmin.password,
        passwordLength: existingAdmin.password ? existingAdmin.password.length : 0
      });
      
      // If the password is missing, let's recreate the user
      if (!existingAdmin.password) {
        console.log('Password field is empty, deleting and recreating admin user');
        await existingAdmin.destroy();
      } else {
        res.json({ 
          message: 'Admin user already exists', 
          user: { email: existingAdmin.email, isAdmin: existingAdmin.isAdmin, hasPassword: !!existingAdmin.password }
        });
        return;
      }
    }

    console.log('Creating new admin user...');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@smartlocks.ge',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+995555123456',
      isAdmin: true
    });

    console.log('Admin user created:', {
      id: adminUser.id,
      email: adminUser.email,
      hasPassword: !!adminUser.password,
      passwordLength: adminUser.password ? adminUser.password.length : 0
    });

    const { password: _, ...userWithoutPassword } = adminUser.toJSON();

    res.json({
      message: 'Admin user created successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ message: 'Failed to create admin user', error: (error as Error).message });
  }
};

// Helper endpoint to make a user admin (for development)
export const makeUserAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await user.update({ isAdmin: true });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      message: 'User promoted to admin successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Make user admin error:', error);
    res.status(500).json({ message: 'Failed to make user admin', error: (error as Error).message });
  }
};
