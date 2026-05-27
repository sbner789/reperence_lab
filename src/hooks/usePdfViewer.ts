import { useState } from 'react';

type PdfViewerState = {
  file: File | null;
  numPages: number;
  currentPage: number;
  scale: number;
};

const INITIAL_VIEWER: PdfViewerState = {
  file: null,
  numPages: 0,
  currentPage: 1,
  scale: 1.0,
};

const usePdfViewer = () => {
  const [viewer, setViewer] = useState<PdfViewerState>(INITIAL_VIEWER);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setViewer({ ...INITIAL_VIEWER, file });
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setViewer((prev) => ({ ...prev, numPages, currentPage: 1 }));
  };

  const goToPrevPage = () => {
    setViewer((prev) => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }));
  };

  const goToNextPage = () => {
    setViewer((prev) => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, prev.numPages) }));
  };

  const zoomIn = () => {
    setViewer((prev) => ({ ...prev, scale: Math.min(Number((prev.scale + 0.2).toFixed(1)), 3.0) }));
  };

  const zoomOut = () => {
    setViewer((prev) => ({ ...prev, scale: Math.max(Number((prev.scale - 0.2).toFixed(1)), 0.5) }));
  };

  return {
    ...viewer,
    handleFileChange,
    onDocumentLoadSuccess,
    goToPrevPage,
    goToNextPage,
    zoomIn,
    zoomOut,
  };
};

export default usePdfViewer;
