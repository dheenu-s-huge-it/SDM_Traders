// "use client"
import React, { useState } from "react";
import dynamic from "next/dynamic";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const TextEditor = ({ value, setValue }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [
        // { list: "ordered" },
        { list: 'bullet' },
        // { indent: "-1" },
        // { indent: "+1" },
      ],
      // [{ table: "table" }],
      // ["table", "link", "image", "video"],
      // ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    // "indent",
    // "table", "link", "image", "video"
  ];

  return (
    <ReactQuill
      modules={modules}
      formats={formats}
      theme="snow"
      value={value}
      onChange={(e) => setValue(e)}
      style={{ fontFamily: 'Times New Roman, serif' }}
    />
  );
};

export default TextEditor;
