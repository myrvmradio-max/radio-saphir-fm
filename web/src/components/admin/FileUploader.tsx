"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import { 
  UploadCloud, 
  Trash2, 
  Image as ImageIcon, 
  Music, 
  CheckCircle2, 
  Loader2, 
  Plus
} from "lucide-react";

interface FileUploaderProps {
  type: "image" | "images" | "audio";
  folder: string;
  value: string | string[];
  onChange: (value: any) => void;
  onAudioDuration?: (duration: number) => void;
  label?: string;
}

export default function FileUploader({
  type,
  folder,
  value,
  onChange,
  onAudioDuration,
  label
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normaliser les valeurs d'images multiples
  const getImagesArray = (): string[] => {
    if (type !== "images") return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value.split(",").map(u => u.trim()).filter(u => u !== "");
    }
    return [];
  };

  const images = getImagesArray();

  // Déclencher le sélecteur de fichier
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Gérer le Drag & Drop
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFiles(e.target.files);
    }
  };

  // Uploader les fichiers
  const uploadFiles = async (fileList: FileList) => {
    setUploading(true);
    setProgress(10); // Début simulé

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        // Validation basique
        if (type === "audio" && !file.type.startsWith("audio/")) {
          alert("Veuillez sélectionner un fichier audio valide.");
          continue;
        }
        if ((type === "image" || type === "images") && !file.type.startsWith("image/")) {
          alert("Veuillez sélectionner une image valide.");
          continue;
        }

        // Nom de fichier unique
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const fileName = `${Date.now()}-${cleanName}`;
        const filePath = `${folder}/${fileName}`;

        setProgress(30);

        // Upload sur Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("saphir-media")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) throw uploadError;

        setProgress(70);

        // Récupérer l'URL publique
        const { data } = supabase.storage
          .from("saphir-media")
          .getPublicUrl(filePath);

        if (!data.publicUrl) {
          throw new Error("Impossible de récupérer l'URL publique.");
        }

        uploadedUrls.push(data.publicUrl);

        // Si c'est un fichier audio et qu'un callback de durée est fourni
        if (type === "audio" && onAudioDuration) {
          try {
            const audioUrl = URL.createObjectURL(file);
            const audio = new Audio(audioUrl);
            audio.addEventListener("loadedmetadata", () => {
              onAudioDuration(Math.round(audio.duration));
              URL.revokeObjectURL(audioUrl);
            });
          } catch (audioErr) {
            console.error("Erreur de calcul de la durée audio:", audioErr);
          }
        }

        // Limiter à 1 pour les types simples
        if (type !== "images") break;
      }

      setProgress(100);

      // Mettre à jour l'état parent
      if (type === "images") {
        const newImages = [...images, ...uploadedUrls];
        // Renvoyer sous la même forme que reçue (tableau ou string séparé par des virgules)
        if (Array.isArray(value)) {
          onChange(newImages);
        } else {
          onChange(newImages.join(", "));
        }
      } else {
        if (uploadedUrls.length > 0) {
          onChange(uploadedUrls[0]);
        }
      }

      alert("Téléversement réussi !");
    } catch (error: any) {
      console.error("Erreur d'upload:", error);
      alert("Erreur lors du téléversement : " + error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Supprimer un fichier
  const handleRemove = (indexToRemove?: number) => {
    if (type === "images" && typeof indexToRemove === "number") {
      const updatedImages = images.filter((_, i) => i !== indexToRemove);
      if (Array.isArray(value)) {
        onChange(updatedImages);
      } else {
        onChange(updatedImages.join(", "));
      }
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs font-bold text-saphir-navy/40 uppercase tracking-widest block">
          {label}
        </label>
      )}

      {/* Input caché */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={type === "audio" ? "audio/*" : "image/*"}
        multiple={type === "images"}
        disabled={uploading}
      />

      {/* Zone de Drag and Drop (quand aucun fichier pour type simple, ou toujours disponible pour images multiples) */}
      {(type === "images" || !value) && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`aspect-[21/9] w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 overflow-hidden ${
            dragActive
              ? "border-saphir-electric bg-saphir-electric/5 scale-[0.99]"
              : "border-gray-200 bg-gray-50 hover:bg-gray-100/50 hover:border-saphir-navy/20"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="animate-spin text-saphir-electric" />
              <span className="text-xs font-bold text-saphir-navy/60">
                Téléversement en cours... {progress > 0 && `${progress}%`}
              </span>
              <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-saphir-electric transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-saphir-navy/30 shadow-sm">
                {type === "audio" ? <Music size={22} /> : <UploadCloud size={22} />}
              </div>
              <div className="text-center px-4">
                <p className="text-xs font-bold text-saphir-navy">
                  Glissez-déposez votre fichier ici, ou{" "}
                  <span className="text-saphir-electric hover:underline">parcourez</span>
                </p>
                <p className="text-[10px] text-saphir-navy/40 font-medium mt-1">
                  {type === "audio"
                    ? "Formats acceptés : MP3, WAV, M4A"
                    : "Formats acceptés : PNG, JPG, WEBP, GIF"}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Rendu des aperçus pour Image Unique */}
      {type === "image" && value && typeof value === "string" && (
        <div className="relative group aspect-video w-full rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-saphir-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleButtonClick}
              className="p-3 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={() => handleRemove()}
              className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Rendu des aperçus pour Images Multiples */}
      {type === "images" && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <img src={imgUrl} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-saphir-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                  title="Supprimer cette image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rendu pour Audio Unique */}
      {type === "audio" && value && typeof value === "string" && (
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-saphir-navy text-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Music size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-saphir-navy truncate">Fichier Audio Chargé</p>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-saphir-electric font-medium hover:underline truncate block"
              >
                {value}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-emerald-500 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-md">
              <CheckCircle2 size={12} /> Prêt
            </div>
            <button
              type="button"
              onClick={() => handleRemove()}
              className="p-2 text-saphir-navy/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Supprimer le fichier"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
