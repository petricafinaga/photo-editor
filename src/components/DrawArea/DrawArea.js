import './DrawArea.css';

import React, { PureComponent, createRef } from 'react';

import { DrawService } from './../../services/Draw.service';

export class DrawArea extends PureComponent {
  drawAreaRef = createRef(null);
  gRef = createRef(null);
  objId = 0;

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

  handleClick = (e) => {
    // Text draw starts here
    if (this.props.drawText) {
      const lastCreatedElement = this.state.objects[this.state.objects.length - 1];

      const { text, color, strokeWidth } = this.props;

      // Update properties of the last element
      if (lastCreatedElement?.id === this.objId) {
        DrawService.updateElementPosition({ el: lastCreatedElement, x: e.clientX, y: e.clientY, text, color, fontSize: strokeWidth, })
        const elements = [...this.state.objects];
        elements.pop();
        elements.push(lastCreatedElement);

        this.setState({ objects: elements });
      } else {
        // Means that we need to create another text element
        const el = DrawService.drawText({ id: this.objId, text, color, fontSize: strokeWidth, x: e.clientX, y: e.clientY });

        const elements = [...this.state.objects, el];
        this.setState({ objects: elements });
      }

      // Free draw starts here
    } else if (this.props.freeDraw) {
      const lastCreatedElement = this.state.objects[this.state.objects.length - 1];
      const { color, strokeWidth } = this.props;

      // Update properties of the last element
      if (lastCreatedElement?.id === this.objId) {
        console.log(lastCreatedElement);
        DrawService.updateFreeDraw({ el: lastCreatedElement, x: e.clientX, y: e.clientY, color, strokeWidth, })
        const elements = [...this.state.objects];
        elements.pop();
        elements.push(lastCreatedElement);

        this.setState({ objects: elements });
      } else {
        // Means that we need to create another text element
        const el = DrawService.freeDraw({ id: this.objId, color, strokeWidth, x: e.clientX, y: e.clientY });

        const elements = [...this.state.objects, el];
        this.setState({ objects: elements });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const drawArea = this.drawAreaRef.current;

    if (prevProps.rotationAngle !== this.props.rotationAngle) {
      this.set(this.gRef.current, 'transform', `rotate(${this.props.rotationAngle}, ${drawArea.clientWidth / 2}, ${drawArea.clientHeight / 2})`);
    }

    if (prevProps.scale !== this.props.scale) {
      this.set(drawArea, 'transform', `scale(${this.props.scale})`);
    }

    if (prevProps.drawText !== this.props.drawText && !this.props.drawText) {
      this.objId++;
    }

    if (prevProps.freeDraw !== this.props.freeDraw && !this.props.freeDraw) {
      this.objId++;
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
        onClick={this.handleClick}
      >
        <g ref={this.gRef}>
          {this.state.objects.map((obj, i) => {
            return React.createElement(obj.type, { ...obj.props, key: obj.type + i }, [...obj?.children]);
          })}
        </g>
      </svg>
    );
  }
}
