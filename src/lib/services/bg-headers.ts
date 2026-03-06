import { HttpHeaderName } from '@baragaun/bg-node-client';
import { env } from '$env/dynamic/public';

export function getBgHeaders(): Record<string, string> {
  return {
    [HttpHeaderName.consumer]: 'first-spark-app',
    'x-branding': env.PUBLIC_PROJECTNAME || 'First Spark',
  };
}
