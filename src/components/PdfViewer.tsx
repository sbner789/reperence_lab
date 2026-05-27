import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import usePdfViewer from '@/hooks/usePdfViewer';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PdfViewer = () => {
  const {
    file,
    numPages,
    currentPage,
    scale,
    handleFileChange,
    onDocumentLoadSuccess,
    goToPrevPage,
    goToNextPage,
    zoomIn,
    zoomOut,
  } = usePdfViewer();

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        PDF 업로드
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {file && (
        <>
          <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-lg">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-white border rounded disabled:opacity-40 hover:bg-gray-50"
            >
              ◀ 이전
            </button>
            <span className="text-sm font-medium">
              {currentPage} / {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="px-3 py-1 bg-white border rounded disabled:opacity-40 hover:bg-gray-50"
            >
              다음 ▶
            </button>
            <div className="w-px h-5 bg-gray-300" />
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="px-3 py-1 bg-white border rounded disabled:opacity-40 hover:bg-gray-50"
            >
              −
            </button>
            <span className="text-sm font-medium w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 3.0}
              className="px-3 py-1 bg-white border rounded disabled:opacity-40 hover:bg-gray-50"
            >
              +
            </button>
          </div>

          <div className="border shadow-md">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={currentPage} scale={scale} />
            </Document>
          </div>
        </>
      )}
    </div>
  );
};

export default PdfViewer;
