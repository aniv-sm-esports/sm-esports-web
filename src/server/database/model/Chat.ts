import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({
  modelName: 'Chat',
  tableName: 'Chat',
  freezeTableName: true,
  timestamps: false
})
export class Chat extends Model {

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
    type: DataType.NUMBER,
    allowNull: false,
  })
  get UserId():number { return this.getDataValue('UserId'); }
  set UserId(value: number) { this.setDataValue('UserId', value); }

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  get Text():string | undefined { return this.getDataValue('Text'); }
  set Text(value: string | undefined) { this.setDataValue('Text', value); }

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  get Date():number { return this.getDataValue('Date'); }
  set Date(value: number) { this.setDataValue('Date', value); }

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false
  })
  get Flagged():boolean { return this.getDataValue('Flagged'); }
  set Flagged(value:boolean) { this.setDataValue('Flagged', value); }

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  get FlaggedComments():string { return this.getDataValue('FlaggedComments'); }
  set FlaggedComments(value:string) { this.setDataValue('FlaggedComments', value); }
}
