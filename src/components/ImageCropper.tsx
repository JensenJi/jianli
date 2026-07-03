import { useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspect?: number;
}

export default function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  aspect,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({
    unit: '%' as const,
    width: 60,
    height: 60,
    x: 20,
    y: 20,
  });
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);

  const onLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgRef(e.currentTarget);
  }, []);

  const onCropChange = useCallback((newCrop: any) => {
    setCrop(newCrop);
  }, []);

  const makeCroppedImage = useCallback(() => {
    if (!imgRef) {
      alert('图片还没加载完，请等一下');
      return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cropX = (crop.x ?? 0) / 100;
    const cropY = (crop.y ?? 0) / 100;
    const cropWidth = (crop.width ?? 0) / 100;
    const cropHeight = (crop.height ?? 0) / 100;
    const width = cropWidth * imgRef.naturalWidth;
    const height = cropHeight * imgRef.naturalHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imgRef, cropX * imgRef.naturalWidth, cropY * imgRef.naturalHeight, width, height, 0, 0, width, height);
    const croppedData = canvas.toDataURL('image/png', 0.9);
    onCropComplete(croppedData);
  }, [imgRef, crop, onCropComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">裁剪图片</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={onCropChange}
            aspect={aspect}
            minHeight={50}
            minWidth={50}
          >
            <img
              src={imageSrc}
              alt="Crop preview"
              onLoad={onLoad}
              style={{ maxWidth: '100%', maxHeight: '60vh', transform: `scale(${scale})` }}
            />
          </ReactCrop>
        </div>

        <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-gray-300 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(3, s + 0.1))}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white transition-colors"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={makeCroppedImage}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              确认裁剪
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
