import * as React from 'react';
import { Option, ReactSelectProps } from 'react-select';

import { noop } from 'core/utils';
import { TetheredSelect } from 'core/presentation';

import { IFormInputProps } from '../interface';

interface ISelectInputProps extends IFormInputProps, ReactSelectProps {
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

/**
 * A react-select input
 *
 * This input supports error validation state rendering
 * It also has a simplified stringOptions prop for when Option interface is overkill.
 * It adapts the onChange event to a controlled input event
 *
 * This component does not attempt to support async loading
 */
export class SelectInput extends React.Component<ISelectInputProps, ISynchronousSelectInputState> {
  public state: ISynchronousSelectInputState = {
    options: [],
  };

  public componentDidMount() {
    this.setState({ options: makeOptions(this.props.stringOptions) });
  }

  public componentDidUpdate(prevProps: ISelectInputProps) {
    if (this.props.stringOptions !== prevProps.stringOptions) {
      this.setState({ options: makeOptions(this.props.stringOptions) });
    } else if (this.props.options !== prevProps.options) {
      this.setState({ options: this.props.options });
    }
  }

  public render() {
    const { stringOptions, field, validation, inputClassName, ...otherProps } = this.props;
    const { options } = this.state;

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

    // TODO: see implementing onBlur makes sense
    const fieldProps = { name: field.name, value: field.value || '', onBlur: noop, onChange };
    const style = validation.validationStatus === 'error' ? selectErrorStyle : {};
    return (
      <TetheredSelect options={options} className={inputClassName} style={style} {...fieldProps} {...otherProps} />
    );
  }
}
