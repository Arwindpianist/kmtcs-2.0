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

    let query;
    
    if (serviceType === 'technical_training') {
      query = supabase
        .from('technical_trainings')
        .select('*')
        .order('created_at', { ascending: false });
    } else if (serviceType === 'non_technical_training') {
      query = supabase
        .from('non_technical_trainings')
        .select('*')
        .order('created_at', { ascending: false });
    } else {
      // Return both types
      const [technicalResult, nonTechnicalResult] = await Promise.all([
        supabase.from('technical_trainings').select('*').order('created_at', { ascending: false }),
        supabase.from('non_technical_trainings').select('*').order('created_at', { ascending: false })
      ]);
      
      if (technicalResult.error) throw technicalResult.error;
      if (nonTechnicalResult.error) throw nonTechnicalResult.error;
      
      const combinedData = [
        ...(technicalResult.data || []).map(item => ({ ...item, service_type: 'technical_training' })),
        ...(nonTechnicalResult.data || []).map(item => ({ ...item, service_type: 'non_technical_training' }))
      ];
      
      return NextResponse.json({ data: combinedData });
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

    // Prepare data for insertion (excluding service_type as it's not in the individual tables)
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
      status: body.status !== undefined ? body.status : true
    };

    let result;
    
    if (body.service_type === 'technical_training') {
      result = await supabase
        .from('technical_trainings')
        .insert(courseData)
        .select()
        .single();
    } else if (body.service_type === 'non_technical_training') {
      result = await supabase
        .from('non_technical_trainings')
        .insert(courseData)
        .select()
        .single();
    } else {
      return NextResponse.json({ 
        error: 'Invalid service_type. Must be technical_training or non_technical_training' 
      }, { status: 400 });
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: { ...result.data, service_type: body.service_type }
    });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id || !body.service_type) {
      return NextResponse.json({ error: 'Course ID and service_type are required' }, { status: 400 });
    }

    // Prepare update data (excluding service_type as it's not in the individual tables)
    const updateData = {
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
      status: body.status
    };

    let result;
    
    if (body.service_type === 'technical_training') {
      result = await supabase
        .from('technical_trainings')
        .update(updateData)
        .eq('id', body.id)
        .select()
        .single();
    } else if (body.service_type === 'non_technical_training') {
      result = await supabase
        .from('non_technical_trainings')
        .update(updateData)
        .eq('id', body.id)
        .select()
        .single();
    } else {
      return NextResponse.json({ 
        error: 'Invalid service_type. Must be technical_training or non_technical_training' 
      }, { status: 400 });
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: { ...result.data, service_type: body.service_type }
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
    const serviceType = searchParams.get('service_type');

    if (!id || !serviceType) {
      return NextResponse.json({ error: 'Course ID and service_type are required' }, { status: 400 });
    }

    let result;
    
    if (serviceType === 'technical_training') {
      result = await supabase
        .from('technical_trainings')
        .delete()
        .eq('id', id);
    } else if (serviceType === 'non_technical_training') {
      result = await supabase
        .from('non_technical_trainings')
        .delete()
        .eq('id', id);
    } else {
      return NextResponse.json({ 
        error: 'Invalid service_type. Must be technical_training or non_technical_training' 
      }, { status: 400 });
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
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