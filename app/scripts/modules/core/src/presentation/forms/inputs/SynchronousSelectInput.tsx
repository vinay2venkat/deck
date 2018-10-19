import * as React from 'react';
import Select, { Option, ReactSelectProps } from 'react-select';

import { noop } from 'core/utils';

import { IFormInputProps } from '../interface';

interface ISynchronousSelectInputProps extends IFormInputProps, ReactSelectProps {
  // Specify either stringOptions or options
  stringOptions?: string[];
  options?: Option[];
}

interface ISynchronousSelectInputState {
  options: Option[];
}

function makeOptions(options: string[]): Option[] {
  options = options || [];
  return options.map(str => ({ label: str, value: str }));
}

// TODO: use standard classes; currently the form-control class messes up the rendering of this react-select
const selectErrorStyle = {
  borderColor: 'var(--color-danger)',
  WebkitBoxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
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
    } else if (this.props.options !== prevProps.options) {
      this.setState({ options: this.props.options });
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
