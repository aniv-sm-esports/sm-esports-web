import {Column, DataType, Model, Table} from 'sequelize-typescript';
import {Entity} from './Entity';

@Table({
  modelName: 'ChatRoomUserMap',
  tableName: 'ChatRoomUserMap',
  freezeTableName: true,
  timestamps: false
})
export class ChatRoomUserMap extends Entity<ChatRoomUserMap> {

  constructor(){
    super();
  }

  public ctor() {
    return new ChatRoomUserMap();
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
  get UserId():number { return this.getDataValue('UserId'); }
  set UserId(value:number) { this.setDataValue('UserId', value); }
}
