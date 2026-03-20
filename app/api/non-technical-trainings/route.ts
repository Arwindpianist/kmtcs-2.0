import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';
import { serverLogger } from '@/app/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');

    const supabase = createSupabaseServerClient();
    
    let result;
    
    if (id) {
      result = await supabase
        .from('non_technical_trainings')
        .select('*')
        .eq('id', id)
        .single();
    } else {
      let query = supabase
        .from('non_technical_trainings')
        .select('*');
      
      if (status !== null) {
        query = query.eq('status', status === 'true');
      }

      if (limit !== null) {
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum)) {
          query = query.limit(limitNum);
        }
      }
      
      result = await query.order('created_at', { ascending: false });
    }

    const { data, error } = result;

    if (error) {
      serverLogger.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch non-technical trainings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    serverLogger.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('non_technical_trainings')
      .insert(body)
      .select()
      .single();

    if (error) {
      serverLogger.error('Supabase error:', error);
      serverLogger.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json(
        { error: 'Failed to create non-technical training', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    serverLogger.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('non_technical_trainings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      serverLogger.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update non-technical training' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    serverLogger.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    
    const { error } = await supabase
      .from('non_technical_trainings')
      .delete()
      .eq('id', id);

    if (error) {
      serverLogger.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete non-technical training' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    serverLogger.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 