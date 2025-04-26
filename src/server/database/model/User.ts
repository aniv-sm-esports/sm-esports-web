import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table({
  modelName: 'User',
  tableName: 'User',
  freezeTableName: true,
  timestamps: false
})
export class User extends Model {

  constructor() {
    super();
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
  set Name(value:string) { this.setDataValue('Name', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  get Email():string { return this.getDataValue('Email'); }
  set Email(value:string) { this.setDataValue('Email', value); }

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  get EmailVisible():boolean { return this.getDataValue('EmailVisible'); }
  set EmailVisible(value: boolean) { this.setDataValue('EmailVisible', value); }

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  get CreatedDate():Date { return this.getDataValue('CreatedDate'); }
  set CreatedDate(value:Date) { this.setDataValue('CreatedDate', value); }

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  get PictureUrl():string | undefined { return this.getDataValue('PictureUrl'); }
  set PictureUrl(value: string | undefined) { this.setDataValue('PictureUrl', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  get ShortDescription():string{ return this.getDataValue('ShortDescription'); }
  set ShortDescription(value: string) { this.setDataValue('ShortDescription', value); }

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  get LongDescription():string | undefined { return this.getDataValue('LongDescription'); }
  set LongDescription(value: string | undefined) { this.setDataValue('LongDescription', value); }

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  get PersonRoleId():number { return this.getDataValue('PersonRoleId'); }
  set PersonRoleId(value: number) { this.setDataValue('PersonRoleId', value); }

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  get UserRoleId():number { return this.getDataValue('UserRoleId'); }
  set UserRoleId(value:number) { this.setDataValue('UserRoleId', value); }
}
