/* eslint-disable import/prefer-default-export */
import { ControlButton } from './ControlButton';
import {
  MoveRight,
  MoveRightAll,
  MoveLeft,
  MoveLeftAll,
} from '../icons/Controls';

interface ControlButtonsProps {
  onMoveRight: () => void;
  onMoveAllRight: () => void;
  onMoveAllLeft: () => void;
  onMoveLeft: () => void;
  disableMoveRight: boolean;
  disableMoveAllRight: boolean;
  disableMoveAllLeft: boolean;
  disableMoveLeft: boolean;
}

export function ControlButtonGroup({
  onMoveRight,
  onMoveAllRight,
  onMoveAllLeft,
  onMoveLeft,
  disableMoveRight,
  disableMoveAllRight,
  disableMoveAllLeft,
  disableMoveLeft,
}: Readonly<ControlButtonsProps>) {
  return (
    <div className="flex flex-col gap-3 p-2">
      <ControlButton
        icon={<MoveRight />}
        onClick={onMoveRight}
        aria-label="move-right"
        disabled={disableMoveRight}
      />
      <ControlButton
        icon={<MoveRightAll />}
        onClick={onMoveAllRight}
        aria-label="move-all-right"
        disabled={disableMoveAllRight}
      />
      <ControlButton
        icon={<MoveLeftAll />}
        onClick={onMoveAllLeft}
        aria-label="move-all-left"
        disabled={disableMoveAllLeft}
      />
      <ControlButton
        icon={<MoveLeft />}
        onClick={onMoveLeft}
        aria-label="move-left"
        disabled={disableMoveLeft}
      />
    </div>
  );
}
