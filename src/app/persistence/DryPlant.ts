export class DryPlant {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly targetFlows: Set<string>,
    readonly recipes: Set<string>
  ) {}
}
