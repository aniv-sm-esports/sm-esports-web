import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table({
  modelName: 'UserCredential',
  tableName: 'UserCredential',
  freezeTableName: true,
  timestamps: false
})
export class UserCredential extends Model {

  public constructor() {
    super();

    this.Id = 0;
    this.UserId = 0;
    this.Password = '';

  }

  public ctor() {
    return new UserCredential();
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  get UserId():number { return this.getDataValue('UserId'); }
  set UserId(value: number) { this.setDataValue('UserId', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  get Password():string { return this.getDataValue('Password'); }
  set Password(value: string) { this.setDataValue('Password', value); }
}
