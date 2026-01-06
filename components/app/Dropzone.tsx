"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPTED_FILE_TYPES, getAcceptedFileTypesString, MAX_FILE_SIZE } from "@/lib/utils";

interface DropzoneProps {
  onFileAccepted: (file: File) => Promise<void>;
  disabled?: boolean;
}

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

export function Dropzone({ onFileAccepted, disabled }: DropzoneProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setStatus("uploading");
      setProgress(0);
      setErrorMessage("");

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        setStatus("processing");
        await onFileAccepted(file);
        setProgress(100);
        setStatus("success");

        // Reset after success
        setTimeout(() => {
          setStatus("idle");
          setProgress(0);
        }, 3000);
      } catch (error) {
        clearInterval(progressInterval);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Upload failed"
        );

        // Reset after error
        setTimeout(() => {
          setStatus("idle");
          setProgress(0);
          setErrorMessage("");
        }, 5000);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_FILE_TYPES,
      maxSize: MAX_FILE_SIZE,
      maxFiles: 1,
      disabled: disabled || status === "uploading" || status === "processing",
    });

  const rejectionMessage =
    fileRejections.length > 0
      ? fileRejections[0].errors[0].message
      : "";

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600",
        disabled && "cursor-not-allowed opacity-50",
        status === "error" && "border-red-300 bg-red-50"
      )}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {isDragActive ? "Drop your file here" : "Upload your document"}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Drag & drop or click to browse
              </p>
              <p className="mt-2 text-xs text-gray-400">
                {getAcceptedFileTypesString()} • Max 50MB
              </p>
            </div>
          </motion.div>
        )}

        {(status === "uploading" || status === "processing") && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {status === "uploading" ? "Uploading..." : "Processing..."}
              </p>
              <div className="mx-auto mt-3 h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-4"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <p className="font-semibold text-green-600">Upload successful!</p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-4"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-100">
              <XCircle className="h-7 w-7 text-red-600" />
            </div>
            <p className="font-semibold text-red-600">
              {errorMessage || rejectionMessage || "Upload failed"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
