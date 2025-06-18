import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    userType: 'student' as 'student' | 'donor' | 'admin'
  });

  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, don't show the modal
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          throw new Error('Please fill in all required fields');
        }

        if (formData.userType === 'student' && !formData.username) {
          throw new Error('Username is required for students');
        }

        await signup(
          formData.email, 
          formData.password, 
          formData.firstName, 
          formData.lastName, 
          formData.userType,
          formData.userType === 'student' ? formData.username : undefined
        );
        
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      }

      onClose();
      
      // Redirect based on user type
      if (formData.userType === 'student') {
        navigate('/student-dashboard');
      } else if (formData.userType === 'donor') {
        navigate('/donor-dashboard');
      } else if (formData.userType === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/campaigns');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isLogin ? 'Sign In to EduFund' : 'Join EduFund'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="userType">I am a: *</Label>
                <select
                  id="userType"
                  value={formData.userType}
                  onChange={(e) => handleInputChange('userType', e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                  required
                >
                  <option value="student">Student</option>
                  <option value="donor">Donor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.userType === 'student' && (
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Choose a unique username"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be used in your campaign URL
                  </p>
                </div>
              )}
            </>
          )}

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              minLength={6}
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm">Remember me</Label>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-green-400 hover:scale-105 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>

          <div className="text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;