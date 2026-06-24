import React from 'react';
import { Button } from '../Button';
import Copy from '../../icons/Copy';
import { ToolTip } from '..';
import copyToClipboard from './helper';
import HexagonIcon from '../../icons/HexagonIcon';
import Settings from '../../icons/Settings';

interface IWallet {
  name: string;
  id: string;
  balance: string;
}

export interface WalletProps {
  wallet: IWallet;
  onClick: () => void;
  onBtnClick: () => void;
  btnLabel?: string;
  className?: string;
  balanceClassName?: string;
  idClassName?: string;
}

export function Wallet({
  onBtnClick,
  onClick,
  wallet,
  btnLabel = 'Add Funds',
  className = '',
  balanceClassName = '',
  idClassName = '',
}: WalletProps) {
  const [toolTipContent, setToolTipContent] = React.useState<
    'Click to Copy' | 'Copied!'
  >('Click to Copy');

  const handleCopy = () => {
    copyToClipboard(wallet?.id ?? '', () => setToolTipContent('Copied!'));
  };

  return (
    <div
      className={` ${className ?? ''} border-border-border bg-fill-fill relative z-0 flex h-[14.375rem] w-[25.375rem] flex-col items-start justify-between overflow-hidden rounded-2xl border-[0.0625rem] px-4`}
    >
      <div className="flex w-full items-start justify-between py-4">
        <Button
          reversed
          size="md"
          type="button"
          label={wallet?.name}
          icon={<Settings />}
          hierarchy="Tertiary Button"
          onClick={onClick}
        />
        <Button
          size="sm"
          type="button"
          label={btnLabel}
          hierarchy="Secondary"
          onClick={onBtnClick}
        />
      </div>
      <div className={`${balanceClassName ?? ''} text-text-text flex flex-col`}>
        <p className="paragraph-extra-small font-normal">Balance</p>
        <span className=" heading-1-semibold">₹ {wallet.balance}</span>
      </div>
      <div
        className={` ${idClassName ?? ''} paragraph-extra-small text-text-light flex items-center space-x-[0.375rem] `}
      >
        <span>Wallet id</span>
        <div className="bg-fill-fill my-2 flex space-x-2 rounded-lg px-2 font-normal">
          <span>{wallet.id}</span>
          <ToolTip
            iconToolTip={
              <Copy
                className="text-icon-icon h-[1.125rem] w-[1.125rem] cursor-pointer p-[0.1875rem]"
                onMouseLeave={() => setToolTipContent('Click to Copy')}
                onClick={handleCopy}
              />
            }
            contentToolTip={toolTipContent}
            placementToolTip="top-center"
            classNameToolTip="text-nowrap"
          />
        </div>
      </div>
      <HexagonIcon className="text-surface-base absolute -right-28 -top-7 -z-10 h-72 w-60 rotate-[30deg]" />
    </div>
  );
}
