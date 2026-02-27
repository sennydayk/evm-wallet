import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

type InputAsInput = BaseInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps> & {
    multiline?: false;
  };

type InputAsTextarea = BaseInputProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseInputProps> & {
    multiline: true;
    rows?: number;
  };

export type InputProps = InputAsInput | InputAsTextarea;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      placeholder,
      disabled,
      className = '',
      multiline = false,
      ...rest
    } = props;

    const classNames = ['input', className].filter(Boolean).join(' ');

    if (multiline) {
      const { rows = 4 } = rest as InputAsTextarea;
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={classNames}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          {...rest as TextareaHTMLAttributes<HTMLTextAreaElement>}
        />
      );
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type="text"
        className={classNames}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        {...rest as InputHTMLAttributes<HTMLInputElement>}
      />
    );
  }
);

Input.displayName = 'Input';
