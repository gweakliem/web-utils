import { readMultipartFormData } from 'h3'
import pdfParse from 'pdf-parse'

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default defineEventHandler(async (event) => {
  try {
    // Parse the multipart form data
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    // Find the PDF file in the form data
    const pdfFile = formData.find(field => field.name === 'pdf')
    
    if (!pdfFile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No PDF file found'
      })
    }

    if (!pdfFile.data || pdfFile.data.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Empty file uploaded'
      })
    }

    // Validate file type (basic check on filename)
    if (!pdfFile.filename || !pdfFile.filename.toLowerCase().endsWith('.pdf')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only PDF files are allowed'
      })
    }

    // Check PDF magic number (starts with %PDF-)
    const pdfMagic = pdfFile.data.slice(0, 5).toString('ascii')
    if (!pdfMagic.startsWith('%PDF-')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid PDF file format'
      })
    }

    // Check file size (10MB limit)
    if (pdfFile.data.length > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File size exceeds 10MB limit'
      })
    }

    // Extract text from PDF
    const pdfData = await pdfParse(pdfFile.data)
    
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      throw createError({
        statusCode: 422,
        statusMessage: 'No text could be extracted from this PDF'
      })
    }

    return {
      text: pdfData.text,
      info: {
        pages: pdfData.numpages,
        filename: pdfFile.filename
      }
    }

  } catch (error) {
    console.error('PDF extraction error:', error)
    
    if (error.statusCode) {
      throw error // Re-throw HTTP errors
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process PDF file'
    })
  }
})