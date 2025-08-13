import React, { useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-blocks-basic';

export default function GrapesEditor() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs-editor',
      plugins: ['grapesjs-blocks-basic'],
      storageManager: false,
      blockManager: {
        blocks: [
          { id: 'text', label: 'Текст', content: '<p>Редактируйте меня</p>' },
          { id: 'image', label: 'Изображение', content: '<img src="https://via.placeholder.com/300" style="max-width:100%"/>' }
        ],
      },
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs-editor" style={{ height: '100vh' }} />;
}