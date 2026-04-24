import { NextRequest, NextResponse } from 'next/server';
import {
  createCatalogRecord,
  deleteCatalogRecord,
  listCatalogRecords,
  updateCatalogRecord,
  type CatalogTable,
} from '@/app/lib/db/catalogRepository';

function toCatalogTable(serviceType: string): CatalogTable | null {
  if (serviceType === 'technical_training') return 'technical_trainings';
  if (serviceType === 'non_technical_training') return 'non_technical_trainings';
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('service_type');
    const status = searchParams.get('status');

    if (serviceType === 'technical_training' || serviceType === 'non_technical_training') {
      const table = toCatalogTable(serviceType)!;
      const { data, error } = await listCatalogRecords(table, status, null);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ data: data || [] });
    }

    // Return both types
    const [technicalResult, nonTechnicalResult] = await Promise.all([
      listCatalogRecords('technical_trainings', status, null),
      listCatalogRecords('non_technical_trainings', status, null),
    ]);

    if (technicalResult.error) throw technicalResult.error;
    if (nonTechnicalResult.error) throw nonTechnicalResult.error;

    const combinedData = [
      ...((technicalResult.data || []).map(item => ({ ...item, service_type: 'technical_training' }))),
      ...((nonTechnicalResult.data || []).map(item => ({ ...item, service_type: 'non_technical_training' }))),
    ];

    return NextResponse.json({ data: combinedData });
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

    const table = toCatalogTable(body.service_type);
    if (!table) {
      return NextResponse.json({ 
        error: 'Invalid service_type. Must be technical_training or non_technical_training' 
      }, { status: 400 });
    }

    const result = await createCatalogRecord(table, courseData);

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

    const table = toCatalogTable(body.service_type);
    if (!table) {
      return NextResponse.json({ 
        error: 'Invalid service_type. Must be technical_training or non_technical_training' 
      }, { status: 400 });
    }

    const result = await updateCatalogRecord(table, body.id, updateData);

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

    const table = toCatalogTable(serviceType);
    if (!table) {
      return NextResponse.json({ 
        error: 'Invalid service_type. Must be technical_training or non_technical_training' 
      }, { status: 400 });
    }

    const result = await deleteCatalogRecord(table, id);

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