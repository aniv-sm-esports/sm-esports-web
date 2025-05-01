import {AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {ModelAttributeColumnOptions} from 'sequelize';
import {Entity} from './Entity';

export enum PersonRoleTypeEnum {
  GeneralUser = 0,
  BoardMember = 1
}

@Table({
  modelName: 'PersonRoleType',
  tableName: 'PersonRoleType',
  freezeTableName: true,
  timestamps: false
})
export class PersonRoleType extends Entity<PersonRoleType> {

  public constructor() {
    super();

    this.Id = 0;
    this.Name = '';
  }

  public ctor() {
    return new PersonRoleType();
  }

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    allowNull: false,
  })
  get Id():number { return this.getDataValue('Id'); }
  set Id(value: number) { this.setDataValue('Id', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  get Name():string { return this.getDataValue('Name'); }
  set Name(value: string) { this.setDataValue('Name', value); }
}
