import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  full_name: string | null;
  created_at: string;
  last_sign_in: string | null;
}

export class AdminAuthService {
  /**
   * Check if the current user is an admin
   */
  static async isAdmin(): Promise<boolean> {
    try {
      console.log('AdminAuthService.isAdmin(): Starting admin check');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('AdminAuthService.isAdmin(): No session or user');
        return false;
      }

      console.log('AdminAuthService.isAdmin(): Session found, checking users table for user ID:', session.user.id);

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (error) {
        console.error('AdminAuthService.isAdmin(): Database error:', error);
        return false;
      }

      if (!user) {
        console.log('AdminAuthService.isAdmin(): User not found in users table or not an admin');
        return false;
      }

      console.log('AdminAuthService.isAdmin(): Admin user found:', user);
      return true;
    } catch (error) {
      console.error('AdminAuthService.isAdmin(): Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Get the current admin user data
   */
  static async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      console.log('AdminAuthService.getCurrentAdmin(): Getting current admin data');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('AdminAuthService.getCurrentAdmin(): No session or user');
        return null;
      }

      console.log('AdminAuthService.getCurrentAdmin(): Session found, querying users table');

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (error) {
        console.error('AdminAuthService.getCurrentAdmin(): Database error:', error);
        return null;
      }

      if (!user) {
        console.log('AdminAuthService.getCurrentAdmin(): User not found in users table or not an admin');
        return null;
      }

      console.log('AdminAuthService.getCurrentAdmin(): Admin user data retrieved:', user);
      return user as AdminUser;
    } catch (error) {
      console.error('AdminAuthService.getCurrentAdmin(): Error getting current admin:', error);
      return null;
    }
  }

  /**
   * Update last sign in timestamp
   */
  static async updateLastSignIn(userId: string): Promise<void> {
    try {
      console.log('AdminAuthService.updateLastSignIn(): Updating last sign in for user:', userId);
      
      await supabase
        .from('users')
        .update({ last_sign_in: new Date().toISOString() })
        .eq('id', userId);
        
      console.log('AdminAuthService.updateLastSignIn(): Last sign in updated successfully');
    } catch (error) {
      console.error('AdminAuthService.updateLastSignIn(): Error updating last sign in:', error);
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<void> {
    try {
      console.log('AdminAuthService.signOut(): Signing out user');
      await supabase.auth.signOut();
      console.log('AdminAuthService.signOut(): User signed out successfully');
    } catch (error) {
      console.error('AdminAuthService.signOut(): Error signing out:', error);
    }
  }
} 