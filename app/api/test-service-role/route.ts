import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    
    // Test service role access to all tables
    const results: any = {};
    
    // Test users table
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      results.users = {
        accessible: !usersError,
        count: users?.length || 0,
        error: usersError?.message
      };
    } catch (e) {
      results.users = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
    
    // Test contact_submissions table
    try {
      const { data: contacts, error: contactsError } = await supabase
        .from('contact_submissions')
        .select('*')
        .limit(1);
      
      results.contact_submissions = {
        accessible: !contactsError,
        count: contacts?.length || 0,
        error: contactsError?.message
      };
    } catch (e) {
      results.contact_submissions = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
    
    // Test technical_trainings table
    try {
      const { data: techTrainings, error: techError } = await supabase
        .from('technical_trainings')
        .select('*')
        .limit(1);
      
      results.technical_trainings = {
        accessible: !techError,
        count: techTrainings?.length || 0,
        error: techError?.message
      };
    } catch (e) {
      results.technical_trainings = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
    
    // Test non_technical_trainings table
    try {
      const { data: nonTechTrainings, error: nonTechError } = await supabase
        .from('non_technical_trainings')
        .select('*')
        .limit(1);
      
      results.non_technical_trainings = {
        accessible: !nonTechError,
        count: nonTechTrainings?.length || 0,
        error: nonTechError?.message
      };
    } catch (e) {
      results.non_technical_trainings = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
    
    // Test consulting_services table
    try {
      const { data: services, error: servicesError } = await supabase
        .from('consulting_services')
        .select('*')
        .limit(1);
      
      results.consulting_services = {
        accessible: !servicesError,
        count: services?.length || 0,
        error: servicesError?.message
      };
    } catch (e) {
      results.consulting_services = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
    
    // Test consultants table
    try {
      const { data: consultants, error: consultantsError } = await supabase
        .from('consultants')
        .select('*')
        .limit(1);
      
      results.consultants = {
        accessible: !consultantsError,
        count: consultants?.length || 0,
        error: consultantsError?.message
      };
    } catch (e) {
      results.consultants = {
        accessible: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service role access test results',
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Service role test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 