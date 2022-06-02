const triggerDownload = (imgURI) => {
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true
  });

  const a = document.createElement('a');
  a.setAttribute('download', 'MY_COOL_IMAGE.png');
  a.setAttribute('href', imgURI);
  a.setAttribute('target', '_blank');

  a.dispatchEvent(evt);
}

const handleImageLoad = (e) => {
  const reader = new FileReader();

  reader.onload = (ev) => {
    const event = new CustomEvent('onImageLoaded', { detail: ev.target.result });
    document.dispatchEvent(event);
  }

  reader.readAsDataURL(e.target.files[0]);
}

const loadImage = (fileInputRef) => {
  const { current } = fileInputRef;

  current.removeEventListener('change', handleImageLoad);
  current.addEventListener('change', handleImageLoad);
  current.click();
}

const downloadImage = () => {
  const svg = document.getElementById('draw-area');
  const canvas = document.getElementById('canvas');

  const ctx = canvas.getContext('2d');
  const data = (new XMLSerializer()).serializeToString(svg);
  const DOMURL = window.URL || window.webkitURL || window;

  const img = new Image();
  const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  const url = DOMURL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);

    const imgURI = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    triggerDownload(imgURI);
  };

  img.src = url;
}

export const FileService = {
  loadImage,
  downloadImage,
};
