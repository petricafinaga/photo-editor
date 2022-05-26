import './DrawArea.css';

import React, { PureComponent, createRef } from 'react';

import { DrawService } from './../../services/Draw.service';

export class DrawArea extends PureComponent {
  drawAreaRef = createRef(null);
  gRef = createRef(null);

  constructor(props) {
    super(props);
    this.state = { objects: [], viewbox: null };
  }

  set(ref, attrribute, value) {
    ref.setAttribute(attrribute, value);
  }

  onImageLoad = ({ detail }) => {
    this.setState({ objects: [DrawService.drawImage({ imageSource: detail, drawArea: this.drawAreaRef })] });
  }

  componentDidUpdate(prevProps) {
    const drawArea = this.drawAreaRef.current;

    if (prevProps.rotationAngle !== this.props.rotationAngle) {
      this.set(this.gRef.current, 'transform', `rotate(${this.props.rotationAngle}, ${drawArea.clientWidth / 2}, ${drawArea.clientHeight / 2})`);
    }

    if (prevProps.scale !== this.props.scale) {
      this.set(drawArea, 'transform', `scale(${this.props.scale})`);
    }
  }

  componentDidMount() {
    const drawArea = this.drawAreaRef.current;

    this.set(drawArea, 'width', drawArea.clientWidth);
    this.set(drawArea, 'height', drawArea.clientHeight);
    this.setState({ viewbox: `0 0 ${drawArea.clientWidth} ${drawArea.clientHeight}` });

    document.addEventListener('onImageLoaded', this.onImageLoad);
  }

  componentWillUnmount() {
    document.removeEventListener('onImageLoaded', this.onImageLoad);
  }

  render() {
    return (
      <svg
        id="draw-area"
        ref={this.drawAreaRef}
        viewBox={this.state.viewbox}
        className="draw-area"
        xmlns="http://www.w3.org/2000/svg"
        xlinkHref="http://www.w3.org/1999/xlink"
      >
        <g ref={this.gRef}>
          {this.state.objects.map((obj, i) => {
            return React.createElement(obj.type, { ...obj.props, key: obj.type + i }, [...obj.children]);
          })}
        </g>
      </svg>
    );
  }
}
