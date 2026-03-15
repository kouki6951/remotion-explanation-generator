import React, { useEffect, useState } from 'react';
import { staticFile } from 'remotion';
import { pdfjs, Document, Page } from 'react-pdf';

// PDF.js workerの設定
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfSlideProps {
  pdfPath: string;
  pageNumber?: number;
  width?: number;
  height?: number;
}

export const PdfSlide: React.FC<PdfSlideProps> = ({
  pdfPath,
  pageNumber = 1,
  width,
  height
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Document
        file={staticFile(pdfPath)}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div style={{ color: '#fff', fontSize: '24px' }}>
            PDFを読み込み中...
          </div>
        }
        error={
          <div style={{ color: '#f00', fontSize: '24px' }}>
            PDFの読み込みに失敗しました
          </div>
        }
      >
        <Page
          pageNumber={Math.min(pageNumber, numPages || 1)}
          width={width}
          height={height}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
};
