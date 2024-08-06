import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';

export interface AuthVisibleProps extends React.PropsWithChildren<{}> {
  /** The item for which auth will be checked or a resource class (e.g. Job). */
  item: KubeObject;
  /** The verb associated with the permissions being verifying. See https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb . */
  authVerb: string;
  /** The subresource for which the permissions are being verifyied (e.g. "log" when checking for a pod's log). */
  subresource?: string;
  /** The namespace for which we're checking the permission, if applied. This is mostly useful when checking "creation" using a resource class, instead of an instance. */
  namespace?: string;
  /** Callback for when an error occurs.
   * @param err The error that occurred.
   */
  onError?: (err: Error) => void;
  /** Callback for when the authorization is checked.
   * @param result The result of the authorization check. Its `allowed` member will be true if the user is authorized to perform the specified action on the given resource; false otherwise. The `reason` member will contain a string explaining why the user is authorized or not.
   */
  onAuthResult?: (result: { allowed: boolean; reason: string }) => void;
}

/** A component that will only render its children if the user is authorized to perform the specified action on the given resource.
 * @param props The props for the component.
 */
export default function AuthVisible(props: AuthVisibleProps) {
  const { item, authVerb, subresource, namespace, onError, onAuthResult, children } = props;
  const { data } = useQuery<any>({
    enabled: !!item,
    queryKey: ['authVisible', item, authVerb, subresource, namespace],
    queryFn: () => {
      try {
        return item.getAuthorization(authVerb, { subresource, namespace });
      } catch (e: any) {
        onError?.(e);
      }
    },
  });

  const visible = data?.status?.allowed ?? false;

  useEffect(() => {
    if (data) {
      onAuthResult?.({
        allowed: visible,
        reason: data.status?.reason ?? '',
      });
    }
  }, [data]);

  if (!visible) {
    return null;
  }

  return <>{children}</>;
}
