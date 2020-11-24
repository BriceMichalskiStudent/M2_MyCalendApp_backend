
export default class PopulateModel {
    public path: string;
    public populate: any[];

    constructor (path: string, populate: any[]) {
      this.path = path
      this.populate = populate
    }
}
