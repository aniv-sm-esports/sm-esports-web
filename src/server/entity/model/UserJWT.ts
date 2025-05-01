import {BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {Entity} from './Entity';
import { User } from "./User";
import lodash from 'lodash';

@Table({
  modelName: 'UserJWT',
  tableName: 'UserJWT',
  freezeTableName: true,
  timestamps: false
})
export class UserJWT extends Entity<UserJWT> {

  public constructor() {
    super();
  }

  public ctor() {
    return new UserJWT();
  }

  // Couple methods were used on the client (TODO)
  public static default() {
    return new UserJWT();
  }

  // Couple methods were used on the client (TODO)
  public isDefault() {
    return lodash.isEqual(this, UserJWT.default());
  }

  // Relationships
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
    type: DataType.STRING,
    allowNull: false,
  })
  get Token():string { return this.getDataValue('Token'); }
  set Token(value: string) { this.setDataValue('Token', value); }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => User)
  get UserId():number { return this.getDataValue('UserId'); }
  set UserId(value: number) { this.setDataValue('UserId', value); }

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  get LoginTime():Date { return this.getDataValue('LoginTime'); }
  set LoginTime(value: Date) { this.setDataValue('LoginTime', value); }

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  get ExpirationTime():Date { return this.getDataValue('ExpirationTime'); }
  set ExpirationTime(value: Date) { this.setDataValue('ExpirationTime', value); }
}
