import React, { useState, useRef } from "react";
import { useLanguage } from '../../context/LanguageContext';
import { Download, Upload } from "lucide-react";
import ConfirmationModal from "../../components/ConfirmationModal";
import { exportToCSV, parseCSV } from "../../utils/csvUtils";

const DataControls = ({ data, onImport }) => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const csv = exportToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pfinances_backup_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPendingFile(file);
      setShowModal(true);
    }
    // Reset input so same file can be selected again if needed
    event.target.value = "";
  };

  const handleConfirmImport = () => {
    if (!pendingFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsedData = parseCSV(text);
        onImport(parsedData);
        setShowModal(false);
        setPendingFile(null);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        alert(
          t('csvParseError')
        );
      }
    };
    reader.readAsText(pendingFile);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".csv"
        />

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleExport}
            className="w-full py-4 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors flex items-center justify-center gap-2 group"
          >
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{t('exportCSV')}</span>
          </button>
          
          <button
            onClick={handleImportClick}
            className="w-full py-4 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors flex items-center justify-center gap-2 group"
          >
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </div>
             <span className="font-medium text-gray-900 dark:text-white">{t('importCSV')}</span>
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setPendingFile(null);
        }}
        onConfirm={handleConfirmImport}
        title={t('importDataTitle')}
        message={t('importDataMessage')}
        confirmText={t('importReplace')}
        type="danger"
      />
    </>
  );
};

export default DataControls;
