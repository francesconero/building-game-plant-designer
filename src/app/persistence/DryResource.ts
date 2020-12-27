import { Resource, ResourceType } from "../domain/Resource";

export class DryResource<
  T extends ResourceType = ResourceType
> extends Resource<T> {}
