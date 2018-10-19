import * as React from 'react';
import Select, { Option, ReactSelectProps } from 'react-select';

import { noop } from 'core/utils';

import { IFormInputProps } from '../interface';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
interface ISynchronousSelectInputProps extends IFormInputProps, Omit<ReactSelectProps, 'options' | 'onChange'> {
  stringOptions: string[];
}

interface ISynchronousSelectInputState {
  options: Option[];
}

function makeOptions(options: string[] | Option[]): Option[] {
  options = options || [];
  if (options && options[0] && (options[0] as Option).label) {
    return options as Option[];
  }

  const strings = options as string[];
  return strings.map(str => ({ label: str, value: str }));
}

const selectErrorStyle = {
  borderColor: 'var(--color-danger)',
  '-webkitBoxShadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
  boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
};

export class SynchronousSelectInput extends React.Component<
  ISynchronousSelectInputProps,
  ISynchronousSelectInputState
> {
  public state: ISynchronousSelectInputState = {
    options: [],
  };

  public componentDidMount() {
    this.setState({ options: makeOptions(this.props.stringOptions) });
  }

  public componentDidUpdate(prevProps: ISynchronousSelectInputProps) {
    if (this.props.stringOptions !== prevProps.stringOptions) {
      this.setState({ options: makeOptions(this.props.stringOptions) });
    }
  }

  public render() {
    const { stringOptions, field, validation, inputClassName, ...otherProps } = this.props;

    const onChange = (selectedOption: Option) => {
      const fakeEvent = {
        target: {
          value: selectedOption.value,
          name: field.name,
        },
        persist: noop,
        stopPropagation: noop,
        preventDefault: noop,
      };
      return (field.onChange || noop)(fakeEvent);
    };

    const fieldProps = { name: field.name, value: field.value || '', onBlur: noop, onChange };

    const style = validation.validationStatus === 'error' ? selectErrorStyle : {};

    return (
      <Select
        options={this.state.options}
        className={`${inputClassName}`}
        style={style}
        {...fieldProps}
        {...otherProps}
      />
    );
  }
}
