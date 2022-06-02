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
};

const drawText = ({ id, text, color, fontSize, x, y }) => {
  const obj = {
    type: 'text',
    id,
    props: {
      x,
      y,
      fontSize,
      fill: color,
    },
    children: [text],
  }

  return obj;
};

const updateElementPosition = ({ el, x, y, text, color, fontSize }) => {
  el.props.x = x;
  el.props.y = y;
  el.props.fill = color;
  el.props.fontSize = fontSize;
  el.children = [text];
};

export const DrawService = {
  drawImage,
  drawText,
  updateElementPosition,
};
