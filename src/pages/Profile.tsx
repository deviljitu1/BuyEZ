import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { LogOut, Plus, User, Mail, Phone, Globe, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockAccounts = [
  { id: 1, name: 'John Doe', email: 'john.doe@email.com', avatar: '' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', avatar: '' },
];

const mockGoogleAccounts = [
  { id: 1, name: 'John G', email: 'john.g@gmail.com', avatar: '', color: 'bg-blue-500' },
  { id: 2, name: 'Jane G', email: 'jane.g@gmail.com', avatar: '', color: 'bg-red-500' },
  { id: 3, name: 'Work G', email: 'work.g@gmail.com', avatar: '', color: 'bg-green-500' },
];

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(mockAccounts[0].name);
  const [email, setEmail] = useState(mockAccounts[0].email);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accounts, setAccounts] = useState(mockAccounts);
  const [activeAccount, setActiveAccount] = useState(0);
  const [showLogout, setShowLogout] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<'choose'|'google'|'mobile'|'mobile-otp'|'email'|'email-verify'|'done'>('choose');
  const [selectedGoogle, setSelectedGoogle] = useState<number|null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailSignup, setEmailSignup] = useState({ email: '', password: '', confirm: '' });
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogout(false);
    navigate('/');
  };

  const handleSwitchAccount = (idx: number) => {
    setActiveAccount(idx);
    setName(accounts[idx].name);
    setEmail(accounts[idx].email);
  };

  const handleCreateAccount = (method: 'google' | 'mobile' | 'email') => {
    if (method === 'google') {
      setCreateStep('google');
    } else if (method === 'mobile') {
      setCreateStep('mobile');
      setMobileNumber('');
      setMobileOtp('');
      setMobileError('');
    } else if (method === 'email') {
      setCreateStep('email');
      setEmailSignup({ email: '', password: '', confirm: '' });
      setEmailError('');
    }
  };

  const handleMobileContinue = () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setMobileError('');
    setCreateStep('mobile-otp');
  };

  const handleMobileOtp = () => {
    if (mobileOtp !== '123456') {
      setMobileError('Invalid OTP. Try 123456 for demo.');
      return;
    }
    setMobileError('');
    const newAccount = {
      id: accounts.length + 1,
      name: `Mobile User ${accounts.length + 1}`,
      email: `mobile${accounts.length + 1}@phone.com`,
      avatar: '',
    };
    setAccounts([...accounts, newAccount]);
    setActiveAccount(accounts.length);
    setName(newAccount.name);
    setEmail(newAccount.email);
    setCreateStep('done');
    setTimeout(() => {
      setShowCreateModal(false);
      setCreateStep('choose');
      setMobileNumber('');
      setMobileOtp('');
      setMobileError('');
    }, 1200);
  };

  const handleSelectGoogle = (acc: typeof mockGoogleAccounts[0]) => {
    const newAccount = {
      id: accounts.length + 1,
      name: acc.name,
      email: acc.email,
      avatar: acc.avatar,
    };
    setAccounts([...accounts, newAccount]);
    setActiveAccount(accounts.length);
    setName(newAccount.name);
    setEmail(newAccount.email);
    setSelectedGoogle(acc.id);
    setCreateStep('done');
    setTimeout(() => {
      setShowCreateModal(false);
      setCreateStep('choose');
      setSelectedGoogle(null);
    }, 1200);
  };

  const handleEmailContinue = () => {
    if (!/^\S+@\S+\.\S+$/.test(emailSignup.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (emailSignup.password.length < 6) {
      setEmailError('Password must be at least 6 characters.');
      return;
    }
    if (emailSignup.password !== emailSignup.confirm) {
      setEmailError('Passwords do not match.');
      return;
    }
    setEmailError('');
    setCreateStep('email-verify');
  };

  const handleEmailVerify = () => {
    const newAccount = {
      id: accounts.length + 1,
      name: `Email User ${accounts.length + 1}`,
      email: emailSignup.email,
      avatar: '',
    };
    setAccounts([...accounts, newAccount]);
    setActiveAccount(accounts.length);
    setName(newAccount.name);
    setEmail(newAccount.email);
    setCreateStep('done');
    setTimeout(() => {
      setShowCreateModal(false);
      setCreateStep('choose');
      setEmailSignup({ email: '', password: '', confirm: '' });
      setEmailError('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex flex-col items-center justify-start py-12 px-4">
      <Card className="w-full max-w-xl p-8 rounded-2xl shadow-xl border border-primary/20 bg-white/80 dark:bg-background/80">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Avatar className="w-24 h-24 mb-2 shadow-lg">
            <AvatarImage src={accounts[activeAccount].avatar} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          {editing ? (
            <Input
              className="text-2xl font-bold text-primary text-center mb-2"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          ) : (
            <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight">{name}</h1>
          )}
          {editing ? (
            <Input
              className="text-base text-muted-foreground text-center"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          ) : (
            <p className="text-base text-muted-foreground mb-2">{email}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="outline" onClick={() => setEditing(e => !e)}>
            {editing ? 'Save' : 'Edit Profile'}
          </Button>
          <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
          <Button variant="destructive" onClick={() => setShowLogout(true)}><LogOut className="w-4 h-4 mr-1" />Logout</Button>
        </div>
        <div className="text-center text-muted-foreground text-xs mt-4 mb-8">
          Your personal information is kept private and secure.
        </div>
        {/* Account Switcher */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-primary">Accounts ({accounts.length})</span>
            <Button variant="ghost" size="sm" onClick={() => { setShowCreateModal(true); setCreateStep('choose'); }} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Create New Account
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {accounts.map((acc, idx) => (
              <Button
                key={acc.id}
                variant={activeAccount === idx ? 'default' : 'outline'}
                className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm"
                onClick={() => handleSwitchAccount(idx)}
              >
                <User className="w-4 h-4" />
                <span>{acc.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>
      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPasswordModal(false)} variant="outline">Cancel</Button>
            <Button onClick={() => setShowPasswordModal(false)} variant="default">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Logout Modal */}
      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">Are you sure you want to logout?</div>
          <DialogFooter>
            <Button onClick={() => setShowLogout(false)} variant="outline">Cancel</Button>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Create New Account Modal - Multi-step */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
          </DialogHeader>
          {createStep === 'choose' && (
            <div className="flex flex-col gap-4 mt-2">
              <Button
                className="w-full flex items-center justify-center gap-3 py-4 text-lg font-semibold bg-white border hover:bg-primary/10"
                variant="outline"
                onClick={() => handleCreateAccount('google')}
              >
                <Globe className="w-6 h-6 text-red-500" /> Continue with Google
              </Button>
              <Button
                className="w-full flex items-center justify-center gap-3 py-4 text-lg font-semibold bg-white border hover:bg-primary/10"
                variant="outline"
                onClick={() => handleCreateAccount('mobile')}
              >
                <Phone className="w-6 h-6 text-green-500" /> Continue with Mobile Number
              </Button>
              <Button
                className="w-full flex items-center justify-center gap-3 py-4 text-lg font-semibold bg-white border hover:bg-primary/10"
                variant="outline"
                onClick={() => handleCreateAccount('email')}
              >
                <Mail className="w-6 h-6 text-blue-500" /> Continue with Email
              </Button>
            </div>
          )}
          {createStep === 'google' && (
            <div className="flex flex-col gap-4 mt-2 animate-fade-in">
              <div className="text-lg font-semibold mb-2">Select a Google Account</div>
              {mockGoogleAccounts.map(acc => (
                <Button
                  key={acc.id}
                  className={`w-full flex items-center justify-start gap-3 py-3 text-base font-medium border ${selectedGoogle === acc.id ? 'border-primary bg-primary/10' : 'bg-white'} hover:bg-primary/10`}
                  variant="outline"
                  onClick={() => handleSelectGoogle(acc)}
                  disabled={!!selectedGoogle}
                >
                  <div className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-bold ${acc.color}`}>{acc.name[0]}</div>
                  <div className="flex flex-col text-left">
                    <span>{acc.name}</span>
                    <span className="text-xs text-muted-foreground">{acc.email}</span>
                  </div>
                  {selectedGoogle === acc.id && <CheckCircle className="ml-auto text-primary w-5 h-5" />}
                </Button>
              ))}
            </div>
          )}
          {createStep === 'mobile' && (
            <div className="flex flex-col gap-4 mt-2 animate-fade-in">
              <div className="text-lg font-semibold mb-2">Enter Mobile Number</div>
              <Input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value.replace(/[^\d]/g, ''))}
                maxLength={10}
              />
              {mobileError && <div className="text-red-500 text-sm">{mobileError}</div>}
              <Button className="w-full" onClick={handleMobileContinue}>Continue</Button>
            </div>
          )}
          {createStep === 'mobile-otp' && (
            <div className="flex flex-col gap-4 mt-2 animate-fade-in">
              <div className="text-lg font-semibold mb-2">Enter OTP</div>
              <Input
                type="tel"
                placeholder="Enter 6-digit OTP (try 123456)"
                value={mobileOtp}
                onChange={e => setMobileOtp(e.target.value.replace(/[^\d]/g, ''))}
                maxLength={6}
              />
              {mobileError && <div className="text-red-500 text-sm">{mobileError}</div>}
              <Button className="w-full" onClick={handleMobileOtp}>Verify & Create Account</Button>
            </div>
          )}
          {createStep === 'email' && (
            <div className="flex flex-col gap-4 mt-2 animate-fade-in">
              <div className="text-lg font-semibold mb-2">Sign Up with Email</div>
              <Input
                type="email"
                placeholder="Email address"
                value={emailSignup.email}
                onChange={e => setEmailSignup(v => ({ ...v, email: e.target.value }))}
              />
              <Input
                type="password"
                placeholder="Password (min 6 chars)"
                value={emailSignup.password}
                onChange={e => setEmailSignup(v => ({ ...v, password: e.target.value }))}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={emailSignup.confirm}
                onChange={e => setEmailSignup(v => ({ ...v, confirm: e.target.value }))}
              />
              {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
              <Button className="w-full" onClick={handleEmailContinue}>Continue</Button>
            </div>
          )}
          {createStep === 'email-verify' && (
            <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
              <Mail className="w-12 h-12 text-blue-500 mb-2" />
              <div className="text-lg font-semibold">Verification email sent to {emailSignup.email}</div>
              <Button className="mt-2" onClick={handleEmailVerify}>I've Verified My Email</Button>
            </div>
          )}
          {createStep === 'done' && (
            <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
              <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
              <div className="text-lg font-semibold">Account Created & Switched!</div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => { setShowCreateModal(false); setCreateStep('choose'); setSelectedGoogle(null); }} variant="outline">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile; 