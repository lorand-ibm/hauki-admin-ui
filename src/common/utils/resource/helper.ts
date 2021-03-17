import { Resource, ResourceType } from '../../lib/types';

// eslint-disable-next-line import/prefer-default-export
export const isUnitResource = (resource: Resource): boolean =>
  resource.resource_type === ResourceType.UNIT;
