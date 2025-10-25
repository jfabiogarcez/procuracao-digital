import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;
import { readFile } from 'fs/promises';

export interface PDFExtractionResult {
  text: string;
  numPages: number;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

/**
 * Extrai texto de um arquivo PDF
 * @param filePath Caminho do arquivo PDF
 * @returns Texto extraído e metadados
 */
export async function extractTextFromPDF(filePath: string): Promise<PDFExtractionResult> {
  try {
    const dataBuffer = await readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);

    return {
      text: pdfData.text,
      numPages: pdfData.numpages,
      metadata: {
        title: pdfData.info?.Title,
        author: pdfData.info?.Author,
        subject: pdfData.info?.Subject,
        keywords: pdfData.info?.Keywords,
        creator: pdfData.info?.Creator,
        producer: pdfData.info?.Producer,
        creationDate: pdfData.info?.CreationDate ? new Date(pdfData.info.CreationDate) : undefined,
        modificationDate: pdfData.info?.ModDate ? new Date(pdfData.info.ModDate) : undefined,
      },
    };
  } catch (error: any) {
    throw new Error(`Erro ao extrair texto do PDF: ${error.message}`);
  }
}

/**
 * Extrai texto de um buffer PDF
 * @param buffer Buffer do arquivo PDF
 * @returns Texto extraído e metadados
 */
export async function extractTextFromPDFBuffer(buffer: Buffer): Promise<PDFExtractionResult> {
  try {
    const pdfData = await pdfParse(buffer);

    return {
      text: pdfData.text,
      numPages: pdfData.numpages,
      metadata: {
        title: pdfData.info?.Title,
        author: pdfData.info?.Author,
        subject: pdfData.info?.Subject,
        keywords: pdfData.info?.Keywords,
        creator: pdfData.info?.Creator,
        producer: pdfData.info?.Producer,
        creationDate: pdfData.info?.CreationDate ? new Date(pdfData.info.CreationDate) : undefined,
        modificationDate: pdfData.info?.ModDate ? new Date(pdfData.info.ModDate) : undefined,
      },
    };
  } catch (error: any) {
    throw new Error(`Erro ao extrair texto do PDF: ${error.message}`);
  }
}

