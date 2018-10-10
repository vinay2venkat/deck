import { IProject } from 'core/domain';
import { IWizardPageProps, wizardPage } from 'core/modal';
import { FormikFormField, IFormInputProps, StandardFieldLayout, TextInput } from 'core/presentation';
import { ArrayHelpers, FieldArray, FormikErrors } from 'formik';
import * as React from 'react';
import { Option } from 'react-select';
import VirtualizedSelect from 'react-virtualized-select';

import './Applications.css';

export interface IApplicationsProps extends IWizardPageProps<IProject> {
  allApplications: string[];
}

class ApplicationsImpl extends React.Component<IApplicationsProps> {
  public static LABEL = 'Applications';

  public validate(project: IProject) {
    const configuredApps = (project.config && project.config.applications) || [];
    const getApplicationError = (app: string) =>
      this.props.allApplications.includes(app) ? undefined : `Application '${app}' does not exist.`;

    const applicationErrors = configuredApps.map(getApplicationError);
    if (!applicationErrors.some(err => !!err)) {
      return {};
    }

    return {
      config: {
        applications: applicationErrors,
      },
    } as FormikErrors<IProject>;
  }

  public render() {
    const { formik } = this.props;
    const { values } = formik;
    const applications = values.config.applications || [];
    const selectOptions: Array<Option<string>> = this.props.allApplications
      .filter(app => !applications.includes(app))
      .map(app => ({ value: app, label: app }));

    const TrashButton = ({ arrayHelpers, index }: { arrayHelpers: ArrayHelpers; index: number }) => (
      <button type="button" onClick={() => arrayHelpers.remove(index)} className="nostyle">
        <i className="fas fa-trash-alt" />
      </button>
    );

    const Application = (props: IFormInputProps) => {
      const appClassName = 'body-small zombie-label flex-1 sp-padding-xs-yaxis sp-padding-s-xaxis sp-margin-xs-yaxis';
      const isError = props.validation.validationStatus === 'error';
      // When there is an error, render a disabled TextInput with failed validation, else render the weird box ui
      return isError ? <TextInput disabled={true} {...props} /> : <p className={appClassName}>{props.field.value}</p>;
    };

    return (
      <FieldArray
        name="config.applications"
        render={arrayHelpers => (
          <div className="Applications">
            {applications.map((app, index) => (
              <FormikFormField
                key={app}
                name={`config.applications[${index}]`}
                label={<label />}
                input={Application}
                actions={<TrashButton arrayHelpers={arrayHelpers} index={index} />}
                touched={true}
              />
            ))}

            <StandardFieldLayout
              label={<label />}
              input={
                <VirtualizedSelect
                  options={selectOptions}
                  onChange={(item: Option<string>) => arrayHelpers.push(item.value)}
                  className="body-small"
                />
              }
            />
          </div>
        )}
      />
    );
  }
}

export const Applications = wizardPage(ApplicationsImpl);
