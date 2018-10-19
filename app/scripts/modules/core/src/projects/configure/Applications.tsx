import { IProject } from 'core/domain';
import { IWizardPageProps, wizardPage } from 'core/modal';
import { FormikApplicationsPicker } from 'core/projects/configure/FormikApplicationsPicker';
import { FormikErrors } from 'formik';
import * as React from 'react';

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
    const { allApplications } = this.props;

    return <FormikApplicationsPicker applications={allApplications} name="config.applications" />;
  }
}

export const Applications = wizardPage(ApplicationsImpl);
