'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/UserContext';
import { LogOut, User, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, type ReactNode, type ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';


function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Header({ children }: { children?: ReactNode }) {
  const router = useRouter();
  const { user, setUserProfilePicture } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: 'Image Too Large',
          description: 'Please select an image smaller than 2MB.',
          variant: 'destructive',
        });
        return;
      }
      const dataUri = await fileToDataUri(file);
      setUserProfilePicture(dataUri);
      toast({
        title: 'Profile Picture Updated',
        description: 'Your new photo has been saved.',
      });
    }
  };

  const handleUpdatePhotoClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {children}
      <div className="flex w-full items-center justify-end gap-4">
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profilePicture || undefined} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.basic?.name || user.basic?.email || 'User'}</p>
                {user.basic?.email && (
                  <p className="text-xs leading-none text-muted-foreground">{user.basic.email}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleUpdatePhotoClick}>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Change Photo</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                try {
                  localStorage.removeItem('currentUser');
                } catch {}
                router.push('/');
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {!user.profile && (
          <Badge
            variant="outline"
            className="text-xs cursor-pointer"
            onClick={() => router.push('/dashboard/onboarding')}
          >
            Complete Profile
          </Badge>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
        />
      </div>
    </header>
  );
}
