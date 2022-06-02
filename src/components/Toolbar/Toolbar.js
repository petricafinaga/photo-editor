import './Toolbar.css';
import { useRef, useState } from 'react';

import { FileService } from './../../services/File.service';

import { ICON_COLOR, ICON_SIZE } from '../../settings/Style.settings';
import { Actions } from '../../settings/Constants.settings';

import { PlusCircle, ArrowRepeat, ArrowsAngleContract, Pencil, Fonts, FiletypePng } from 'react-bootstrap-icons';

export const Toolbar = ({ setAction }) => {
  const [highlighted, setHighlighted] = useState(Actions.None);
  const fileInputRef = useRef(null);

  const openFileUpload = () => {
    FileService.loadImage(fileInputRef);
  }

  const setActionButton = (action) => {
    let newAction = action;
    if (highlighted === action) newAction = Actions.None;

    setAction(newAction);
    setHighlighted(newAction);
  }

  const isHighlighted = (action => highlighted === action ? 'is-highlighted' : '');

  return (
    <div className="toolbar">
      <div className="toolbar-actions">
        <PlusCircle color={ICON_COLOR} size={ICON_SIZE} onClick={openFileUpload} />
        <ArrowRepeat
          color={ICON_COLOR}
          size={ICON_SIZE}
          className={`${isHighlighted(Actions.Rotate)}`}
          onClick={() => setActionButton(Actions.Rotate)}
        />
        <ArrowsAngleContract
          color={ICON_COLOR}
          size={ICON_SIZE}
          className={`${isHighlighted(Actions.Zoom)}`}
          onClick={() => setActionButton(Actions.Zoom)}
        />
        <Pencil
          color={ICON_COLOR}
          size={ICON_SIZE}
          className={`${isHighlighted(Actions.Draw)}`}
          onClick={() => setActionButton(Actions.Draw)}
        />
        <Fonts
          color={ICON_COLOR}
          size={ICON_SIZE}
          className={`${isHighlighted(Actions.Text)}`}
          onClick={() => setActionButton(Actions.Text)}
        />

        <FiletypePng
          color={ICON_COLOR}
          size={ICON_SIZE}
          onClick={() => FileService.downloadImage()}
        />

        <input type='file' ref={fileInputRef} className="display-none" />
        <canvas id='canvas' className="display-none" />
      </div>
    </div>
  );
}
