const handleImageLoad = (e) => {
  const reader = new FileReader();

  reader.onload = (ev) => {
    const event = new CustomEvent('onImageLoaded', { detail: ev.target.result });
    // const event = new CustomEvent('onImageLoaded', { detail: e.target.files[0] });
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

export const FileService = {
  loadImage,
};
