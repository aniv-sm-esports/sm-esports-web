import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({
  modelName: 'ChatRoomSecurityRule',
  tableName: 'ChatRoomSecurityRule',
  freezeTableName: true,
  timestamps: false
})
export class ChatRoomSecurityRule extends Model {

  constructor(){
    super();
  }

  public ctor() {
    return new ChatRoomSecurityRule();
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
  get UserRoleId():number { return this.getDataValue('UserRoleId'); }
  set UserRoleId(value:number) { this.setDataValue('UserRoleId', value); }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  get PersonRoleId():number { return this.getDataValue('PersonRoleId'); }
  set PersonRoleId(value:number) { this.setDataValue('PersonRoleId', value); }
}
