import React from 'react';

class ImageList extends React.Component {
  render() {
    let images = [];
    const { photo } = this.props;
    const lastIndex = photo.length - 1;
    photo.map((p, i) => {
      if (i === lastIndex) {
        // last one
        images.push(<img alt={p.alt} className="block h-auto w-full" src={p.src} />);
      } else {
        // not last one
        images.push(<img alt={p.alt} className="block h-auto w-full mb-1" src={p.src} />);
      }
      return true;
    });
    return images;
  }
}

export default ImageList;
