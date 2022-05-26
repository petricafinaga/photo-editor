import './Canvas.css';

import { PureComponent, createRef } from 'react';

import { DrawService } from './../../services/Draw.service';

export class Canvas extends PureComponent {
  canvasRef = createRef(null);

  onImageLoad = ({ detail }) => {
    DrawService.drawCanvasImage({ imageSource: detail, canvas: this.canvasRef.current });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rotationAngle !== this.props.rotationAngle) {
      DrawService.rotateCanvasImage({ angle: this.props.rotationAngle, canvas: this.canvasRef.current });
    }
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.imageSmoothingEnabled = false;

    document.addEventListener('onImageLoaded', this.onImageLoad);
  }

  componentWillUnmount() {
    document.removeEventListener('onImageLoaded', this.onImageLoad);
  }

  render() {
    return (
      <canvas id="canvas" ref={this.canvasRef} className="canvas" />
    );
  }
}
