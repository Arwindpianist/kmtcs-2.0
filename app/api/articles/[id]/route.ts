import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { parseArticleContent } from '../../../lib/articles'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await params.id
  
  try {
    const articlesDirectory = path.join(process.cwd(), 'app/articles')
    const filePath = path.join(articlesDirectory, `${id}.txt`)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const content = fs.readFileSync(filePath, 'utf8')
    const article = parseArticleContent(content, `${id}.txt`)
    
    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
} 