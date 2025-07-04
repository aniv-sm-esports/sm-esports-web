import {AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {ModelAttributeColumnOptions} from 'sequelize';

@Table({
  modelName: 'UserRoleType',
  tableName: 'UserRoleType',
  freezeTableName: true,
  timestamps: false
})
export class UserRoleType extends Model {

  public constructor() {
    super();

    this.Id = 0;
    this.Name = '';
  }

  public ctor() {
    return new UserRoleType();
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
