import React from 'react';

class ImageList extends React.Component {
  render() {
    const { photo } = this.props;
    const lastIndex = photo.length - 1;
    return photo.map((p, i) => {
      const normalizedSrc = /^(https?:)?\/\//i.test(p.src) || p.src.startsWith('/') ? p.src : `/${p.src}`;

      if (i === lastIndex) {
        // last one
        return <img key={`${p.src}-${i}`} alt={p.alt} className="block h-auto w-full" src={normalizedSrc} />;
      } else {
        // not last one
        return <img key={`${p.src}-${i}`} alt={p.alt} className="block h-auto w-full mb-1" src={normalizedSrc} />;
      }
    });
  }
}

export default ImageList;
