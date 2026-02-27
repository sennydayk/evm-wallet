import { Button } from './Button';
import copyIcon from '../../assets/copy.svg';
import checkIcon from '../../assets/check.svg';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export interface CopyButtonProps {
  text: string;
  className?: string;
  ariaLabel?: string;
}

const DEFAULT_ARIA_LABEL_COPIED = 'Copied';
const DEFAULT_ARIA_LABEL_COPY = 'Copy to clipboard';

export const CopyButton = ({ text, className = '', ariaLabel }: CopyButtonProps) => {
  const { copied, copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => copyToClipboard(text)}
      aria-label={ariaLabel ?? (copied ? DEFAULT_ARIA_LABEL_COPIED : DEFAULT_ARIA_LABEL_COPY)}
    >
      <img
        src={copied ? checkIcon : copyIcon}
        alt=""
        className={`copy-btn__icon ${copied ? 'copy-btn__icon--copied' : ''}`}
      />
    </Button>
  );
};
