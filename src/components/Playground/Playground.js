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

      // Values used to manipulate canvas drawings
      rotationAngle: 0,
      scale: 1,
    }
  }

  componentDidMount() {
    const playgroundElement = document.getElementById(playgroundId);
    this.playground = playgroundElement;

    this.zingRegion = new ZingTouch.Region(playgroundElement);
    this.wesRegion = new Gestures.Region(playgroundElement);
  }

  componentDidUpdate(prevProps) {
    const { action } = this.props;
    if (prevProps.action === action) return;

    // Unregister to last used gesture
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
            rotationAngle={this.state.rotationAngle}
            scale={this.state.scale}
          />
        </div>
      </div>

      {action !== Actions.None &&
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
      </div>
    </>
  }
};
