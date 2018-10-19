import * as React from 'react';
import { FieldArray, FormikErrors, FormikProps, getIn } from 'formik';

import { SynchronousSelectInput, FormikFormField, TextInput } from 'core/presentation';
import { IAccount } from 'core/account';
import { IProject, IProjectCluster } from 'core/domain';
import { IWizardPageProps, wizardPage } from 'core/modal';
import { NgReact } from 'core/reactShims';

import { FormikApplicationsPicker } from './FormikApplicationsPicker';

import './Clusters.css';

export interface IClustersProps extends IWizardPageProps<IProject> {
  accounts: IAccount[];
  applications: string[];
  entries: IProjectCluster[];
}

class ClustersImpl extends React.Component<IClustersProps> {
  public static LABEL = 'Clusters';

  public validate = (value: IProject) => {
    if (value.config.clusters && value.config.clusters.length) {
      const clusterErrors = value.config.clusters.map(cluster => {
        if (!cluster.account) {
          return { account: 'Account must be specified' };
        }
        return null;
      });

      if (clusterErrors.some(val => !!val)) {
        return {
          config: {
            clusters: clusterErrors,
          },
        };
      }
    }

    return {} as FormikErrors<IProject>;
  };

  private toggleAllApps(formik: FormikProps<any>, path: string) {
    const isChecked = !getIn(formik.values, path);
    formik.setFieldValue(path, isChecked ? [] : null);
  }

  public render() {
    const { HelpField } = NgReact;
    const { applications, accounts } = this.props;

    const tableHeader = (
      <tr>
        <td className="wide">Application</td>
        <td className="wide">Account</td>
        <td>
          Stack <HelpField id="project.cluster.stack" />
        </td>
        <td>
          Detail <HelpField id="project.cluster.detail" />
        </td>
        <td />
      </tr>
    );

    return (
      <FieldArray
        name="config.clusters"
        render={clustersArrayHelpers => {
          const formik = clustersArrayHelpers.form;
          const clusters: IProjectCluster[] = formik.values.config.clusters || [];
          const accountNames = accounts.map(account => account.name);

          return (
            <section className="Clusters vertical center">
              <table style={{ width: '100%' }}>
                <thead>{tableHeader}</thead>

                <tbody>
                  {clusters.map((cluster, idx) => {
                    const clusterPath = `config.clusters[${idx}]`;
                    const applicationsPath = `${clusterPath}.applications`;

                    return (
                      <tr key={idx}>
                        <td className="vertical">
                          <label className="sp-group-margin-s-xaxis">
                            <input
                              type="checkbox"
                              onChange={() => this.toggleAllApps(formik, applicationsPath)}
                              checked={!Array.isArray(cluster.applications)}
                            />
                            <span>All</span>
                          </label>

                          {!!cluster.applications && (
                            <FormikApplicationsPicker name={`${applicationsPath}`} applications={applications} />
                          )}
                        </td>

                        <td>
                          <FormikFormField
                            name={`${clusterPath}.account`}
                            layout={({ input }) => <div>{input}</div> /* render only the select */}
                            input={props => (
                              <SynchronousSelectInput {...props} clearable={false} stringOptions={accountNames} />
                            )}
                          />
                        </td>

                        <td>
                          <FormikFormField
                            name={`${clusterPath}.stack`}
                            input={props => <TextInput {...props} inputClassName="sp-padding-xs-xaxis" />}
                          />
                        </td>

                        <td>
                          <FormikFormField
                            name={`${clusterPath}.detail`}
                            input={props => <TextInput {...props} inputClassName="sp-padding-xs-xaxis" />}
                          />
                        </td>

                        <td>
                          <i className="fas fa-trash-alt clicakble" onClick={() => clustersArrayHelpers.remove(idx)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <a
                className="button zombie sp-margin-m horizontal middle center"
                onClick={() => clustersArrayHelpers.push({})}
              >
                <i className="fas fa-plus-circle" /> Add Cluster
              </a>
            </section>
          );
        }}
      />
    );
  }
}

export const Clusters = wizardPage(ClustersImpl);
