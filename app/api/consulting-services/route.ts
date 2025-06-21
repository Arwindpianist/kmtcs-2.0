import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('consulting_services')
      .select('*')
      .order('created_at', { ascending: false });

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
    if (!body.title) {
      return NextResponse.json({ 
        error: 'Title is required' 
      }, { status: 400 });
    }

    // Prepare data for insertion
    const serviceData = {
      title: body.title,
      description: body.description || '',
      duration: body.duration || '',
      price: body.price,
      objectives: body.objectives || [],
      service_contents: body.service_contents || '',
      target_audience: body.target_audience || '',
      methodology: body.methodology || '',
      deliverables: body.deliverables || '',
      status: body.status !== undefined ? body.status : true
    };

    const { data, error } = await supabase
      .from('consulting_services')
      .insert(serviceData)
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
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('consulting_services')
      .update({
        title: body.title,
        description: body.description,
        duration: body.duration,
        price: body.price,
        objectives: body.objectives,
        service_contents: body.service_contents,
        target_audience: body.target_audience,
        methodology: body.methodology,
        deliverables: body.deliverables,
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
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('consulting_services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Service deleted successfully' 
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 