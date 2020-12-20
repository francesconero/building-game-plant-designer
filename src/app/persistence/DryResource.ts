import { ResourceType } from "../domain/Resource";

export class DryResource<T extends ResourceType> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly color: string,
    readonly type: T
  ) {}
}
