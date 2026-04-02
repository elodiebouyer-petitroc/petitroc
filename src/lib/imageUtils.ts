export const compressImage = (file: File, maxWidth: number = 1200, maxHeight: number = 1200, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        (ctx as CanvasRenderingContext2D).drawImage(img, 0, 0, width, height);
        // Convert to WebP with 80% quality
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const blurRegion = (dataUrl: string, regions: { ymin: number, xmin: number, ymax: number, xmax: number }[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);

      regions.forEach(region => {
        const x = (region.xmin / 1000) * canvas.width;
        const y = (region.ymin / 1000) * canvas.height;
        const w = ((region.xmax - region.xmin) / 1000) * canvas.width;
        const h = ((region.ymax - region.ymin) / 1000) * canvas.height;

        // Apply blur by drawing a pixelated version or just a solid color/gradient
        // For a simple "blur", we can draw a semi-transparent rectangle or use filter
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();
        
        // Simple pixelation/blur effect
        ctx.filter = 'blur(10px)';
        ctx.drawImage(canvas, 0, 0);
        
        // Add a semi-transparent overlay just in case
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x, y, w, h);
        
        ctx.restore();
      });

      resolve(canvas.toDataURL('image/webp', 0.8));
    };
    img.onerror = (error) => reject(error);
  });
};
