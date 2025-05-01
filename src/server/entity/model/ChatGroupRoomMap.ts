import {Column, DataType, Model, Table} from 'sequelize-typescript';
import {Entity} from './Entity';

@Table({
  modelName: 'ChatGroupRoomMap',
  tableName: 'ChatGroupRoomMap',
  freezeTableName: true,
  timestamps: false
})
export class ChatGroupRoomMap extends Entity<ChatGroupRoomMap> {

  constructor(){
    super();
  }

  public ctor() {
    return new ChatGroupRoomMap();
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
  get ChatGroupId():number { return this.getDataValue('ChatGroupId'); }
  set ChatGroupId(value: number) { this.setDataValue('ChatGroupId', value); }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  get ChatRoomId():number { return this.getDataValue('ChatRoomId'); }
  set ChatRoomId(value:number) { this.setDataValue('ChatRoomId', value); }
}
