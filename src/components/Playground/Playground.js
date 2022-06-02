import './Playground.css';

import { PureComponent } from 'react';
import ZingTouch from 'zingtouch';
import Gestures from 'westures';

import { Actions } from '../../settings/Constants.settings';
import { DrawArea } from './../DrawArea/DrawArea';

const playgroundId = 'playground';

export class Playground extends PureComponent {
  wesRegion;
  zingRegion;
  playground;

  constructor(props) {
    super(props);

    this.state = {
      displayValue: 0,
      gesture: null,
      drawText: false,
      freeDraw: false,

      // Values used to manipulate canvas drawings
      rotationAngle: 0,
      scale: 1,
      color: '#FF0000',
      stroke: 20,
      text: '',
    }
  }

  componentDidMount() {
    const playgroundElement = document.getElementById(playgroundId);
    this.playground = playgroundElement;

    this.zingRegion = new ZingTouch.Region(playgroundElement, [], false);
    this.wesRegion = new Gestures.Region(playgroundElement);
  }

  componentDidUpdate(prevProps) {
    const { action } = this.props;
    if (prevProps.action === action) return;

    // Unregister to last used gesture
    this.setState({ drawText: false, text: '', freeDraw: false });
    this.zingRegion.unbind(this.playground);
    if (this.state.gesture) {
      this.wesRegion.removeGesture(this.state.gesture);
      this.setState({ gesture: null });
    }

    switch (action) {
      case Actions.Rotate:
        this.zingRegion.bind(this.playground, action, (e) => {
          const value = parseInt(this.state.rotationAngle + e.detail.distanceFromLast) % 360;
          this.setState({ rotationAngle: value, displayValue: value });
        });
        break;

      case Actions.Zoom:
        const zoomGesture = new Gestures.Pinch(this.playground, (e) => {
          const zoomFactor = this.state.scale < 1.5 ? 0.01 : 0.05;
          const zoom = this.state.scale + (e.scale > 1 ? zoomFactor : -zoomFactor);
          const value = parseFloat(zoom < 0 ? 0 : zoom > 5 ? 5 : zoom);

          this.setState({ scale: value, displayValue: value });
        });
        this.wesRegion.addGesture(zoomGesture);
        this.setState({ gesture: zoomGesture });
        break;

      case Actions.Draw:
        this.setState({ freeDraw: true });
        break;

      case Actions.Text:
        this.setState({ drawText: true });
        break;

      case Actions.None:
      default:
        break;
    };
  }

  render() {
    const { action } = this.props;
    return <>
      <div id={playgroundId}>
        <div className="playground">
          <DrawArea
            freeDraw={this.state.freeDraw}
            drawText={this.state.drawText}
            color={this.state.color}
            text={this.state.text}
            strokeWidth={this.state.stroke}
            rotationAngle={this.state.rotationAngle}
            scale={this.state.scale}
          />
        </div>
      </div>

      {action !== Actions.None && action !== Actions.Draw && action !== Actions.Text &&
        <div className="show-value">
          {this.state.displayValue}
        </div>
      }
      <div className="actions">
        {action === Actions.Rotate &&
          <input
            className="slider"
            type="range"
            min={-180}
            max={180}
            step={1}
            value={this.state.rotationAngle}
            onChange={(e) => { this.setState({ rotationAngle: e.target.value, displayValue: e.target.value }); }}
          />
        }
        {action === Actions.Zoom &&
          <input
            className="slider"
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={this.state.scale}
            onChange={(e) => { this.setState({ scale: e.target.value, displayValue: e.target.value }); }}
          />
        }
        {(action === Actions.Draw || action === Actions.Text) &&
          <>
            <input
              className="draw-action color-picker"
              type="color"
              value={this.state.color}
              onChange={(e) => { this.setState({ color: e.target.value }); }}
            />

            <input
              className=" draw-action stroke-width"
              type="number"
              pattern="/^[0-9]*$/"
              min="0"
              max="100"
              value={this.state.stroke}
              onChange={(e) => { this.setState({ stroke: e.target.value }); }}
            />
            {action === Actions.Text &&
              <input
                className=" draw-action text-value"
                type="text"
                value={this.state.text}
                onChange={(e) => { this.setState({ text: e.target.value }); }}
              />
            }
          </>
        }
      </div>
    </>
  }
};
