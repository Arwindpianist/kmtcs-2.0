import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import mammoth from 'mammoth';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain' // .txt
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload .docx, .doc, or .txt files only.' 
      }, { status: 400 });
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('training-documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('training-documents')
      .getPublicUrl(fileName);

    // Create database record
    const { data: dbRecord, error: dbError } = await supabase
      .from('document_uploads')
      .insert({
        file_name: file.name,
        file_path: publicUrl,
        file_size: file.size,
        file_type: file.type,
        upload_status: 'processing'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to create database record' }, { status: 500 });
    }

    // Parse document content
    let extractedData = null;
    let errorMessage = null;

    try {
      const arrayBuffer = await file.arrayBuffer();
      let textContent = '';

      if (file.type === 'text/plain') {
        // Handle .txt files
        textContent = new TextDecoder().decode(arrayBuffer);
      } else {
        // Handle .docx and .doc files
        const result = await mammoth.extractRawText({ arrayBuffer });
        textContent = result.value;
      }

      // Parse the extracted text
      extractedData = parseTrainingDocument(textContent);

      // Update database with extracted data
      await supabase
        .from('document_uploads')
        .update({
          upload_status: 'completed',
          extracted_data: extractedData
        })
        .eq('id', dbRecord.id);

    } catch (parseError) {
      console.error('Parsing error:', parseError);
      errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
      
      // Update database with error
      await supabase
        .from('document_uploads')
        .update({
          upload_status: 'failed',
          error_message: errorMessage
        })
        .eq('id', dbRecord.id);
    }

    return NextResponse.json({
      success: true,
      id: dbRecord.id,
      extractedData,
      errorMessage
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function parseTrainingDocument(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const extractedData: any = {
    title: '',
    description: '',
    duration: '',
    objectives: [],
    course_contents: '',
    target_audience: '',
    methodology: '',
    certification: '',
    hrdcorp_approval_no: ''
  };

  let currentSection = '';
  let objectivesStarted = false;
  let contentStarted = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Extract title
    if (lowerLine.includes('title') && !extractedData.title) {
      // Look for title in next few lines
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j] && lines[j].length > 5 && !lines[j].toLowerCase().includes('hrdcorp')) {
          extractedData.title = lines[j];
          break;
        }
      }
    }

    // Extract HRDCorp approval number
    if (lowerLine.includes('hrdcorp') && lowerLine.includes('approval')) {
      const match = line.match(/\d+/);
      if (match) {
        extractedData.hrdcorp_approval_no = match[0];
      }
    }

    // Extract duration
    if (lowerLine.includes('day') && (lowerLine.includes('course') || lowerLine.includes('training'))) {
      const match = line.match(/(\d+)\s*day/);
      if (match) {
        extractedData.duration = `${match[1]} days`;
      }
    }

    // Extract objectives
    if (lowerLine.includes('objectives') || lowerLine.includes('outcomes')) {
      objectivesStarted = true;
      continue;
    }

    if (objectivesStarted) {
      if (lowerLine.includes('course contents') || lowerLine.includes('4.0') || lowerLine.includes('5.0')) {
        objectivesStarted = false;
      } else if (line.match(/^\d+\./) || line.match(/^[•\-\*]/)) {
        // Remove numbering/bullets and add to objectives
        const cleanObjective = line.replace(/^\d+\.\s*/, '').replace(/^[•\-\*]\s*/, '');
        if (cleanObjective.length > 10) {
          extractedData.objectives.push(cleanObjective);
        }
      }
    }

    // Extract course contents
    if (lowerLine.includes('course contents') || lowerLine.includes('4.0')) {
      contentStarted = true;
      continue;
    }

    if (contentStarted) {
      if (lowerLine.includes('who should attend') || lowerLine.includes('5.0') || lowerLine.includes('6.0')) {
        contentStarted = false;
      } else {
        extractedData.course_contents += line + '\n';
      }
    }

    // Extract target audience
    if (lowerLine.includes('who should attend') || lowerLine.includes('target audience')) {
      let audience = '';
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        if (lines[j] && !lines[j].toLowerCase().includes('methodology') && !lines[j].toLowerCase().includes('6.0')) {
          audience += lines[j] + ' ';
        }
      }
      extractedData.target_audience = audience.trim();
    }

    // Extract methodology
    if (lowerLine.includes('methodology') || lowerLine.includes('training methodology')) {
      let methodology = '';
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j] && !lines[j].toLowerCase().includes('certification') && !lines[j].toLowerCase().includes('7.0')) {
          methodology += lines[j] + ' ';
        }
      }
      extractedData.methodology = methodology.trim();
    }

    // Extract certification
    if (lowerLine.includes('certification')) {
      let certification = '';
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        if (lines[j] && !lines[j].toLowerCase().includes('contact') && !lines[j].toLowerCase().includes('7.0')) {
          certification += lines[j] + ' ';
        }
      }
      extractedData.certification = certification.trim();
    }
  }

  // Clean up extracted data
  extractedData.course_contents = extractedData.course_contents.trim();
  extractedData.target_audience = extractedData.target_audience.trim();
  extractedData.methodology = extractedData.methodology.trim();
  extractedData.certification = extractedData.certification.trim();

  // Generate description from title if not found
  if (!extractedData.description && extractedData.title) {
    extractedData.description = `Training program: ${extractedData.title}`;
  }

  return extractedData;
} 