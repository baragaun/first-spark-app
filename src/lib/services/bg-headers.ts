import { HttpHeaderName, type HttpHeaders } from '@baragaun/bg-node-client';
import { env } from '$env/dynamic/public';

export function getBgHeaders(): HttpHeaders {
  return {
    [HttpHeaderName.consumer]: 'first-spark-app',
    [HttpHeaderName.branding]: env.PUBLIC_PROJECTNAME || 'First Spark',
  };
}
