import {BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {Entity} from './Entity';
import {User} from './User';

@Table({
  modelName: 'UserCredential',
  tableName: 'UserCredential',
  freezeTableName: true,
  timestamps: false
})
export class UserCredential extends Entity<UserCredential> {

  public constructor() {
    super();

    this.Id = 0;
    this.UserId = 0;
    this.Password = '';

  }

  public ctor() {
    return new UserCredential();
  }

  public static fromLogon(userName:string, password:string) {
    let result: UserCredential = new UserCredential();
    result.User = new User();
    result.User.Name = userName;
    result.Password = password;
    return result;
  }

  @BelongsTo(() => User, "UserId")
  User!:User;

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
  @ForeignKey(() => User)
  get UserId():number { return this.getDataValue('UserId'); }
  set UserId(value: number) { this.setDataValue('UserId', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  get Password():string { return this.getDataValue('Password'); }
  set Password(value: string) { this.setDataValue('Password', value); }
}
