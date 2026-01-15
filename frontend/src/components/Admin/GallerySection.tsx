import React, { useState, useRef } from 'react';
import { FaPlus, FaTrash, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import {
  useGetGalleryImagesQuery,
  useUploadGalleryImageMutation,
  useUpdateGalleryImageMutation,
  useDeleteGalleryImageMutation,
} from '../../services/galleryApi';
import type { GalleryImage } from '../../services/galleryApi';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const GallerySection: React.FC = () => {
  const { data: images, isLoading, refetch } = useGetGalleryImagesQuery({ includeInactive: true });
  const [uploadImage] = useUploadGalleryImageMutation();
  const [updateImage] = useUpdateGalleryImageMutation();
  const [deleteImage] = useDeleteGalleryImageMutation();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('აირჩიეთ სურათი');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);

      await uploadImage(formData).unwrap();
      toast.success('სურათი წარმატებით აიტვირთა');
      resetUploadForm();
      refetch();
    } catch (error) {
      toast.error('სურათის ატვირთვა ვერ მოხერხდა');
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setShowUploadModal(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleToggleActive = async (image: GalleryImage) => {
    try {
      await updateImage({ id: image.id, data: { isActive: !image.isActive } }).unwrap();
      toast.success(image.isActive ? 'სურათი დამალულია' : 'სურათი გამოჩენილია');
      refetch();
    } catch (error) {
      toast.error('სტატუსის შეცვლა ვერ მოხერხდა');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('დარწმუნებული ხართ რომ გსურთ სურათის წაშლა?')) {
      try {
        await deleteImage(id).unwrap();
        toast.success('სურათი წაიშალა');
        refetch();
      } catch (error) {
        toast.error('სურათის წაშლა ვერ მოხერხდა');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white">ნამუშევრები / გალერეა</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          <FaPlus /> სურათის დამატება
        </button>
      </div>

      {!images || images.length === 0 ? (
        <div className="glassmorphism-card p-12 text-center">
          <p className="text-blue-200 text-lg">გალერეა ცარიელია</p>
          <p className="text-blue-300 text-sm mt-2">დაამატეთ თქვენი ნამუშევრების სურათები</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`glassmorphism-card overflow-hidden group relative ${!image.isActive ? 'opacity-50' : ''}`}
            >
              <div className="aspect-square relative">
                <img
                  src={`${API_BASE}${image.imagePath}`}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleToggleActive(image)}
                    className={`p-3 rounded-full ${image.isActive ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'} hover:scale-110 transition-transform`}
                    title={image.isActive ? 'დამალვა' : 'გამოჩენა'}
                  >
                    {image.isActive ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-3 rounded-full bg-red-500/20 text-red-300 hover:scale-110 transition-transform"
                    title="წაშლა"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
              {image.title && (
                <div className="p-3">
                  <p className="text-white font-semibold truncate">{image.title}</p>
                </div>
              )}
              {!image.isActive && (
                <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded">
                  დამალული
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glassmorphism-card w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white">სურათის დამატება</h3>
                <button
                  onClick={resetUploadForm}
                  className="text-blue-200 hover:text-white"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="text-blue-200">
                      <FaPlus className="mx-auto text-4xl mb-2" />
                      <p>დააჭირეთ სურათის ასატვირთად</p>
                      <p className="text-sm text-blue-300 mt-1">მაქსიმუმ 10MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    სათაური (არასავალდებულო)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="სურათის სათაური"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    აღწერა (არასავალდებულო)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-400 focus:outline-none resize-none"
                    rows={3}
                    placeholder="სურათის აღწერა"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={resetUploadForm}
                    className="flex-1 glassmorphism-button px-6 py-3 text-white"
                  >
                    გაუქმება
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                  >
                    {uploading ? 'იტვირთება...' : 'ატვირთვა'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
