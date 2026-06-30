import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings, Moon, Sun, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowProfileMenu(false);
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-4 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, categories..."
            className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        
        <div className="relative" ref={menuRef}>
          <div 
            className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer border border-primary/20 hover:bg-primary/20 transition-colors"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-primary" />
            )}
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-sm font-medium leading-none">{user?.name || 'Administrator'}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{user?.email || 'admin@example.com'}</p>
              </div>
              <div className="p-1">
                <button 
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => handleNavigation('/settings')}
                >
                  <User className="mr-2 h-4 w-4" /> My Profile
                </button>
                <button 
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => handleNavigation('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" /> Account Settings
                </button>
                <button 
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <Bell className="mr-2 h-4 w-4" /> Notifications
                </button>
              </div>
              <div className="p-1 border-t border-border/50">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Theme</div>
                <button 
                  className={`flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'light' ? 'bg-accent text-accent-foreground' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun className="mr-2 h-4 w-4" /> Light Mode
                </button>
                <button 
                  className={`flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="mr-2 h-4 w-4" /> Dark Mode
                </button>
                <button 
                  className={`flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'system' ? 'bg-accent text-accent-foreground' : ''}`}
                  onClick={() => setTheme('system')}
                >
                  <Settings className="mr-2 h-4 w-4" /> System
                </button>
              </div>
              <div className="p-1 border-t border-border/50">
                <button 
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <HelpCircle className="mr-2 h-4 w-4" /> Help & Support
                </button>
              </div>
              <div className="p-1 border-t border-border/50">
                <button 
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none text-destructive hover:bg-destructive/10 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
