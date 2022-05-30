const drawImage = ({ imageSource, drawArea }) => {
  const { clientWidth } = drawArea.current;
  const obj = {
    type: 'image',
    props: {
      xlinkHref: imageSource,
      width: clientWidth,
      height: "100%",
    },
    children: [],
  };

  return obj;
}

export const DrawService = {
  drawImage,
};
