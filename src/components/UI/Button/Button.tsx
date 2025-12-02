import type { ButtonType } from '../../../types/components';
import './Button.css';

export default function Button(props: ButtonType) {
  const { variant, onClick, size, text, ref, disabled } = props;
  let content = text;
  let classes = '';

  if (variant === 'close') {
    content = '\u00D7';
  } else if (variant === 'left-arrow') {
    content = '\u003C';
  } else if (variant === 'right-arrow') {
    content = '\u003E';
  } else if (variant === 'edit') {
    content = '\u270E';
  }

  if (disabled) {
    classes = `btn btn-disabled btn-${size || 'medium'}`;
  } else {
    classes = `btn btn-${variant || 'default'} btn-${size || 'medium'}`;
  }

  return (
    <div ref={ref} onClick={disabled ? () => {} : onClick} className={classes}>
      {content}
    </div>
  );
}
