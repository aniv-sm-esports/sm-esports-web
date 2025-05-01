import { Model } from "sequelize-typescript";

export abstract class Entity<TModel> extends Model {
  abstract Id: number;
  abstract ctor(): TModel;
}
