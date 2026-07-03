import { Edit, Eye, Download, RotateCcw } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";

export default function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useResumeStore();

  const handleExport = () => {
    const data = useResumeStore.getState();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-template.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          const store = useResumeStore.getState();
          Object.entries(data).forEach(([key, value]) => {
            if (store.hasOwnProperty(key) && !key.startsWith("set")) {
              // @ts-ignore
              store[key] = value;
            }
          });
        } catch (err) {
          alert("导入失败，请检查文件格式");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* 导出/导入按钮 */}
      {isEditMode && (
        <div className="flex gap-2">
          <label className="cursor-pointer flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">导入</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">导出</span>
          </button>
        </div>
      )}

      {/* 模式切换按钮 */}
      <button
        onClick={toggleEditMode}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl shadow-xl transition-all font-bold ${
          isEditMode
            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
        }`}
      >
        {isEditMode ? (
          <>
            <Eye className="w-5 h-5" />
            <span>预览模式</span>
          </>
        ) : (
          <>
            <Edit className="w-5 h-5" />
            <span>编辑模式</span>
          </>
        )}
      </button>
    </div>
  );
}
