import React, { useState, useRef } from "react";
import { useLanguage } from '../../context/LanguageContext';
import { Download, Upload, FileText } from "lucide-react";
import Dropdown from "../../components/Dropdown";
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

  const handleAction = (action) => {
    if (action === "export") {
      handleExport();
    } else if (action === "import") {
      fileInputRef.current?.click();
    }
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

        <div className="w-full">
          <Dropdown
            placeholder={t('exportImportData')}
            options={[
              { value: "export", label: t('exportCSV') },
              { value: "import", label: t('importCSV') },
            ]}
            onChange={handleAction}
            getIcon={(value) => {
              if (value === "export") return Download;
              if (value === "import") return Upload;
              return FileText;
            }}
          />
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
