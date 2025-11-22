import React, { useRef } from "react";

export default function FileUpload({ onFileSelected }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onFileSelected({
        fileName: file.name,
        fileDataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="px-2 text-lg"
        title="File yuborish"
      >
        📎
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
