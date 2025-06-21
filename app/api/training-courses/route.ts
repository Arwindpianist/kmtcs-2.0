import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('service_type');
    const status = searchParams.get('status');

    let query = supabase
      .from('training_courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (serviceType) {
      query = query.eq('service_type', serviceType);
    }

    if (status !== null) {
      query = query.eq('status', status === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.service_type) {
      return NextResponse.json({ 
        error: 'Title and service_type are required' 
      }, { status: 400 });
    }

    // Prepare data for insertion
    const courseData = {
      title: body.title,
      description: body.description || '',
      duration: body.duration || '',
      price: body.price,
      objectives: body.objectives || [],
      course_contents: body.course_contents || '',
      target_audience: body.target_audience || '',
      methodology: body.methodology || '',
      certification: body.certification || '',
      hrdcorp_approval_no: body.hrdcorp_approval_no || '',
      service_type: body.service_type,
      status: body.status !== undefined ? body.status : true
    };

    const { data, error } = await supabase
      .from('training_courses')
      .insert(courseData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data 
    });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('training_courses')
      .update({
        title: body.title,
        description: body.description,
        duration: body.duration,
        price: body.price,
        objectives: body.objectives,
        course_contents: body.course_contents,
        target_audience: body.target_audience,
        methodology: body.methodology,
        certification: body.certification,
        hrdcorp_approval_no: body.hrdcorp_approval_no,
        service_type: body.service_type,
        status: body.status
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data 
    });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('training_courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Course deleted successfully' 
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 