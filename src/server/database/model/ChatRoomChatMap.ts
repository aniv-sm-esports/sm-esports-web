import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({
  modelName: 'ChatRoomChatMap',
  tableName: 'ChatRoomChatMap',
  freezeTableName: true,
  timestamps: false
})
export class ChatRoomChatMap extends Model {

  constructor(){
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
    type: DataType.INTEGER,
    allowNull: false
  })
  get ChatRoomId():number { return this.getDataValue('ChatRoomId'); }
  set ChatRoomId(value: number) { this.setDataValue('ChatRoomId', value); }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  get ChatId():number { return this.getDataValue('ChatId'); }
  set ChatId(value:number) { this.setDataValue('ChatId', value); }
}
