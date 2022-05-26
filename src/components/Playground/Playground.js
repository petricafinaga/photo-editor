import './Playground.css';

import { useEffect, useState } from 'react';
import ZingTouch from 'zingtouch';

import { Actions } from '../../settings/Constants.settings';

import { DrawArea } from './../DrawArea/DrawArea';

const playgroundId = 'playground';

export const Playground = ({ action }) => {
  const [zingRegion, setZingRegion] = useState(null);
  const [playground, setPlayground] = useState(null);
  const [displayValue, setDisplayValue] = useState(0);

  // Values used to manipulate canvas drawings
  const [rotationAngle, setRotationAngle] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!zingRegion || !playground) return;

    // Unbind to all zing touch events
    zingRegion.unbind(playground);

    switch (action) {
      case Actions.Rotate:
        zingRegion.bind(playground, action, (e) => {
          setRotationAngle(prevValue => {
            return parseInt(prevValue + e.detail.distanceFromLast) % 360;
          });
        });
        setDisplayValue(rotationAngle);
        break;

      case Actions.Pinch:
        zingRegion.bind(playground, action, (e) => {
          // setRotationAngle(e.detail.distanceFromLast);
          console.log('pinch -- ', e.detail, e.detail.distanceFromLast);
        });
        setDisplayValue(scale);
        break;
      case Actions.Expand:
        zingRegion.bind(playground, 'expand', (e) => {
          // setRotationAngle(e.detail.distanceFromLast);
          console.log('expand -- ', e.detail, e.detail.distanceFromLast);
        });
        setDisplayValue(scale);
        break;

      case Actions.None:
      default:
        break;
    };
  }, [action, zingRegion, playground, scale, rotationAngle]);

  useEffect(() => {
    const playgroundElement = document.getElementById(playgroundId);
    setPlayground(playgroundElement);

    setZingRegion(new ZingTouch.Region(playgroundElement));
  }, []);

  return (
    <>
      <div id={playgroundId} className="playground">
        <DrawArea
          rotationAngle={rotationAngle}
          scale={scale}
        />
      </div>

      {action !== Actions.None &&
        <div className="show-value">
          {displayValue}
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
            value={rotationAngle < -180 || rotationAngle > 180 ? rotationAngle % 180 : rotationAngle}
            onChange={(e) => { setRotationAngle(parseInt(e.target.value)) }}
          />
        }
        {action === Actions.Pinch &&
          <input
            className="slider"
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={scale}
            onChange={(e) => { setScale(parseFloat(e.target.value)) }}
          />
        }
        {action === Actions.Expand &&
          <input
            className="slider"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={scale}
            onChange={(e) => { setScale(parseFloat(e.target.value)) }}
          />
        }
      </div>
    </>
  );
};
